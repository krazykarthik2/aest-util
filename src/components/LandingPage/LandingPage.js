import React, { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Terminal from "../Terminal/Terminal";

// Lazy load style components
const Style1 = lazy(() => import("./Styles/Style1"));
const Style2 = lazy(() => import("./Styles/Style2"));
const Style3 = lazy(() => import("./Styles/Style3"));
const Style4 = lazy(() => import("./Styles/Style4"));
const Style5 = lazy(() => import("./Styles/Style5"));
const Style6 = lazy(() => import("./Styles/Style6"));
const Style7 = lazy(() => import("./Styles/Style7"));
const Style8 = lazy(() => import("./Styles/Style8"));
const Style9 = lazy(() => import("./Styles/Style9"));
const Style10 = lazy(() => import("./Styles/Style10"));
const Style11 = lazy(() => import("./Styles/Style11"));
const Style12 = lazy(() => import("./Styles/Style12"));
const Style13 = lazy(() => import("./Styles/Style13"));
const Style14 = lazy(() => import("./Styles/Style14"));
const Style15 = lazy(() => import("./Styles/Style15"));
const allStyles = [
  Style1,
  Style2,
  Style3,
  Style4,
  Style5,
  Style6,
  Style7,
  Style8,
  Style9,
  Style10,
  Style11,
  Style12,
  Style13,
  Style14,
  Style15,
];

const LandingPage = (props) => {
  const [time, setTime] = useState(new Date());
  const style = useSelector((state) => state.command.style);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getFormattedTime = () => {
    if (!Number.isInteger(style) || style <= 0) {
      return <div>Please select a valid style number</div>;
    }
    if (style > allStyles.length) {
      return (
        <div>
          Styles are limited
          <Terminal {...props} hidden={true} />
        </div>
      );
    }

    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");

    // Get the selected style component
    const StyleSelected = allStyles[style - 1];
    return (
      <Suspense fallback={<div>Loading...</div>}>
        {/* Render the lazy-loaded component */}
        <StyleSelected hours={hours} minutes={minutes} props={props} dispatch={dispatch} />
      </Suspense>
    );
  };

  return getFormattedTime();
};

export default LandingPage;
