import React, { useState } from 'react';
import { captureElementAsImage } from '../services/geminiService';

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ScreenshotButton: React.FC = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleScreenshot = async () => {
    setIsCapturing(true);
    try {
      await captureElementAsImage(document.getElementById('root'), 'soundarya-lahari-full-page.png');
    } catch (error) {
      // The utility function already alerts the user.
      console.error('Full page screenshot failed.', error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <button
      onClick={handleScreenshot}
      disabled={isCapturing}
      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-amber-800 bg-white/80 rounded-full border border-amber-300/60 shadow-sm hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-wait"
      aria-label="Capture screenshot of the full page"
    >
      <CameraIcon />
      {isCapturing ? 'Capturing...' : 'Share Full Page'}
    </button>
  );
};

export default ScreenshotButton;