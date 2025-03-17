import axios from "axios";
import React, { useEffect, useState } from "react";
import Terminal from "../../Terminal/Terminal";
import { GithubBtn, LoggedInAs, VersionBtn } from "../pins";
import { getTimeDiffStr } from "../../TypingPage/util.js";

const Style12 = ({ hours, minutes, props, dispatch }) => {
  const [sessions, setSessions] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const update = () => {
    setLoading(true);
    axios
      .get("http://localhost:4593/sessions")
      .then((res) => {
        setSessions(res.data);
        setLoading(false); // remove loading
        setLastUpdated(new Date());
      })
      .catch((err) => {
        setErr(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    update();
  }, []);

  return (
    <div className="stack justify-between items-center h-screen py-10 px-5 gap-5">
      <div className="top">
        <h1>
          Status:

          {lastUpdated == -1
            && "offline"}
            {lastUpdated != -1 && `last updated ${getTimeDiffStr(
                lastUpdated,
                new Date()
              )} ago`}{" "}
        </h1>
        {loading ? (
          <button disabled>Loading...</button>
        ) : (
          <button onClick={update}>Refresh</button>
        )}


        {err && <div>{JSON.stringify(err)}</div>}
      </div>

      <div className="middle">
        {sessions.map((e, i) => (
          <div className="flex justify-between items-center w-full">
            <div className="s">{i + 1}</div>
            <div className="left">{e}</div>
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
          <LoggedInAs />
        </div>
      </div>
    </div>
  );
};
export default Style12;
