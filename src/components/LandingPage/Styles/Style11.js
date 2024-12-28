import React, { useEffect, useState } from "react";
import Terminal from "../../Terminal/Terminal";
import { GithubBtn, LoggedinAs, VersionBtn } from "../pins";
import "./Style11.css";
const Balls = ({ value, total }) => {
  const balls = [];
  for (let i = 0; i < total; i++) {
    balls.push(
      <div
        key={i}
        className={`ball rounded-full w-3 h-3 ${
          i <= value * total
            ? "active bg-white "
            : "bg-black border border-white border-solid"
        }`}
      ></div>
    );
  }
  return balls;
};

const Style11 = ({ hours, minutes, props, dispatch }) => {
  const toTime = props.timer.to;
  const fromTime = props.timer.from;
  const [hoursLeft, setHoursLeft] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  window._ = {
    hoursLeft,
    minutesLeft,
    secondsLeft,
    timeLeft,
    toTime,
    fromTime,
    setHoursLeft,
    setMinutesLeft,
    setSecondsLeft,
    setTimeLeft,
  };

  useEffect(() => {
    const _h = (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
    const _m = (timeLeft % (1000 * 60 * 60)) / (1000 * 60);
    const _s = (timeLeft % (1000 * 60)) / 1000;
    const hours = _h < 0 ? Math.ceil(_h) : Math.floor(_h);
    const minutes = _m < 0 ? Math.ceil(_m) : Math.floor(_m);
    const seconds = _s < 0 ? Math.ceil(_s) : Math.floor(_s);
    setHoursLeft(hours);
    setMinutesLeft(minutes);
    setSecondsLeft(seconds);
  }, [timeLeft]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const distance = toTime - now;
      setTimeLeft(distance);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [toTime]);
  return (
    <div className="flex stack justify-between items-stretch h-screen py-10 px-5 gap-5">
      <div className="top flex flex-col justify-between stack items-center">
        <div className="top"></div>
        <div className="middle"></div>
        <div className="bottom"></div>
      </div>
      <div className="middle justify-between w-full h-full stack items-center">
        <div className="top text-4xl font-bold">
          {timeLeft > 0 ? (
            <div>Timer ends in</div>
          ) : (
            <div className="text-red-500">Timer ended.</div>
          )}
        </div>
        <div className="middle d-center stack">
          <div
            className={
              "text-9xl scale-[1.5] font-bold items-end stack h-full text-3xl " +
              (timeLeft > 0 ? "text-white" : "text-red-500")
            }
          >
            {hoursLeft ? <div className="hours">{hoursLeft}h</div> : ""}
            {minutesLeft ? <div className="minutes">{minutesLeft}m</div> : ""}
            {secondsLeft ? (
              <div className="seconds">
                {secondsLeft}
                {(hoursLeft == 0 && minutesLeft == 0 )? "" : "s"}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="bottom">
          
          <Terminal {...props} hidden />
        </div>
      </div>
      <div className="bottom w-full justify-between stack items-center gap-2">
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
        <div className="astable">
          {timeLeft > 0 && (
            <div className="parts-100 d-center gap-2 blur-sm">
              <Balls value={1 - timeLeft / (toTime - fromTime)} total={20} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Style11;
