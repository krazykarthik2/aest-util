import axios from "axios";
import React, { useEffect, useState } from "react";
import Terminal from "../../Terminal/Terminal";
import { GithubBtn, LoggedInAs, VersionBtn } from "../pins";
import SnakeGame from "../../Games/SnakeGame";
import { useParams } from "react-router-dom";
import MazeGame from "../../Games/MazeGame";
const Style12 = ({ hours, minutes, props, dispatch }) => {
  const params = useParams();
  return (
    <div className="stack justify-between items-center h-screen py-10 px-5 gap-5">
      <div className="top">GAME</div>

      <div className="middle h-full w-full">
        {params?.game=="snake"&&
        <SnakeGame />}
        {params?.game=="maze"&&
        <MazeGame/>}
      </div>

      <div className="bottom w-full justify-between stack items-center gap-2">
        <Terminal {...props} hidden />

        <div className="flex justify-between items-center w-full h-full">
          <div className="left"></div>
          <div className="middle">
            <GithubBtn />
          </div>
          <div className="right">
            <VersionBtn />
          </div>
        </div>
        <div className="bottom d-center">
          <LoggedInAs />
        </div>
      </div>
    </div>
  );
};
export default Style12;
