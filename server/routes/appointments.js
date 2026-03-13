const router = require("express").Router();
const auth = require("../middleware/auth");
const Appointment = require("../models/Appointment");

// POST /api/appointments
router.post("/", auth, async (req, res) => {
  try {
    const appointment = await Appointment.create({
      userId: req.user.id,
      ...req.body,
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/appointments
router.get("/", auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/appointments/:id
router.patch("/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
