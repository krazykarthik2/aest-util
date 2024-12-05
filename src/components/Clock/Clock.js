import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const { style } = useSelector((state) => state.command);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getFormattedTime = () => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    
    if (style === 1) {
      return `${hours}:${minutes}`;
    } else {
      return (
        <div className="text-6xl font-bold text-red-400/80">
          {hours} {minutes}
        </div>
      );
    }
  };

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${
      style === 1 ? 'bg-terminal-gray rounded-lg p-2 shadow-lg' : ''
    }`}>
      {getFormattedTime()}
    </div>
  );
};

export default Clock;
