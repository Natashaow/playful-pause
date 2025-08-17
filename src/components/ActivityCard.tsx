import React from "react";

type Props = {
  title: string;
  description: string;
  onClick: () => void;
  doodle: React.ReactNode;
  gradient?: string; // optional background accent
};

const ActivityCard: React.FC<Props> = ({ title, description, onClick, doodle, gradient }) => {
  return (
    <button
      onClick={onClick}
      className={[
        "group relative w-full h-32 overflow-hidden rounded-2xl text-left",
        "bg-white/70 backdrop-blur ring-1 ring-white/50 shadow-sm",
        "transition-transform duration-300 hover:-translate-y-0.5",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-foreground/30",
        "p-5 sm:p-6"
      ].join(" ")}
    >
      {/* soft accent blob */}
      {gradient && <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full ${gradient} opacity-50 blur-2xl`} />}

      <div className="relative z-10 flex items-center gap-4">
        <div className="text-foreground/80 size-12 rounded-xl bg-white/80 ring-1 ring-white/60 flex items-center justify-center">
          <span className="text-foreground/80 animate-float-slow">{doodle}</span>
        </div>
        <div className="min-w-0">
          <h3 className="font-recoleta text-lg text-foreground mb-0.5">{title}</h3>
          <p className="font-jakarta text-[13.5px] leading-5 text-foreground/70 line-clamp-2">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default ActivityCard;