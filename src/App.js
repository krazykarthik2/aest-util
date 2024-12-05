import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCommand, setStyle } from './redux/commandSlice';

// Components
import Terminal from './components/Terminal/Terminal';
import Clock from './components/Clock/Clock';
import TypingPage from './components/TypingPage/TypingPage';
import TypingResults from './components/TypingResults/TypingResults';
import QRPage from './components/QRPage/QRPage';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import Signup from './components/Auth/Signup';
import EnableTotp from './components/Auth/EnableTotp';
import PrivateRoute from './components/Auth/PrivateRoute';

// Utils
import HandleKeyPress from './components/util/HandleKeyPress';
import { ToastContainer } from 'react-toastify';
function App() {
  const dispatch = useDispatch();
  const { style } = useSelector((state) => state.command);

 
  useEffect(() => {
    // Handle /init route parameters
    const params = new URLSearchParams(window.location.search);
    const cmd = params.get('cmd');
    const styleParam = params.get('style');

    if (cmd) dispatch(setCommand(decodeURIComponent(cmd)));
    if (styleParam) dispatch(setStyle(parseInt(styleParam)));
  }, [dispatch]);

  return (
    <Router>
      <div className={`min-h-screen bg-terminal-black text-terminal-white font-mono ${
        style === 2 ? 'bg-opacity-95' : ''
      }`}>
        <Clock />
        
        <div className="container mx-auto">
          <HandleKeyPress />
          <Routes>
            <Route path="/" element={<Navigate to="/terminal" />} />
            <Route path="/init" element={<Navigate to="/terminal" />} />
            <Route path="/terminal" element={<Terminal />} />
            <Route path="/typing" element={<TypingPage />} />
            <Route path="/results" element={<TypingResults />} />
            <Route path="/qr" element={<QRPage />} />
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
