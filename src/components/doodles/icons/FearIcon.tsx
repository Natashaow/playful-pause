import * as React from "react";

/**
 * FearIcon
 * A small trembling droplet with a soft halo that breathes and settles.
 * - Size is scalable and inherits currentColor for easy theming.
 * - Motion is gentle; respects prefers-reduced-motion.
 *
 * Usage:
 *   <FearIcon className="h-7 w-7 text-foreground/80" />
 *   <FearIcon size={28} className="text-[hsl(var(--whimsy-lavender))]" />
 */
export function FearIcon({
  size = 28,
  className,
  title = "Fear (gently letting go)",
}: {
  size?: number | string;
  className?: string;
  title?: string;
}) {
  const px = typeof size === "number" ? `${size}px` : size;

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>

      {/* Styles are scoped to this SVG */}
      <style>{`
        /* Colors default to currentColor so you can theme with Tailwind/classes */
        .f-droplet { fill: currentColor; }
        .f-face { fill: #ffffff; opacity: .9 }
        .f-halo { stroke: currentColor; stroke-width: 1.5; fill: none; opacity: .22 }
        .f-mist { stroke: currentColor; stroke-width: 2; stroke-linecap: round; opacity: .35 }

        /* Tremble (tiny jitter, easing out) */
        @keyframes fear-jitter {
          0%   { transform: translate(0,0) }
          18%  { transform: translate(-0.8px,.7px) }
          36%  { transform: translate(1.0px,-.8px) }
          54%  { transform: translate(-0.7px,.9px) }
          72%  { transform: translate(.6px,-.6px) }
          100% { transform: translate(0,0) }
        }

        /* Breathing halo */
        @keyframes fear-halo {
          0%   { r: 18; opacity: .10 }
          50%  { r: 22; opacity: .22 }
          100% { r: 18; opacity: .10 }
        }

        /* Mist (exhale) fade + drift */
        @keyframes fear-mist {
          0%   { opacity: .0; transform: translateX(0) }
          20%  { opacity: .35; transform: translateX(1px) }
          60%  { opacity: .18; transform: translateX(3px) }
          100% { opacity: .0; transform: translateX(5px) }
        }

        /* Calm pulse when settled */
        @keyframes fear-pulse {
          0%,100% { transform: scale(1) }
          50% { transform: scale(1.04) }
        }

        /* Motion safety */
        @media (prefers-reduced-motion: reduce) {
          .f-anim, .f-anim * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Soft background halo (breathing) */}
      <circle
        className="f-halo f-anim"
        cx="32"
        cy="32"
        r="20"
        style={{ animation: "fear-halo 3.2s ease-in-out infinite" }}
      />

      {/* A couple of tiny “mist” lines (exhale/let-go). They loop slowly. */}
      <g
        className="f-anim"
        style={{ animation: "fear-mist 2.8s ease-in-out infinite" }}
        transform="translate(36,32)"
      >
        <path className="f-mist" d="M0 0 h8" />
        <path className="f-mist" d="M-2 6 h6" />
      </g>

      {/* Droplet group (slight jitter, then subtle pulse) */}
      <g className="f-anim">
        {/* jitter first half, pulse second half – by staggering two groups */}
        <g style={{ animation: "fear-jitter 1.8s ease-out infinite" }}>
          {/* droplet shape */}
          <path
            className="f-droplet"
            d="
              M32 14
              C28 21, 24 26, 24 31
              c0 4.4, 3.6 8, 8 8
              s8 -3.6, 8 -8
              c0 -5 -4 -10 -8 -17
              z
            "
          />
          {/* simple face (calm, closed eyes) */}
          <g transform="translate(0,1)">
            <circle className="f-face" cx="32" cy="30" r="6.5" />
            <path
              d="M29 29 q1.6 1.6 3 0"
              stroke="#7C7C7C"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              opacity=".65"
            />
            <circle cx="30" cy="28.2" r="0.7" fill="#7C7C7C" />
            <circle cx="34" cy="28.2" r="0.7" fill="#7C7C7C" />
          </g>
        </g>

        {/* subtle calm pulse (very gentle) */}
        <g
          style={{
            animation: "fear-pulse 3.6s ease-in-out infinite",
            transformOrigin: "32px 32px",
          }}
        >
          <circle cx="32" cy="32" r="0.01" fill="transparent" />
        </g>
      </g>
    </svg>
  );
}

export default FearIcon;


