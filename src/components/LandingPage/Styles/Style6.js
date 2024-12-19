import React from "react";
import {
  FaCopy,
  FaDownload,
  FaShareNodes
} from "react-icons/fa6";
import QRCode from "react-qr-code";
import Terminal from "../../Terminal/Terminal";
import { Battery, GithubBtn, ShareBtn, VersionBtn } from "../pins";

const ShowQr = (props) => {
    const qrData = props.command.replaceAll("qr", "");
    return (
      <div className="d-center w-full h-full">
        {qrData && qrData.replaceAll(" ", "") && <QRCode value={qrData} />}
        <div className="qrBtn stack gap-10 px-5">
          <FaShareNodes size={37} />
          <FaDownload size={37} />
          <FaCopy size={37} />
        </div>
      </div>
    );
  };
  const Style6 =({hours,minutes,props,dispatch}) => (
    <div className="flex justify-between h-screen w-screen overflow-hidden py-10 px-10 gap-5">
      <div className="left"></div>
      <div className="middle d-center stack w-full">
        <div className="text-9xl font-bold text-white w-full d-center gap-10">
          <div className="hours">{hours}</div>
          <div className="circle w-5 h-5 rounded-full bg-gray-800"></div>
          <div className="minutes">{minutes}</div>
          <Terminal {...props} hidden={true} />
        </div>
        <ShowQr {...props} />
        <div className="terminal w-full">
          <Terminal {...props} />
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
  
  export default Style6;