import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/App.css";

const PlanDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const plan = queryParams.get("plan") || "Basic";
  const billing = queryParams.get("billing") || "monthly";

  // ⭐ FEATURES FOR EACH PLAN (INCLUDING ADVANCED)
  const features = {
    Basic: [
      "🏢 1 Warehouse",
      "📷 2 Cameras",
      "📊 Basic Analytics",
      "🚫 AI Predictions",
      "🎁 7-day Free Trial",
      "❌ Cancel Anytime"
    ],
    Standard: [
      "🏢 3 Warehouses",
      "📷 5 Cameras",
      "📊 Advanced Analytics",
      "🚫 AI Predictions"
    ],
    Business: [
      "🏢 10 Warehouses",
      "📷 15 Cameras",
      "🤖 AI Predictions Enabled",
      "🔒 24/7 Monitoring"
    ],
    Advanced: [
      "🏢 20 Warehouses",
      "📷 30 Cameras",
      "🤖 AI Predictions Enabled",
      "📊 Advanced Analytics",
      "🔒 24/7 Monitoring",
      "⭐ Priority Support"
    ]
  };

  return (
    <div style={styles.container}>

      {/* LEFT PANEL */}
      <div style={styles.leftPanel}>
        <div style={styles.planBox}>
          <h1 style={styles.planTitle}>{plan} Plan</h1>
          <h3 style={styles.billingInfo}>Billing: {billing}</h3>

          {/* ⭐ DYNAMIC FEATURES */}
          <ul style={styles.featureList}>
            {features[plan].map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={styles.rightPanel}>
        <div style={styles.welcomeBox}>
          <h2 style={styles.heading}>Welcome to Warehouse Pro</h2>

          <div style={styles.authRow}>
            <button
              style={styles.loginBtn}
              onClick={() => navigate("/login")}
            >
              Log In
            </button>

            <span style={styles.dividerText}>or</span>

            <button
              style={styles.signupBtn}
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>

          <p style={styles.message}>
            🚀 You selected the <strong>{plan}</strong> plan with{" "}
            <strong>{billing}</strong> billing. Get started in minutes!
          </p>

          <button
            style={styles.backBtn}
            onClick={() => navigate("/")}>
            ← Back to Plans
          </button>
        </div>
      </div>

    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
    padding: 60,
  },
  leftPanel: {
    backgroundColor: "#0056b3",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: "0 0 560px",
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  planBox: {
    backgroundColor: "#0a72e8",
    color: "white",
    padding: 50,
    width: 420,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
  },
  planTitle: {
    fontSize: 40,
    marginBottom: 14,
    fontWeight: "700",
  },
  billingInfo: {
    fontSize: 22,
    marginBottom: 28,
    fontWeight: "600",
  },
  featureList: {
    listStyle: "none",
    paddingLeft: 0,
    fontSize: 18,
    lineHeight: 2.4,
    fontWeight: "600",
  },
  rightPanel: {
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    flex: "0 0 600px",
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeBox: {
    backgroundColor: "white",
    padding: 50,
    width: 420,
    color: "#222",
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  },
  heading: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 38,
  },
  authRow: {
    display: "flex",
    gap: 16,
    marginBottom: 28,
  },
  loginBtn: {
    flex: 1,
    padding: 16,
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 12,
    fontSize: 19,
    fontWeight: "700",
    cursor: "pointer",
  },
  signupBtn: {
    flex: 1,
    padding: 16,
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: 12,
    fontSize: 19,
    fontWeight: "700",
    cursor: "pointer",
  },
  dividerText: {
    fontSize: 20,
    color: "#888",
  },
  message: {
    fontSize: 17,
    color: "#555",
    marginTop: 14,
    marginBottom: 32,
  },
  backBtn: {
    backgroundColor: "transparent",
    color: "#007bff",
    border: "none",
    textDecoration: "underline",
    cursor: "pointer",
    fontSize: 17,
    fontWeight: "700",
  }
};

export default PlanDetail;
