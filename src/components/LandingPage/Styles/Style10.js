import React, { useCallback, useEffect, useState } from "react";
import KeyboardMapper from "../../KeyboardMapper/KeyboardMapper";
import Terminal from "../../Terminal/Terminal";
import { GithubBtn, LoggedinAs, ShareBtn, VersionBtn } from "../pins";
import { useSelector } from "react-redux";
import {
  selectKeyboardLayout,
  selectTypingSettings,
} from "../../../redux/typingSlice";
import { alternateDiff, treatSpace, Cursor } from "../../TypingPage/TypingPage";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getFormattedText } from "../../TypingPage/util";
import { getRandomQuote } from "../../../util/jsutil"
function Diff({ source, change }) {
  const [list, diff_list] = alternateDiff(source, change);
  const list_spaced = list.map((e) => e?.split(" "));
  return (
    <div className="flex d-center gap-0">
      {list.map((e, i) => {
        return (
          <div className="d-center gap-2" key={i}>
            {list_spaced[i].map(
              // word:1 word:last has no margin
              (ee, ii) => (
                <div
                  className={
                    "before-diff-" +
                    (ii == 0) +
                    " after-diff-" +
                    (ii == list_spaced[i].length - 1)
                  }
                  key={ii}
                >
                  {ee?.split().map((eee, iii) => (
                    <span
                      key={iii}
                      className={
                        diff_list[i] === null
                          ? "text-gray-400"
                          : diff_list[i]
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {eee}
                    </span>
                  ))}
                </div>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}
const TypeWriter = () => {
  const inputRef = React.useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);
  const [input, setInput] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [text, setText] = useState("my hovercraft is full of eels");
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const { punc, num, capitalize } = useSelector(selectTypingSettings);
  useEffect(() => {
    getRandomQuote().then((q) => {
      let x = q[0];
      x = getFormattedText(x, capitalize, punc, num);
      console.log(x);
      setText(x);
    });
  }, [punc, num, capitalize]);
  const handleInput = (e) => {
    if (e.target.value == "") {
      setIsActive(false);
      setStartTime(null);
      setInput("");
    }
    if (!text) {
      setStartTime(null);
      return false;
    }
    if (!isActive) {
      setIsActive(true);
      setStartTime(new Date());
    }
    setInput(e.target.value);
    if (e.target.value.length >= text.length) {
      setIsActive(false);
      const stats = calculateStats();
      setStats(stats);
      navigate("/results", {
        state: { stats, tryAgain: "/keyboard?style=10" },
      });
    }
  };

  const calculateStats = useCallback(() => {
    const endTime = new Date();
    const timeElapsed = (endTime - startTime) / 1000; // in seconds
    const __input = input.trim();
    const __text = text.trim();
    const total_length = __input.length;
    const raw_wpm = Math.round((total_length / (5 * timeElapsed)) * 60);
    const correctChars = __input
      .split("")
      .filter((e, i) => e == __text[i]).length;
    const acc = correctChars / total_length;
    const wpm = Math.round(raw_wpm * acc);
    const accuracy = Math.round(acc * 100);
    window.stats = {
      wpm: wpm,
      accuracy,
      endTime,
      timeElapsed,
      wpm: raw_wpm,
      total_length,
      correctChars,
      text,
      input,
      startTime,
    };

    return {
      wpm: wpm,
      accuracy,
      time: Math.round(timeElapsed),
      rawWpm: raw_wpm,
    };
  }, [input, startTime, text]);
  return (
    <div className="d-center h-full w-full">
      <div className="d-center w-full gap-0 max-h-full text-4xl">
        <div className="w-full flex justify-end">
          <Diff
            source={text?.substring(input.length - 30, input.length)}
            change={input?.substring(input.length - 30, input.length)}
          />
        </div>
          {input.at(-1) == " " && <div className="ms-2"/>}
        <Cursor />
        <pre className="w-full flex justify-start flex-nowrap nowrap text-gray-500">
          {/* {text.at(input.length) == " " && <>&nbsp;</>} */}
          {text?.substring(input.length, input.length + 30)}
        </pre>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInput}
        className="w-full bg-transparent h-0 p-0 m-0 border-none outline-none text-terminal-white text-lg absolute"
        placeholder="Start typing..."
        onBlur={(e) => {
          e.target.focus();
          return false;
        }}
      />
    </div>
  );
};
const Style10 = ({ hours, minutes, props, dispatch }) => {
  const [terminal, setTerminal] = useState(false);
  const keyboardLayoutPreference = useSelector(selectKeyboardLayout);
  return (
    <div className="flex justify-between items-stretch h-screen">
      <div className="left justify-between h-full stack items-center px-5 py-10">
        <div className="top"></div>
        <div className="middle"></div>
        <div className="bottom">
          <ShareBtn />
        </div>
      </div>
      <div className="middle justify-between w-full h-full stack items-center py-10">
        <div className="top"></div>
        <div className="middle">
          <KeyboardMapper />
        </div>
        <div className="bottom stack d-center gap-10 w-full">
          <div className="terminal d-center w-full">
            <Terminal {...props} hidden={!terminal} />
            {!terminal && <TypeWriter />}{" "}
          </div>
          <div className="d-center px-10 py-5 rounded-lg gap-10">
            <button
              onClick={() => setTerminal(true)}
              className={terminal ? "text-red-500" : "text-gray-500"}
            >
              Terminal
            </button>
            <button
              onClick={() => setTerminal(false)}
              className={!terminal ? "text-red-500" : "text-gray-500"}
            >
              Typer
            </button>
          </div>

          <div className="github">
            {keyboardLayoutPreference == "all" || <GithubBtn />}
            <LoggedinAs />
          </div>
        </div>
      </div>
      <div className="right justify-between h-full stack items-center px-5 py-10">
        <div className="top"></div>
        <div className="middle"></div>
        <div className="bottom">
          <VersionBtn />
        </div>
      </div>
    </div>
  );
};
export default Style10;
