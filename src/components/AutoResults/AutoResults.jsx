import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FloatingDock from "../util/Aceternity/FloatingDock";
import Pointer from "../util/Aceternity/Pointer";
import DotBg from "./../util/Aceternity/DotBg";
import { makeLineIdGroups } from "./processutil";
import Alert, { AlertSub } from "./UI/Alerts";
import Connector from "./UI/Connector";
import Server, {
  ServerGroupedCommand,
  ServerSub,
  ServerUnit,
} from "./UI/Server";
import You, { YouSub } from "./UI/You";
import {
  FaArrowDown,
  FaBackward,
  FaForward,
  FaHome,
  FaMinus,
  FaPlus,
} from "react-icons/fa";

function Msg({ by, content, sub = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.3 }}
      className={`w-full d-center`}
    >
      {by === "alert" ? (
        sub ? (
          <AlertSub {...props} by={by} sub={sub} lineId={content.lineId} />
        ) : (
          <Alert by={by} content={content} />
        )
      ) : null}
      {by === "server" ? (
        sub ? (
          <ServerSub {...props} by={by} sub={sub} lineId={content.lineId} />
        ) : (
          <Server by={by} content={content} />
        )
      ) : null}
      {by === "you" ? (
        sub ? (
          <YouSub {...props} by={by} sub={sub} lineId={content.lineId} />
        ) : (
          <You by={by} content={content} />
        )
      ) : null}
    </motion.div>
  );
}
function ExpandedBlock({ sub }) {
  return (
    <div className="stack">
      {sub?.map((e, i) => (
        <React.Fragment key={i}>
          {e.content.action === "grouped-command" ? (
            <ServerGroupedCommand {...e} />
          ) : (
            <ServerUnit {...e} />
          )}
          {i !== sub.length - 1 && <Connector />}
        </React.Fragment>
      ))}
    </div>
  );
}
function AutoResults() {
  const location = useLocation();
  const [processedState, setProcessedState] = useState([]);
  const [expansionIndices, setExpansionIndices] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(-1);

  useEffect(() => {
    if (location.state) {
      let prx1 = makeLineIdGroups(location.state);
      setProcessedState(prx1);
    }
  }, [location.state]);
  useEffect(() => {
    let __indices = [];
    if (!processedState) return;
    for (let i = 0; i < processedState.length; i++) {
      if (processedState[i]?.sub?.length > 0) {
        __indices.push(i);
      }
    }
    setExpansionIndices(__indices);
  }, [processedState]);

  function handleExpand(i, sub) {
    setExpandedIndex(i);
    setExpanded(sub);
  }
  useEffect(() => {
    if (expandedIndex == -1) setExpanded(null);
  }, [expandedIndex]);

  function nextExpansion() {
    if (!expansionIndices) return;
    if (expansionIndices.length == 0) return;
    let index = expansionIndices.findIndex((e) => e == expandedIndex);
    if (index == expansionIndices.length - 1) return;
    return setExpandedIndex(expansionIndices[index + 1]);
  }
  function prevExpansion() {
    if (!expansionIndices) return;
    if (expansionIndices.length == 0) return;
    let index = expansionIndices.findIndex((e) => e == expandedIndex);
    if (index == expansionIndices.length - 1) return;
    return setExpandedIndex(expansionIndices[index + 1]);
  }
  const items = [
    {
      icon: <FaMinus size={30} />,
      title: (
        <>
          <u>M</u>inimize
        </>
      ),
      onClick: () => setExpandedIndex(-1),
      accessKey: "m",
    },
    {
      icon: <FaForward size={30} />,
      title: (
        <>
          <u>N</u>ext
        </>
      ), 
      onClick: () => nextExpansion(),
      accessKey: "n",
    },  {
      icon: <FaBackward size={30} />,
      title: (
        <>
          <u>P</u>rev
        </>
      ),
      onClick: () => prevExpansion(),
      accessKey: "p",
    },
  ];
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="h-screen gap-7 stack py-10 flex flex-col items-center"
    >
      <h1 className="d-center text-2xl">AUTOMATA WORKFLOW LOG ANALYSIS</h1>
      <div className="d-center gap-10 h-full">
        <div className="stack relative overflow-y-auto py-10 h-full">
          {processedState.map((msg, i) => (
            <React.Fragment key={i}>
              <Msg
                {...msg}
                onExpand={(sub) => handleExpand(i, sub)}
                onCollapse={() => setExpandedIndex(-1)}
                isExpanded={i == expandedIndex}
              />

              {i !== processedState.length - 1 && <Connector />}
            </React.Fragment>
          ))}
          <FloatingDock items={items} />
        </div>
        {expanded && (
          <div className="stack relative overflow-y-auto py-24 h-full">
            <ExpandedBlock sub={expanded} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
export default AutoResults;
