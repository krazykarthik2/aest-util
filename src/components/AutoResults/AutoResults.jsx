import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
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

import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);
function Msg({ by, content, sub = false, ...props }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (inView) setIsAnimated(true);
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100, rotate: "-20deg" }}
      animate={isAnimated ? { opacity: 1, y: 0, rotate: "0deg" } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full d-center"
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
function ExpandedBlock({ sub, expandedTitle }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false); // Reset animation
    setTimeout(() => setAnimate(true), 50); // Re-trigger animation after a tiny delay
  }, [sub]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={animate ? { duration: 0.7 } : { duration: 0 }}
    >
      <div className="stack">
        <h1 className="d-center text-2xl">{expandedTitle}</h1>
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
    </motion.div>
  );
}
const layout = [
  { i: "log", x: 0, y: 0, w: 6, h: 5, minW: 3, minH: 3 },
  { i: "expanded", x: 6, y: 0, w: 6, h: 5, minW: 3, minH: 3 },
];
function AutoResults() {
  const location = useLocation();
  const [processedState, setProcessedState] = useState([]);
  const [expansionIndices, setExpansionIndices] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [expandedTitle, setExpandedTitle] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [altKey, setAltKey] = useState(false);
  const ref = React.useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const scrollUp = () => {
      ref.current.scrollBy({ top: -50, behavior: "smooth" });
    };
    const scrollDown = () => {
      ref.current.scrollBy({ top: +50, behavior: "smooth" });
    };
    const keyDown = (e) => {
      if (e.key == "Alt") {
        setAltKey(true);
      }
      if (e.key == "ArrowUp") {
        scrollUp();
      }
      if (e.key == "ArrowDown") {
        scrollDown();
      }
    };
    const keyUp = (e) => {
      if (e.key == "Alt") {
        setAltKey(false);
      }
      if (e.key == "ArrowLeft") {
        prevExpansion();
      }
      if (e.key == "ArrowRight") {
        nextExpansion();
      }
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [ref, expandedIndex]);

  useEffect(() => {
    if (location.state) {
      window.state = location.state;
      window.processor = makeLineIdGroups;
      let prx1 = makeLineIdGroups(location.state);
      window.prx1 = prx1;
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

  function handleExpand(i, title, sub) {
    setExpandedIndex(i);
    setExpanded(sub);
    setExpandedTitle(title);
  }
  useEffect(() => {
    if (expandedIndex == -1) setExpanded(null);
  }, [expandedIndex]);

  function nextExpansion() {
    if (!expansionIndices) return;
    if (expansionIndices.length == 0) return;
    let index = expansionIndices.findIndex((e) => e == expandedIndex);
    if (index == expansionIndices.length - 1) return;
    setExpandedIndex(expansionIndices[index + 1]);
    console.log(processedState[expansionIndices[index + 1]]);
    setExpandedTitle(
      "@" + processedState[expansionIndices[index + 1]].content.lineId
    );
    setExpanded(processedState[expansionIndices[index + 1]].sub);
  }
  function prevExpansion() {
    if (!expansionIndices) return;
    if (expansionIndices.length == 0) return;
    let index = expansionIndices.findIndex((e) => e == expandedIndex);
    if (index == -1) index = 1;
    if (index == 0) return;
    setExpandedIndex(expansionIndices[index - 1]);
    console.log(processedState[expansionIndices[index - 1]]);
    setExpandedTitle(
      "@" + processedState[expansionIndices[index - 1]].content.lineId
    );
    setExpanded(processedState[expansionIndices[index - 1]].sub);
  }
  const items = [
    {
      icon: <FaMinus size={20} />,
      title: (
        <>
          <u>M</u>inimize
        </>
      ),
      onClick: () => setExpandedIndex(-1),
      accessKey: "m",
    },
    {
      icon: <FaForward size={20} />,
      title: (
        <>
          <u>N</u>ext
        </>
      ),
      onClick: () => nextExpansion(),
      accessKey: "n",
    },
    {
      icon: <FaBackward size={20} />,
      title: (
        <>
          Pre<u>v</u>
        </>
      ),
      onClick: () => prevExpansion(),
      accessKey: "v",
    },
  ];
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="h-screen w-full gap-7 stack py-10 flex flex-col items-center"
    >
      <h1 className="d-center text-2xl">AUTOMATA WORKFLOW LOG ANALYSIS</h1>
      <ResponsiveGridLayout
        className="layout w-full h-full"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 10, sm: 6 }}
        rowHeight={30}
        draggableHandle=".drag-handle"
      >
        {/* Log Section */}
        <div key="log" className="p-4 overflow-y-auto">
          <h2 className="drag-handle cursor-move d-center text-xl">Logs</h2>
          <div className="stack">
            {processedState.map((msg, i) => (
              <React.Fragment key={i}>
                <Msg
                  {...msg}
                  onExpand={(title, sub) => handleExpand(i, title, sub)}
                  isExpanded={i === expandedIndex}
                />
                {i !== processedState.length - 1 && <Connector />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Expanded Details Section */}
        <div key="expanded" className="p-4 overflow-y-auto">
          <h2 className="drag-handle cursor-move d-center text-xl">Details</h2>
          {expanded && (
            <>
              {" "}
              <ExpandedBlock sub={expanded} expandedTitle={expandedTitle} />
              {altKey && (
                <div className="d-center w-full gap-10">
                  <kbd className="rounded-xs px-5 py-2 stack d-center">
                    <span>v</span>
                    <span>prev</span>
                  </kbd>
                  <kbd className="rounded-xs px-5 py-2 stack d-center">
                    <span>m</span>
                    <span>min</span>
                  </kbd>
                  <kbd className="rounded-xs px-5 py-2 stack d-center">
                    <span>n</span>
                    <span>next</span>
                  </kbd>
                </div>
              )}
            </>
          )}
        </div>
      </ResponsiveGridLayout>
    </motion.div>
  );
}
export default AutoResults;
