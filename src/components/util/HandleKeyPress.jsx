import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HandleKeyPress = ({ focus }) => {
  const navigate = useNavigate();
  const [focusKey, setFocusKey] = React.useState("");
  const callBack = useCallback((e) => {
    if (e.key === "Escape") {
      navigate("/terminal");
    }
    if (e.altKey) {
      if (e.key === "t") navigate("/terminal");
      else if (Number.isInteger(parseInt(e.key))) {
        if ([1, 2, 3, 4, 5, 7, 8].includes(parseInt(e.key)))
          // 6 for qr code only
          navigate(`/clock?style=${parseInt(e.key)}`);
        if (e.key === "0") navigate("/keyboard?style=10");
      }
    }
    if (e.key == "/") {
      navigate("?focus="+!focus);
      setFocusKey(focus);
    }
  }, [navigate, focus ]);
  useEffect(() => {
    // handle shortcuts
    const handleKeyDown = (e) => {
      callBack(e);
    }
    ;

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);
  const inputRef = React.useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, focus]);
  return (
    <>
      {focus && (
        <>
          <input
            className="flex h-0 w-0"
            type="text"
            value={focusKey}
            onChange={(e) => setFocusKey(e.target.value)}
            autoFocus
            onBlur={(e) => e.target.focus()}
            ref={inputRef}
          />
          {focusKey}
        </>
      )}
    </>
  );
};

export default HandleKeyPress;
