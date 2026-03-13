const router = require("express").Router();
const auth = require("../middleware/auth");
const ExposomeData = require("../models/ExposomeData");
const aiService = require("../services/aiService");
const axios = require("axios");

// GET /api/exposome/current — fetch current environmental data
router.get("/current", auth, async (req, res) => {
  try {
    // TODO: Replace with real API keys in .env
    const { lat, lon } = req.query;

    // Placeholder — integrate OpenWeatherMap + AQICN APIs here
    const environmentData = {
      aqi: 0,
      weather: { temp: 0, humidity: 0, description: "N/A" },
      uvIndex: 0,
    };

    // Get AI risk assessment
    const aiResponse = await aiService.exposomeRisk({
      userId: req.user.id,
      ...environmentData,
    });

    const exposome = await ExposomeData.create({
      userId: req.user.id,
      ...environmentData,
      pathogenRisk: aiResponse.data.pathogenRisk,
      suggestions: aiResponse.data.suggestions,
    });

    res.json(exposome);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/exposome/history
router.get("/history", auth, async (req, res) => {
  try {
    const data = await ExposomeData.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
