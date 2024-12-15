import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearHistory, addToHistory, setStyle } from "../../redux/commandSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { handleCommand } from "./logic";
import HandleURLSearchParams from "../util/HandleURLSearchParams";

const Terminal = ({ command, setCommand, setStyle, hidden }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { style, history } = useSelector((state) => state.command);
  const [searchParams, setSearchParams] = useSearchParams();

  const [upIndex, setUpIndex] = useState(0);
  const inputRef = useRef(null);
  const limit = 3

  function ExecuteCommand(cmd) {
    setTimeout(() => {
      if (!cmd) return;
      cmd.split("&").forEach((element) => {
        const output = handleCommand(element, navigate, dispatch, clearHistory);
        if (output !== null) {
          //null means silent
          dispatch(addToHistory({ input: element, output: output }));
        }
      });
    }, 0);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!command.trim()) return;
    ExecuteCommand(command);
    setCommand("");
    setUpIndex(0);
  };

  const renderPrompt = (isOld=false) => {
    if (style === 1) {
      return <span className={"text-terminal-accent "+(isOld?"opacity-75":"")}>$&gt;</span>;
    }
    return <span className="text-red-400">❯_</span>;
  };
  function onKeyDown(e) {
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      let x = 0;
      if (e.key == "ArrowUp") x = 1;
      else if (e.key == "ArrowDown") x = -1;
      if((upIndex+x)>history.length)return;
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
        <div className="w-full max-w-2xl mx-auto" onClick={() => inputRef.current?.focus()}>
          <div className="w-full terminal-container">
            <div className="">
              {history.map((entry,index)=>({entry,index})).slice(-(limit-1+Math.max(1,upIndex)),Math.max(limit,history.length-upIndex+1)).map(({entry,index}) => (
                <div key={index} className="mb-2 flex">
                  {index ===history.length- upIndex ? "===>" : renderPrompt(true)}
                  <div
                    className={
                      (index === history.length - upIndex ? "ml-10" : "ml-5") +
                      " text-terminal-white stack"
                    }
                  >
                    <span>{entry.input}</span>
                    <pre className="text-gray-300">
                      &lt;&nbsp;&nbsp;&nbsp;{entry.output}
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center">
              {renderPrompt()}
              <input
                autoFocus
                onBlur={(e) => e.target.focus()}
                ref={inputRef}
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-terminal-white ml-2"
                placeholder={
                  style === 1 ? "Enter command..." : "Type a command..."
                }
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
      />
    </>
  );
};

export default Terminal;
