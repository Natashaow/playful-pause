import React from "react";

export const IconRainbow: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 40" className={className} aria-hidden>
    <path d="M6 30a26 26 0 0 1 52 0" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 30a20 20 0 0 1 40 0" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M18 30a14 14 0 0 1 28 0" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const IconBreath: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 40" className={className} aria-hidden>
    <path d="M8 22c10-8 20-8 30 0s20 8 30 0" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="20" cy="22" r="2" fill="currentColor"/>
    <circle cx="44" cy="22" r="2" fill="currentColor"/>
  </svg>
);

export const IconHeartStar: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden>
    <path d="M24 38s-12-7-12-16a7 7 0 0 1 12-5 7 7 0 0 1 12 5c0 9-12 16-12 16Z"
      fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M34 8l1.6 3.4 3.6.4-2.7 2.4.7 3.6L34 16l-3.2 1.8.7-3.6-2.7-2.4 3.6-.4L34 8Z"
      fill="currentColor"/>
  </svg>
);

export const IconPalette: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden>
    <path d="M24 6c10 0 18 7 18 14s-7 8-10 8-2 6-8 6c-8 0-18-6-18-14S14 6 24 6Z"
      fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="18" cy="16" r="2" fill="currentColor"/>
    <circle cx="26" cy="14" r="2" fill="currentColor"/>
    <circle cx="31" cy="20" r="2" fill="currentColor"/>
  </svg>
);