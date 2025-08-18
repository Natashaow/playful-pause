# System Patterns: Playful Pause

## System Architecture
- SPA built with Vite + React + TypeScript
- Routing: react-router-dom with `App` rendering `/` → `Index` and a catch-all `NotFound`
- UI components: shadcn/ui wrappers under `src/components/ui`
- Activities are modular React components under `src/components/activities` and are switched via local state in `Index`

## Key Technical Decisions
- Keep activities self-contained with a single `onBack` prop
- Favor local component state; no global store
- Use Tailwind for utility styles, custom keyframes defined in `tailwind.config.ts`
- Use localStorage for light personalization and saved text (no backend)
- Web Audio API used directly in `SoundShapes`

## Design Patterns in Use
- Presentational + local stateful components
- Feature modules: each activity encapsulates its UI and logic
- Minimal cross-activity coupling; optional helpers in `src/lib/personalization.ts`

## Component Relationships
- `App` → `Index` page → renders one of the activities by discriminated union `Activity`
- Activities: `ColorBreathing`, `ColorDoodlePlay`, `CreativePrompt`, `MoodGarden`, `SoundShapes`, `WhimsyWishes`
- `ActivityCard` used on home grid to launch activities

## Critical Implementation Paths
- Home activity switcher in `src/pages/Index.tsx`
- Tailwind animations defined in `tailwind.config.ts` and inline `<style>` blocks inside activities
- Persistence keys: `pp:personalContext`, `pp:creativeSpark:response`, `moodGarden`
