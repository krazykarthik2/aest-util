import React, { useEffect } from "react";
import { GithubBtn } from "../LandingPage/pins";
import Terminal from "../Terminal/Terminal";
import { useSelector, useDispatch } from "react-redux";

function TerminalPage(props) {
  const style = useSelector((state) => state.command.style);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!([10,11].includes(style)) || style === null) dispatch(props.setStyle(10))
  }, [style]);
  return (
    <div className="stack w-full h-screen px-10 py-10 justify-between">
      <div className="top"></div>
      <div className="middle"></div>
      <div className="bottom stack gap-10">
        <Terminal {...props} />
        <GithubBtn />
      </div>
    </div>
  );
}

export default TerminalPage;
