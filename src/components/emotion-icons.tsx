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

// Helper component for reusable whimsy definitions
function WhimsyDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
      </linearGradient>
      <filter id={`${id}-bloom`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2" />
        <feComponentTransfer>
          <feFuncA type="table" tableValues="0 0.3 0.6 0.8 1" />
        </feComponentTransfer>
      </filter>
    </defs>
  );
}

export const JoyIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      <g 
        className="whimsy-float whimsy-drift" 
        filter={`url(#${id}-bloom)`} 
        stroke={`url(#${id}-grad)`} 
        fill="none"
      >
        {/* Sun circle with rays */}
        <circle cx="24" cy="24" r="12" strokeWidth="2" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          const x1 = 24 + Math.cos(a) * 11;
          const y1 = 24 + Math.sin(a) * 11;
          const x2 = 24 + Math.cos(a) * 17;
          const y2 = 24 + Math.sin(a) * 17;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="2" />
          );
        })}
      </g>
      
      {/* Sparkles with staggered animation */}
      <circle className="whimsy-loop-twinkle" style={{ animationDelay: "0ms" }} cx="10" cy="14" r="1.2" fill="currentColor" />
      <rect className="whimsy-loop-twinkle" style={{ animationDelay: "420ms" }} x="36" y="20" width="2" height="2" transform="rotate(45 37 21)" fill="currentColor" />
      <circle className="whimsy-loop-twinkle" style={{ animationDelay: "900ms" }} cx="16" cy="36" r="1" fill="currentColor" />
    </SvgWrapper>
  );
};

export const SadnessIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      <g 
        className="whimsy-float whimsy-drift" 
        filter={`url(#${id}-bloom)`} 
        stroke={`url(#${id}-grad)`} 
        fill="none"
      >
        {/* Droplet shape */}
        <path
          d="M24 8c0 0-8 12-8 20a8 8 0 0 0 16 0c0-8-8-20-8-20z"
          strokeWidth="2"
        />
        
        {/* Ripple circle */}
        <circle cx="24" cy="36" r="6" strokeWidth="1.5" />
      </g>
      
      {/* Sparkles */}
      <circle className="whimsy-loop-twinkle" style={{ animationDelay: "200ms" }} cx="14" cy="18" r="1" fill="currentColor" />
      <rect className="whimsy-loop-twinkle" style={{ animationDelay: "600ms" }} x="32" y="28" width="1.5" height="1.5" transform="rotate(45 32.75 28.75)" fill="currentColor" />
    </SvgWrapper>
  );
};

export const LoveIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      <g 
        className="whimsy-float whimsy-drift" 
        filter={`url(#${id}-bloom)`} 
        stroke={`url(#${id}-grad)`} 
        fill="none"
      >
        {/* Heart shape */}
        <path
          d="M24 36c0 0-8-6-8-14a6 6 0 0 1 12 0c0 8-4 14-4 14z"
          strokeWidth="2"
        />
        
        {/* Inner heart glow */}
        <path
          d="M24 36c0 0-8-6-8-14a6 6 0 0 1 12 0c0 8-4 14-4 14z"
          strokeWidth="1"
          opacity="0.6"
        />
      </g>
      
      {/* Sparkles */}
      <rect className="whimsy-loop-twinkle" style={{ animationDelay: "250ms" }} x="12" y="14" width="2" height="2" transform="rotate(45 13 15)" fill="currentColor" />
      <circle className="whimsy-loop-twinkle" style={{ animationDelay: "800ms" }} cx="36" cy="30" r="1.2" fill="currentColor" />
    </SvgWrapper>
  );
};

export const GrowthIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      <g 
        className="whimsy-float whimsy-drift" 
        filter={`url(#${id}-bloom)`} 
        stroke={`url(#${id}-grad)`} 
        fill="none"
      >
        {/* Stem */}
        <line
          x1="24"
          y1="40"
          x2="24"
          y2="20"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Left leaf */}
        <path
          d="M24 20c-8-4-12-2-12 4s4 8 12 4"
          strokeWidth="2"
        />
        
        {/* Right leaf */}
        <path
          d="M24 20c8-4 12-2 12 4s-4 8-12 4"
          strokeWidth="2"
        />
      </g>
      
      {/* Sparkles */}
      <circle className="whimsy-loop-twinkle" style={{ animationDelay: "150ms" }} cx="18" cy="16" r="1" fill="currentColor" />
      <rect className="whimsy-loop-twinkle" style={{ animationDelay: "500ms" }} x="30" y="22" width="1.5" height="1.5" transform="rotate(45 30.75 22.75)" fill="currentColor" />
      <circle className="whimsy-loop-twinkle" style={{ animationDelay: "850ms" }} cx="14" cy="32" r="0.8" fill="currentColor" />
    </SvgWrapper>
  );
};

export const FearIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      <g 
        className="whimsy-float whimsy-drift" 
        filter={`url(#${id}-bloom)`} 
        stroke={`url(#${id}-grad)`} 
        fill="none"
      >
        {/* Eye outline */}
        <ellipse cx="24" cy="24" rx="12" ry="8" strokeWidth="2" />
        
        {/* Iris */}
        <circle cx="24" cy="24" r="6" fill="currentColor" opacity="0.7" />
        
        {/* Pupil */}
        <circle cx="24" cy="24" r="3" fill="currentColor" />
      </g>
      
      {/* Sparkles */}
      <circle className="whimsy-loop-twinkle" style={{ animationDelay: "100ms" }} cx="8" cy="20" r="1" fill="currentColor" />
      <rect className="whimsy-loop-twinkle" style={{ animationDelay: "450ms" }} x="38" y="28" width="1.5" height="1.5" transform="rotate(45 38.75 28.75)" fill="currentColor" />
      <circle className="whimsy-loop-twinkle" style={{ animationDelay: "750ms" }} cx="12" cy="38" r="0.8" fill="currentColor" />
    </SvgWrapper>
  );
};

export const PeaceIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      <g 
        className="whimsy-float whimsy-drift" 
        filter={`url(#${id}-bloom)`} 
        stroke={`url(#${id}-grad)`} 
        fill="none"
      >
        {/* Outer circle */}
        <circle cx="24" cy="24" r="16" strokeWidth="2" />
        
        {/* Vertical line */}
        <line x1="24" y1="8" x2="24" y2="40" strokeWidth="3" strokeLinecap="round" />
        
        {/* Horizontal line */}
        <line x1="8" y1="24" x2="40" y2="24" strokeWidth="3" strokeLinecap="round" />
        
        {/* Diagonal lines */}
        <line x1="16" y1="16" x2="32" y2="32" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="16" x2="16" y2="32" strokeWidth="2" strokeLinecap="round" />
      </g>
      
      {/* Sparkles */}
      <circle className="whimsy-loop-twinkle" style={{ animationDelay: "300ms" }} cx="10" cy="12" r="1" fill="currentColor" />
      <rect className="whimsy-loop-twinkle" style={{ animationDelay: "700ms" }} x="36" y="36" width="1.5" height="1.5" transform="rotate(45 36.75 36.75)" fill="currentColor" />
      <circle className="whimsy-loop-twinkle" style={{ animationDelay: "1100ms" }} cx="14" cy="40" r="0.8" fill="currentColor" />
    </SvgWrapper>
  );
};

export const HopeIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      <g 
        className="whimsy-float whimsy-drift" 
        filter={`url(#${id}-bloom)`} 
        stroke={`url(#${id}-grad)`} 
        fill="none"
      >
        {/* Horizon line */}
        <line x1="8" y1="32" x2="40" y2="32" strokeWidth="2" strokeLinecap="round" />
        
        {/* Rising sun */}
        <circle cx="24" cy="32" r="8" fill="currentColor" />
        
        {/* Sun rays */}
        <line x1="24" y1="20" x2="24" y2="16" strokeWidth="1.5" />
        <line x1="24" y1="48" x2="24" y2="44" strokeWidth="1.5" />
        <line x1="16" y1="24" x2="12" y2="24" strokeWidth="1.5" />
        <line x1="36" y1="24" x2="40" y2="24" strokeWidth="1.5" />
      </g>
      
      {/* Sparkles */}
      <circle className="whimsy-loop-twinkle" style={{ animationDelay: "180ms" }} cx="16" cy="18" r="1" fill="currentColor" />
      <rect className="whimsy-loop-twinkle" style={{ animationDelay: "550ms" }} x="32" y="26" width="1.5" height="1.5" transform="rotate(45 32.75 26.75)" fill="currentColor" />
      <circle className="whimsy-loop-twinkle" style={{ animationDelay: "920ms" }} cx="10" cy="38" r="0.8" fill="currentColor" />
    </SvgWrapper>
  );
};

export const GentleIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      <g 
        className="whimsy-float whimsy-drift" 
        filter={`url(#${id}-bloom)`} 
        stroke={`url(#${id}-grad)`} 
        fill="none"
      >
        {/* Main feather shape */}
        <path
          d="M16 16c0 0 8-8 16-8s16 8 16 8-8 8-16 8-16-8-16-8z"
          strokeWidth="2"
        />
        
        {/* Feather details */}
        <path
          d="M24 8c0 0 4 4 8 4s8-4 8-4"
          strokeWidth="1.5"
          opacity="0.7"
        />
        
        {/* Soft inner glow */}
        <path
          d="M16 16c0 0 8-8 16-8s16 8 16 8-8 8-16 8-16-8-16-8z"
          strokeWidth="1"
          opacity="0.3"
        />
      </g>
      
      {/* Sparkles */}
      <circle className="whimsy-loop-twinkle" style={{ animationDelay: "220ms" }} cx="20" cy="12" r="1" fill="currentColor" />
      <rect className="whimsy-loop-twinkle" style={{ animationDelay: "580ms" }} x="28" y="20" width="1.5" height="1.5" transform="rotate(45 28.75 20.75)" fill="currentColor" />
      <circle className="whimsy-loop-twinkle" style={{ animationDelay: "950ms" }} cx="18" cy="34" r="0.8" fill="currentColor" />
    </SvgWrapper>
  );
};

export const AnxietyIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      <g 
        className="whimsy-float whimsy-drift" 
        filter={`url(#${id}-bloom)`} 
        stroke={`url(#${id}-grad)`} 
        fill="none"
      >
        {/* Core shape */}
        <path
          d="M24 8c0 0-8 8-8 16s8 16 8 16 8-8 8-16-8-16-8-16z"
          strokeWidth="2"
        />
        
        {/* Scribble effect */}
        <path
          d="M24 8c0 0-8 8-8 16s8 16 8 16 8-8 8-16-8-16-8-16z"
          strokeWidth="1"
          strokeDasharray="60"
          opacity="0.6"
        />
        
        {/* Shiver burst */}
        <circle
          cx="24"
          cy="24"
          r="12"
          strokeWidth="1"
          opacity="0.4"
        />
      </g>
      
      {/* Sparkles */}
      <circle className="whimsy-loop-twinkle" style={{ animationDelay: "120ms" }} cx="12" cy="16" r="1" fill="currentColor" />
      <rect className="whimsy-loop-twinkle" style={{ animationDelay: "480ms" }} x="34" y="24" width="1.5" height="1.5" transform="rotate(45 34.75 24.75)" fill="currentColor" />
      <circle className="whimsy-loop-twinkle" style={{ animationDelay: "820ms" }} cx="16" cy="38" r="0.8" fill="currentColor" />
    </SvgWrapper>
  );
};

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
