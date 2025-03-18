import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";

function Connector({ index }) {
  const lineRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 0.5, delay: index * 0.5, ease: "power2.out" }
    );
  }, [index]);

  return (
    <motion.div
      ref={lineRef}
      className="w-1 bg-blue-500 h-10 mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.5 }}
      whileHover={{ scaleX: 1.2, backgroundColor: "#4f46e5" }}
    />
  );
}

export default Connector;
