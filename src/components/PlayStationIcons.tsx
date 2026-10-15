import React from 'react';

export const PsTriangle: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 3 22 21 2 21 12 3" />
  </svg>
);

export const PsCircle: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
  </svg>
);

export const PsCross: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const PsSquare: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
);

export const DualSenseIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 11h4M8 9v4" />
    <circle cx="15" cy="12" r="1" fill="currentColor" />
    <circle cx="17" cy="10" r="1" fill="currentColor" />
    <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.468 4.212-.857 7.712.358 9.387 1.157 1.595 3.652 1.94 5.37.773L9.5 17.5h5l1.07 1.25c1.718 1.167 4.213.822 5.37-.773 1.215-1.675.826-5.175.358-9.387A4 4 0 0 0 17.32 5Z" />
  </svg>
);
