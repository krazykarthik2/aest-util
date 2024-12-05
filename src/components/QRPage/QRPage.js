import React from 'react';
import { useSelector } from 'react-redux';
import QRCode from '../util/QRCode/QRCode';

const QRPage = () => {
  const { command, style } = useSelector((state) => state.command);

  const qrData = {
    command,
    style,
    timestamp: new Date().toISOString()
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className={`p-8 ${style === 1 ? 'bg-terminal-gray rounded-lg shadow-lg' : ''}`}>
        <QRCode
          value={JSON.stringify(qrData)}
          size={256}
          level="H"
          fgColor={style === 1 ? '#ffffff' : '#ff6b6b'}
          bgColor="transparent"
          renderAs="svg"
          className="qr-code"
        />
      </div>
      <div className="mt-4 text-center">
        <p className="text-terminal-white">Scan to share command</p>
        <button
          onClick={() => window.history.back()}
          className={`mt-4 px-4 py-2 rounded ${
            style === 1
              ? 'bg-terminal-accent text-black'
              : 'bg-red-400/20 text-red-400'
          }`}
        >
          Back to Terminal
        </button>
      </div>
    </div>
  );
};

export default QRPage;
