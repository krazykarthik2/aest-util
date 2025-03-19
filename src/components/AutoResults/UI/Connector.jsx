import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";

function Connector({ index }) {
  const lineRef = useRef(null);

  return (
    <AnimatePresence>
      <motion.div
        ref={lineRef}
        className="w-1 bg-blue-500 h-10 mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: index * 0.5 }}
      />
    </AnimatePresence>
  );
}

export default Connector;
