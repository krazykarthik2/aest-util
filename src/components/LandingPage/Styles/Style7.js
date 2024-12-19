import { handleStyleChange } from "../util";
import React from "react";
import {
  FaTerminal
} from "react-icons/fa6";
import Terminal from "../../Terminal/Terminal";
import { Battery, GithubBtn, ShareBtn, VersionBtn } from "../pins";
 

const Style7 =({hours,minutes,props,dispatch}) => (
    <div className="flex justify-between h-screen w-screen overflow-hidden py-10 px-10 gap-5">
      <div className="left stack justify-between">
        <div className="top"></div>
        <div className="bottom">
          <button onClick={() => handleStyleChange(1, props, dispatch)}>
            <FaTerminal size={40} />
            <Terminal {...props} hidden={true} />
          </button>
        </div>
      </div>
      <div className="middle d-center stack w-full">
        <div className="text-9xl font-bold text-white w-full d-center gap-10">
          <div className="hours">{hours}</div>
          <div className="circle w-5 h-5 rounded-full bg-gray-800"></div>
          <div className="minutes">{minutes}</div>
        </div>
      </div>
      <div className="right stack items-end justify-between">
        <div className="left">
          <Battery />
        </div>
        <div className="middle">
          <ShareBtn />
        </div>
        <div className="right stack items-end">
          <VersionBtn />
          <GithubBtn />
        </div>
      </div>
    </div>
  );

export default Style7