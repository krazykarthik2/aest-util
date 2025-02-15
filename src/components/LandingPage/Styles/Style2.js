import React from "react";
import { FaTerminal } from "react-icons/fa6";
import Terminal from "../../Terminal/Terminal";
import { GithubBtn, LoggedInAs, ShareBtn, VersionBtn } from "../pins";
import { handleStyleChange } from "../util";
const Style2 = ({hours,minutes,props,dispatch}) => (
  <div className="flex justify-between items-stretch h-screen">
    <div className="left justify-between h-full stack items-center px-5 py-10">
      <div className="top"></div>
      <div className="middle"></div>
      <div className="bottom">
        <ShareBtn />
      </div>
    </div>
    <div className="middle justify-between w-full h-full stack items-center py-10">
      <div className="top"></div>
      <div className="middle">
        <div className="text-9xl scale-[1.9] font-bold text-white w-full d-center stack h-full text-3xl">
          <div className="hours">{hours}</div>
          <div className="minutes">{minutes}</div>
        </div>
      </div>
      <div className="bottom stack d-center gap-10 w-full">
        <div className="terminal d-center w-full">
          <button onClick={() => handleStyleChange(1, props, dispatch)}>
            <FaTerminal size={40} />
            <Terminal {...props} hidden={true} />
          </button>
        </div>
        <div className="github">
          <GithubBtn />
          <LoggedInAs />
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

export default Style2;
