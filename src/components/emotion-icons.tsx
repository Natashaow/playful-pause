import React from 'react';

export interface IconProps {
  size?: number;
  className?: string;
  'aria-label'?: string;
}

const SvgWrapper: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 48,
  className = '',
  'aria-label': ariaLabel,
  children
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label={ariaLabel}
    role="img"
  >
    {children}
  </svg>
);

export const JoyIcon: React.FC<IconProps> = (props) => (
  <SvgWrapper {...props}>
    {/* Sun circle with breathing animation */}
    <circle
      cx="24"
      cy="24"
      r="12"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      className="motion-safe:animate-emotion-breathe"
    />
    
    {/* 8 rays with rays animation */}
    <g className="motion-safe:animate-emotion-rays">
      <line x1="24" y1="8" x2="24" y2="4" stroke="currentColor" strokeWidth="2" />
      <line x1="24" y1="44" x2="24" y2="40" stroke="currentColor" strokeWidth="2" />
      <line x1="8" y1="24" x2="4" y2="24" stroke="currentColor" strokeWidth="2" />
      <line x1="44" y1="24" x2="40" y2="24" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="12" x2="9" y2="9" stroke="currentColor" strokeWidth="2" />
      <line x1="39" y1="39" x2="36" y2="36" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="36" x2="9" y2="39" stroke="currentColor" strokeWidth="2" />
      <line x1="39" y1="12" x2="36" y2="9" stroke="currentColor" strokeWidth="2" />
    </g>
    
    {/* 3 sparkles with staggered delays */}
    <g className="motion-safe:animate-emotion-sparkle" style={{ animationDelay: '0s' }}>
      <path d="M32 16l2-2 2 2-2 2z" fill="currentColor" />
    </g>
    <g className="motion-safe:animate-emotion-sparkle" style={{ animationDelay: '0.6s' }}>
      <path d="M16 32l2-2 2 2-2 2z" fill="currentColor" />
    </g>
    <g className="motion-safe:animate-emotion-sparkle" style={{ animationDelay: '1.2s' }}>
      <path d="M36 36l2-2 2 2-2 2z" fill="currentColor" />
    </g>
  </SvgWrapper>
);

export const SadnessIcon: React.FC<IconProps> = (props) => (
  <SvgWrapper {...props}>
    {/* Droplet with fall animation */}
    <path
      d="M24 8c0 0-8 12-8 20a8 8 0 0 0 16 0c0-8-8-20-8-20z"
      fill="currentColor"
      className="motion-safe:animate-emotion-dropletFall"
    />
    
    {/* Ripple circle near bottom */}
    <circle
      cx="24"
      cy="36"
      r="6"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      className="motion-safe:animate-emotion-ripple"
    />
  </SvgWrapper>
);

export const LoveIcon: React.FC<IconProps> = (props) => (
  <SvgWrapper {...props}>
    {/* Heart with breathing animation */}
    <path
      d="M24 36c0 0-8-6-8-14a6 6 0 0 1 12 0c0 8-4 14-4 14z"
      fill="currentColor"
      className="motion-safe:animate-emotion-breathe"
    />
    
    {/* Subtle glow effect */}
    <path
      d="M24 36c0 0-8-6-8-14a6 6 0 0 1 12 0c0 8-4 14-4 14z"
      fill="currentColor"
      opacity="0.3"
      className="motion-safe:animate-emotion-glow"
    />
  </SvgWrapper>
);

export const GrowthIcon: React.FC<IconProps> = (props) => (
  <SvgWrapper {...props}>
    {/* Stem */}
    <line
      x1="24"
      y1="40"
      x2="24"
      y2="20"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    
    {/* Two leaves with growth animation */}
    <path
      d="M24 20c-8-4-12-2-12 4s4 8 12 4"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      className="motion-safe:animate-emotion-leafGrow"
    />
    <path
      d="M24 20c8-4 12-2 12 4s-4 8-12 4"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      className="motion-safe:animate-emotion-leafGrow"
      style={{ animationDelay: '0.5s' }}
    />
  </SvgWrapper>
);

export const FearIcon: React.FC<IconProps> = (props) => (
  <SvgWrapper {...props}>
    {/* Eye outline */}
    <ellipse
      cx="24"
      cy="24"
      rx="12"
      ry="8"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    
    {/* Iris */}
    <circle
      cx="24"
      cy="24"
      r="6"
      fill="currentColor"
      opacity="0.7"
    />
    
    {/* Pupil with dart animation */}
    <circle
      cx="24"
      cy="24"
      r="3"
      fill="currentColor"
      className="motion-safe:animate-emotion-eyeDart"
    />
    
    {/* Shiver on whole eye group */}
    <g className="motion-safe:animate-emotion-shiver">
      <ellipse
        cx="24"
        cy="24"
        rx="12"
        ry="8"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
    </g>
  </SvgWrapper>
);

export const PeaceIcon: React.FC<IconProps> = (props) => (
  <SvgWrapper {...props}>
    {/* Peace symbol with gentle rotation */}
    <g className="motion-safe:animate-emotion-rotatePeace">
      {/* Circle */}
      <circle
        cx="24"
        cy="24"
        r="16"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Peace symbol lines */}
      <line
        x1="24"
        y1="8"
        x2="24"
        y2="40"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="24"
        x2="40"
        y2="24"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Diagonal lines */}
      <line
        x1="16"
        y1="16"
        x2="32"
        y2="32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="32"
        y1="16"
        x2="16"
        y2="32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  </SvgWrapper>
);

export const HopeIcon: React.FC<IconProps> = (props) => (
  <SvgWrapper {...props}>
    {/* Horizon line */}
    <line
      x1="8"
      y1="32"
      x2="40"
      y2="32"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    
    {/* Sun rising with dawn animation */}
    <circle
      cx="24"
      cy="32"
      r="8"
      fill="currentColor"
      className="motion-safe:animate-emotion-dawn"
    />
    
    {/* Rays */}
    <g className="motion-safe:animate-emotion-rays">
      <line x1="24" y1="20" x2="24" y2="16" stroke="currentColor" strokeWidth="1.5" />
      <line x1="24" y1="48" x2="24" y2="44" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="24" x2="12" y2="24" stroke="currentColor" strokeWidth="1.5" />
      <line x1="36" y1="24" x2="40" y2="24" stroke="currentColor" strokeWidth="1.5" />
    </g>
  </SvgWrapper>
);

export const GentleIcon: React.FC<IconProps> = (props) => (
  <SvgWrapper {...props}>
    {/* Feather/soft leaf shape */}
    <path
      d="M16 16c0 0 8-8 16-8s16 8 16 8-8 8-16 8-16-8-16-8z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      className="motion-safe:animate-emotion-sway"
    />
    
    {/* Feather details */}
    <path
      d="M24 8c0 0 4 4 8 4s8-4 8-4"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      opacity="0.7"
    />
    
    {/* Float animation wrapper */}
    <g className="motion-safe:animate-emotion-float">
      <path
        d="M16 16c0 0 8-8 16-8s16 8 16 8-8 8-16 8-16-8-16-8z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
    </g>
  </SvgWrapper>
);

export const AnxietyIcon: React.FC<IconProps> = (props) => (
  <SvgWrapper {...props}>
    {/* Core shape with irregular pulse */}
    <path
      d="M24 8c0 0-8 8-8 16s8 16 8 16 8-8 8-16-8-16-8-16z"
      fill="currentColor"
      className="motion-safe:animate-emotion-irregularPulse"
    />
    
    {/* Scribble stroke around with scribble animation */}
    <path
      d="M24 8c0 0-8 8-8 16s8 16 8 16 8-8 8-16-8-16-8-16z"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      strokeDasharray="60"
      className="motion-safe:animate-emotion-scribble"
    />
    
    {/* Shiver burst loop */}
    <g className="motion-safe:animate-emotion-shiver">
      <circle
        cx="24"
        cy="24"
        r="12"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
    </g>
  </SvgWrapper>
);

// Export all icons
export const EmotionIcons = {
  JoyIcon,
  SadnessIcon,
  LoveIcon,
  GrowthIcon,
  FearIcon,
  PeaceIcon,
  HopeIcon,
  GentleIcon,
  AnxietyIcon,
};
