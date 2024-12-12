import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, selectAuth, clearError } from '../../redux/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector(selectAuth);
  const [totpMode, setTotpMode] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    totp: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      // Use requestAnimationFrame for smooth navigation
      requestAnimationFrame(() => {
        navigate(location.state?.from || '/terminal', { replace: true });
      });
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
    } catch (err) {
      // Error is already handled in the reducer
      console.error('Login failed:', err);
    }
  };

  // Memoize form rendering
  const renderForm = useMemo(() => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-terminal-white mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 rounded bg-terminal-black text-terminal-white border border-terminal-accent focus:outline-none focus:border-terminal-accent"
          required
          autoFocus
          disabled={loading}
        />
      </div>

      <div className="totp-pass-selector d-center gap-5">
        <button
          type="button"
          onClick={() => setTotpMode(true)}
          className={`p-2 rounded ${
            totpMode
              ? 'bg-terminal-accent text-black'
              : 'bg-red-400/20 text-red-400'
          } font-semibold transition-colors`}
        >
          TOTP
        </button>
        <button
          type="button"
          onClick={() => setTotpMode(false)}
          className={`p-2 rounded ${
            !totpMode
              ? 'bg-terminal-accent text-black'
              : 'bg-red-400/20 text-red-400'
          } font-semibold transition-colors`}
        >
          Password
        </button>
      </div>
     { totpMode?
        <div>
          <label className="block text-terminal-white mb-1">Auth Code</label>
          <input
            type="text"
            name="totp"
            value={formData.totp}
            onChange={handleChange}
            className="w-full p-2 rounded bg-terminal-black text-terminal-white border border-terminal-accent focus:outline-none focus:border-terminal-accent"
            placeholder="Enter 6-digit code"
            pattern="[0-9]{6}"
            disabled={loading}
          />
        </div>:
        
      <div>
        <label className="block text-terminal-white mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 rounded bg-terminal-black text-terminal-white border border-terminal-accent focus:outline-none focus:border-terminal-accent"
          required
          disabled={loading}
        />
      </div>}
      
      <button
        type="submit"
        disabled={loading}
        className={`w-full p-2 rounded ${
          loading
            ? 'bg-terminal-accent/50'
            : 'bg-terminal-accent hover:bg-terminal-accent/90'
        } text-black font-semibold transition-colors`}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  ), [formData, loading,  handleChange, handleSubmit]);

  // Format error message for display
  const getErrorMessage = (error) => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (typeof error === 'object') {
      const message = error.details?.message || error.message || JSON.stringify(error);
      return message.length > 200 ? message.substring(0, 200) + '...' : message;
    }
    return 'An unknown error occurred';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-terminal-black">
      <div className="bg-terminal-gray p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-terminal-white mb-6">Login</h2>
        
        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
            {getErrorMessage(error)}
          </div>
        )}

        {renderForm}
      </div>
    </div>
  );
};

export default Login;
