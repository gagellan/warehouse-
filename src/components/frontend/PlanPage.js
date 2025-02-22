import React, { useEffect, useState } from "react";
import "../../assets/css/App.css";

const PlanPage = () => {
  const [isYearly, setIsYearly] = useState(false);

  const pricing = {
    Basic: { monthly: 19, yearly: 205 }, // 10% discount applied
    Standard: { monthly: 39, yearly: 420 },
    Business: { monthly: 79, yearly: 850 }
  };

  useEffect(() => {
    const handleSubscriptionClick = (event) => {
      const selectedPlan = event.target.dataset.plan;
      if (selectedPlan) {
        localStorage.setItem("selectedPlan", selectedPlan);
        window.location.href = "vehicle.html";
      }
    };

    document.querySelectorAll(".plan-subscribe").forEach(button => {
      button.addEventListener("click", handleSubscriptionClick);
    });

    return () => {
      document.querySelectorAll(".plan-subscribe").forEach(button => {
        button.removeEventListener("click", handleSubscriptionClick);
      });
    };
  }, []);

  return (
    <div className="plan-container">
      <div className="plan-pricing-container">
        <h1>Choose a Subscription Plan</h1>
        <p>Select the best plan for your warehouse monitoring needs.</p>

        {/* Toggle Switch */}
        <div className="plan-toggle-container">
          <span className="toggle-label">MONTHLY</span>
          <label className="plan-switch">
            <input type="checkbox" onChange={() => setIsYearly(!isYearly)} />
            <span className="plan-slider"></span>
          </label>
          <span className="toggle-label">YEARLY <small>Save 10%</small></span>
        </div>

        {/* Pricing Plans */}
        <div className="plan-plans">
          {Object.entries(pricing).map(([plan, prices]) => (
            <div className="plan-box" key={plan} style={{
              borderTopColor: plan === "Basic" ? "#ADD8E6" : plan === "Standard" ? "#FFB6C1" : "#08d8a4",
            }}>
              <h2>{plan}</h2>
              <p className="plan-price">
                ${isYearly ? prices.yearly : prices.monthly}
                <span>{isYearly ? "/yr" : "/mo"}</span>
              </p>
              <p className="plan-discount">
                Save {isYearly ? `$${(prices.monthly * 12 - prices.yearly)}` : "$0"}/year
              </p>
              <ul className="plan-features">
                {plan === "Basic" && (
                  <>
                    <li>1 Warehouse</li>
                    <li>2 Cameras</li>
                    <li>Basic Analytics</li>
                    <li className="plan-disabled">AI Predictions</li>
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
              <button className="plan-subscribe" data-plan={plan}>
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
