import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  captializeOptions,
  modeOptions,
  selectTypingSettings,
  setCapitalization,
  setNumbers,
  setPunctuation,
  setTimeLimit,
  setTypingMode,
  setWords,
  timeLimitOptions,
  wordOptions,
} from "../../redux/typingSlice";
import "./TypingPage.css";
import { getFormattedText } from "./util";
import { getRandomQuote } from "../../util/jsutil";
import { getRandomWords } from "../../util/jsutil";
const treatSpace = (str, to_show = true) => {
  return to_show ? str.replaceAll(/\s/g, "_") : str;
};
export function alternateDiff(source, change) {
  let list = [];
  let diff_list = [];
  if (change == "") {
    diff_list.push(null);
    list.push([source]);
  } else {
    let is_same = source[0] == change[0];
    diff_list.push(is_same);
    for (let i = 0; i < source.length; i++) {
      if (i >= change.length) {
        list.push([]);
        while (i < source.length) {
          list.at(-1).push(source[i]);
          i++;
        }
        diff_list.push(null);
        break;
      }
      if (source[i] != change[i] && is_same) {
        is_same = false;
        diff_list.push(is_same);
        list.push([treatSpace(change[i])]);
        continue;
      } else if (source[i] == change[i] && !is_same) {
        is_same = true;
        diff_list.push(is_same);
        list.push([source[i]]);
        continue;
      }
      if ((source[i] == change[i]) == is_same) {
        list.at(-1)
          ? list.at(-1).push(treatSpace(change[i], !(source[i] == change[i])))
          : list.push([treatSpace(change[i], !(source[i] == change[i]))]);
        // diff_list.push(is_same)
      }
    }
  }
  return [list.map((e) => e.join("")), diff_list];
}

window.alternateDiff = alternateDiff;

export const Cursor = ({ __ref, className = "" }) => {
  return (
    <div
      className={
        "h-em-1 w-1 bg-[var(--accent-color)] animate-pulse " + className
      }
      ref={__ref}
    ></div>
  );
};
function EachList({ e, i, list_spaced, diff_list }) {
  const CursorRef = React.useRef(null);
  useEffect(() => {
    if (CursorRef.current) {
      CursorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [CursorRef, i, list_spaced]);
  return (
    <>
      {diff_list[i] == null && <Cursor __ref={CursorRef} />}
      {list_spaced[i].map(
        // word:1 word:last has no margin
        (ee, ii) => (
          <>
            <div
              className={
                "word before-diff-" +
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
                  {ii != list_spaced[i].length - 1 && <>&nbsp;</>}
                </span>
              ))}
            </div>
          </>
        )
      )}
    </>
  );
}

function Diff({ source, change }) {
  const [list, diff_list] = alternateDiff(source, change);
  const list_spaced = list.map((e) => e?.split(" "));

  return (
    <div className="flex flex-wrap gap-0 gap-y-5">
      {list.map((e, i) => (
        <EachList
          key={i}
          e={e}
          i={i}
          list_spaced={list_spaced}
          diff_list={diff_list}
        />
      ))}
    </div>
  );
}
const TypingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { timeLimit, punc, num, capitalize, mode, words } =
    useSelector(selectTypingSettings);
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [stats, setStats] = useState(null);
  const nextCapitalizeChoice = (cp) => {
    const currentIndex = captializeOptions.indexOf(cp);
    const nextIndex = (currentIndex + 1) % captializeOptions.length;
    return captializeOptions[nextIndex];
  };

  const inputRef = React.useRef(null);
  const diffScrollerRef = React.useRef(null);
  window.diffs = diffScrollerRef;
  window.source = text;
  window.change = input;

  const [takenWords, setTakenWords] = useState();

  useEffect(() => {
    if (mode == "quote") {
      getRandomQuote()
        .then((quote) => {
          setTakenWords(quote[0].split(" "));
        })
        .catch((error) => {
          console.error("Error fetching random quote:", error);
        });
    }
    let __words;
    if (mode == "timeLimit")
      __words = { 15: 50, 30: 100, 60: 200, 120: 300 }[timeLimit];
    else if (mode == "words") __words = words;
    getRandomWords(__words)
      .then((randomWords) => {
        setTakenWords(randomWords);
      })
      .catch((error) => {
        console.error("Error fetching random text:", error);
      });
  }, [timeLimit, words, mode]);

  useEffect(() => {
    if (!takenWords) return;
    let select = takenWords.join(" ");
    select = getFormattedText(select, capitalize, punc, num);
    setText(select);
    setStartTime(null);
    setIsActive(false);
    // setInput("");
    setStats(null);
  }, [takenWords, capitalize, num, punc]);

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

  const handleInput = (e) => {
    if (!isActive) {
      setIsActive(true);
      setStartTime(new Date());
    }
    setInput(e.target.value);
    if (e.target.value.length >= text.length) {
      setIsActive(false);
      const stats = calculateStats();
      setStats(stats);
      navigate("/results", { state: { stats, tryAgain: "/typing" } });
    }
  };

  useEffect(() => {
    if (input.length == 0) {
      setIsActive(false);
      setStartTime(null);
    }
  }, [input]);

  useEffect(() => {
    if (isActive && timeLeft <= 0) {
      setIsActive(false);
      const stats = calculateStats();
      setStats(stats);
      navigate("/results", { state: { stats } });
      setStartTime(null);
    }
  }, [timeLeft, calculateStats, navigate]);

  useEffect(() => {
    //only for timeLimit mode
    if (mode != "timeLimit") return;
    if (!startTime) return;
    if (!isActive) return;
    const stopper = setInterval(() => {
      const timeleft__ =
        timeLimit - Math.floor((new Date() - startTime) / 1000);
      setTimeLeft(timeleft__);
    }, 1000);
    return () => {
      clearInterval(stopper);
    };
  }, [isActive, timeLimit, startTime, mode]);

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  return (
    <div className="typing-page min-h-screen w-full flex flex-col items-center justify-center p-8">
      <div className="w-full rounded-lg p-6">
        {!isActive && (
          <div className="flex justify-between mb-4">
            <div className="space-x-4 text-2xl">
              {modeOptions.map((e) => (
                <button
                  className={`${mode === e ? "text-red-400" : "text-gray-500"}`}
                  onClick={() => dispatch(setTypingMode(e))}
                >
                  {e}
                </button>
              ))}
            </div>

            {mode == "timeLimit" && (
              <div className="space-x-4">
                {timeLimitOptions.map((e) => (
                  <button
                    className={`${
                      timeLimit === e ? "text-red-400" : "text-gray-500"
                    }`}
                    onClick={() => dispatch(setTimeLimit(e))}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
            {mode == "words" && (
              <div className="space-x-4">
                {wordOptions.map((e) => (
                  <button
                    className={`${
                      words === e ? "text-red-400" : "text-gray-500"
                    }`}
                    onClick={() => dispatch(setWords(e))}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => dispatch(setPunctuation(!punc))}
                className={punc ? "text-red-400" : "text-gray-500"}
              >
                !punc
              </button>
              <button
                type="button"
                onClick={() => dispatch(setNumbers(!num))}
                className={num ? "text-red-400" : "text-gray-500"}
              >
                123num
              </button>
              <button
                type="button"
                onClick={() =>
                  dispatch(setCapitalization(nextCapitalizeChoice(capitalize)))
                }
                className={"text-red-400 stack d-center"}
              >
                <span className="">{capitalize}</span>
                <span className="text-xs text-gray-500">
                  {nextCapitalizeChoice(capitalize)}
                </span>
              </button>
            </div>
          </div>
        )}
        {isActive && mode == "timeLimit" && (
          <div className="d-center timer-cont text-4xl">
            <span className="text-red-400">{timeLeft > 0 && timeLeft}</span>
            <span className="text-gray-500">s</span>
          </div>
        )}

        <div className="bg-terminal-black p-6 rounded-lg mb-4">
          <div
            className="text-terminal-white text-4xl max-h-96 overflow-y-auto"
            ref={diffScrollerRef}
          >
            <Diff source={text} change={input} />
          </div>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          className="w-full bg-transparent h-0 p-0 m-0 border-none outline-none text-terminal-white text-lg"
          placeholder="Start typing..."
          onBlur={(e) => {
            e.target.focus();
            return false;
          }}
        />
      </div>
    </div>
  );
};

export default TypingPage;
