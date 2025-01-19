import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { addToHistory, clearHistory } from "../../redux/commandSlice";
import { handleCommand } from "../Terminal/logic";

const HandleURLSearchParams = ({
  command,
  setCommand,
  setStyle,
  ExecuteCommand,
  setFocus,
  setTimer,
}) => {
  const [URLSearchParams, setURLSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [previousStyle, setPreviousStyle] = useState(1);
  const style = useSelector((state) => state.command.style);
  useEffect(() => {
    const cmd = URLSearchParams.get("cmd");
    const styleParam = URLSearchParams.get("style");
    const do_ = URLSearchParams.get("do");
    const __focus = URLSearchParams.get("focus");
    const timerParamfrom = URLSearchParams.get("timerfrom");
    const timerParamto = URLSearchParams.get("timerto");
    if (__focus) {
      setFocus(__focus=="true");
    }
    if(timerParamfrom && timerParamto){
      const from = parseInt(timerParamfrom);
      const to = parseInt(timerParamto);
      setTimer({from,to});
    }
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

  useEffect(() => {
    if(!command)return;
    if (command.trim().startsWith("qr ")) {
      if (style == 6) return;
      setPreviousStyle(style);
      dispatch(setStyle(6)); //qr style is 6
    } else {
      if (style == 6) {
        if (previousStyle) {
          dispatch(setStyle(previousStyle));
        } else dispatch(setStyle(1));
      }
      // else happy
    }
  }, [command]);

  useEffect(() => {
    if (!previousStyle) return;
    if(!command)return;
    if (!command.trim().startsWith("qr") && style == 6) {
      dispatch(setStyle(previousStyle));
    }
  }, [command, style, previousStyle]);

  return null;
};

export default HandleURLSearchParams;
