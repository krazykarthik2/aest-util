import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearHistory, addToHistory, setStyle } from "../../redux/commandSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { handleCommand } from "./logic";
import HandleURLSearchParams from "../util/HandleURLSearchParams";
import Icon from "./Icon";

function reverseIf(arr, boolean = false) {
  return boolean ? arr.reverse() : arr;
}
const Terminal = ({
  command,
  setCommand,
  setStyle,
  hidden,
  setFocus,
  focus,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { style, history } = useSelector((state) => state.command);
  const [searchParams, setSearchParams] = useSearchParams();

  const [upIndex, setUpIndex] = useState(0);
  const inputRef = useRef(null);
  const limit = 3;

  const historyDown = [3, 5].includes(style);

  useEffect(() => {
    if (!focus) {
      if (inputRef.current) inputRef.current.focus();
    }
  }, [inputRef, focus]);
  async function ExecuteCommand(cmd) {
    setTimeout(async () => {
      if (!cmd) return;
      for (let element of cmd.split("&")) {
        const output = await handleCommand(
          element,
          navigate,
          dispatch,
          clearHistory
        );
        if (output !== null) {
          //null means silent
          dispatch(addToHistory({ input: element, output: output }));
        }
      }
    }, 0);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!command.trim()) return;
    ExecuteCommand(command);
    setCommand("");
    setUpIndex(0);
  };

  const renderPrompt = (isOld = false) => {
    if (style === 1) {
      return (
        <span className={"text-terminal-accent " + (isOld ? "opacity-75" : "")}>
          $&gt;
        </span>
      );
    }
    return <span className="text-red-400">&gt;&gt;</span>;
  };

  const renderIcon = (command) => {
    const action = command
      ?.split(" ")
      ?.filter((e) => e)?.[0]
      ?.replaceAll(/[^a-zA-Z0-9.?]+/g, "");
    return (
      <span className="text-terminal-accent">
        {action in Icon ? Icon[action] : renderPrompt()}
      </span>
    );
  };

  function onKeyDown(e) {
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      let x = 0;
      if (historyDown) {
        if (e.key == "ArrowUp") {
          x = -1;
        } else if (e.key == "ArrowDown") {
          x = 1;
        }
      } else {
        if (e.key == "ArrowUp") {
          x = 1;
        } else if (e.key == "ArrowDown") {
          x = -1;
        }
      }
      if (upIndex + x > history.length) return;
      if (upIndex + x < 1) {
        setUpIndex(0);
        setCommand("");
        return false;
      }
      setCommand(history.at(-(upIndex + x))?.input);
      setUpIndex((e) => e + x);
    }
    return false;
  }

  useEffect(() => {
    if (history.length < upIndex) setUpIndex(history.length);
    if (upIndex < 0) setUpIndex(0);
  }, [history, upIndex]);

  return (
    <>
      {hidden ? null : (
        <div
          className="w-full max-w-2xl mx-auto"
          onClick={() => inputRef.current?.focus()}
        >
          <div
            className={
              "w-full terminal-container flex gap-5 " +
              (historyDown ? "flex-col-reverse" : "flex-col")
            }
          >
            {history.length > 0 && (
              <div className="stack">
                {reverseIf(
                  history
                    .map((entry, index) => ({ entry, index }))
                    .slice(
                      -(limit - 1 + Math.max(1, upIndex)),
                      Math.max(limit, history.length - upIndex + 1)
                    ),
                  historyDown
                ).map(({ entry, index }) => (
                  <div
                    key={index}
                    className={
                      "mb-2 flex w-full " +
                      (index === history.length - upIndex ? "gap-10" : "gap-5")
                    }
                  >
                    {index === history.length - upIndex
                      ? "===>"
                      : renderPrompt(true)}
                    <div className=" text-terminal-white w-full stack">
                      <span>{entry.input}</span>
                      <div className="d-center text-gray-300 flex gap-4">
                        <div className="thisisoutput">&lt;&lt;</div>
                        <div className="text-gray-300 stack w-full justify-start">
                          {entry.output.split("\n").map((e) => (
                            <div className="line flex flex-wrap justify-end w-[fit-content]">
                              {e.split(" ").map((e) => (
                                <span>{e}&nbsp;</span>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center">
              {renderIcon(command)}
              <input
                disabled={focus}
                autoFocus
                onBlur={(e) => (focus ? null : e.target.focus())}
                ref={inputRef}
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-terminal-white ml-2"
                placeholder="Type a command..."
                onKeyDown={onKeyDown}
              />
            </form>
          </div>
        </div>
      )}
      <HandleURLSearchParams
        command={command}
        setCommand={setCommand}
        setStyle={setStyle}
        ExecuteCommand={ExecuteCommand}
        setFocus={setFocus}
      />
    </>
  );
};

export default Terminal;
