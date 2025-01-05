import React, { useEffect, useState } from "react";
import Terminal from "../../Terminal/Terminal";
import { GithubBtn, LoggedinAs, VersionBtn } from "../pins";
import axios from "axios";

const Style12 = ({ hours, minutes, props, dispatch }) => {
  const [sessions, setSessions] = useState([]);
  const [err, setErr] = useState("");
  const update = () => {
    axios
      .get("http://localhost:4593/sessions")
      .then((res) => {
        setSessions(res.data);
      })
      .catch((err) => {
        setErr(err);
      });
  };
  useEffect(() => {
    update();
  }, []);

  return (
    <div className="stack justify-between items-center h-screen py-10 px-5 gap-5">
      <div className="top">
        <h1>Status: </h1>
        <button onClick={update}>Refresh</button>
      </div>

      <div className="middle">
        {sessions.map((e,i) => (
          <div className="flex justify-between items-center w-full">
            <div className="s">{i+1}</div><div className="left">{e}</div>
          </div>
        ))}
      </div>

      <div className="bottom w-full justify-between stack items-center gap-2">
        <Terminal {...props} hidden />

        <div className="flex justify-between items-center w-full h-full">
          <div className="left"></div>
          <div className="middle">
            <GithubBtn />
          </div>
          <div className="right">
            <VersionBtn />
          </div>
        </div>
        <div className="bottom d-center">
          <LoggedinAs />
        </div>
      </div>
    </div>
  );
};
export default Style12;
