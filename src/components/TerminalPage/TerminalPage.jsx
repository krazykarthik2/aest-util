import React, { useEffect } from "react";
import { GithubBtn } from "../LandingPage/pins";
import Terminal from "../Terminal/Terminal";
import { useSelector, useDispatch } from "react-redux";

function TerminalPage(props) {
  const style = useSelector((state) => state.command.style);
  const dispatch = useDispatch();
  useEffect(() => {
    if (![10, 11].includes(style) || style === null)
      dispatch(props.setStyle(10));
  }, [style]);
  return (
    <div className="stack w-full h-screen px-10 py-10 justify-between">
      <div className="top"></div>
      <div className="middle w-full h-full d-center relative">
        <div className="stack w-full h-full d-center gap-3 absolute">
          {props.recommend && props?.recommend?.map((e, i) => 
            <div className={"item bg-gray-950 py-2 px-5 rounded-lg " + (i == 0 ? "underline" : "")}>{e}</div>
          )}
        </div>
      </div>
      <div className="bottom stack gap-10">
        <Terminal {...props} />
        <GithubBtn />
      </div>
    </div>
  );
}

export default TerminalPage;
