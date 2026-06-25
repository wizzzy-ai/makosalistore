import React from 'react';
import LottiePlayer from './LottiePlayer';

const LoadingScreen = ({ visible = true, src, label = 'Loading...' }) => {
  const resolvedSrc = src || process.env.REACT_APP_APP_LOADING_LOTTIE_SRC || '/lottie/app-loading.json';

  return (
    <div
      className={`loading ${visible ? 'loading--visible' : 'loading--hidden'}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="loading__animation">
        <LottiePlayer
          src={resolvedSrc}
          style={{ width: 320, height: 320 }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
