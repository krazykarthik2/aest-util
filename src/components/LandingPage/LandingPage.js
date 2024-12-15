import React, { useState, useEffect } from "react";
import {
  FaCodeBranch,
  FaCopy,
  FaDownload,
  FaGithub,
  FaShareNodes,
  FaTerminal,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Terminal from "../Terminal/Terminal";
import HandleURLSearchParams from "../util/HandleURLSearchParams";
import { setStyle } from "../../redux/commandSlice";
import QRCode from "react-qr-code";

const Style1 = (hours, minutes, props, dispatch) => (
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
        <div className="text-9xl scale-[1.5] font-bold text-white w-full d-center stack h-full text-3xl">
          <div className="hours">{hours}</div>
          <div className="minutes">{minutes}</div>
        </div>
      </div>
      <div className="bottom stack d-center gap-10 w-full">
        <div className="terminal d-center w-full">
          <Terminal {...props} />
        </div>
        <div className="github">
          <GithubBtn />
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

const Battery = () => (
  <div className="battery">
    <div className="charge"></div>
  </div>
);
const ShareBtn = () => (
  <button className="share">
    <FaShareNodes size={37} />
  </button>
);
export const GithubBtn = () => (
  <a
    href="https://github.com/krazykarthik2"
    target="_blank"
    rel="noopener noreferrer"
    className="d-center gap-2"
  >
    <FaGithub size={37} />
    <span className="d-center vertical text-xl font-bold">/krazykarthik2</span>
  </a>
);
const VersionBtn = () => (
  <div className="versionbtn relative d-center">
    <div className="d-center absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
      <FaCodeBranch size={25} />
    </div>
    <span className="text-2xl font-bold">21.2.3</span>
  </div>
);

const handleStyleChange = (style, props, dispatch) => {
  dispatch(props.setStyle(style));
};
const Style2 = (hours, minutes, props, dispatch) => (
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
const Style3 = (hours, minutes, props, dispatch) => (
  <div className="flex justify-between items-stretch h-screen">
    <div className="left stack justify-between h-full px-16 py-10">
      <div className="top"></div>
      <div className="middle">
        <div className="text-9xl scale-[1.2] font-bold text-white w-full d-center stack h-full text-3xl">
          <div className="hours">{hours}</div>
          <div className="minutes">{minutes}</div>
          <Terminal {...props} hidden={true} />
        </div>
      </div>
      <div className="bottom d-center stack justify-between">
        <GithubBtn />
        <ShareBtn />
      </div>
    </div>
    <div className="middle d-center py-28">
      <div className="h-full w-2 rounded-full bg-gray-800"></div>
    </div>
    <div className="right flex d-center w-full px-10">
      <Terminal {...props} />
    </div>
  </div>
);
const Battery4 = () => (
  <div className="battery">
    <div className="charge"></div>
  </div>
);

const Style4 = (hours, minutes, props, dispatch) => (
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
      <div className="middle d-center">
        <GithubBtn />
      </div>
      <div className="right d-center">
        <VersionBtn />
      </div>
    </div>
  </div>
);

const Style5 = (hours, minutes, props, dispatch) => (
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
const ShowQr = (props) => {
  const qrData = props.command.replaceAll("qr", "");
  return (
    <div className="d-center w-full h-full">
      {qrData && qrData.replaceAll(" ", "") && (
        <QRCode value={qrData} />
      )}
      <div className="qrBtn stack gap-10 px-5">
        <FaShareNodes size={37} />
        <FaDownload size={37} />
        <FaCopy size={37} />
      </div>
    </div>
  );
};
const Style6 = (hours, minutes, props, dispatch) => (
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

const Style7 = (hours, minutes, props, dispatch) => (
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

const Style8 = (hours, minutes, props, dispatch) => (
  <div className="flex justify-between h-screen w-screen overflow-hidden py-10 px-10 gap-5">
    <div className="text-9xl font-bold text-white w-full d-center gap-10">
      <div className="hours">{hours}</div>
      <div className="circle w-5 h-5 rounded-full bg-gray-800"></div>
      <div className="minutes">{minutes}</div>
    </div>
    <Terminal {...props} hidden={true} />
  </div>
);
const Style9 = Style8;
const allStyles = [
  Style1,
  Style2,
  Style3,
  Style4,
  Style5,
  Style6,
  Style7,
  Style8,
  Style9,
];

const Clock = (props) => {
  const [time, setTime] = useState(new Date());
  const style = useSelector((state) => state.command.style);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const dispatch = useDispatch();

  const getFormattedTime = () => {
    if (!Number.isInteger(style)) return <>{style}Styles has to be a number</>;
    if (style > allStyles.length) return <>Styles are limited<Terminal {...props} hidden={true} /></>;

    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");

    const StyleSelected = allStyles[style - 1];
    return StyleSelected(hours, minutes, props, dispatch);
  };

  return getFormattedTime();
};

export default Clock;
