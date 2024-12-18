import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setTimeLimit,
  setPunctuation,
  setNumbers,
  setCapitalization,
  selectTypingSettings,
} from "../../redux/typingSlice";
import axios from "axios";
import "./TypingPage.css";
import commonthousand from "../../assets/most-common-1000.txt";

async function getRandomQuote() {
  try {
    const response = await axios.get("https://dummyjson.com/quotes/random/10");
    return response.data.map((e) => e.quote);
  } catch (error) {
    console.error("Error fetching random text:", error);
    return "";
  }
}
async function getRandomWords(number = 50) {
  try {
    const response = await axios.get(commonthousand);
    const words = response.data.split("\n");
    const randomWords = words.sort(() => Math.random() - 0.5).slice(0, number);
    return randomWords;
  } catch (error) {
    console.error("Error fetching random text:", error);
    return "";
  }
}
const treatSpace = (str, to_show = true) => {
  return to_show ? str.replaceAll(/\s/g, "_") : str;
};
function alternateDiff(source, change) {
  let is_same = true;
  let list = [];
  let diff_list = [];
  if (change == "") {
    diff_list.push(null);
    list.push([source]);
  } else {
    diff_list.push(true);
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

const Cursor = () => {
  return <div className="h-7 w-1 bg-[var(--accent-color)] animate-pulse"></div>;
};

function Diff({ source, change }) {
  const [list, diff_list] = alternateDiff(source, change);
  const list_spaced = list.map((e) => e?.split(" "));
  return (
    <div className="flex flex-wrap gap-0 overflow-y-auto max-h-full text-2xl">
      {list.map((e, i) => {
        return (
          <React.Fragment key={i}>
            {diff_list[i] == null && <Cursor />}
            {list_spaced[i].map(
              // word:1 word:last has no margin
              (ee, ii) => (
                <div
                  className={
                    "word mx-2 before-diff-" +
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
          </React.Fragment>
        );
      })}
    </div>
  );
}

const TypingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { style } = useSelector((state) => state.command);
  const { timeLimit, punc, num, capitalize } =
    useSelector(selectTypingSettings);
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [stats, setStats] = useState(null);
  const capitalizeChoices = ["capital", "small", "word", "sentence"];
  const nextCapitalizeChoice = (cp) => {
    const currentIndex = capitalizeChoices.indexOf(cp);
    const nextIndex = (currentIndex + 1) % capitalizeChoices.length;
    return capitalizeChoices[nextIndex];
  };

  const inputRef = React.useRef(null);
  window.source = text;
  window.change = input;

  const [takenWords, setTakenWords] = useState();

  useEffect(() => {
    getRandomWords({ 15: 50, 30: 100, 60: 200, 120: 300 }[timeLimit])
      .then((randomWords) => {
        setTakenWords(randomWords);
      })
      .catch((error) => {
        console.error("Error fetching random text:", error);
      });
  }, [timeLimit]);

  useEffect(() => {
    if (!takenWords) return;
    let select = takenWords.join(" ");
    if (!select) return;
    select = select
      .split(" ")
      .filter((e) => e)
      .join(" ");
    if (capitalize === "word") {
      select = select
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } else if (capitalize === "sentence") {
      select = select
        .split(".")
        .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
        .join(".");
    } else if (capitalize === "capital") {
      select = select.toUpperCase();
    } else if (capitalize === "small") {
      select = select.toLowerCase();
    }

    if (!punc) {
      select = select.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    } else {
      //sometimes add comma after a word randomly sometimes add a dot
      select = select
        .split(" ")
        .map((e) => {
          return (
            e + (Math.random() < 0.1 ? "," : Math.random() < 0.2 ? "." : "")
          );
        })
        .join(" ");
    }
    if (!num) {
      select = select.replace(/[0-9]/g, "");
    } else {
      select = select
        .split(" ")
        .map((e) => {
          return (
            e +
            (Math.random() < 0.1
              ? Math.floor(Math.random() * 10)
              : Math.random() < 0.2
              ? Math.floor(Math.random() * 100)
              : "")
          );
        })
        .join(" ");
    }
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
      navigate("/results", { state: { stats } });
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
  }, [isActive, timeLimit, startTime]);

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  return (
    <div className="typing-page min-h-screen flex flex-col items-center justify-center p-8">
      <div
        className={`w-full max-w-3xl ${
          style === 1 ? "bg-terminal-gray rounded-lg p-6" : ""
        }`}
      >
        <div className="flex justify-between mb-4">
          <div className="space-x-4">
            <button
              className={`${
                timeLimit === 15 ? "text-red-400" : "text-gray-500"
              }`}
              onClick={() => dispatch(setTimeLimit(15))}
            >
              15
            </button>
            <button
              className={`${
                timeLimit === 30 ? "text-red-400" : "text-gray-500"
              }`}
              onClick={() => dispatch(setTimeLimit(30))}
            >
              30
            </button>
            <button
              className={`${
                timeLimit === 60 ? "text-red-400" : "text-gray-500"
              }`}
              onClick={() => dispatch(setTimeLimit(60))}
            >
              60
            </button>
            <button
              className={`${
                timeLimit === 120 ? "text-red-400" : "text-gray-500"
              }`}
              onClick={() => dispatch(setTimeLimit(120))}
            >
              120
            </button>
          </div>
          {isActive && (
            <div className="d-center timer-cont">
              <span className="text-red-400">{timeLeft > 0 && timeLeft}</span>
              <span className="text-gray-500">s</span>
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

        <div className="bg-terminal-black p-6 rounded-lg mb-4">
          <div className="text-terminal-white text-lg max-h-96">
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
