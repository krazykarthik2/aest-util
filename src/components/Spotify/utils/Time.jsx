import React from "react";
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
function Time({ value = 0.5 ,current= 123 , total= 456}) {
  return (
    <div className="d-center stack ">
      <div className="top w-full d-center !justify-between">
          <div>{formatTime(current)}</div>
          <div>{formatTime(total)}</div>
      </div>
      <div className="bottom w-[350px]">
        <div className="w-full rounded-full h-2 bg-[#282828] d-center !justify-start">
          <div
            className="line-progress h-full rounded-full bg-[#545454] "
            style={{ width: 100 * value + "%" }}
          ></div>
          <div className="w-14 h-14 rounded-full bg-[#000] d-center -translate-x-1/2  ">
            <div className="w-10 h-10 rounded-full bg-[#282828] d-center">
              <div className="w-5 h-5 rounded-full bg-[#000] d-center">
                <div className="w-2 h-2 rounded-full bg-[#282828]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Time;
