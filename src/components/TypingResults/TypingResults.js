import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TypingResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { style } = useSelector((state) => state.command);
  const stats = location.state?.stats || {
    wpm: 0,
    accuracy: 0,
    time: 0,
    rawWpm: 0
  };

  const renderStat = (value, label, size = 'large') => (
    <div className="text-center">
      <div className={`${size === 'large' ? 'text-6xl' : 'text-4xl'} font-bold ${
        style === 1 ? 'text-terminal-white' : 'text-red-400'
      }`}>
        {value}
      </div>
      <div className="text-gray-500 text-sm mt-1">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className={`w-full max-w-2xl ${
        style === 1 ? 'bg-terminal-gray rounded-lg p-8' : ''
      }`}>
        <div className="grid grid-cols-2 gap-8 mb-8">
          {renderStat(stats.wpm, 'wpm', 'large')}
          {renderStat(stats.accuracy + '%', 'acc', 'large')}
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          {renderStat(stats.rawWpm, 'raw-wpm', 'small')}
          {renderStat(stats.time + 's', 'time-taken', 'small')}
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => navigate('/typing')}
            className={`px-6 py-2 rounded ${
              style === 1
                ? 'bg-terminal-accent text-black'
                : 'bg-red-400/20 text-red-400'
            }`}
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/terminal')}
            className={`px-6 py-2 rounded ${
              style === 1
                ? 'bg-terminal-gray text-terminal-white'
                : 'bg-gray-800/50 text-gray-400'
            }`}
          >
            Back to Terminal
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypingResults;
