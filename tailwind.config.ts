import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
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
				'gradient-warm': 'var(--gradient-warm)'
			},
			fontFamily: {
				'recoleta': ['Recoleta', 'serif'],
				'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
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
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'letter-in': 'letter-in 500ms ease-out both',
				'rise-fade': 'rise-fade 500ms ease-out both',
				'float-slow': 'float-slow 4s ease-in-out infinite',
				'twinkle': 'twinkle 2.2s ease-in-out infinite',
			}
		}
	},
	plugins: [animate],
} satisfies Config;
