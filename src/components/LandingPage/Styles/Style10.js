import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  modeOptions,
  selectKeyboardLayout,
  selectTapeMode,
  selectTypingSettings,
  setTapeModeMovePref,
  setTypingMode,
  setWords,
  tapeModeOptions,
  wordOptions,
} from "../../../redux/typingSlice";
import { getRandomQuote, getRandomWords } from "../../../util/jsutil";
import KeyboardMapper from "../../KeyboardMapper/KeyboardMapper";
import Terminal from "../../Terminal/Terminal";
import { alternateDiff, Cursor } from "../../TypingPage/TypingPage";
import { getFormattedText, withoutLast } from "../../TypingPage/util";
import { GithubBtn, LoggedinAs, ShareBtn, VersionBtn } from "../pins";
import "./Style10.css";
function Diff({
  source,
  change,
  fadeOut = false,
  readyFlag = true,
  setReadyFlag = () => {},
}) {
  const [list, diff_list] = alternateDiff(source, change);
  const list_spaced = list.map((e) => e?.split(" "));

  return (
    source.length != change.length || (
      <div className="flex d-center gap-0">
        {list.map((e, i) => {
          return (
            <div className="d-center gap-2" key={i}>
              {list_spaced[i].map(
                // word:1 word:last has no margin
                (ee, ii) => {
                  return (
                    <div
                      className={
                        " before-diff-" +
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
                  );
                }
              )}
            </div>
          );
        })}
      </div>
    )
  );
}

const BEFORELIMIT = 25,
  AFTERLIMIT = 25;
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
  const { punc, num, capitalize, mode, words } =
    useSelector(selectTypingSettings);
  const { move } = useSelector(selectTapeMode);
  useEffect(() => {
    let changeThis = !isActive;
    if (mode == "quote")
      getRandomQuote().then((q) => {
        if (!changeThis) return false;
        let x = q[0];
        x = getFormattedText(x, capitalize, punc, num);
        console.log(x);
        setText(x);
      });
    if (mode == "words" || mode == "timeLimit")
      getRandomWords(words).then((q) => {
        if (!changeThis) return false;
        let x = q.join(" ");
        x = getFormattedText(x, capitalize, punc, num);
        console.log(x);
        setText(x);
      });
    return () => {
      changeThis = false;
    };
  }, [punc, num, capitalize, isActive, mode, words]);
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

  const BEFORETEXT = text?.substring(input.length - BEFORELIMIT, input.length);
  const BEFORETEXTLASTWORD = BEFORETEXT?.split(" ").at(-1);
  const BEFOREINPUTLASTWORD = input?.substring(
    input.length - BEFORETEXTLASTWORD.length,
    input.length
  );
  const BEFORETEXTWITHOUTLASTWORD = withoutLast(BEFORETEXT?.split(" ")).join(
    " "
  );
  const BEFOREINPUTWITHOUTLASTWORD = input?.substring(
    input.length - BEFORELIMIT,
    input.length - 1 - BEFORETEXTLASTWORD.length
  );
  const INPUTATLASTWORDINTERVAL = input.at(-1 - BEFORETEXTLASTWORD.length);
  const BEFOREINPUT = input?.substring(
    input.length - BEFORELIMIT,
    input.length
  );
  const AFTERTEXT = text?.substring(
    input.length,
    input.length + AFTERLIMIT - BEFOREINPUTLASTWORD.length
  );
  return (
    <div className="d-center h-full w-full">
      {
        <React.Fragment key={move && input.length}>
          <div
            className={
              "d-center w-[fit-content] gap-0 max-h-full text-4xl overflow-visible"
            }
          >
            {move == "letter" && (
              <>
                <div className="w-full flex justify-end">
                  <Diff
                    source={BEFORETEXT}
                    change={BEFOREINPUT}
                    fadeOut={true}
                  />
                </div>
                {input.at(-1) == " " && <div className="ms-2" />}
                <Cursor />
                <pre className="w-full flex justify-start flex-nowrap nowrap text-gray-500">
                  {/* {text.at(input.length) == " " && <>&nbsp;</>} */}
                  {AFTERTEXT}
                </pre>
              </>
            )}
            {move == "word" && (
              <>
                <div className="w-fit-content flex justify-end">
                  {BEFORELIMIT < input.length &&
                    Array(BEFORETEXTLASTWORD.length).fill(<>&nbsp;</>)}
                  <Diff
                    source={BEFORETEXTWITHOUTLASTWORD}
                    change={BEFOREINPUTWITHOUTLASTWORD}
                    fadeOut={true}
                  />
                </div>
                <div className={"flex justify-start items-center scale-1.2"}>
                  {INPUTATLASTWORDINTERVAL == " " ? (
                    <>&nbsp;</>
                  ) : (
                    <span className="text-red-400">
                      {INPUTATLASTWORDINTERVAL}
                    </span>
                  )}

                  <Diff
                    source={BEFORETEXTLASTWORD}
                    change={BEFOREINPUTLASTWORD}
                    fadeOut={false}
                  />
                  {input.at(-1) == " " && <div className="ms-2" />}
                  <Cursor />
                </div>
                <div className="d-center w-fit-content">
                  <pre className="w-full flex justify-start flex-nowrap nowrap text-gray-500">
                    {AFTERTEXT}
                  </pre>
                </div>
              </>
            )}
          </div>
        </React.Fragment>
      }
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
  const { move } = useSelector(selectTapeMode);
  const { mode, words } = useSelector(selectTypingSettings);
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
          <div className="terminal d-center w-full stack">
            {terminal && <div className="d-center gap-10"> {props.recommend.map((e,i)=><div className={"item "+(i==0?"mb-3 underline":"")}>{e}</div>)} </div>}
            <Terminal {...props} hidden={!terminal} />
            {!terminal && <TypeWriter />}{" "}
          </div>

          <div className="stack d-center">
            {!terminal && (
              <div className="d-center settings px-10 py-5 gap-10">
                <div className="d-center rounded-lg bg-gray-800 px-3 py-1 gap-10">
                  {tapeModeOptions.map((e) => (
                    <button
                      key={e}
                      onClick={() => dispatch(setTapeModeMovePref(e))}
                      className={move == e ? "text-red-500" : "text-gray-500"}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <div className="d-center rounded-lg bg-gray-800 px-3 py-1 gap-10">
                  {modeOptions.map((e) => (
                    <button
                      disabled={e == "timeLimit"}
                      key={e}
                      onClick={() => dispatch(setTypingMode(e))}
                      className={
                        "disabled:text-black " +
                        (mode == e ? "text-red-500" : "text-gray-500")
                      }
                    >
                      {e}
                    </button>
                  ))}
                </div>
                {mode == "words" && (
                  <div className="d-center rounded-lg bg-gray-800 px-3 py-1 gap-10">
                    {wordOptions.map((e) => (
                      <button
                        disabled={e == "timeLimit"}
                        key={e}
                        onClick={() => dispatch(setWords(e))}
                        className={
                          "disabled:text-black " +
                          (words == e ? "text-red-500" : "text-gray-500")
                        }
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="d-center opts">
              <div className="d-center rounded-lg bg-gray-800 px-3 py-1 gap-10">
                <button
                  onClick={() => setTerminal(true)}
                  className={terminal ? "text-red-500" : "text-gray-500"}
                  accessKey="t"
                >
                  <u>T</u>erminal
                </button>
                <button
                  onClick={() => setTerminal(false)}
                  className={!terminal ? "text-red-500" : "text-gray-500"}
                  accessKey="y"
                >
                  T<u>y</u>per
                </button>
              </div>
            </div>
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
