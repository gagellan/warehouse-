import React, { useState } from "react";
import "../../assets/css/App.css";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="floating-chat-container">
      {/* Floating Chat Button */}
      <div className="chat-button" onClick={toggleChat}>
        💬
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className="chat-popup">
          <h3>How can we help you?</h3>
          <button className="chat-option" onClick={() => alert("Contact Sales clicked")}>
            Chat with Us
          </button>
          <button className="chat-option" onClick={() => alert("Get a Demo clicked")}>
            Get a Demo
          </button>
          <button className="chat-option" onClick={() => alert("Free Trial clicked")}>
            Free Trial
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingChat;