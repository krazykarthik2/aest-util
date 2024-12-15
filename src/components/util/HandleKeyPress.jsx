import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HandleKeyPress = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // handle shortcuts
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate("/terminal");
      }
      if (e.altKey) {
        if (e.key === "t") navigate("/terminal");
        else if (Number.isInteger(parseInt(e.key))) {
          if ([1, 2, 3, 4, 5,  7, 8].includes(parseInt(e.key)))// 6 for qr code only
            navigate(`/clock?style=${parseInt(e.key)}`);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return null;
};

export default HandleKeyPress;
