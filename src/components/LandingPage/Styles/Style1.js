import React from "react";
import Terminal from "../../Terminal/Terminal";
import { GithubBtn, LoggedinAs, ShareBtn, VersionBtn } from "../pins";
import Floating from "../../util/Floating/Floating";
const Recommend = ({ value, cmd }) => {
  return (
    <div className="relative w-full h-full d-center stack">
      <Floating
        children={value.map((v, i) => ({
          el: (
            <div className="text-3xl w-full d-center h-full ">
              <div className="text-white">{cmd}</div>
              <div className="text-gray-400">{v.substring(cmd.length)}</div>
            </div>
          ),
          key: v,
          render:cmd.length
        }))}
      />
    </div>
  );
};
const Style1 = ({ hours, minutes, props, dispatch }) => (
  <div className="flex justify-between items-stretch h-screen w-screen overflow-hidden">
    <div className="left justify-between h-full stack items-center px-5 py-10">
      <div className="top"></div>
      <div className="middle"></div>
      <div className="bottom">
        <ShareBtn />
      </div>
    </div>
    <div className="middle justify-between w-full h-full stack items-center py-10">
      <div className="top"></div>
      <div className="middle d-center w-full">
        {props.recommend.length ? (
          <Recommend value={props.recommend} cmd={props.command} />
        ) : (
          <div className="text-9xl scale-[1.5] font-bold text-white w-full d-center stack h-full text-3xl">
            <div className="hours">{hours}</div>
            <div className="minutes">{minutes}</div>
          </div>
        )}
      </div>
      <div className="bottom stack d-center gap-10 w-full">
        <div className="terminal d-center w-full">
          <Terminal {...props} />
        </div>
        <div className="github">
          <GithubBtn />
          <LoggedinAs />
        </div>
      </div>
    </div>
    <div className="right justify-between h-full stack items-center px-5 py-10">
      <div className="top"></div>
      <div className="middle"></div>
      <div className="bottom">
        <VersionBtn />
      </div>
    </div>
  </div>
);

export default Style1;
