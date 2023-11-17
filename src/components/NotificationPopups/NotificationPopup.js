import React, { useState, useEffect } from "react";
import "./NotificationPopup.css"; // Import the CSS file for styling

function NotificationPopup({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000); // Auto-close after 5 seconds

    return () => {
      clearTimeout(timer); // Clear the timer if the component unmounts
    };
  }, [onClose]);

  const getClassName = () => {
    switch (type) {
      case "success":
        return "notification-popup success";
      case "error":
        return "notification-popup error";
      default:
        return "notification-popup";
    }
  };

  return isVisible ? (
    <div className={getClassName()}>
      <div className="notification-content">{message}</div>
    </div>
  ) : null;
}

export default NotificationPopup;
