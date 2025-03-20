import { FaServer } from "react-icons/fa";
import React, { useEffect } from "react";
import Connector from "./Connector";
import { splitText } from "../../../util/jsutil";
import { Icon } from "../processutil";
import TextGen from "../../util/Aceternity/TextGen";
export function ServerCommandEach(e) {
  return (
    <div className="stack relative border rounded-xl p-2">
      <div className="flex justify-between items-center gap-5 ">
        <div className="stack text-gray-600 text-xs">
          {splitText(e.content.batchId, 9).map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </div>
        {["line-started", "line-executed"].includes(e.content.action) && (
          <div className="flex justify-between w-full h-full items-center gap-5">
            <span>{Icon[e.content.action]}</span>
            <span>{e.content.output}</span>
          </div>
        )}
        {["batch-output", "batch-error"].includes(e.content.action) && (
          <div className="flex w-full items-center ">{e.content.output}</div>
        )}
      </div>
    </div>
  );
}

export function ServerGroupedCommand({ content, inouts }) {
  return (
    <div className="stack border rounded-2xl p-5">
      {inouts.map((e, i) => (
        <React.Fragment key={i}>
          <ServerCommandEach {...e} />
          {i === inouts.length - 1 || <Connector />}
        </React.Fragment>
      ))}
    </div>
  );
  // return <></>
}

export function ServerUnit({ by, content }) {
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
      </div>
    </div>
  );
}
export function ServerSub({
  by,
  sub,
  lineId,
  onExpand,
  isExpanded,
  onCollapse,
}) {
  return (
    <div
      className={`inline-flex rounded-xl gap-5 items-center bg-green-500 text-white text-sm font-bold px-4 py-3 ${
        isExpanded ? "animate-pulse" : ""
      } `}
      role="alert"
    >
      <button
        className="expand text-3xl"
        onClick={() => {
          if (!isExpanded) onExpand("@" + lineId, sub);
          else onCollapse();
        }}
        aria-label={isExpanded ? "Collapse" : "Expand"}
      >
        {isExpanded ? "-" : "+"}
      </button>
      <FaServer size={30} />
      <p>{lineId}</p>
    </div>
  );
}

export default function Server({ by, content }) {
  const IconReq = Icon[content.action] || <></>;
  return (
    <div className="flex justify-between w-full items-center">
      <div className="stack text-gray-600 text-xs">
        {splitText(content?.batchId, 9).map((e, i) => (
          <span key={i}>{e}</span>
        ))}
      </div>
      <div
        className={`inline-flex rounded-xl gap-5 items-center text-white text-sm font-bold px-4 py-3 ${
          content.action == "batch-error" ? "bg-red-500" : "bg-green-500"
        } `}
        role="alert"
      >
        <FaServer size={30} />
        {IconReq}

        {typeof content == "string" ? (
          <span>{content}</span>
        ) : (
          <div className="flex justify-between gap-5">
            <div className="flex-col">
              <span className="d-center w-full text-xl">{content.action}</span>
              <TextGen words={content.output} />
            </div>
          </div>
        )}
      </div>
      <div className="right"></div>
    </div>
  );
}
