import React from "react";
import { FaTerminal } from "react-icons/fa6";
import Terminal from "../../Terminal/Terminal";
import { Battery4, GithubBtn, LoggedinAs, ShareBtn, VersionBtn } from "../pins";
import { handleStyleChange } from "../util";

const Style4 =({hours,minutes,props,dispatch}) => (
  <div className="flex justify-between stack items-stretch h-screen w-screen overflow-hidden py-10">
    <div className="top flex justify-between px-10">
      <div className="left d-center"></div>
      <div className="middle d-center"></div>
      <div className="right d-center">
        <Battery4 />
      </div>
    </div>
    <div className="middle d-center">
      <div className="text-9xl scale-[3.2] font-bold text-white w-full d-center h-full text-3xl">
        <div className="hours">{hours}</div>
        <button
          className="terminal scale-[.3125]"
          onClick={() => handleStyleChange(1, props, dispatch)}
        >
          <FaTerminal size={40} />
          <Terminal {...props} hidden={true} />
        </button>
        <div className="minutes">{minutes}</div>
      </div>
    </div>
    <div className="bottom flex justify-between px-10">
      <div className="left d-center">
        <ShareBtn />
      </div>
      <div className="middle d-center stack gap-5">
        <GithubBtn />
        <LoggedinAs />
      </div>
      <div className="right d-center">
        <VersionBtn />
      </div>
    </div>
  </div>
);
export default Style4;
