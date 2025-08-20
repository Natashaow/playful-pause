import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./index.html",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				whimsy: {
					sage: 'hsl(var(--whimsy-sage))',
					blush: 'hsl(var(--whimsy-blush))',
					cream: 'hsl(var(--whimsy-cream))',
					lavender: 'hsl(var(--whimsy-lavender))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			backgroundImage: {
				'gradient-whimsy': 'var(--gradient-whimsy)',
				'gradient-calm': 'var(--gradient-calm)',
				'gradient-warm': 'var(--gradient-warm)',
				'gradient-joy': 'var(--gradient-joy)',
				'gradient-sunshine': 'var(--gradient-sunshine)'
			},
			fontFamily: {
				'recoleta': ['Recoleta', 'serif'],
				'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
				'heading': ['Recoleta', 'serif'],
				'sans': ['Plus Jakarta Sans', 'sans-serif'],
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'glow': 'var(--shadow-glow)'
			},
			transitionTimingFunction: {
				'gentle': 'var(--transition-gentle)',
				'bounce': 'var(--transition-bounce)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'letter-in': {
					'0%':   { transform: 'translateY(-12px) rotate(-2deg)', opacity: '0' },
					'60%':  { transform: 'translateY(2px) rotate(0deg)', opacity: '1' },
					'100%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
				},
				'rise-fade': {
					'0%':   { transform: 'translateY(6px)', opacity: '0' },
					'100%': { transform: 'translateY(0)',   opacity: '1' },
				},
				'float-slow': {
					'0%,100%': { transform: 'translateY(0)' },
					'50%':     { transform: 'translateY(-6px)' },
				},
				'twinkle': {
					'0%,100%': { opacity: '0' },
					'50%':     { opacity: '1' },
				},
				'card-pop': {
					'0%': { transform: 'translateY(6px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				'breathe-scale': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.5)' },
					'100%': { transform: 'scale(1)' },
				},
				'ripple-soft': {
					'0%': { opacity: '0.6', transform: 'scale(1)' },
					'100%': { opacity: '0', transform: 'scale(1.6)' },
				},
				// Emotion icon keyframes
				'breathe': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.06)' }
				},
				'bounce1px': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-1px)' }
				},
				'rays': {
					'0%': { transform: 'scale(0.95)', opacity: '0.6' },
					'100%': { transform: 'scale(1.05)', opacity: '1' }
				},
				'sparkle': {
					'0%': { transform: 'scale(0.6)', opacity: '0' },
					'30%': { transform: 'scale(1)', opacity: '1' },
					'100%': { transform: 'scale(1.4)', opacity: '0' }
				},
				'dropletFall': {
					'0%': { transform: 'translateY(0)', opacity: '1' },
					'80%': { transform: 'translateY(8px)', opacity: '1' },
					'100%': { transform: 'translateY(8px)', opacity: '0' }
				},
				'ripple': {
					'0%': { transform: 'scale(0.8)', opacity: '0.3' },
					'80%': { transform: 'scale(1.2)', opacity: '0' },
					'100%': { transform: 'scale(1.2)', opacity: '0' }
				},
				'leafGrow': {
					'0%': { transform: 'scale(0.9) rotate(-2deg)' },
					'50%': { transform: 'scale(1.04) rotate(0deg)' },
					'100%': { transform: 'scale(0.9) rotate(-2deg)' }
				},
				'eyeDart': {
					'0%': { transform: 'translateX(0)' },
					'20%': { transform: 'translateX(-2px)' },
					'40%': { transform: 'translateX(2px)' },
					'60%, 100%': { transform: 'translateX(0)' }
				},
				'shiver': {
					'0%, 100%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(0.5px)' },
					'50%': { transform: 'translateX(-0.5px)' },
					'75%': { transform: 'translateX(0.5px)' }
				},
				'sway': {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-2px)' }
				},
				'irregularPulse': {
					'0%': { transform: 'scale(1)' },
					'25%': { transform: 'scale(1.03)' },
					'50%': { transform: 'scale(0.98)' },
					'75%': { transform: 'scale(1.05)' },
					'100%': { transform: 'scale(1)' }
				},
				'scribble': {
					'0%': { strokeDashoffset: '60', opacity: '1' },
					'50%': { strokeDashoffset: '0', opacity: '0.6' },
					'100%': { strokeDashoffset: '0', opacity: '0.25' }
				},
				'dawn': {
					'0%': { transform: 'translateY(3px)', opacity: '0.6' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'rotatePeace': {
					'0%, 100%': { transform: 'rotate(-4deg)' },
					'50%': { transform: 'rotate(4deg)' }
				},
				'glow': {
					'0%': { filter: 'drop-shadow(0 0 0 currentColor)' },
					'100%': { filter: 'drop-shadow(0 0 6px currentColor)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'letter-in': 'letter-in 500ms ease-out both',
				'rise-fade': 'rise-fade 500ms ease-out both',
				'float-slow': 'float-slow 4s ease-in-out infinite',
				'twinkle': 'twinkle 2.2s ease-in-out infinite',
				'card-pop': 'card-pop .45s ease-out both',
				'breathe': 'breathe-scale 4s ease-in-out infinite',
				'ripple-soft': 'ripple-soft 1600ms ease-out',
				// Emotion icon animations
				'emotion-breathe': 'breathe 3s ease-in-out infinite',
				'emotion-bounce1px': 'bounce1px 2s ease-in-out infinite',
				'emotion-rays': 'rays 4s ease-in-out infinite',
				'emotion-sparkle': 'sparkle 2s ease-in-out infinite',
				'emotion-dropletFall': 'dropletFall 3s ease-in-out infinite',
				'emotion-ripple': 'ripple 2s ease-in-out infinite',
				'emotion-leafGrow': 'leafGrow 4s ease-in-out infinite',
				'emotion-eyeDart': 'eyeDart 3s ease-in-out infinite',
				'emotion-shiver': 'shiver 0.5s ease-in-out infinite',
				'emotion-sway': 'sway 3s ease-in-out infinite',
				'emotion-float': 'float 4s ease-in-out infinite',
				'emotion-irregularPulse': 'irregularPulse 2.5s ease-in-out infinite',
				'emotion-scribble': 'scribble 3s ease-in-out infinite',
				'emotion-dawn': 'dawn 4s ease-in-out infinite',
				'emotion-rotatePeace': 'rotatePeace 5s ease-in-out infinite',
				'emotion-glow': 'glow 3s ease-in-out infinite'
			}
		}
	},
	plugins: [animate],
} satisfies Config;
