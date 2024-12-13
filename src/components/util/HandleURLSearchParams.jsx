import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { addToHistory, clearHistory } from "../../redux/commandSlice";
import { handleCommand } from "../Terminal/logic";

const HandleURLSearchParams = ({ setCommand, setStyle ,ExecuteCommand}) => {
  const [URLSearchParams, setURLSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const cmd = URLSearchParams.get("cmd");
    const styleParam = URLSearchParams.get("style");
    const do_ = URLSearchParams.get("do");

    if (do_) {
      const __cmd = decodeURIComponent(do_);
      console.log("Executing inside ?", __cmd);
      ExecuteCommand(__cmd);
    }
    if (cmd && decodeURIComponent(cmd) && decodeURIComponent(cmd) !== "null") {
      setCommand(decodeURIComponent(cmd));
    }
    if (styleParam) {
      dispatch(setStyle(parseInt(styleParam)));
    }
    setURLSearchParams(new createSearchParams());
  }, [URLSearchParams]);

  return null;
};

export default HandleURLSearchParams;
