import React from "react";
import Terminal from "../../Terminal/Terminal";

const Style8 =({hours,minutes,props,dispatch}) => (
  <div className="flex justify-between h-screen w-screen overflow-hidden py-10 px-10 gap-5">
    <div className="text-9xl font-bold text-white w-full d-center gap-10">
      <div className="hours">{hours}</div>
      <div className="circle w-5 h-5 rounded-full bg-gray-800"></div>
      <div className="minutes">{minutes}</div>
    </div>
    <Terminal {...props} hidden={true} />
  </div>
);
export default Style8