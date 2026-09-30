import React from 'react';

export interface LogoProps {
  className?: string;
  alt?: string;
  variant?: 'light' | 'dark' | 'auto';
  hideSubtitle?: boolean;
  subtitleColor?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = 'h-12 w-auto',
  alt = 'COS Education',
}) => {
  return (
    <img
      src="/cos-education-logo.png"
      alt={alt}
      className={`object-contain ${className}`}
      referrerPolicy="no-referrer"
    />
  );
};

export const COSLogo = Logo;
export default Logo;
