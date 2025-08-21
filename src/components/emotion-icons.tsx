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
      
      {/* Gentle cloud with soft, layered elements */}
      <g className="magicalFloat" stroke="currentColor" fill="currentColor">
        {/* Cloud body - multiple overlapping circles for depth */}
        <circle cx="18" cy="18" r="6" opacity="0.2" />
        <circle cx="30" cy="18" r="6" opacity="0.2" />
        <circle cx="24" cy="14" r="7" opacity="0.2" />
        <circle cx="20" cy="20" r="4" opacity="0.15" />
        <circle cx="28" cy="20" r="4" opacity="0.15" />
        
        {/* Cloud outline */}
        <path d="M12 18c0-4 3-7 7-7 1-4 6-6 10-4 2-4 7-5 11-2" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M10 22h28c3 0 6-2 6-6 0-3-3-6-6-6-1 0-2 0-3 0" fill="currentColor" opacity="0.25" />
      </g>

      {/* Rain drops falling with gentle movement */}
      <g stroke="currentColor" fill="currentColor" opacity={0.6}>
        {/* Connected raindrops */}
        <path className="floatSlow" style={{ animationDelay: "0.2s" }} d="M18 24l0 8c0 2 1 3 2 3s2-1 2-3l0-8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path className="floatSlow" style={{ animationDelay: "0.8s" }} d="M24 26l0 6c0 1.5 1 2.5 1.5 2.5s1.5-1 1.5-2.5l0-6" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path className="floatSlow" style={{ animationDelay: "1.4s" }} d="M30 25l0 7c0 1.5 1 2.5 1.5 2.5s1.5-1 1.5-2.5l0-7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        
        {/* Small droplet tips */}
        <circle className="floatSlow" style={{ animationDelay: "0.2s" }} cx="20" cy="35" r="1.5" />
        <circle className="floatSlow" style={{ animationDelay: "0.8s" }} cx="25.5" cy="35" r="1" />
        <circle className="floatSlow" style={{ animationDelay: "1.4s" }} cx="31.5" cy="35" r="1" />
      </g>

      {/* Gentle ripples where drops land */}
      <g stroke="currentColor" fill="none" opacity={0.3}>
        <circle cx="20" cy="40" r="3" strokeWidth="1" className="shimmer" style={{ animationDelay: "0.5s" }} />
        <circle cx="25.5" cy="40" r="2" strokeWidth="1" className="shimmer" style={{ animationDelay: "1.1s" }} />
        <circle cx="31.5" cy="40" r="2.5" strokeWidth="1" className="shimmer" style={{ animationDelay: "1.7s" }} />
      </g>
      
      {/* Peaceful sparkles around the cloud */}
      <g fill="currentColor" opacity={0.4}>
        <circle className="sparkle" style={{ animationDelay: "1s" }} cx="12" cy="15" r="0.8" />
        <circle className="sparkle" style={{ animationDelay: "2s" }} cx="36" cy="17" r="0.6" />
      </g>
    </SvgWrapper>
  );
};

export const LoveIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      
      {/* Simple flower with layered petals */}
      <g className="magicalFloat" stroke="currentColor" fill="currentColor">
        {/* Flower center */}
        <circle cx="24" cy="24" r="6" opacity="0.9" />
        <circle cx="24" cy="24" r="4" opacity="0.7" />
        <circle cx="24" cy="24" r="2" opacity="0.5" />
        
        {/* Simple flower petals - 6 petals around center */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i * Math.PI) / 3;
          const x = 24 + Math.cos(a) * 12;
          const y = 24 + Math.sin(a) * 12;
          return (
            <ellipse 
              key={i} 
              cx={x} 
              cy={y} 
              rx="3" 
              ry="1.5"
              transform={`rotate(${i * 60} ${x} ${y})`}
              opacity="0.8"
              className="floatSlow"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          );
        })}
      </g>

      {/* Flower stem */}
      <g className="gentleRotate" stroke="currentColor" fill="none">
        <line x1="24" y1="30" x2="24" y2="40" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Flower leaves */}
      <g className="floatSlow" stroke="currentColor" fill="currentColor" opacity="0.6">
        <path
          d="M24 32c-4-2-6-1-6 2s2 4 6 2"
          className="floatSlow"
          style={{ animationDelay: "0.3s" }}
        />
        <path
          d="M24 32c4-2 6-1 6 2s-2 4-6 2"
          className="floatSlow"
          style={{ animationDelay: "0.7s" }}
        />
      </g>

      {/* Floating love particles */}
      <g fill="currentColor" opacity="0.8">
        <circle className="floatSlow" style={{ animationDelay: "0.3s" }} cx="16" cy="16" r="0.8" />
        <circle className="floatSlow" style={{ animationDelay: "0.9s" }} cx="32" cy="16" r="0.8" />
        <circle className="floatSlow" style={{ animationDelay: "1.5s" }} cx="24" cy="12" r="0.6" />
      </g>
      
      {/* Magical sparkles */}
      <g fill="currentColor" opacity="0.9">
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
      
      {/* Growing stem with gentle sway */}
      <g className="gentleRotate" stroke="currentColor" fill="none">
        <line
          x1="24"
          y1="40"
          x2="24"
          y2="20"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Left leaf with gentle movement */}
        <path
          d="M24 20c-8-4-12-2-12 4s4 8 12 4"
          strokeWidth="2"
          className="floatSlow"
          style={{ animationDelay: "0.3s" }}
        />
        
        {/* Right leaf with gentle movement */}
        <path
          d="M24 20c8-4 12-2 12 4s-4 8-12 4"
          strokeWidth="2"
          className="floatSlow"
          style={{ animationDelay: "0.7s" }}
        />
      </g>

      {/* Growing energy orbs at leaf tips */}
      <g stroke="currentColor" fill="currentColor" opacity={0.2} filter={`url(#${id}-halo)`}>
        <circle cx="12" cy="24" r="3" className="motion-safe softGlow" />
        <circle cx="36" cy="24" r="3" className="motion-safe softGlow" style={{ animationDelay: "1.3s" }} />
      </g>

      {/* Floating growth particles */}
      <g fill="currentColor" opacity={0.7}>
        <circle className="floatSlow" style={{ animationDelay: "0.2s" }} cx="20" cy="12" r="0.8" />
        <circle className="floatSlow" style={{ animationDelay: "0.8s" }} cx="28" cy="14" r="0.6" />
        <circle className="floatSlow" style={{ animationDelay: "1.4s" }} cx="18" cy="18" r="0.7" />
      </g>
      
      {/* Growth sparkles */}
      <g fill="currentColor" opacity={0.9}>
        <circle className="sparkle" style={{ animationDelay: "0.5s" }} cx="18" cy="16" r="1" />
        <circle className="sparkle" style={{ animationDelay: "1.1s" }} cx="30" cy="22" r="0.8" />
        <circle className="sparkle" style={{ animationDelay: "1.7s" }} cx="14" cy="32" r="0.6" />
      </g>
    </SvgWrapper>
  );
};

export const FearIcon: React.FC<IconProps> = (props) => {
  const id = React.useId();
  return (
    <SvgWrapper {...props}>
      <WhimsyDefs id={id} />
      
      {/* Protective shield with gentle curves and layered elements */}
      <g className="magicalFloat" stroke="currentColor" fill="none">
        {/* Shield outline - rounded and friendly */}
        <path
          d="M24 8c-8 2-12 6-12 16s4 14 12 16c8-2 12-6 12-16s-4-14-12-16z"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Inner protective layer */}
        <path
          d="M24 12c-6 1.5-9 4.5-9 12s3 10.5 9 12c6-1.5 9-4.5 9-12s-3-10.5-9-12z"
          strokeWidth="1.5"
          opacity="0.6"
          className="gentleBreathe"
        />
      </g>

      {/* Gentle protective center with layered circles */}
      <g fill="currentColor">
        <circle cx="24" cy="24" r="4" opacity="0.2" className="softGlow" />
        <circle cx="24" cy="24" r="2" opacity="0.4" />
        <circle cx="24" cy="24" r="1" opacity="0.6" />
      </g>

      {/* Floating protective sparkles around the shield */}
      <g fill="currentColor" opacity={0.5}>
        <circle className="floatSlow" style={{ animationDelay: "0.2s" }} cx="16" cy="16" r="1" />
        <circle className="floatSlow" style={{ animationDelay: "0.8s" }} cx="32" cy="16" r="0.8" />
        <circle className="floatSlow" style={{ animationDelay: "1.4s" }} cx="14" cy="32" r="1.2" />
        <circle className="floatSlow" style={{ animationDelay: "0.5s" }} cx="34" cy="32" r="0.9" />
      </g>

      {/* Courage sparkles */}
      <g fill="currentColor" opacity={0.7}>
        <circle className="sparkle" style={{ animationDelay: "0.6s" }} cx="18" cy="20" r="0.8" />
        <circle className="sparkle" style={{ animationDelay: "1.2s" }} cx="30" cy="28" r="0.6" />
        <circle className="sparkle" style={{ animationDelay: "1.8s" }} cx="20" cy="36" r="0.7" />
      </g>

      {/* Gentle protective aura */}
      <g stroke="currentColor" fill="none" opacity={0.3}>
        <circle cx="24" cy="24" r="18" strokeWidth="1" className="shimmer" style={{ animationDelay: "0.5s" }} />
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
      
      {/* Rising sun with gentle rays */}
      <g className="gentleBreathe" stroke="currentColor" fill="none">
        {/* Horizon line */}
        <line x1="8" y1="32" x2="40" y2="32" strokeWidth="2" strokeLinecap="round" />
        
        {/* Sun rays with staggered animation */}
        <line x1="24" y1="20" x2="24" y2="16" strokeWidth="1.5" className="floatSlow" style={{ animationDelay: "0.2s" }} />
        <line x1="24" y1="48" x2="24" y2="44" strokeWidth="1.5" className="floatSlow" style={{ animationDelay: "0.6s" }} />
        <line x1="16" y1="24" x2="12" y2="24" strokeWidth="1.5" className="floatSlow" style={{ animationDelay: "1.0s" }} />
        <line x1="36" y1="24" x2="40" y2="24" strokeWidth="1.5" className="floatSlow" style={{ animationDelay: "1.4s" }} />
      </g>

      {/* Rising sun with inner glow */}
      <g fill="currentColor">
        <circle cx="24" cy="32" r="8" className="motion-safe gentleBreathe" />
      </g>

      {/* Sun halo effect */}
      <g stroke="currentColor" fill="currentColor" opacity={0.15} filter={`url(#${id}-halo)`}>
        <circle cx="24" cy="32" r="12" className="motion-safe softGlow" />
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
      
      {/* Beautiful feather with layered elements */}
      <g className="magicalFloat" stroke="currentColor" fill="currentColor">
        {/* Feather quill (main stem) */}
        <line x1="24" y1="8" x2="24" y2="40" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        
        {/* Feather vane (the soft part) - layered for depth */}
        <g className="floatSlow" style={{ animationDelay: "0.1s" }}>
          {/* Main feather shape - left side */}
          <path
            d="M24 12 Q16 16 12 20 Q16 24 24 28 Q16 32 12 36 Q16 40 24 44"
            opacity="0.3"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Main feather shape - right side */}
          <path
            d="M24 12 Q32 16 36 20 Q32 24 24 28 Q32 32 36 36 Q32 40 24 44"
            opacity="0.3"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
        
        {/* Inner feather details - left side */}
        <g className="floatSlow" style={{ animationDelay: "0.3s" }}>
          <path
            d="M24 16 Q18 18 15 22 Q18 26 24 30 Q18 34 15 38 Q18 42 24 46"
            opacity="0.4"
            fill="none"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
        
        {/* Inner feather details - right side */}
        <g className="floatSlow" style={{ animationDelay: "0.5s" }}>
          <path
            d="M24 16 Q30 18 33 22 Q30 26 24 30 Q30 34 33 38 Q30 42 24 46"
            opacity="0.4"
            fill="none"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
        
        {/* Small feather barbs for texture */}
        <g className="floatSlow" style={{ animationDelay: "0.7s" }}>
          {Array.from({ length: 8 }).map((_, i) => {
            const y = 14 + i * 4;
            return (
              <g key={i}>
                <line x1="20" y1={y} x2="28" y2={y} strokeWidth="0.5" opacity="0.3" />
              </g>
            );
          })}
        </g>
      </g>

      {/* Feather glow effect */}
      <g stroke="currentColor" fill="currentColor" opacity="0.15" filter={`url(#${id}-glow)`}>
        <path
          d="M24 12 Q16 16 12 20 Q16 24 24 28 Q16 32 12 36 Q16 40 24 44"
          className="motion-safe softGlow"
        />
        <path
          d="M24 12 Q32 16 36 20 Q32 24 24 28 Q32 32 36 36 Q32 40 24 44"
          className="motion-safe softGlow"
        />
      </g>

      {/* Floating feather particles */}
      <g fill="currentColor" opacity="0.6">
        <circle className="floatSlow" style={{ animationDelay: "0.2s" }} cx="18" cy="16" r="0.8" />
        <circle className="floatSlow" style={{ animationDelay: "0.8s" }} cx="30" cy="18" r="0.6" />
        <circle className="floatSlow" style={{ animationDelay: "1.4s" }} cx="20" cy="36" r="0.7" />
        <circle className="floatSlow" style={{ animationDelay: "0.5s" }} cx="32" cy="34" r="0.5" />
      </g>
      
      {/* Gentle sparkles around the feather */}
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
      
      {/* Calming spiral with gentle movement and layered elements */}
      <g className="gentleRotate" stroke="#6B46C1" fill="none">
        {/* Outer calming spiral */}
        <path
          d="M24 24c0-6 6-10 12-10s14 4 14 12-6 16-14 16-18-6-18-14 8-18 18-18"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        
        {/* Middle spiral */}
        <path
          d="M24 24c0-4 4-6 8-6s10 2 10 8-4 12-10 12-12-4-12-10 6-12 12-12"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
          className="floatSlow"
          style={{ animationDelay: "0.3s" }}
        />
        
        {/* Inner calming center */}
        <path
          d="M24 24c0-2 2-4 4-4s6 2 6 4-2 6-4 6-6-2-6-4 4-6 6-6"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="1"
          className="floatSlow"
          style={{ animationDelay: "0.6s" }}
        />
      </g>

      {/* Peaceful center point with layered circles */}
      <g fill="#8B5CF6">
        <circle cx="24" cy="24" r="2" opacity="0.8" className="gentleBreathe" />
        <circle cx="24" cy="24" r="1" opacity="1" />
        <circle cx="24" cy="24" r="0.5" opacity="0.9" />
      </g>

      {/* Floating calming particles around the spiral */}
      <g fill="#A78BFA" opacity="0.7">
        <circle className="floatSlow" style={{ animationDelay: "0.2s" }} cx="14" cy="16" r="1" />
        <circle className="floatSlow" style={{ animationDelay: "0.8s" }} cx="34" cy="18" r="0.8" />
        <circle className="floatSlow" style={{ animationDelay: "1.4s" }} cx="16" cy="32" r="0.9" />
        <circle className="floatSlow" style={{ animationDelay: "0.5s" }} cx="32" cy="34" r="1.1" />
      </g>
      
      {/* Soothing sparkles */}
      <g fill="#C4B5FD" opacity="0.8">
        <circle className="shimmer" style={{ animationDelay: "0.4s" }} cx="12" cy="24" r="0.7" />
        <circle className="shimmer" style={{ animationDelay: "1.0s" }} cx="36" cy="24" r="0.8" />
        <circle className="shimmer" style={{ animationDelay: "1.6s" }} cx="24" cy="12" r="0.6" />
        <circle className="shimmer" style={{ animationDelay: "0.7s" }} cx="24" cy="36" r="0.9" />
      </g>

      {/* Gentle breathing aura */}
      <g stroke="#DDD6FE" fill="none" opacity="0.4">
        <circle cx="24" cy="24" r="20" strokeWidth="1" className="softGlow" />
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
