import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup, selectAuth, clearError } from '../../redux/authSlice';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(selectAuth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Clear password error when user types
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const validatePassword = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    const { email, password,name } = formData;
    const result = await dispatch(signup({ email, password,name }));
    
    if (!result.error) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-terminal-black">
      <div className="bg-terminal-gray p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-terminal-white mb-6">Sign Up</h2>
        
        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
            {JSON.stringify(error)}
          </div>
        )}

        {passwordError && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
            {passwordError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-terminal-white mb-1" htmlFor='name'>Name</label>
            <input
              type="text"
              name="name"
              id='name'
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-terminal-black text-terminal-white border border-terminal-accent focus:outline-none focus:border-terminal-accent"
              required
            />
          </div>
          <div>
            <label className="block text-terminal-white mb-1" htmlFor='email'>Email</label>
            <input
              type="email"
              name="email"
              id='email'
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded bg-terminal-black text-terminal-white border border-terminal-accent focus:outline-none focus:border-terminal-accent"
              required
            />
          </div>

          <div>
            <label className="block text-terminal-white mb-1" htmlFor='password'>Password</label>
            <input
              type="password"
              name="password"
              id='password'
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 rounded bg-terminal-black text-terminal-white border border-terminal-accent focus:outline-none focus:border-terminal-accent"
              required
            />
          </div>

          <div>
            <label className="block text-terminal-white mb-1" htmlFor='confirmPassword'>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 rounded bg-terminal-black text-terminal-white border border-terminal-accent focus:outline-none focus:border-terminal-accent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded ${
              loading
                ? 'bg-terminal-accent/50'
                : 'bg-terminal-accent hover:bg-terminal-accent/90'
            } text-black font-semibold transition-colors`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
