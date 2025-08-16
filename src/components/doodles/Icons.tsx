import React from "react";

export const IconRainbow: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 40" className={className} aria-hidden>
    {/* Rainbow arcs with vibrant colors */}
    <path d="M6 30a26 26 0 0 1 52 0" fill="none" stroke="#FF6B6B" strokeWidth="3" opacity="0.9"/>
    <path d="M12 30a20 20 0 0 1 40 0" fill="none" stroke="#4ECDC4" strokeWidth="3" opacity="0.9"/>
    <path d="M18 30a14 14 0 0 1 28 0" fill="none" stroke="#45B7D1" strokeWidth="3" opacity="0.9"/>
    {/* Decorative clouds */}
    <circle cx="8" cy="25" r="2" fill="#87CEEB" opacity="0.7"/>
    <circle cx="56" cy="25" r="2" fill="#DDA0DD" opacity="0.7"/>
    <circle cx="32" cy="20" r="1.5" fill="#F0E68C" opacity="0.8"/>
    {/* Sparkle effects */}
    <path d="M16 15l1 1-1 1-1-1 1-1z" fill="#FFD700" opacity="0.8"/>
    <path d="M48 15l1 1-1 1-1-1 1-1z" fill="#FFD700" opacity="0.8"/>
  </svg>
);

export const IconBreath: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 40" className={className} aria-hidden>
    {/* Breathing wave with calming colors */}
    <path d="M8 22c10-8 20-8 30 0s20 8 30 0" stroke="#87CEEB" strokeWidth="3" fill="none" opacity="0.8"/>
    {/* Breathing circles */}
    <circle cx="20" cy="22" r="3" fill="#4ECDC4" opacity="0.9"/>
    <circle cx="44" cy="22" r="3" fill="#45B7D1" opacity="0.9"/>
    {/* Additional breathing elements */}
    <circle cx="32" cy="18" r="1.5" fill="#FFB6C1" opacity="0.7"/>
    <circle cx="32" cy="26" r="1.5" fill="#DDA0DD" opacity="0.7"/>
    {/* Calming dots */}
    <circle cx="12" cy="20" r="1" fill="#98FB98" opacity="0.8"/>
    <circle cx="52" cy="20" r="1" fill="#F0E68C" opacity="0.8"/>
  </svg>
);

export const IconHeartStar: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden>
    {/* Heart with gradient-like effect */}
    <path d="M24 38s-12-7-12-16a7 7 0 0 1 12-5 7 7 0 0 1 12 5c0 9-12 16-12 16Z"
      fill="#FFB6C1" opacity="0.8" stroke="#FF69B4" strokeWidth="2"/>
    <path d="M24 38s-12-7-12-16a7 7 0 0 1 12-5 7 7 0 0 1 12 5c0 9-12 16-12 16Z"
      fill="#FF69B4" opacity="0.4"/>
    {/* Star with golden glow */}
    <path d="M34 8l1.6 3.4 3.6.4-2.7 2.4.7 3.6L34 16l-3.2 1.8.7-3.6-2.7-2.4 3.6-.4L34 8Z"
      fill="#FFD700" opacity="0.9"/>
    <path d="M34 8l1.6 3.4 3.6.4-2.7 2.4.7 3.6L34 16l-3.2 1.8.7-3.6-2.7-2.4 3.6-.4L34 8Z"
      fill="#FFA500" opacity="0.6"/>
    {/* Decorative sparkles */}
    <circle cx="20" cy="12" r="1" fill="#87CEEB" opacity="0.8"/>
    <circle cx="28" cy="12" r="1" fill="#DDA0DD" opacity="0.8"/>
    <circle cx="16" cy="32" r="1" fill="#98FB98" opacity="0.8"/>
    <circle cx="32" cy="32" r="1" fill="#F0E68C" opacity="0.8"/>
  </svg>
);

export const IconPalette: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden>
    {/* Palette base with artistic flair */}
    <path d="M24 6c10 0 18 7 18 14s-7 8-10 8-2 6-8 6c-8 0-18-6-18-14S14 6 24 6Z"
      fill="#F5F5DC" opacity="0.8" stroke="#D2B48C" strokeWidth="2"/>
    {/* Colorful paint dots */}
    <circle cx="18" cy="16" r="3" fill="#FF6B6B" opacity="0.9"/>
    <circle cx="26" cy="14" r="3" fill="#4ECDC4" opacity="0.9"/>
    <circle cx="31" cy="20" r="3" fill="#45B7D1" opacity="0.9"/>
    {/* Additional paint colors */}
    <circle cx="22" cy="22" r="2" fill="#FFD93D" opacity="0.8"/>
    <circle cx="28" cy="18" r="2" fill="#FF8E9E" opacity="0.8"/>
    <circle cx="16" cy="20" r="2" fill="#A8E6CF" opacity="0.8"/>
    {/* Paintbrush handle */}
    <rect x="36" y="8" width="2" height="8" rx="1" fill="#8B4513" opacity="0.8"/>
    <rect x="37" y="7" width="1" height="2" rx="0.5" fill="#CD853F" opacity="0.9"/>
    {/* Artistic splashes */}
    <path d="M8 28c2-1 4-1 6 0" stroke="#FFB6C1" strokeWidth="1.5" fill="none" opacity="0.7"/>
    <path d="M38 30c-2-1-4-1-6 0" stroke="#87CEEB" strokeWidth="1.5" fill="none" opacity="0.7"/>
  </svg>
);

export const IconGarden: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden>
    {/* Soil base */}
    <path d="M8 36c0-4 8-8 16-8s16 4 16 8" fill="#8B4513" opacity="0.6"/>
    {/* Main flower */}
    <circle cx="24" cy="20" r="6" fill="#FFB6C1" opacity="0.8"/>
    <circle cx="24" cy="20" r="4" fill="#FF69B4" opacity="0.6"/>
    <circle cx="24" cy="20" r="2" fill="#FF1493" opacity="0.8"/>
    {/* Stem */}
    <path d="M24 26v8" stroke="#228B22" strokeWidth="2" strokeLinecap="round"/>
    {/* Leaves */}
    <path d="M20 30c-2-1-3-3-3-5" stroke="#32CD32" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M28 30c2-1 3-3 3-5" stroke="#32CD32" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* Small flowers */}
    <circle cx="18" cy="16" r="3" fill="#87CEEB" opacity="0.7"/>
    <circle cx="30" cy="16" r="3" fill="#DDA0DD" opacity="0.7"/>
    <circle cx="18" cy="28" r="2" fill="#F0E68C" opacity="0.8"/>
    <circle cx="30" cy="28" r="2" fill="#98FB98" opacity="0.8"/>
  </svg>
);

export const IconSound: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden>
    {/* Musical notes with whimsical design */}
    <path d="M16 20v8c0 2 2 4 4 4s4-2 4-4v-8" fill="#FFB6C1" opacity="0.8" stroke="#FF69B4" strokeWidth="2"/>
    <path d="M28 16v12c0 2 2 4 4 4s4-2 4-4V16" fill="#87CEEB" opacity="0.8" stroke="#4682B4" strokeWidth="2"/>
    <path d="M4 24v4c0 2 2 4 4 4s4-2 4-4v-4" fill="#DDA0DD" opacity="0.8" stroke="#9370DB" strokeWidth="2"/>
    {/* Decorative elements */}
    <circle cx="24" cy="8" r="2" fill="#F0E68C" opacity="0.9"/>
    <circle cx="24" cy="40" r="2" fill="#98FB98" opacity="0.9"/>
    {/* Musical note dots */}
    <circle cx="20" cy="24" r="1.5" fill="#FF69B4" opacity="0.8"/>
    <circle cx="32" cy="20" r="1.5" fill="#4682B4" opacity="0.8"/>
    <circle cx="8" cy="28" r="1.5" fill="#9370DB" opacity="0.8"/>
    {/* Sparkle effects */}
    <path d="M36 12l1 1-1 1-1-1 1-1z" fill="#FFD700" opacity="0.7"/>
    <path d="M12 36l1 1-1 1-1-1 1-1z" fill="#FFD700" opacity="0.7"/>
  </svg>
);