import React from "react";
import { FaHeart } from "react-icons/fa6";
function Heart({ onClick }) {
  return (
    <button onClick={onClick}>
      <FaHeart />
    </button>
  );
}

export default Heart;
