import React from "react";
import Terminal from "../../Terminal/Terminal";
import { Battery, GithubBtn,LoggedInAs, ShareBtn, VersionBtn } from "../pins";


const Style5 =({hours,minutes,props,dispatch}) => (
    <div className="flex justify-between h-screen w-screen overflow-hidden py-10 px-10 gap-5">
      <div className="left"></div>
      <div className="middle d-center stack w-full">
        <div className="text-9xl font-bold text-white w-full d-center gap-10">
          <div className="hours">{hours}</div>
          <div className="circle w-5 h-5 rounded-full bg-gray-800"></div>
          <div className="minutes">{minutes}</div>
        </div>
        <div className="terminal w-full h-full">
          <Terminal {...props} />
        </div>
        <div className="d-center w-full">
          <LoggedInAs />
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
export default Style5