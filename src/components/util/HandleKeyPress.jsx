import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HandleKeyPress = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // handle shortcuts
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate('/terminal');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return null;
};

export default HandleKeyPress;
