import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {clearHistory} from "../../redux/commandSlice"
const HandleKeyPress = ({ focus, onTab }) => {
  const navigate = useNavigate();
  const [focusKey, setFocusKey] = React.useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const callBack = (e) => {
      if (e.key === "Escape") {
        navigate("/terminal");
      }
      if (e.altKey) {
        if (e.key === "x") navigate("/session?style=12");
        else if (Number.isInteger(parseInt(e.key))) {
          if ([1, 2, 3, 4, 5, 7, 8].includes(parseInt(e.key)))
            // 6 for qr code only
            navigate(`/clock?style=${parseInt(e.key)}`);
          if (e.key === "0") navigate("/keyboard?style=10");
        }
      }
      if (e.key === "F4") {
        navigate("?focus=" + !focus);
        setFocusKey(focus);
      }
      if (e.key == "Tab") {
        console.log("doing ontab");
        if(!onTab({ shiftKey: e.shiftKey, navigate })){
          console.log('----------------')
          e.preventDefault();
        }
      }
      if(e.ctrlKey){
        if(e.key=="p"){
          e.preventDefault();
          dispatch(clearHistory());
        }
      }
    };

    // handle shortcuts
    const handleKeyDown = (e) => {
      callBack(e);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, onTab]);
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
