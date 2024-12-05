import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCommand, addToHistory, clearHistory } from '../../redux/commandSlice';
import { useNavigate } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

const Terminal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { command, style, history } = useSelector((state) => state.command);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (command) {
      setInputValue(command);
      dispatch(addToHistory(command));
    }
  }, [command, dispatch]);

  const handleCommand = (cmd) => {
    let [action, ...args] = cmd.split(' ');
    
    action = action.replaceAll(/[^a-zA-Z0-9.]+/g, '');
    switch(action.toLowerCase()) {
      case 'qr':
        navigate('/qr');
        break;
      case 'type':
        navigate('/typing');
        break;
      case 'login':
        navigate('/login');
        break;
      case 'signout':
      case 'logout':
        navigate('/logout');
        break;
      case 'register':
      case 'signup':
        navigate('/signup');
        break;
      case 'clear':
      case 'cls':
        dispatch(clearHistory());
        break;
      case 'auth.totp.enable':
        navigate('/enable-totp');
        break;
      default:
        // Handle other commands or show error
        dispatch(addToHistory(`Unknown command: ${cmd}`));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    dispatch(addToHistory(inputValue));
    handleCommand(inputValue);
    setInputValue('');
  };

  const renderPrompt = () => {
    if (style === 1) {
      return <span className="text-terminal-accent">$</span>;
    }
    return <span className="text-red-400">❯_</span>;
  };

  return (
    <div className={`min-h-screen ${style === 1 ? 'p-4' : 'p-8'}`} onClick={() => inputRef.current?.focus()}>
      <div className={style === 1 ? 'terminal-container' : ''}>
        <div className="mb-4">
          {history.map((entry, index) => (
            <div key={index} className="mb-2">
              {renderPrompt()}
              <span className="ml-2 text-terminal-white">{entry}</span>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="flex items-center">
          {renderPrompt()}
          <input
            autoFocus
            onBlur={e=>e.target.focus()}
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-terminal-white ml-2 font-mono"
            placeholder={style === 1 ? "Enter command..." : "Type a command..."}
          />
        </form>
      </div>

      {style === 2 && (
        <div className="fixed bottom-4 right-4 flex items-center space-x-4">
          <a href="https://github.com/krazykarthik2" target="_blank" rel="noopener noreferrer" className="text-red-400">
            <FaGithub size={24} />
          </a>
          <span className="text-red-400 text-sm">21.2.3</span>
        </div>
      )}
    </div>
  );
};

export default Terminal;
