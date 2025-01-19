import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  delayOptions,
  LayoutOptions,
  selectKeyboardDelay,
  selectKeyboardLayout,
  setKeyboardDelay,
  setKeyboardLayout,
} from "../../redux/typingSlice";
import AllLayouts from "./AllLayouts";
import { ModifyKey } from "./AllLayouts";

function KeyboardMapper() {
  const [key, setKey] = useState("");
  const [Shift, setShift] = useState(false);
  const [Ctrl, setCtrl] = useState(false);
  const [Alt, setAlt] = useState(false);
  const [CapsLock, setCapsLock] = useState(false);
  const keyLayoutPreference = useSelector(selectKeyboardLayout);
  const keyboardDelay = useSelector(selectKeyboardDelay);
  const [keyLayout, setKeyLayout] = useState([]);
  useEffect(() => {
    setKeyLayout(AllLayouts[keyLayoutPreference]);
  }, [keyLayoutPreference]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      setKey(event.key);
      setShift(event.shiftKey || event.key === "Shift");
      setCtrl(event.ctrlKey);
      setAlt(event.altKey);
      setCapsLock(event.getModifierState("CapsLock"));
    };
    const handleKeyUp = (event) => {
      if (event.key === "Shift") setShift(false);
      if (event.key === "Control") setCtrl(false);
      if (event.key === "Alt") setAlt(false);
      setCapsLock(event.getModifierState("CapsLock"));
      setKey("");
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  useEffect(()=>{

    const onDocumentBlur = (event)=>{
      setKey("");
      setShift(false);
      setCtrl(false);
      setAlt(false);
    }
    const onDocumentFocus = (event)=>{
      // console.log(event)
    }
    window.addEventListener("focus", onDocumentFocus);
    window.addEventListener("blur", onDocumentBlur);
    return () => {
      window.removeEventListener("focus", onDocumentFocus);
      window.removeEventListener("blur", onDocumentBlur);
    };
  },[])
  const dispatch = useDispatch();
  const setKeyLayoutPreference = (layout) => {
    dispatch(setKeyboardLayout(layout));
  };
  const setKeyBoardDelayPreference = (delay) => {
    dispatch(setKeyboardDelay(delay));
  };
  return (
    <div className="stack items-center gap-10">
      <div className="flex d-center gap-5">
        <div className="bg-gray-700 rounded-lg px-10 py-2 gap-5 d-center">
          {LayoutOptions.map((layout, i) => (
            <button
              key={i}
              className={
                keyLayoutPreference === layout
                  ? "text-red-400"
                  : "text-gray-400"
              }
              onClick={() => setKeyLayoutPreference(layout)}
            >
              {layout}
            </button>
          ))}
        </div>
        <div className="bg-gray-700 rounded-lg px-10 py-2 gap-5 d-center">
          {delayOptions.map((delay, i) => (
            <button
              key={i}
              className={
                keyboardDelay === delay ? "text-red-400" : "text-gray-400"
              }
              onClick={() => setKeyBoardDelayPreference(delay)}
            >
              {delay}
            </button>
          ))}
        </div>
      </div>
      <div className="keyboard stack items-center gap-2">
        {keyLayout?.[Shift ? 1 : 0]?.map((row, i) => (
          <div
            key={i}
            className="flex justify-center gap-1 items-stretch w-full"
          >
            {row.map((__key, i) => (
              <Key
                key={i}
                {...{
                  __key: ModifyKey(__key, CapsLock, Shift),
                  i,
                  isActive: __key === key || __key?.key === key,
                  isSthActive: key != "",
                  delay: keyboardDelay,
                  CapsLock: CapsLock,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
const Bumps = () => {
  return <div className="w-4 min-h-1 rounded-full bg-[#488] flex"></div>;
};

function Key({
  __key,
  i,
  isActive = false,
  isSthActive = false,
  delay,
  CapsLock,
}) {
  const reactOther =
    isSthActive && !isActive
      ? typeof __key == "string"
        ? true
        : __key?.reactOther
        ? true
        : false
      : false;
  return (
    <div
      key={i}
      className={[
        `stack justify-center items-center p-5 h-10 mx-1 rounded-lg text-white transition duration-${delay}`,
        typeof __key == "string" ? "" : __key?.expand ? "w-full" : "",
        reactOther ? "scale-[1.05]" : "",
        isActive
          ? "bg-[#999] scale-[.8]"
          : `bg-[#111]  transition duration-${delay}`,
      ].join(" ")}
    >
      <div className="d-center gap-1">
        <div>{typeof __key == "string" ? __key : __key?.show}</div>
        {(typeof __key == "string" ? __key : __key?.show) == "CapsLock" ? (
          <div
            className={
              "w-3 h-3 rounded-full " + (CapsLock ? "bg-[#ccc]" : "bg-[#111]")
            }
          ></div>
        ) : null}
      </div>
      {typeof __key == "string" && ["j", "f"].includes(__key.toLowerCase()) && (
        <Bumps />
      )}
    </div>
  );
}

export default KeyboardMapper;
