# Tech Context: Playful Pause

## Technologies Used
- React 18, TypeScript
- Vite 5 + @vitejs/plugin-react-swc
- Tailwind CSS + tailwindcss-animate; shadcn/ui components
- React Router v6
- TanStack Query (present, not heavily used yet)
- Web Audio API in `SoundShapes`

## Development Setup
- Node + npm
- Install deps: `npm i`
- Start dev server: `npm run dev`
- Lint: `npm run lint`

## Technical Constraints
- No backend; client-only persistence via localStorage
- Keep bundles small and animations smooth
- Support latest Chrome/Firefox/Safari/Edge

## Dependencies/Utilities
- `src/lib/personalization.ts`: read mood context and last Creative Spark response
- `src/lib/utils.ts`: `cn` helper for Tailwind class merging
- UI primitives under `src/components/ui`

## Tooling/Config
- `tailwind.config.ts`: custom colors, gradients, keyframes (e.g., card-pop, twinkle, breathe)
- `vite.config.ts`: alias `@` → `./src`, dev server config, optional lovable component tagger in dev
