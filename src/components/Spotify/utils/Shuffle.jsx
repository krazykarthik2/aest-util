import React from "react";
import { FaShuffle } from "react-icons/fa6";

function Shuffle({onClick}) {
  return <button onClick={onClick}>
    <FaShuffle  />
  </button>;
}

export default Shuffle;
