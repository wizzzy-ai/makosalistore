import React from 'react';

const LottiePlayer = ({
  src,
  className,
  style,
  loop = true,
  autoplay = true,
  speed = 1,
  background = 'transparent',
  ...props
}) => {
  if (!src) return null;

  return (
    <lottie-player
      src={src}
      background={background}
      speed={speed}
      loop={loop ? true : undefined}
      autoplay={autoplay ? true : undefined}
      className={className}
      style={style}
      {...props}
    />
  );
};

export default LottiePlayer;
