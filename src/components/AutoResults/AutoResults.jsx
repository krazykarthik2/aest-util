import React from "react";
import { useLocation } from "react-router-dom";
import {
  FaArrowRight,
  FaBug,
  FaInfoCircle,
  FaPlusCircle,
  FaServer,
  FaStopCircle,
  FaUserAlt,
} from "react-icons/fa";
function Alert({ by, content }) {
  return (
    <div
      className="inline-flex rounded-xl gap-5 items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
      role="alert"
    >
      <FaInfoCircle size={30} />
      <p>{JSON.stringify(content)}</p>
    </div>
  );
}
const Icon = {
  "batch-created": <FaPlusCircle size={30} />,
  "batch-output": <FaArrowRight size={30} />,
  "batch-error": <FaBug size={30} />,
  "batch-executed": <FaStopCircle size={30} />,
};
function Server({ by, content }) {
  const IconReq = Icon[content.action] || <></>;
  return (
    <div
      className={`inline-flex rounded-xl gap-5 items-center text-white text-sm font-bold px-4 py-3 ${
        content.action == "batch-error" ? "bg-red-500" : "bg-green-500"
      } `}
      role="alert"
    >
      <FaServer size={30} />
      {IconReq}

      <div className="flex-col">
        <div className="flex justify-between">
          <p>{content.action}</p>
          <p>#{content.sessionId}</p>
        </div>
        <p>{content.output}</p>

        <p>{JSON.stringify(content)}</p>
      </div>
    </div>
  );
}
function You({ by, content }) {
  return (
    <div
      className="inline-flex rounded-xl gap-5 items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
      role="alert"
    >
      <FaUserAlt size={30} />
      <p>{JSON.stringify(content)}</p>
    </div>
  );
}
function AlertSub({ by, sub, lineId }) {
  return (
    <div
      className="inline-flex rounded-xl gap-5 items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
      role="alert"
    >
      <FaInfoCircle size={30} />
      <p>{lineId}</p>
      <div className="stack">{sub.map((e) => JSON.stringify(e))}</div>
    </div>
  );
}
function ServerUnit({by,content}){
  return (
    <div className="flex">
      <div className="stack w-full">
        <div className="flex justify-between">
          <span>
            {content.action}
            </span>
            <span>#{content.sessionId}</span>
        </div>
        <div className="flex justify-between">
          <span>
            {content.output}
            </span>
            <span>@{content.lineId}</span>
        </div>
        {/* {JSON.stringify(content)} */}
      </div>
    </div>
  )
}
function ServerSub({ by, sub, lineId }) {
  return (
    <div
      className="inline-flex rounded-xl gap-5 items-center bg-green-500 text-white text-sm font-bold px-4 py-3"
      role="alert"
    >
      <FaServer size={30} />
      <p>{lineId}</p>
      <div className="stack">{sub.map((e) => <div>{<ServerUnit {...e} />}</div>).map((e,i)=><>{e}{i==sub.length-1||<Connector/>}</>)}</div>
    </div>
  );
}
function YouSub({ by, sub, lineId }) {
  return (
    <div
      className="inline-flex rounded-xl gap-5 items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
      role="alert"
    >
      <FaInfoCircle size={30} />
      <p>{lineId}</p>
      <div className="stack">{sub.map((e) => JSON.stringify(e))}</div>
    </div>
  );
}
function Msg({ by, content, sub = false }) {
  return (
    <div className="w-full d-center">
      {by == "alert" ? (
        sub ? (
          <AlertSub by={by} sub={sub} lineId={content.lineId} />
        ) : (
          <Alert by={by} content={content} />
        )
      ) : (
        <></>
      )}
      {by == "server" ? (
        sub ? (
          <ServerSub by={by} sub={sub} lineId={content.lineId} />
        ) : (
          <Server by={by} content={content} />
        )
      ) : (
        <></>
      )}
      {by == "you" ? (
        sub ? (
          <YouSub by={by} sub={sub} lineId={content.lineId} />
        ) : (
          <You by={by} content={content} />
        )
      ) : (
        <></>
      )}
    </div>
  );
}
function Connector() {
  return <div className="w-full d-center">|</div>;
}
function processState(__state) {
  let state= [...__state];
  let newState = [];
  for (let i = 0; i < state.length; i++) {
    // group all things consecutively having same lineId if they are of state.by in ["line-started","batch-output","batch-error","line-executed"]
    if (
      state[i].by == "server" &&
      ["line-started", "batch-output", "batch-error", "line-executed"].includes(
        state[i].content.action
      )
    ) {
      let lineId = state[i].content.lineId;
      let j = i + 1;
      while (
        j < state.length &&
        state[j].by == "server" &&
        state[j].content.lineId == lineId &&
        [
          "line-started",
          "batch-output",
          "batch-error",
          "line-executed",
        ].includes(state[j].content.action)
      ) {
        j++;
      }
      let group = state.splice(i, j - i - 1);
      let newgroup = {};
      newgroup.by = "server";
      newgroup.content = { lineId: lineId };
      newgroup.sub = [];
      for (let k = 0; k < group.length; k++) {
        newgroup.sub.push(group[k]);
      }
      newState.push(newgroup);
    } else {
      newState.push(state[i]);
    }
  }
  return newState;
}
function AutoResults() {
  const location = useLocation();
  const state = location.state;
  window.state = state;
  return (
    <div className="overflow-y-scroll h-screen">
      <h1>Result of Automata</h1>
      <div className="stack">
        {processState(state)
          .map((msg) => Msg(msg))
          .map((msg, i) => (
            <>
              {msg}
              {i != state.length - 1 && <Connector />}
            </>
          ))}
      </div>
    </div>
  );
}

export default AutoResults;
