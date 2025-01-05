import React, { useEffect, useState } from "react";
import Terminal from "../../Terminal/Terminal";
import { GithubBtn, LoggedinAs, VersionBtn } from "../pins";
import "./Style12.css";

const Style12 = ({ hours, minutes, props, dispatch }) => {
  const [cmd, setCmd] = useState("");
  const [stream, setStream] = useState(null);
  const [sessId, setSessId] = useState(null);
  const [outs, setOuts] = useState([]);
  const [errs, setErrs] = useState([]);
  window._ = {
    cmd,
    setCmd,
    stream,
    setStream,
    sessId,
    setSessId,
    outs,
    setOuts,
    errs,
    setErrs,
  };
  const lastRef = React.useRef(null);
  useEffect(() => {
    if (lastRef.current) {
      lastRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [lastRef.current]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (cmd) {
      stream.send(
        JSON.stringify({ action: "command", sessionId: sessId, command: cmd })
      );
      setCmd("");
    }
  };
  const terminateSession = () => {
    stream.close();
  };

  useEffect(() => {
    if (!stream) {
      const __stream = new WebSocket("ws://localhost:4594");
      __stream.onopen = () => {
        setStream(__stream);
      };
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
  return (
    <div className="stack justify-between items-center h-screen py-10 px-5 gap-5">
      <div className="top">
        <h1>session#{sessId}</h1>
        <button onClick={terminateSession}>Close</button>
      </div>
      <div className="middle d-center w-full ">
        <div
          className="w-full stack overflow-y-auto overflow-x-hidden"
          style={{ maxHeight: "50vh" }}
        >
          {[...outs, ...errs]
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((e, i) => (
              <pre
                key={i}
                {...(i == outs.length + errs.length - 1
                  ? { ref: lastRef }
                  : {})}
              >
                {e.msg}
              </pre>
            ))}
        </div>
      </div>

      <div className="bottom w-full justify-between stack items-center gap-2">
        <Terminal {...props} hidden />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={cmd}
            className="bg-gray-800 text-white w-full h-10 px-2 rounded-md"
            onChange={(e) => setCmd(e.target.value)}
          />
        </form>
        <div className="flex justify-between items-center w-full h-full">
          <div className="left"></div>
          <div className="middle">
            <GithubBtn />
          </div>
          <div className="right">
            <VersionBtn />
          </div>
        </div>
        <div className="bottom d-center">
          <LoggedinAs />
        </div>
      </div>
    </div>
  );
};
export default Style12;
