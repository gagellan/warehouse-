import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/App.css";

const PlanDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const plan = queryParams.get("plan") || "Basic";
  const billing = queryParams.get("billing") || "monthly";

  return (
    <div style={styles.container}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.planBox}>
          <h1 style={styles.planTitle}>{plan} Plan</h1>
          <h3 style={styles.billingInfo}>Billing: {billing}</h3>
          <ul style={styles.featureList}>
            <li>🏢 1 Warehouse</li>
            <li>📷 2 Cameras</li>
            <li>📊 Basic Analytics</li>
            <li>🚫 AI Predictions</li>
            <li>🎁 7-day Free Trial</li>
            <li>❌ Cancel Anytime</li>
          </ul>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.welcomeBox}>
          <h2 style={styles.heading}>Welcome to Warehouse Pro</h2>
          <div style={styles.authRow}>
            <button
              style={styles.loginBtn}
              onClick={() => navigate("/login")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#0056b3")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#007bff")
              }
            >
              Log In
            </button>
            <span style={styles.dividerText}>or</span>
            <button
              style={styles.signupBtn}
              onClick={() => navigate("/register")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#1e7e34")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#28a745")
              }
            >
              Sign Up
            </button>
          </div>
          <p style={styles.message}>
            🚀 Access your <strong>{plan}</strong> plan with{" "}
            <strong>{billing}</strong> billing and enjoy your 7-day free trial.
            No credit card needed. Simple, fast, secure.
          </p>
          <button
            style={styles.backBtn}
            onClick={() => navigate("/")}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0056b3")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#007bff")}
          >
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
    flex: "0 0 560px", // bigger width
    height: "auto",
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  planBox: {
    backgroundColor: "#0a72e8",
    color: "white",
    padding: 50,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    width: 420, // wider box
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
  },
  planTitle: {
    fontSize: 40, // bigger text
    marginBottom: 14,
    fontWeight: "700",
  },
  billingInfo: {
    fontSize: 22,
    marginBottom: 28,
    fontWeight: "600",
    opacity: 0.95,
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
    justifyContent: "flex-start",
    alignItems: "center",
    flex: "0 0 600px", // bigger width
    height: "auto",
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeBox: {
    backgroundColor: "white",
    color: "#222",
    padding: 50,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    width: 420, // wider box
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  },
  heading: {
    fontSize: 36, // bigger text
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
    padding: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 19,
    fontWeight: "700",
    boxShadow: "0 4px 14px rgba(0,123,255,0.5)",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  },
  signupBtn: {
    flex: 1,
    padding: "16px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 19,
    fontWeight: "700",
    boxShadow: "0 4px 14px rgba(40,167,69,0.5)",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  },
  dividerText: {
    fontSize: 20,
    color: "#888",
    fontWeight: "700",
    userSelect: "none",
    alignSelf: "center",
  },
  message: {
    fontSize: 17,
    color: "#555",
    marginTop: 14,
    marginBottom: 32,
    lineHeight: 1.6,
  },
  backBtn: {
    backgroundColor: "transparent",
    color: "#007bff",
    border: "none",
    textDecoration: "underline",
    cursor: "pointer",
    fontSize: 17,
    fontWeight: "700",
    transition: "color 0.3s ease",
  },
};

export default PlanDetail;
