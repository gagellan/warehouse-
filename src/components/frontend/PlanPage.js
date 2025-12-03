import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/App.css";

const PlanPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();

  const pricing = {
    Basic: { monthly: 19, yearly: 205 },
    Standard: { monthly: 39, yearly: 420 },
    Business: { monthly: 79, yearly: 850 }
  };

  const handleSelectPlan = async (selectedPlan) => {
    if (selectedPlan === "Basic") {
      // Redirect to plan-details page with query parameters
      navigate(`/plan-details?plan=${selectedPlan}&billing=${isYearly ? "yearly" : "monthly"}`);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/user/status", { withCredentials: true });
      const { isAuthenticated, userId } = res.data;

      if (!isAuthenticated) {
        navigate("/register");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/subscription/select-plan",
        {
          userId,
          plan: selectedPlan,
          billingCycle: isYearly ? "yearly" : "monthly"
        },
        { withCredentials: true }
      );

      navigate("/subscription");
    } catch (err) {
      console.error("Error selecting plan:", err.response?.data || err.message);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="plan-container">
      <div className="plan-pricing-container">
        <h1>Choose a Subscription Plan</h1>
        <p>Select the best plan for your warehouse monitoring needs.</p>

        <div className="plan-toggle-container">
          <span className="toggle-label">MONTHLY</span>
          <label className="plan-switch">
            <input
              type="checkbox"
              onChange={() => setIsYearly(!isYearly)}
              checked={isYearly}
            />
            <span className="plan-slider"></span>
          </label>
          <span className="toggle-label">
            YEARLY <small>Save 10%</small>
          </span>
        </div>

        <div className="plan-plans">
          {Object.entries(pricing).map(([plan, prices]) => (
            <div
              className="plan-box"
              key={plan}
              style={{
                borderTopColor:
                  plan === "Basic"
                    ? "#ADD8E6"
                    : plan === "Standard"
                    ? "#FFB6C1"
                    : "#08d8a4"
              }}
            >
              <h2>{plan}</h2>
              <p className="plan-price">
                ${isYearly ? prices.yearly : prices.monthly}
                <span>{isYearly ? "/yr" : "/mo"}</span>
              </p>
              <p className="plan-discount">
                Save{" "}
                {isYearly
                  ? `$${prices.monthly * 12 - prices.yearly}`
                  : "$0"}
                /year
              </p>
              <ul className="plan-features">
                {plan === "Basic" && (
                  <>
                    <li>1 Warehouse</li>
                    <li>2 Cameras</li>
                    <li>Basic Analytics</li>
                    <li className="plan-disabled">AI Predictions</li>
                    <li>
                      <strong>7-day Free Trial</strong>
                    </li>
                  </>
                )}
                {plan === "Standard" && (
                  <>
                    <li>3 Warehouses</li>
                    <li>5 Cameras</li>
                    <li>Advanced Analytics</li>
                    <li className="plan-disabled">AI Predictions</li>
                  </>
                )}
                {plan === "Business" && (
                  <>
                    <li>10 Warehouses</li>
                    <li>15 Cameras</li>
                    <li>AI Predictions</li>
                    <li>24/7 Monitoring</li>
                  </>
                )}
              </ul>
              <button
                className="plan-subscribe"
                onClick={() => handleSelectPlan(plan)}
              >
                Select {plan}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanPage;
