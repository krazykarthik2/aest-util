import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaArrowRight,
  FaBug,
  FaInfoCircle,
  FaPlay,
  FaPlusCircle,
  FaServer,
  FaStop,
  FaStopCircle,
  FaUserAlt,
} from "react-icons/fa";
import { splitText } from "../../util/jsutil";

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
  "line-started": <FaPlay size={30} />,
  "line-executed": <FaStop size={30} />,
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
          <span>{content.action}</span>
          <div className="stack text-gray-600 text-xs">
            #
            {splitText(content?.sessionId, 9).map((e, i) => (
              <span key={i}>{e}</span>
            ))}
          </div>
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
function ServerSub({ by, sub, lineId }) {
  return (
    <div
      className="inline-flex rounded-xl gap-5 items-center bg-green-500 text-white text-sm font-bold px-4 py-3"
      role="alert"
    >
      <FaServer size={30} />
      <p>{lineId}</p>
      <div className="stack">
        {sub
          .map((e, i) => <div key={i}>{<ServerUnit {...e} />}</div>)
          .map((e, i) => (
            <React.Fragment key={i}>
              {e}
              {i == sub.length - 1 || <Connector />}
            </React.Fragment>
          ))}
      </div>
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

function ServerUnit({ by, content }) {
  const IconReq = Icon[content?.action] || <></>;
  return (
    <div className="flex">
      <div className="flex items-center">{IconReq}</div>
      <div className="stack w-full">
        <div className="flex justify-between">
          <span>{content?.action}</span>{" "}
          <div className="stack text-gray-600 text-xs">
            {splitText(content?.sessionId, 9).map((e, i) => (
              <span key={i}>{e}</span>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <span>{content?.output}</span>
        </div>
        {/* {JSON.stringify(content)} */}
      </div>
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

function makeLineIdGroups(__state) {
  let state = [...__state];
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

      let group = state.splice(i, j - i);
      let newgroup = {};
      newgroup.by = "server";
      newgroup.content = { lineId: lineId };
      let groupedCommandSubs = [];

      for (let k = 0; k < group.length; k++) {
        
        groupedCommandSubs.push(group[k]);
      }
      newgroup.sub = groupedCommandSubs;
      newState.push(newgroup);
    }
    newState.push(state[i]);
  }
  return newState;
}

function AutoResults() {
  const location = useLocation();
  const [processedState, setProcessedState] = useState([]);
  useEffect(() => {
    if (location.state) {
      window.state = location.state;

      let prx1 = makeLineIdGroups(location.state);

      window.prx1 = prx1;
      setProcessedState(prx1);
    }
  }, [location.state]);
  return (
    <div className="overflow-y-scroll h-screen">
      <h1>Result of Automata</h1>
      <div className="stack">
        {processedState
          .map((msg) => Msg(msg))
          .map((msg, i) => (
            <>
              {msg}
              {i != processedState.length - 1 && <Connector />}
            </>
          ))}
      </div>
    </div>
  );
}

export default AutoResults;
