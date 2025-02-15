import { lazy, Suspense, useEffect, useState } from "react";

const Style1 = lazy(() => import("./Styles/Style1"));
const SpotifyStyles = [Style1];

const Spotify = ({ style }) => {
  const RequestedStyle = SpotifyStyles[style - 1];
  const [active, setActive] = useState(true);
  useEffect(() => {
    const keydownCheck = (e) => {
      if (e.altKey && (e.key === "s" || e.key == "S")) setActive((e) => !e);
    };
    document.addEventListener("keydown", keydownCheck);
    return () => document.removeEventListener("keydown", keydownCheck);
  }, []);
  return (
    active && (
      <Suspense fallback={<div>Loading...</div>}>
        <RequestedStyle />
      </Suspense>
    )
  );
};
export default Spotify;
