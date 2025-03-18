import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FloatingDock from "../util/Aceternity/FloatingDock";
import Pointer from "../util/Aceternity/Pointer";
import DotBg from "./../util/Aceternity/DotBg";
import { makeLineIdGroups } from "./processutil";
import Alert, { AlertSub } from "./UI/Alerts";
import Connector from "./UI/Connector";
import Server, { ServerSub } from "./UI/Server";
import You, { YouSub } from "./UI/You";
import { FaArrowDown, FaHome, FaMinus, FaPlus } from "react-icons/fa";

function Msg({ by, content, sub = false, isMinimized }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.3 }}
      className={`w-full d-center`}
    >
      {by === "alert" ? (
        sub ? <AlertSub isMinimized={isMinimized} by={by} sub={sub} lineId={content.lineId} /> : <Alert by={by} content={content} />
      ) : null}
      {by === "server" ? (
        sub ? <ServerSub isMinimized={isMinimized} by={by} sub={sub} lineId={content.lineId} /> : <Server by={by} content={content} />
      ) : null}
      {by === "you" ? (
        sub ? <YouSub isMinimized={isMinimized} by={by} sub={sub} lineId={content.lineId} /> : <You by={by} content={content} />
      ) : null}
    </motion.div>
  );
}
function AutoResults() {
  const location = useLocation();
  const [processedState, setProcessedState] = useState([]);
  useEffect(() => {
    if (location.state) {
      let prx1 = makeLineIdGroups(location.state);
      setProcessedState(prx1);
      
    }
  }, [location.state]);
  const [isMinimized, setIsMinimized] = useState(false);

  function minimizeAll() {
    setIsMinimized(true);
    console.log('exec');
  }
  
  function maximizeAll() {
    setIsMinimized(false);
    console.log('exec');
  }
  

  const dockItems= [
    {
      title:<><u>M</u>inimize</>,
      icon:<FaMinus size={30}/>,
      onClick:minimizeAll,
      accessKey:"m"
    },{
      title:<>Max<u>i</u>mize</>,
      icon:<FaPlus size={30}/>,
      onClick:maximizeAll,
      accessKey:"i"
    }
  ] 

  return (
    <Pointer >
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="overflow-y-scroll h-screen gap-7 stack py-10 flex flex-col items-center"
    >
      <DotBg/>
      <h1 className="d-center text-2xl">AUTOMATA WORKFLOW LOG ANALYSIS</h1>
      
      <div className="stack relative">
        {processedState.map((msg, i) => (
          <React.Fragment key={i}>
            <Msg {...msg} index={i} isMinimized={isMinimized}/>
            {i !== processedState.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
              >
                <Connector index={i} />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
      <FloatingDock items={dockItems} comeOutOnLeft={false}/>
    </motion.div>
    </Pointer>
  );
}

export default AutoResults;