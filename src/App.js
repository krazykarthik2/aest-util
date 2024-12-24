import React, { useState } from "react";
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
import QrImgUtil from "./components/QrImgUtil/QrImgUtil";
import QrImgResult from "./components/QrImgUtil/QrImgResult";
import ShowState from "./components/ShowState/ShowState";
import Terminal from "./components/Terminal/Terminal";
import TypingPage from "./components/TypingPage/TypingPage";
import TypingResults from "./components/TypingResults/TypingResults";
// Utils
import { ToastContainer } from "react-toastify";
import HandleKeyPress from "./components/util/HandleKeyPress";
import TerminalPage from "./components/TerminalPage/TerminalPage";
import Help from "./components/Help/Help";
function App() {
  const dispatch = useDispatch();
  const { style } = useSelector((state) => state.command);
  const [command, setCommand] = useState("");
  const [focus, setFocus] = useState(false);
  const terminalProps = {
    command: command,
    setCommand: setCommand,
    setStyle: setStyle,
    setFocus: setFocus,
    focus: focus,
  };
  return (
    <Router>
      <HandleKeyPress focus={focus} />
      <Routes>
        <Route path="/" element={<Navigate to="/clock?style=1" />} />
        <Route path="/init" element={<Navigate to="/terminal" />} />
        <Route path="/clock" element={<LandingPage {...terminalProps} />} />
        <Route path="/keyboard" element={<LandingPage {...terminalProps} />} />
        <Route path="/terminal" element={<TerminalPage {...terminalProps} />} />
        <Route path="">
          <Route path="1" element={<Navigate to={"/clock?style=1"} />} />
          <Route path="2" element={<Navigate to={"/clock?style=2"} />} />
          <Route path="3" element={<Navigate to={"/clock?style=3"} />} />
          <Route path="4" element={<Navigate to={"/clock?style=4"} />} />
          <Route path="5" element={<Navigate to={"/clock?style=5"} />} />
          <Route path="6" element={<Navigate to={"/clock?style=6"} />} />
          <Route path="7" element={<Navigate to={"/clock?style=7"} />} />
          <Route path="8" element={<Navigate to={"/clock?style=8"} />} />
          <Route path="9" element={<Navigate to={"/clock?style=9"} />} />
        </Route>
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
        <Route path="*" element={<Navigate to="/terminal" />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
