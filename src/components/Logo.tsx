
import React from 'react';

const Logo = ({ className = "h-8 w-8" }: { className?: string }) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" opacity="0.1" />
        <path
          d="M12 20 L20 12 L28 20 L20 28 Z"
          fill="url(#logoGradient)"
          strokeWidth="1"
          stroke="url(#logoGradient)"
        />
        <circle cx="20" cy="20" r="3" fill="white" />
        <circle cx="15" cy="15" r="1.5" fill="white" opacity="0.8" />
        <circle cx="25" cy="15" r="1.5" fill="white" opacity="0.8" />
        <circle cx="15" cy="25" r="1.5" fill="white" opacity="0.8" />
        <circle cx="25" cy="25" r="1.5" fill="white" opacity="0.8" />
      </svg>
    </div>
  );
};

export default Logo;
