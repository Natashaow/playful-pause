import React from 'react';

interface EmotionTileProps {
  label: string;
  colorClass: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const EmotionTile: React.FC<EmotionTileProps> = ({
  label,
  colorClass,
  children,
  onClick,
  className = ''
}) => {
  return (
    <div
      className={`
        group relative rounded-xl p-4 transition-all duration-200
        hover:ring-2 hover:ring-offset-2 hover:scale-[1.02]
        motion-safe:hover:scale-[1.02] motion-reduce:hover:scale-100
        ${colorClass}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="
          transition-transform duration-200
          group-hover:scale-110 motion-safe:group-hover:scale-110
          motion-reduce:group-hover:scale-100
        ">
          {children}
        </div>
        <span className="text-sm font-medium text-center leading-tight">
          {label}
        </span>
      </div>
    </div>
  );
};
