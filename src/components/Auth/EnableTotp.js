import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { enableTotp, selectTotpEnabled, selectTotpEnabling, selectTotpError } from '../../redux/authSlice';
import { generateTOTP } from '../../util/jsutil';
import { Link } from 'react-router-dom';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import QRCode from 'react-qr-code';

const EnableTotp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [totpCode, setTotpCode] = useState("");
  const [authCode, setAuthCode] = useState("");
  const username = useSelector((state) => state.auth.user.name);
  
  React.useEffect(() => {
    const fx = async ()=> {
    
    const code = await generateTOTP();
    setAuthCode(`otpauth://totp/teja:${username}?secret=${code}&issuer=teja`);
    }
    fx();
  }, [username]);
  
  const isEnabled = useSelector(selectTotpEnabled);
  const isEnabling = useSelector(selectTotpEnabling);
  const error = useSelector(selectTotpError);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(enableTotp(totpCode));
      navigate('/terminal');
    } catch (err) {
      console.error('Failed to enable TOTP:', err);
    }
  };

  if (isEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-terminal-black">
        <div className="bg-terminal-gray p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-terminal-white mb-4">TOTP Already Enabled</h2>
          <p className="text-terminal-white mb-4">Two-factor authentication is already enabled for your account.</p>
          <button
            onClick={() => navigate('/terminal')}
            className="w-full p-2 rounded bg-terminal-accent hover:bg-terminal-accent/90 text-black font-semibold transition-colors"
          >
            Return to Terminal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-terminal-black">
      <div className="bg-terminal-gray p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-terminal-white mb-6">Enable Two-Factor Authentication</h2>
        
        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-terminal-white mb-4">
            Enter the 6-digit code from your authenticator app to enable two-factor authentication.
          </p>
        </div>

<div className="stack d-center w-full">

        <QRCode
          value={authCode}
          />
          <Link to={authCode} className="bg-gray-700 rounded-lg p-4">
            <FaArrowUpRightFromSquare size={24} />
          </Link>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-terminal-white mb-1">TOTP Code</label>
            <input
              type="text"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              className="w-full p-2 rounded bg-terminal-black text-terminal-white border border-terminal-accent focus:outline-none focus:border-terminal-accent"
              placeholder="Enter 6-digit code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              disabled={isEnabling}
            />
          </div>

          <button
            type="submit"
            disabled={isEnabling || totpCode.length !== 6}
            className={`w-full p-2 rounded ${
              isEnabling || totpCode.length !== 6
                ? 'bg-terminal-accent/50 cursor-not-allowed'
                : 'bg-terminal-accent hover:bg-terminal-accent/90'
            } text-black font-semibold transition-colors`}
          >
            {isEnabling ? 'Enabling...' : 'Enable TOTP'}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={() => navigate('/terminal')}
            className="w-full p-2 rounded border border-terminal-accent text-terminal-accent hover:bg-terminal-accent/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnableTotp;
