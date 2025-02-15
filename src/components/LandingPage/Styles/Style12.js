import React, { useEffect, useRef, useState } from "react";
import Terminal from "../../Terminal/Terminal";
import { GithubBtn, LoggedInAs, LoggedinAs, VersionBtn } from "../pins";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowUpFromBracket,
  FaArrowUpRightDots,
  FaArrowUpRightFromSquare,
  FaCircleStop,
} from "react-icons/fa6";
import { FaRedo, FaTimes } from "react-icons/fa";
import Snippets, { format$, format$str } from "../../SessionUtils/Snippets";
const SnippetKeys = Object.keys(Snippets);

const Snippet = ({ onSubmit }) => {
  const [value, setValue] = useState("");
  const [sugg, setSugg] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [args, setArgs] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (SnippetKeys.includes(value)) {
      onSubmit(Snippets?.[value.trim()]?.[0]);
    } else if (sugg.length > 0) {
      console.log(sugg?.[0]);
      console.log(Snippets?.[sugg?.[0]]?.[0]);
      onSubmit(format$str(Snippets?.[sugg?.[0]]?.[0], args));
    }
  };
  useEffect(() => {
    const regex = /[^A-Za-z]/g;
    const val = value?.trim()?.split(" ")?.[0]?.replaceAll(regex, "");
    setSugg(SnippetKeys.filter((e) => e.replaceAll(regex, "").startsWith(val)));
    setArgs(
      value
        .split(" ")
        .filter((e) => e)
        .slice(1)
    );
  }, [value]);
  return (
    <form
      className="d-center stack gap-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      onSubmit={handleSubmit}
    >
      <div
        className={
          "d-center gap-2 " + (isFocused ? "" : "opacity-0 pointer-events-none")
        }
      >
        {SnippetKeys?.includes(value) && Snippets?.[value]?.[1]}
        <input
          className="bg-gray-700 text-white px-2 py-2 rounded-md"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          accessKey="s"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      {isFocused && value && (
        <div className="suggestions flex stack items-start text-lg w-full bg-gray-600 rounded-md p-2">
          {sugg?.map((e) => (
            <button
              className="w-full flex items-center gap-2"
              type="button"
              onClick={() => setValue(e)}
            >
              {Snippets?.[e]?.[1]}
              <span>{format$(e, args)}</span>
            </button>
          ))}
        </div>
      )}
    </form>
  );
};
const InputComp = ({ handleSubmit, cmd, setCmd, reference }) => {
  return (
    <form onSubmit={handleSubmit} className="inline-flex w-full">
      <input
        type="text"
        value={cmd}
        ref={reference}
        className="bg-transparent border-0 outline-0 text-white w-full h-10 px-2 rounded-md"
        onChange={(e) => setCmd(e.target.value)}
      />
    </form>
  );
};
const Style12 = ({ hours, minutes, props, dispatch }) => {
  const [cmd, setCmd] = useState("");
  const [stream, setStream] = useState(null);
  const [sessId, setSessId] = useState(null);
  const [outs, setOuts] = useState([]);
  const [errs, setErrs] = useState([]);
  const [terminatedFlag, setTerminatedFlag] = useState(false);
  const [connFailed, setConnFailed] = useState(null);
  const [present, setPresent] = useState([]);

  useEffect(() => {
    const temp = [...outs, ...errs].sort((a, b) => a.timestamp - b.timestamp);
    setPresent({ before: temp.slice(0, -1), last: temp.at(-1) });
  }, [outs, errs]);

  const navigate = useNavigate();
  const lastRef = React.useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (lastRef.current) {
      lastRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [lastRef.current, outs, errs]);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [inputRef]);

  function handleCommand(command) {
    if (command) {
      if (command == "cls") {
        setOuts((e) => [e.at(-1)]);
        setErrs([]);
      } else {
        stream.send(
          JSON.stringify({
            action: "command",
            sessionId: sessId,
            command: command,
          })
        );
      }
    }
  }
  function sendInterrupt() {
    stream.send(
      JSON.stringify({
        action: "interrupt",
        sessionId: sessId,
      })
    );
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    handleCommand(cmd);
    setCmd("");
  };

  const terminateSession = () => {
    setTerminatedFlag(true);
    if (stream) stream.close();
    navigate("/clock?style=1");
  };
  const terminateSessionAndNew = () => {
    setOuts([]);
    setErrs([]);
    setCmd("");
    setConnFailed(null);
    setTerminatedFlag(false)
    if (stream) {
      stream.close();
    } else {
      setStream(null);
    }
  };

  useEffect(() => {
    if (terminatedFlag) return;
    if (!stream) {
      try {
        const __stream = new WebSocket("ws://localhost:4594");
        __stream.onopen = () => {
          setStream(__stream);
          setConnFailed(null);
        };
        __stream.onerror = (e) => {
          console.log("connection failed");
          setConnFailed(e);
          window.connfailed = connFailed;
        };
      } catch (error) {
        console.log("error occured at websocket");
        console.log(error);
      }
    } else {
      stream.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.action === "session-created") {
          setSessId(data.sessionId);
        } else if (data.action === "command-output") {
          setSessId(data.sessionId);
          setOuts((e) => [...e, { timestamp: Date.now(), msg: data.output }]);
        } else if (data.action === "command-error") {
          setErrs((e) => [...e, { timestamp: Date.now(), msg: data.error }]);
        } else if (data.action === "error") {
          setErrs((e) => [...e, { timestamp: Date.now(), msg: data.error }]);
        }
      };
      stream.onclose = () => {
        setStream(null);
      };
    }
  }, [stream]);

  const handleSnippetInsertion = (sni) => {
    setCmd(sni);
    inputRef?.current?.focus();
  };
  const tryOpeningDaemon = () => {
    window.open("teja-util://");
    terminateSessionAndNew();
  };
  return (
    <div className="stack justify-between items-center h-screen py-10 px-5 gap-5">
      <div className="top stack gap-2">
        <h1>session#{sessId}</h1>
        <div className="d-center gap-10">
          <button
            className="px-5 py-2 bg-gray-900 rounded-md d-center gap-5"
            onClick={terminateSessionAndNew}
            accessKey="n"
          >
            <span>
              <u>n</u>ew session
            </span>
            <FaRedo />
          </button>
          <button
            className="px-5 py-2 bg-gray-900 rounded-md d-center gap-5"
            onClick={terminateSession}
            accessKey="w"
          >
            <span>
              close<u>(w)</u>
            </span>
            <FaTimes />
          </button>
          <button
            className="px-5 py-2 bg-gray-900 rounded-md d-center gap-5"
            onClick={sendInterrupt}
            accessKey="c"
          >
            <span>
              interrupt<u>(c)</u>
            </span>
            <FaCircleStop />
          </button>
        </div>
      </div>
      <div
        className="middle d-center w-full h-full"
        onClick={(e) => {
          inputRef?.current?.focus();
        }}
      >
        {connFailed && (
          <div className="err-msg d-center w-full">
            <button
              accessKey="o"
              className="d-center p-3 rounded-lg bg-gray-800 gap-5"
              onClick={tryOpeningDaemon}
            >
              <span>
                <u>o</u>pen daemon
              </span>
              <FaArrowUpRightFromSquare />
            </button>
          </div>
        )}
        {!connFailed && (
          <div
            className="w-full h-full stack overflow-y-auto overflow-x-hidden"
            style={{ maxHeight: "60vh" }}
          >
            <pre>{present?.before?.map((e) => e?.msg)}</pre>

            <div className="flex w-full">
              <pre ref={lastRef}>
                {present?.last?.msg.split("\n")?.slice(0, -1).join("\n")}
              </pre>
            </div>
            <div className="lastline flex w-full items-center">
              <pre>
                {present?.last?.msg.split("\n").length > 1 &&
                  present?.last?.msg.split("\n")?.at(-1)}
              </pre>
              <InputComp
                cmd={cmd}
                setCmd={setCmd}
                handleSubmit={handleSubmit}
                reference={inputRef}
              />
            </div>
          </div>
        )}
      </div>

      <div className="bottom flex items-center w-full">
        <table className="bottomleft stack ">
          <tr>
            <td>
              <kbd>alt</kbd>+<kbd>c</kbd>
            </td>
            <td>interrupt</td>
          </tr>
          <tr>
            <td>
              <kbd>alt</kbd>+<kbd>w</kbd>
            </td>
            <td>close</td>
          </tr>
          <tr>
            <td>
              <kbd>alt</kbd>+<kbd>n</kbd>
            </td>
            <td>new</td>
          </tr>
          <tr>
            <td>
              <kbd>alt</kbd>+<kbd>s</kbd>
            </td>
            <td>snippet</td>
          </tr>
        </table>
        <div className="bottomright w-full justify-between stack items-center gap-2">
          <Snippet onSubmit={handleSnippetInsertion} />
          <Terminal {...props} hidden />

          <div className="flex justify-between items-center w-full h-full">
            <div className="left stack"></div>
            <div className="middle">
              <GithubBtn />
            </div>
            <div className="right">
              <VersionBtn />
            </div>
          </div>
          <div className="bottom d-center">
            <LoggedInAs />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Style12;
