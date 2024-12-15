import React, { useEffect } from "react";
import { GithubBtn } from "../LandingPage/LandingPage";
import Terminal from "../Terminal/Terminal";
import { useSelector, useDispatch } from "react-redux";

function TerminalPage({ command, setCommand, setStyle }) {
  const style = useSelector((state) => state.command.style);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!([10,11].includes(style)) || style === null) dispatch(setStyle(10))
  }, [style]);
  return (
    <div className="stack w-full h-screen px-10 py-10 justify-between">
      <div className="top"></div>
      <div className="middle"></div>
      <div className="bottom stack gap-10">
        <Terminal command={command} setCommand={setCommand} setStyle={setStyle} />
        <GithubBtn />
      </div>
    </div>
  );
}

export default TerminalPage;
