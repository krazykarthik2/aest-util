import React from "react";
import Icon, { IconShort } from "../../Terminal/Icon";
import Terminal from "../../Terminal/Terminal";
import Floating from "../../util/Floating/Floating";
import { GithubBtn, LoggedInAs, ShareBtn, VersionBtn } from "../pins";
import "./Style1.css";
import { useSelector } from "react-redux";
import Spotify from "../../Spotify";
const Recommend = ({ value, cmd, show }) => {
  const children = !show
    ? []
    : [
        ...value.map((v, i) => ({
          el: (
            <div className="prompt">
              <div className="text-white">{cmd}</div>
              <div
                className="text-gray-400"
                style={{ opacity: 0.7 + 0.3 * (cmd.length / v.length) }}
              >
                {v.substring(cmd.length)}
              </div>
            </div>
          ),
          key: v.replaceAll(".", ""),
          render: 1 + cmd.length,
        })),
      ];
  const FirstIc =
    cmd?.trim()?.[0] in IconShort ? IconShort[cmd?.trim()?.[0]] : null;
  const Ic = cmd in Icon ? Icon[cmd] : null;
  return (
    <div className="relative w-full h-full d-center stack">
      <div className="absolute text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl scale-[1.5] d-center *:mix-blend-multiply *:has-[path]:bg-black">
        <div className="bg-gradient-to-tr from-[#2c2c2c] via-[#2c2c2c] to-[#c4c4c4] h-full w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "></div>
        {FirstIc || Ic}
      </div>
      {show && <Floating children={children} />}
    </div>
  );
};
const Style1 = ({ hours, minutes, props, dispatch }) => 
  {
    const history = useSelector((state) => state.command.history);
    return (
  
  <div className="flex justify-between items-stretch h-screen w-screen overflow-hidden">
    <div className="left justify-between h-full stack items-center px-5 py-5">
      <div className="top"></div>
      <div className="middle"></div>
      <div className="bottom">
        <ShareBtn />
      </div>
    </div>
    <div className="middle justify-between  stack items-center py-5 overflow-hidden w-full">
      <div className="top"></div>
      <div className="middle d-center w-full">
        {props?.recommend.length ||
        props?.command?.trim()[0] in IconShort ||
        (props?.command?.split(" ").filter((e) => e).length > 1 &&
          props?.command?.trim()?.split(" ")?.[0] in Icon) ? (
          <Recommend
            value={props?.recommend}
            cmd={props?.command?.trim()?.split(" ")?.[0]}
            show={props?.command?.split(" ")?.filter((e) => e)?.length == 1}
          />
        ) : (
          <div className="w-full h-full d-center">
            <div className="left w-full "></div>
          <div className=" w-full text-9xl scale-[1.5] font-bold text-white h-full d-center stack text-3xl">
            <div className="hours">{hours}</div>
            <div className="minutes">{minutes}</div>
          </div>
            <div className="right w-full ">
              <Spotify style={1} />
            </div>
          </div>
        )}  
      </div>
      {history?.length > 2 && <div className="for-pushing-up h-24"></div>}
      <div className="bottom stack d-center w-full relative pt-2 mt-24">
        
        <div className="terminal d-center w-full absolute top-0 stack !justify-end h-0">
          <Terminal {...props} />
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
      )}


export default Style1;
