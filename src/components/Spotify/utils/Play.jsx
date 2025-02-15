import React from "react";
import { FaPlay, FaPause } from "react-icons/fa6";
function Play({ playing, onClick }) {
  return (
    <button onClick={onClick}>{playing ? <FaPause /> : <FaPlay />}</button>
  );
}

export default Play;
