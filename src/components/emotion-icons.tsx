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
    className={`svg-crisp ${className}`}
    aria-label={ariaLabel}
    role="img"
  >
    {children}
  </svg>
);

// Enhanced whimsy definitions for magical effects
function WhimsyDefs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={`${id}-halo`} x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="1.5" />
      </filter>
      <filter id={`${id}-sparkle`} x="-50%" y="-50%" width="200%" height="200%" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="0.5" />
        <feComponentTransfer>
          <feFuncA type="table" tableValues="0 0.8 1 0.8 0" />
        </feComponentTransfer>
      </filter>
      <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%" filterUnits="userSpaceOnUse">
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
      
      {/* Sunflower with petals and center */}
      <g className="magicalFloat" stroke="currentColor" fill="none">
        {/* Sunflower petals */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          const x1 = 24 + Math.cos(a) * 8;
          const y1 = 24 + Math.sin(a) * 8;
          const x2 = 24 + Math.cos(a) * 16;
          const y2 = 24 + Math.sin(a) * 16;
          return (
            <ellipse 
              key={i} 
              cx={24 + Math.cos(a) * 12} 
              cy={24 + Math.sin(a) * 12} 
              rx="4" 
              ry="2"
              transform={`rotate(${i * 30} ${24 + Math.cos(a) * 12} ${24 + Math.sin(a) * 12})`}
              fill="currentColor"
              opacity="0.8"
              className="floatSlow"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          );
        })}
      </g>

      {/* Sunflower center */}
      <g fill="currentColor">
        <circle cx="24" cy="24" r="8" opacity="0.9" />
        <circle cx="24" cy="24" r="6" opacity="0.7" />
        <circle cx="24" cy="24" r="4" opacity="0.5" />
      </g>

      {/* Magical sparkles around sunflower */}
      <g fill="currentColor" opacity={0.9}>
        <circle className="sparkle" style={{ animationDelay: "0.3s" }} cx="10" cy="14" r="1.2" />
        <circle className="sparkle" style={{ animationDelay: "1.2s" }} cx="38" cy="20" r="1" />
        <circle className="sparkle" style={{ animationDelay: "0.8s" }} cx="16" cy="36" r="0.8" />
        <circle className="sparkle" style={{ animationDelay: "1.5s" }} cx="42" cy="34" r="1" />
      </g>

      {/* Floating energy orbs */}
      <g fill="currentColor" opacity={0.6}>
        <circle className="floatSlow" style={{ animationDelay: "0.5s" }} cx="8" cy="24" r="1.5" />
        <circle className="floatSlow" style={{ animationDelay: "1.8s" }} cx="40" cy="24" r="1.5" />
      </g>
    </SvgWrapper>
  );
};

export const SadnessIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      
      {/* Gentle droplet with soft edges */}
      <g className="gentleRotate" stroke="currentColor" fill="none">
        <path
          d="M24 8c0 0-8 12-8 20a8 8 0 0 0 16 0c0-8-8-20-8-20z"
          strokeWidth="2"
        />
        
        {/* Soft ripple circles */}
        <circle cx="24" cy="36" r="6" strokeWidth="1.5" opacity="0.7" />
        <circle cx="24" cy="38" r="4" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Gentle rain drops */}
      <g stroke="currentColor" fill="currentColor" opacity={0.4}>
        <circle className="floatSlow" style={{ animationDelay: "0.2s" }} cx="18" cy="12" r="1" />
        <circle className="floatSlow" style={{ animationDelay: "0.8s" }} cx="30" cy="10" r="0.8" />
        <circle className="floatSlow" style={{ animationDelay: "1.4s" }} cx="14" cy="16" r="0.6" />
      </g>

      {/* Wet glow effect */}
      <g stroke="currentColor" fill="currentColor" opacity={0.15} filter={`url(#${id}-halo)`}>
        <circle cx="24" cy="32" r="4" className="motion-safe softGlow" />
      </g>
      
      {/* Gentle sparkles */}
      <g fill="currentColor" opacity={0.7}>
        <circle className="shimmer" style={{ animationDelay: "0.5s" }} cx="14" cy="18" r="1" />
        <circle className="shimmer" style={{ animationDelay: "1.1s" }} cx="34" cy="28" r="0.8" />
      </g>
    </SvgWrapper>
  );
};

export const LoveIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      
      {/* Magical heart outline */}
      <g className="gentleBreathe" stroke="currentColor" fill="none">
        <path
          d="M24 36c0 0-8-6-8-14a6 6 0 0 1 12 0c0 8-4 14-4 14z"
          strokeWidth="2"
        />
      </g>

      {/* Inner heart glow with breathing effect */}
      <g stroke="currentColor" fill="currentColor" opacity={0.25} filter={`url(#${id}-glow)`}>
        <path
          d="M24 36c0 0-8-6-8-14a6 6 0 0 1 12 0c0 8-4 14-4 14z"
          className="motion-safe gentleBreathe"
        />
      </g>

      {/* Floating love particles */}
      <g fill="currentColor" opacity={0.8}>
        <circle className="floatSlow" style={{ animationDelay: "0.3s" }} cx="16" cy="20" r="0.8" />
        <circle className="floatSlow" style={{ animationDelay: "0.9s" }} cx="32" cy="20" r="0.8" />
        <circle className="floatSlow" style={{ animationDelay: "1.5s" }} cx="24" cy="16" r="0.6" />
      </g>
      
      {/* Magical sparkles */}
      <g fill="currentColor" opacity={0.9}>
        <circle className="sparkle" style={{ animationDelay: "0.6s" }} cx="12" cy="14" r="1.2" />
        <circle className="sparkle" style={{ animationDelay: "1.2s" }} cx="36" cy="30" r="1" />
        <circle className="sparkle" style={{ animationDelay: "0.9s" }} cx="20" cy="32" r="0.8" />
      </g>
    </SvgWrapper>
  );
};

export const GrowthIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      
      {/* Tree trunk with gentle sway */}
      <g className="gentleRotate" stroke="currentColor" fill="none">
        {/* Main trunk */}
        <rect
          x="22"
          y="32"
          width="4"
          height="16"
          rx="2"
          strokeWidth="2"
        />
        
        {/* Branches */}
        <path
          d="M24 28c-6-2-8-1-8 3s2 5 8 3"
          strokeWidth="2"
          className="floatSlow"
          style={{ animationDelay: "0.3s" }}
        />
        <path
          d="M24 28c6-2 8-1 8 3s-2 5-8 3"
          strokeWidth="2"
          className="floatSlow"
          style={{ animationDelay: "0.7s" }}
        />
        <path
          d="M24 24c-4-1-6-0.5-6 2s2 3 6 2"
          strokeWidth="1.5"
          className="floatSlow"
          style={{ animationDelay: "0.5s" }}
        />
        <path
          d="M24 24c4-1 6-0.5 6 2s-2 3-6 2"
          strokeWidth="1.5"
          className="floatSlow"
          style={{ animationDelay: "0.9s" }}
        />
      </g>

      {/* Tree foliage clusters */}
      <g fill="currentColor" opacity="0.6">
        <circle cx="16" cy="22" r="4" className="motion-safe softGlow" />
        <circle cx="32" cy="22" r="4" className="motion-safe softGlow" style={{ animationDelay: "0.4s" }} />
        <circle cx="20" cy="18" r="3" className="motion-safe softGlow" style={{ animationDelay: "0.8s" }} />
        <circle cx="28" cy="18" r="3" className="motion-safe softGlow" style={{ animationDelay: "1.2s" }} />
        <circle cx="24" cy="16" r="3.5" className="motion-safe softGlow" style={{ animationDelay: "0.6s" }} />
      </g>

      {/* Growing buds */}
      <g fill="currentColor" opacity="0.8">
        <circle className="floatSlow" style={{ animationDelay: "0.2s" }} cx="18" cy="26" r="1.5" />
        <circle className="floatSlow" style={{ animationDelay: "0.8s" }} cx="30" cy="26" r="1.5" />
        <circle className="floatSlow" style={{ animationDelay: "1.4s" }} cx="24" cy="20" r="1.2" />
      </g>
      
      {/* Growth sparkles */}
      <g fill="currentColor" opacity={0.9}>
        <circle className="sparkle" style={{ animationDelay: "0.5s" }} cx="14" cy="16" r="1" />
        <circle className="sparkle" style={{ animationDelay: "1.1s" }} cx="34" cy="20" r="0.8" />
        <circle className="sparkle" style={{ animationDelay: "1.7s" }} cx="22" cy="14" r="0.6" />
      </g>
    </SvgWrapper>
  );
};

export const FearIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      
      {/* Gentle eye outline with soft edges */}
      <g className="gentleRotate" stroke="currentColor" fill="none">
        <ellipse cx="24" cy="24" rx="12" ry="8" strokeWidth="2" />
      </g>

      {/* Soft iris and pupil with gentle breathing */}
      <g fill="currentColor">
        <circle cx="24" cy="24" r="6" opacity="0.6" className="motion-safe gentleBreathe" />
        <circle cx="24" cy="24" r="3" opacity="0.8" />
      </g>

      {/* Protective energy field */}
      <g stroke="currentColor" fill="currentColor" opacity={0.1} filter={`url(#${id}-halo)`}>
        <circle cx="24" cy="24" r="16" className="motion-safe softGlow" />
      </g>
      
      {/* Gentle protective sparkles */}
      <g fill="currentColor" opacity={0.6}>
        <circle className="shimmer" style={{ animationDelay: "0.3s" }} cx="8" cy="20" r="1" />
        <circle className="shimmer" style={{ animationDelay: "0.9s" }} cx="40" cy="28" r="0.8" />
        <circle className="shimmer" style={{ animationDelay: "1.5s" }} cx="12" cy="38" r="0.6" />
      </g>

      {/* Floating comfort particles */}
      <g fill="currentColor" opacity={0.4}>
        <circle className="floatSlow" style={{ animationDelay: "0.6s" }} cx="16" cy="16" r="0.8" />
        <circle className="floatSlow" style={{ animationDelay: "1.2s" }} cx="32" cy="16" r="0.8" />
      </g>
    </SvgWrapper>
  );
};

export const PeaceIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      
      {/* Peace dove with gentle movement */}
      <g className="magicalFloat" stroke="currentColor" fill="none">
        {/* Dove body */}
        <ellipse cx="24" cy="28" rx="8" ry="6" strokeWidth="2" fill="currentColor" opacity="0.1" />
        
        {/* Dove head */}
        <circle cx="24" cy="20" r="4" strokeWidth="2" fill="currentColor" opacity="0.1" />
        
        {/* Dove wings with gentle flapping */}
        <g className="floatSlow" style={{ animationDelay: "0.2s" }}>
          {/* Left wing */}
          <path 
            d="M16 24 Q12 20 10 24 Q12 28 16 24" 
            strokeWidth="2" 
            fill="currentColor" 
            opacity="0.15"
          />
          {/* Right wing */}
          <path 
            d="M32 24 Q36 20 38 24 Q36 28 32 24" 
            strokeWidth="2" 
            fill="currentColor" 
            opacity="0.15"
          />
        </g>
        
        {/* Dove tail */}
        <path 
          d="M20 32 Q24 36 28 32" 
          strokeWidth="2" 
          fill="none"
        />
        
        {/* Dove beak */}
        <path 
          d="M24 20 L26 18 L24 16" 
          strokeWidth="1.5" 
          fill="none"
        />
      </g>

      {/* Inner peace glow */}
      <g stroke="currentColor" fill="currentColor" opacity={0.15} filter={`url(#${id}-glow)`}>
        <circle cx="24" cy="24" r="6" className="motion-safe softGlow" />
      </g>

      {/* Floating peace sparkles */}
      <g fill="currentColor" opacity={0.6}>
        <circle className="floatSlow" style={{ animationDelay: "0.4s" }} cx="12" cy="12" r="1" />
        <circle className="floatSlow" style={{ animationDelay: "1.0s" }} cx="36" cy="12" r="1" />
        <circle className="floatSlow" style={{ animationDelay: "1.6s" }} cx="24" cy="8" r="0.8" />
      </g>
      
      {/* Peace sparkles */}
      <g fill="currentColor" opacity={0.9}>
        <circle className="sparkle" style={{ animationDelay: "0.7s" }} cx="10" cy="12" r="1" />
        <circle className="sparkle" style={{ animationDelay: "1.3s" }} cx="38" cy="36" r="0.8" />
        <circle className="sparkle" style={{ animationDelay: "0.9s" }} cx="14" cy="40" r="0.6" />
      </g>
    </SvgWrapper>
  );
};

export const HopeIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      
      {/* Sunflower stem and leaves */}
      <g className="gentleBreathe" stroke="currentColor" fill="none">
        {/* Stem */}
        <line x1="24" y1="40" x2="24" y2="28" strokeWidth="2" strokeLinecap="round" />
        
        {/* Leaves */}
        <path
          d="M24 32c-6-2-8-1-8 2s2 4 8 2"
          strokeWidth="1.5"
          className="floatSlow"
          style={{ animationDelay: "0.2s" }}
        />
        <path
          d="M24 32c6-2 8-1 8 2s-2 4-8 2"
          strokeWidth="1.5"
          className="floatSlow"
          style={{ animationDelay: "0.6s" }}
        />
      </g>

      {/* Sunflower center */}
      <g fill="currentColor">
        <circle cx="24" cy="24" r="6" className="motion-safe gentleBreathe" />
      </g>

      {/* Sunflower petals - outer layer */}
      <g fill="currentColor" opacity="0.8">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          const x = 24 + Math.cos(a) * 12;
          const y = 24 + Math.sin(a) * 12;
          const width = 3;
          const height = 8;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx={width}
              ry={height}
              transform={`rotate(${i * 30} ${x} ${y})`}
              className="floatSlow"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          );
        })}
      </g>

      {/* Sunflower petals - inner layer */}
      <g fill="currentColor" opacity="0.6">
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          const x = 24 + Math.cos(a) * 8;
          const y = 24 + Math.sin(a) * 8;
          const width = 2.5;
          const height = 6;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx={width}
              ry={height}
              transform={`rotate(${i * 45} ${x} ${y})`}
              className="floatSlow"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          );
        })}
      </g>

      {/* Sunflower halo effect */}
      <g stroke="currentColor" fill="currentColor" opacity={0.15} filter={`url(#${id}-halo)`}>
        <circle cx="24" cy="24" r="18" className="motion-safe softGlow" />
      </g>
      
      {/* Floating hope particles */}
      <g fill="currentColor" opacity={0.7}>
        <circle className="floatSlow" style={{ animationDelay: "0.3s" }} cx="18" cy="18" r="0.8" />
        <circle className="floatSlow" style={{ animationDelay: "0.9s" }} cx="30" cy="20" r="0.6" />
        <circle className="floatSlow" style={{ animationDelay: "1.5s" }} cx="16" cy="26" r="0.7" />
      </g>

      {/* Hope sparkles */}
      <g fill="currentColor" opacity={0.9}>
        <circle className="sparkle" style={{ animationDelay: "0.5s" }} cx="16" cy="18" r="1" />
        <circle className="sparkle" style={{ animationDelay: "1.1s" }} cx="32" cy="26" r="0.8" />
        <circle className="sparkle" style={{ animationDelay: "1.7s" }} cx="10" cy="38" r="0.6" />
      </g>
    </SvgWrapper>
  );
};

export const GentleIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      
      {/* Dove body and head with gentle movement */}
      <g className="gentleRotate" stroke="currentColor" fill="none">
        {/* Dove body */}
        <ellipse cx="24" cy="28" rx="8" ry="6" strokeWidth="2" />
        
        {/* Dove head */}
        <circle cx="24" cy="20" r="4" strokeWidth="2" />
        
        {/* Beak */}
        <path
          d="M28 20l2 1l-1 1z"
          strokeWidth="1.5"
          fill="currentColor"
        />
        
        {/* Wings */}
        <path
          d="M16 26c0 0-4-2-4-4s2-2 4-1"
          strokeWidth="1.5"
          className="floatSlow"
          style={{ animationDelay: "0.3s" }}
        />
        <path
          d="M32 26c0 0 4-2 4-4s-2-2-4-1"
          strokeWidth="1.5"
          className="floatSlow"
          style={{ animationDelay: "0.7s" }}
        />
        
        {/* Tail */}
        <path
          d="M16 32c0 0 2-2 4-2s4 2 4 2"
          strokeWidth="1.5"
          className="floatSlow"
          style={{ animationDelay: "0.5s" }}
        />
      </g>

      {/* Dove inner glow with breathing */}
      <g stroke="currentColor" fill="currentColor" opacity="0.12" filter={`url(#${id}-glow)`}>
        <ellipse cx="24" cy="28" rx="6" ry="4" className="motion-safe gentleBreathe" />
        <circle cx="24" cy="20" r="2.5" className="motion-safe gentleBreathe" />
      </g>

      {/* Floating gentle particles */}
      <g fill="currentColor" opacity="0.6">
        <circle className="floatSlow" style={{ animationDelay: "0.2s" }} cx="18" cy="16" r="0.8" />
        <circle className="floatSlow" style={{ animationDelay: "0.8s" }} cx="30" cy="16" r="0.6" />
        <circle className="floatSlow" style={{ animationDelay: "1.4s" }} cx="20" cy="36" r="0.7" />
      </g>
      
      {/* Gentle sparkles */}
      <g fill="currentColor" opacity="0.8">
        <circle className="sparkle" style={{ animationDelay: "0.6s" }} cx="16" cy="14" r="1" />
        <circle className="sparkle" style={{ animationDelay: "1.2s" }} cx="32" cy="24" r="0.8" />
        <circle className="sparkle" style={{ animationDelay: "0.9s" }} cx="22" cy="38" r="0.6" />
      </g>
    </SvgWrapper>
  );
};

export const AnxietyIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      
      {/* Soft anxiety shape with gentle movement */}
      <g className="gentleRotate" stroke="currentColor" fill="none">
        {/* Core shape */}
        <path
          d="M24 8c0 0-8 8-8 16s8 16 8 16 8-8 8-16-8-16-8-16z"
          strokeWidth="2"
        />
        
        {/* Soft scribble effect */}
        <path
          d="M24 8c0 0-8 8-8 16s8 16 8 16 8-8 8-16-8-16-8-16z"
          strokeWidth="1"
          strokeDasharray="60"
          opacity="0.6"
          className="floatSlow"
          style={{ animationDelay: "0.5s" }}
        />
      </g>

      {/* Calming energy field */}
      <g stroke="currentColor" fill="currentColor" opacity={0.08} filter={`url(#${id}-halo)`}>
        <circle
          cx="24"
          cy="24"
          r="12"
          className="motion-safe softGlow"
        />
      </g>

      {/* Floating calming particles */}
      <g fill="currentColor" opacity={0.5}>
        <circle className="floatSlow" style={{ animationDelay: "0.2s" }} cx="16" cy="16" r="0.8" />
        <circle className="floatSlow" style={{ animationDelay: "0.8s" }} cx="32" cy="16" r="0.8" />
        <circle className="floatSlow" style={{ animationDelay: "1.4s" }} cx="24" cy="12" r="0.6" />
      </g>
      
      {/* Calming sparkles */}
      <g fill="currentColor" opacity={0.7}>
        <circle className="shimmer" style={{ animationDelay: "0.4s" }} cx="12" cy="16" r="1" />
        <circle className="shimmer" style={{ animationDelay: "1.0s" }} cx="36" cy="24" r="0.8" />
        <circle className="shimmer" style={{ animationDelay: "1.6s" }} cx="16" cy="38" r="0.6" />
      </g>
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
