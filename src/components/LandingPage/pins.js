import React from "react";
import { FaCodeBranch, FaGithub, FaShareNodes } from "react-icons/fa6";
import { useSelector } from "react-redux";

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
export const LoggedinAs = () => {
  const user = useSelector((state) => state.auth.user);
  return user ? (
    <div className="d-center gap-2 text-sm w-full">
      <span> logged in as </span>
      <span className="">{user?.name}</span>
    </div>
  ) : (
    <div className="d-center gap-2">
      <span> logged out </span>
    </div>
  );
};
export const Battery = () => (
  <div className="battery">
    <div className="charge"></div>
  </div>
);
export const ShareBtn = () => (
  <button className="share">
    <FaShareNodes size={37} />
  </button>
);
export const VersionBtn = () => (
  <div className="versionbtn relative d-center">
    <div className="d-center absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
      <FaCodeBranch size={25} />
    </div>
    <span className="text-2xl font-bold">2.1.4</span>
  </div>
);

export const Battery4 = () => (
  <div className="battery">
    <div className="charge"></div>
  </div>
);
