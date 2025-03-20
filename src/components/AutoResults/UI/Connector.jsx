import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

function Connector({ index }) {
  const lineRef = useRef(null);

  return (
    <AnimatePresence>
      <motion.div
        ref={lineRef}
        className="w-1 bg-blue-500 mx-auto"
        initial={{ opacity: 0,minHeight:"0px" }}
        whileInView={{ opacity: 1 ,minHeight:"30px"}}
        transition={{ duration: 0.5, delay: index * 0.5 }}
      />
    </AnimatePresence>
  );
}

export default Connector;
