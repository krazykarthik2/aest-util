import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearHistory, addToHistory, setStyle } from "../../redux/commandSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { handleCommand } from "./logic";
import HandleURLSearchParams from "../util/HandleURLSearchParams";

const Terminal = ({ command, setCommand, setStyle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { style, history } = useSelector((state) => state.command);
  const [searchParams, setSearchParams] = useSearchParams();

  const [upIndex, setUpIndex] = useState(0);
  const inputRef = useRef(null);

  function ExecuteCommand(cmd) {
    setTimeout(() => {
      if (!cmd) return;
      const output = handleCommand(cmd, navigate, dispatch, clearHistory);
      if (output !== null) {
        //null means silent
        dispatch(addToHistory({ input: cmd, output: output }));
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

  const renderPrompt = () => {
    if (style === 1) {
      return <span className="text-terminal-accent">$</span>;
    }
    return <span className="text-red-400">❯_</span>;
  };
  function onKeyDown(e) {
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      let x = 0;
      if (e.key == "ArrowUp") x = 1;
      else if (e.key == "ArrowDown") x = -1;
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
      <div
        className={`min-h-screen ${style === 1 ? "p-4" : "p-8"}`}
        onClick={() => inputRef.current?.focus()}
      >
        {upIndex}
        <div className={style === 1 ? "terminal-container" : ""}>
          <div className="mb-4">
            {history.map((entry, index) => (
              <div key={index} className="mb-2 flex">
                {index === history.length - upIndex ? "===>" : renderPrompt()}
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
              className="flex-1 bg-transparent border-none outline-none text-terminal-white ml-2 font-mono"
              placeholder={
                style === 1 ? "Enter command..." : "Type a command..."
              }
              onKeyDown={onKeyDown}
            />
          </form>
        </div>

        {style === 2 && (
          <div className="fixed bottom-4 right-4 flex items-center space-x-4">
            <a
              href="https://github.com/krazykarthik2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400"
            >
              <FaGithub size={24} />
            </a>
            <span className="text-red-400 text-sm">21.2.3</span>
          </div>
        )}
      </div>
      <HandleURLSearchParams
        setCommand={setCommand}
        setStyle={setStyle}
        ExecuteCommand={ExecuteCommand}
      />
    </>
  );
};

export default Terminal;
