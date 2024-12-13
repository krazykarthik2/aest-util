import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { setStyle } from './redux/commandSlice';

// Components
import EnableTotp from './components/Auth/EnableTotp';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import PrivateRoute from './components/Auth/PrivateRoute';
import Signup from './components/Auth/Signup';
import Clock from './components/Clock/Clock';
import QRPage from './components/QRPage/QRPage';
import ShowState from './components/ShowState/ShowState';
import Terminal from './components/Terminal/Terminal';
import TypingPage from './components/TypingPage/TypingPage';
import TypingResults from './components/TypingResults/TypingResults';
// Utils
import { ToastContainer } from 'react-toastify';
import HandleKeyPress from './components/util/HandleKeyPress';

function App() {
  const dispatch = useDispatch();
  const { style } = useSelector((state) => state.command);
  const [command,setCommand] = useState("")
  return (
    <Router>
      <div className={`min-h-screen bg-terminal-black text-terminal-white font-mono`}>
        <Clock />
        <div className="container mx-auto">
          <HandleKeyPress />
          <Routes>
            <Route path="/" element={<Navigate to="/terminal" />} />
            <Route path="/init" element={<Navigate to="/terminal" />} />
            <Route path="/clock" element={<Clock/>}/>
            <Route path="/terminal" element={<Terminal command={command} setCommand={setCommand} setStyle={setStyle}/>} />
            <Route path="/typing" element={<TypingPage />} />
            <Route path="/results" element={<TypingResults />} />
            <Route path="/qr" element={<QRPage />} />
            <Route path="/state" element={<ShowState />}/>
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
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
