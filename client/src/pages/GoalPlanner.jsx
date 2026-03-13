import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./GoalPlanner.css";

// Sample insurance goals data - in production this would come from an API
const initialGoals = [
  {
    id: 1,
    title: "Maintain Healthy BMI",
    description: "Keep BMI between 18.5-24.9 for 3 consecutive months",
    category: "weight",
    icon: "⚖️",
    emiReduction: 150,
    progress: 75,
    target: 100,
    unit: "%",
    deadline: "2026-06-30",
    status: "in_progress",
    tips: ["Track weight weekly", "Maintain balanced diet", "Exercise 30 mins daily"],
    milestones: [
      { month: 1, target: "BMI < 25", completed: true },
      { month: 2, target: "BMI stable", completed: true },
      { month: 3, target: "BMI maintained", completed: false },
    ],
  },
  {
    id: 2,
    title: "Complete Annual Health Checkup",
    description: "Get full body checkup with all recommended tests",
    category: "checkup",
    icon: "🩺",
    emiReduction: 200,
    progress: 100,
    target: 100,
    unit: "%",
    deadline: "2026-03-31",
    status: "completed",
    tips: ["Book appointment early", "Fast 12 hours before blood test", "Bring previous reports"],
    milestones: [
      { month: 1, target: "Book appointment", completed: true },
      { month: 1, target: "Complete checkup", completed: true },
      { month: 1, target: "Upload reports", completed: true },
    ],
  },
  {
    id: 3,
    title: "10,000 Steps Daily Challenge",
    description: "Achieve 10,000 steps average for 30 days",
    category: "fitness",
    icon: "👟",
    emiReduction: 100,
    progress: 18,
    target: 30,
    unit: "days",
    deadline: "2026-04-15",
    status: "in_progress",
    tips: ["Take stairs instead of elevator", "Walk during lunch break", "Evening walks"],
    milestones: [
      { week: 1, target: "7 days", completed: true },
      { week: 2, target: "14 days", completed: true },
      { week: 3, target: "21 days", completed: false },
      { week: 4, target: "30 days", completed: false },
    ],
  },
  {
    id: 4,
    title: "Quit Smoking Program",
    description: "Stay smoke-free for 6 months verified by cotinine test",
    category: "lifestyle",
    icon: "🚭",
    emiReduction: 500,
    progress: 0,
    target: 180,
    unit: "days",
    deadline: "2026-09-30",
    status: "not_started",
    tips: ["Use nicotine patches", "Join support groups", "Avoid triggers"],
    milestones: [
      { month: 1, target: "30 days smoke-free", completed: false },
      { month: 3, target: "90 days verified", completed: false },
      { month: 6, target: "180 days certified", completed: false },
    ],
  },
  {
    id: 5,
    title: "Blood Pressure Control",
    description: "Maintain BP below 120/80 for 3 months",
    category: "vitals",
    icon: "❤️",
    emiReduction: 175,
    progress: 45,
    target: 90,
    unit: "days",
    deadline: "2026-05-31",
    status: "in_progress",
    tips: ["Reduce salt intake", "Practice meditation", "Regular monitoring"],
    milestones: [
      { month: 1, target: "BP < 130/85", completed: true },
      { month: 2, target: "BP < 125/82", completed: false },
      { month: 3, target: "BP < 120/80", completed: false },
    ],
  },
  {
    id: 6,
    title: "Sleep Quality Improvement",
    description: "Achieve 7+ hours quality sleep for 30 nights",
    category: "sleep",
    icon: "😴",
    emiReduction: 75,
    progress: 22,
    target: 30,
    unit: "nights",
    deadline: "2026-04-30",
    status: "in_progress",
    tips: ["Fixed sleep schedule", "No screens before bed", "Dark, cool room"],
    milestones: [
      { week: 1, target: "7 nights", completed: true },
      { week: 2, target: "14 nights", completed: true },
      { week: 3, target: "21 nights", completed: true },
      { week: 4, target: "30 nights", completed: false },
    ],
  },
];

const categoryColors = {
  weight: { bg: "rgba(34, 197, 94, 0.15)", color: "#22c55e", border: "rgba(34, 197, 94, 0.3)" },
  checkup: { bg: "rgba(59, 130, 246, 0.15)", color: "#3b82f6", border: "rgba(59, 130, 246, 0.3)" },
  fitness: { bg: "rgba(249, 115, 22, 0.15)", color: "#f97316", border: "rgba(249, 115, 22, 0.3)" },
  lifestyle: { bg: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "rgba(239, 68, 68, 0.3)" },
  vitals: { bg: "rgba(236, 72, 153, 0.15)", color: "#ec4899", border: "rgba(236, 72, 153, 0.3)" },
  sleep: { bg: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6", border: "rgba(139, 92, 246, 0.3)" },
};

const statusLabels = {
  completed: { label: "Completed", color: "#22c55e" },
  in_progress: { label: "In Progress", color: "#3b82f6" },
  not_started: { label: "Not Started", color: "#94a3b8" },
};

export default function GoalPlanner() {
  const [goals, setGoals] = useState(initialGoals);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showConfetti, setShowConfetti] = useState(false);

  // Calculate totals
  const currentEMI = 2500; // Base EMI
  const totalPotentialSavings = goals.reduce((sum, g) => sum + g.emiReduction, 0);
  const currentSavings = goals
    .filter((g) => g.status === "completed")
    .reduce((sum, g) => sum + g.emiReduction, 0);
  const inProgressSavings = goals
    .filter((g) => g.status === "in_progress")
    .reduce((sum, g) => sum + Math.round((g.progress / g.target) * g.emiReduction), 0);

  const filteredGoals = filter === "all" 
    ? goals 
    : goals.filter((g) => g.status === filter);

  const completeGoal = (goalId) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, status: "completed", progress: g.target }
          : g
      )
    );
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const updateProgress = (goalId, newProgress) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { 
              ...g, 
              progress: Math.min(newProgress, g.target),
              status: newProgress >= g.target ? "completed" : "in_progress"
            }
          : g
      )
    );
  };

  return (
    <div className="emi-goals-container">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="confetti-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="confetti-piece"
                initial={{ 
                  y: -20, 
                  x: Math.random() * window.innerWidth,
                  rotate: 0,
                  opacity: 1
                }}
                animate={{ 
                  y: window.innerHeight + 20,
                  rotate: Math.random() * 720 - 360,
                  opacity: 0
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2,
                  ease: "easeOut"
                }}
                style={{
                  background: ["#22c55e", "#3b82f6", "#f97316", "#ec4899", "#8b5cf6"][Math.floor(Math.random() * 5)],
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="emi-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="emi-badge">💰 Insurance Rewards</span>
          <h1 className="emi-title">
            Reduce Your Health Insurance EMI
          </h1>
          <p className="emi-subtitle">
            Complete health goals to unlock discounts on your monthly premium. 
            The healthier you are, the less you pay!
          </p>
        </motion.div>

        {/* EMI Summary Cards */}
        <motion.div 
          className="emi-summary-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="emi-summary-card emi-card-current">
            <div className="emi-card-icon">📋</div>
            <div className="emi-card-content">
              <span className="emi-card-label">Current EMI</span>
              <span className="emi-card-value">₹{currentEMI.toLocaleString()}</span>
              <span className="emi-card-sub">/month</span>
            </div>
          </div>

          <div className="emi-summary-card emi-card-saved">
            <div className="emi-card-icon">✅</div>
            <div className="emi-card-content">
              <span className="emi-card-label">Already Saved</span>
              <span className="emi-card-value">₹{currentSavings.toLocaleString()}</span>
              <span className="emi-card-sub">/month</span>
            </div>
          </div>

          <div className="emi-summary-card emi-card-progress">
            <div className="emi-card-icon">⏳</div>
            <div className="emi-card-content">
              <span className="emi-card-label">In Progress</span>
              <span className="emi-card-value">₹{inProgressSavings.toLocaleString()}</span>
              <span className="emi-card-sub">potential</span>
            </div>
          </div>

          <div className="emi-summary-card emi-card-potential">
            <div className="emi-card-icon">🎯</div>
            <div className="emi-card-content">
              <span className="emi-card-label">Total Potential</span>
              <span className="emi-card-value">₹{totalPotentialSavings.toLocaleString()}</span>
              <span className="emi-card-sub">/month savings</span>
            </div>
          </div>
        </motion.div>

        {/* New EMI Preview */}
        <motion.div 
          className="emi-new-preview"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="emi-preview-content">
            <span className="emi-preview-label">Your New EMI (after all goals)</span>
            <div className="emi-preview-values">
              <span className="emi-old">₹{currentEMI.toLocaleString()}</span>
              <span className="emi-arrow">→</span>
              <span className="emi-new">₹{(currentEMI - totalPotentialSavings).toLocaleString()}</span>
            </div>
            <div className="emi-savings-percent">
              Save {Math.round((totalPotentialSavings / currentEMI) * 100)}% on your premium!
            </div>
          </div>
        </motion.div>
      </section>

      {/* Filter Tabs */}
      <div className="emi-filters">
        {[
          { key: "all", label: "All Goals", count: goals.length },
          { key: "in_progress", label: "In Progress", count: goals.filter((g) => g.status === "in_progress").length },
          { key: "completed", label: "Completed", count: goals.filter((g) => g.status === "completed").length },
          { key: "not_started", label: "Not Started", count: goals.filter((g) => g.status === "not_started").length },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`emi-filter-btn ${filter === tab.key ? "active" : ""}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            <span className="filter-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      <motion.div 
        className="emi-goals-grid"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              className="emi-goal-card"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setSelectedGoal(goal)}
              style={{
                borderColor: categoryColors[goal.category]?.border,
              }}
            >
              <div className="goal-card-header">
                <span 
                  className="goal-category-badge"
                  style={{ 
                    background: categoryColors[goal.category]?.bg,
                    color: categoryColors[goal.category]?.color,
                  }}
                >
                  {goal.icon} {goal.category}
                </span>
                <span 
                  className="goal-status-badge"
                  style={{ color: statusLabels[goal.status]?.color }}
                >
                  {statusLabels[goal.status]?.label}
                </span>
              </div>

              <h3 className="goal-title">{goal.title}</h3>
              <p className="goal-description">{goal.description}</p>

              <div className="goal-progress-section">
                <div className="goal-progress-header">
                  <span>Progress</span>
                  <span className="goal-progress-text">
                    {goal.progress}/{goal.target} {goal.unit}
                  </span>
                </div>
                <div className="goal-progress-bar">
                  <motion.div 
                    className="goal-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${(goal.progress / goal.target) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ 
                      background: categoryColors[goal.category]?.color 
                    }}
                  />
                </div>
              </div>

              <div className="goal-emi-section">
                <div className="goal-emi-icon">💰</div>
                <div className="goal-emi-info">
                  <span className="goal-emi-label">EMI Reduction</span>
                  <span className="goal-emi-value">₹{goal.emiReduction}/month</span>
                </div>
                {goal.status === "completed" && (
                  <span className="goal-emi-unlocked">✓ Unlocked</span>
                )}
              </div>

              <div className="goal-deadline">
                <span>🗓️ Deadline: {new Date(goal.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Goal Detail Modal */}
      <AnimatePresence>
        {selectedGoal && (
          <motion.div
            className="goal-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGoal(null)}
          >
            <motion.div
              className="goal-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedGoal(null)}>
                ✕
              </button>

              <div className="modal-header">
                <span 
                  className="modal-icon"
                  style={{ background: categoryColors[selectedGoal.category]?.bg }}
                >
                  {selectedGoal.icon}
                </span>
                <div>
                  <h2>{selectedGoal.title}</h2>
                  <p>{selectedGoal.description}</p>
                </div>
              </div>

              <div className="modal-emi-highlight">
                <div className="modal-emi-box">
                  <span className="modal-emi-label">Complete this goal to save</span>
                  <span className="modal-emi-amount">₹{selectedGoal.emiReduction}</span>
                  <span className="modal-emi-period">per month on your EMI</span>
                </div>
              </div>

              <div className="modal-progress">
                <h4>Your Progress</h4>
                <div className="modal-progress-bar">
                  <div 
                    className="modal-progress-fill"
                    style={{ 
                      width: `${(selectedGoal.progress / selectedGoal.target) * 100}%`,
                      background: categoryColors[selectedGoal.category]?.color 
                    }}
                  />
                </div>
                <div className="modal-progress-stats">
                  <span>{selectedGoal.progress} / {selectedGoal.target} {selectedGoal.unit}</span>
                  <span>{Math.round((selectedGoal.progress / selectedGoal.target) * 100)}% complete</span>
                </div>
              </div>

              <div className="modal-milestones">
                <h4>Milestones</h4>
                <div className="milestones-list">
                  {selectedGoal.milestones.map((m, i) => (
                    <div 
                      key={i} 
                      className={`milestone-item ${m.completed ? "completed" : ""}`}
                    >
                      <span className="milestone-check">
                        {m.completed ? "✓" : (i + 1)}
                      </span>
                      <span className="milestone-text">{m.target}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-tips">
                <h4>💡 Tips to Complete</h4>
                <ul>
                  {selectedGoal.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              {selectedGoal.status !== "completed" && (
                <div className="modal-actions">
                  <button 
                    className="modal-btn-progress"
                    onClick={() => {
                      const newProgress = selectedGoal.progress + Math.ceil(selectedGoal.target * 0.1);
                      updateProgress(selectedGoal.id, newProgress);
                      setSelectedGoal({ ...selectedGoal, progress: Math.min(newProgress, selectedGoal.target) });
                    }}
                  >
                    Log Progress (+10%)
                  </button>
                  <button 
                    className="modal-btn-complete"
                    onClick={() => {
                      completeGoal(selectedGoal.id);
                      setSelectedGoal(null);
                    }}
                  >
                    Mark as Complete
                  </button>
                </div>
              )}

              {selectedGoal.status === "completed" && (
                <div className="modal-completed-badge">
                  <span>🎉</span>
                  <span>Goal Completed! You're saving ₹{selectedGoal.emiReduction}/month</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How It Works Section */}
      <section className="emi-how-it-works">
        <h2>How EMI Reduction Works</h2>
        <div className="how-it-works-grid">
          <div className="how-step">
            <div className="step-number">1</div>
            <h3>Choose Goals</h3>
            <p>Select health goals that match your lifestyle and health priorities</p>
          </div>
          <div className="how-step">
            <div className="step-number">2</div>
            <h3>Track Progress</h3>
            <p>Log your activities and sync with wearables for automatic tracking</p>
          </div>
          <div className="how-step">
            <div className="step-number">3</div>
            <h3>Get Verified</h3>
            <p>Complete verification through health reports or connected devices</p>
          </div>
          <div className="how-step">
            <div className="step-number">4</div>
            <h3>Save Money</h3>
            <p>Enjoy reduced EMI starting from the next billing cycle</p>
          </div>
        </div>
      </section>
    </div>
  );
}
