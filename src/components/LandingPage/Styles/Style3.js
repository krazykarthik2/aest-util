import React from "react";
import Terminal from "../../Terminal/Terminal";
import { GithubBtn, LoggedinAs, ShareBtn, VersionBtn } from "../pins";

const Style3 =({hours,minutes,props,dispatch}) => (
    <div className="flex justify-between items-stretch h-screen">
      <div className="left stack justify-between h-full px-16 py-10">
        <div className="top"></div>
        <div className="middle">
          <div className="text-9xl scale-[1.3] font-bold text-white w-full d-center stack h-full text-3xl">
            <div className="hours">{hours}</div>
            <div className="minutes">{minutes}</div>
            <Terminal {...props} hidden={true} />
          </div>
        </div>
        <div className="bottom d-center stack justify-between gap-10 text-gray-500">
          <GithubBtn />
          <div className="justify-between w-full flex flex-col items-center gap-10">
            <VersionBtn />
            <ShareBtn />
          </div>
        </div>
      </div>
      <div className="middle d-center py-24">
        <div className="h-full w-2 rounded-full bg-gray-800"></div>
      </div>
      <div className="right stack d-center w-full px-10 py-7">
        <div className="d-center h-full w-full">
          <Terminal {...props} />
        </div>
        <LoggedinAs />
      </div>
    </div>
  );
  
export default Style3