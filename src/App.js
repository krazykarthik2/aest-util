import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { setStyle } from "./redux/commandSlice";

// Components
import EnableTotp from "./components/Auth/EnableTotp";
import Login from "./components/Auth/Login";
import Logout from "./components/Auth/Logout";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Signup from "./components/Auth/Signup";
import LandingPage from "./components/LandingPage/LandingPage";
import QrImgResult from "./components/QrImgUtil/QrImgResult";
import QrImgUtil from "./components/QrImgUtil/QrImgUtil";
import ShowState from "./components/ShowState/ShowState";
import TypingPage from "./components/TypingPage/TypingPage";
import TypingResults from "./components/TypingResults/TypingResults";
// Utils
import { ToastContainer } from "react-toastify";
import Help from "./components/Help/Help";
import { AllCommands } from "./components/Terminal/logic";
import TerminalPage from "./components/TerminalPage/TerminalPage";
import HandleKeyPress from "./components/util/HandleKeyPress";
const emptyFunc = () => {};
function App() {
  const dispatch = useDispatch();
  const { style } = useSelector((state) => state.command);
  const [command, setCommand] = useState("");
  const [focus, setFocus] = useState(false);
  const [timer, setTimer] = useState(0);
  const [recommend, setRecommend] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const terminalProps = {
    command: command,
    setCommand: setCommand,
    setStyle: setStyle,
    setFocus: setFocus,
    focus: focus,
    timer: timer,
    setTimer: setTimer,
    recommend: recommend,
    setRecommend: setRecommend,
    setIsHidden: setIsHidden,
  };
  useEffect(() => {
    const _recom = command?.trim()
      ? AllCommands.filter((c) => c?.startsWith(command?.trim()))
      : [];
    setRecommend(_recom);
  }, [command]);

  /**
   * Handles tab key press
   * @param {Object} props
   * @param {boolean} props.shiftKey - If shift key is pressed
   * @param {function} props.navigate - Navigate function to navigate to a new route
   * @returns {boolean} - Whether the tab should be validated to perform or not
   */
  const onTab = ({ shiftKey, navigate }) => {
    if (isHidden) return true;
    if (!recommend.length) return false;
    if (shiftKey) {
      navigate("?do=" + recommend[0]);
    } else setCommand(recommend[0]);
    return false;
  };

  return (
    <Router>
      <HandleKeyPress focus={focus} onTab={onTab} />
      <Routes>
        <Route path="/" element={<Navigate to="/clock?style=1" />} />
        <Route path="/init" element={<Navigate to="/terminal" />} />
        <Route path="/clock" element={<LandingPage {...terminalProps} />} />
        <Route path="/keyboard" element={<LandingPage {...terminalProps} />} />
        <Route path="/session" element={<LandingPage {...terminalProps} />} />
        <Route path="/sessions" element={<LandingPage {...terminalProps} />} />
        <Route path="/auto" element={<LandingPage {...terminalProps} />} />
        <Route
          path="/games/:game"
          element={<LandingPage {...terminalProps} />}
        />
        <Route path="/timer" element={<LandingPage {...terminalProps} />} />
        <Route path="/terminal" element={<TerminalPage {...terminalProps} />} />
        <Route path="/help" element={<Help />} />
        <Route path="/typing" element={<TypingPage />} />
        <Route path="/results" element={<TypingResults />} />
        <Route path="/qr" element={<Navigate to="/clock" />} />
        <Route path="/qrimgutil" element={<QrImgUtil />} />
        <Route path="/qrimgresult">
          <Route path=":result" element={<QrImgResult />} />
        </Route>
        <Route path="/state" element={<ShowState />} />
        {/* /auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/enable-totp"
          element={
            <PrivateRoute>
              <EnableTotp />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/clock?style=1" />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
