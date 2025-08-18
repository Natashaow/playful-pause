# Active Context: Playful Pause

## Current Work Focus
- Restore and complete Memory Bank documentation based on current codebase
- Keep activities stable; removed experimental Snake activity per request

## Recent Changes
- Created Memory Bank core files and filled with concrete details
- Deleted `src/components/activities/Snake.tsx`
- Verified activities wired via `src/pages/Index.tsx`

## Next Steps
- Audit accessibility: ensure aria labels and keyboard flows across activities
- Remove unused audio toggle wiring in `Index` or add an actual `<audio>` element
- Keep Memory Bank updated after meaningful feature changes

## Active Decisions and Considerations
- Stay SPA-only with local state; avoid global state or backend until needed
- Keep animations subtle; prefer CSS keyframes over heavy JS where possible

## Important Patterns and Preferences
- Each activity receives `onBack` and owns its local UI/logic
- Tailwind utility-first, with custom keyframes in `tailwind.config.ts`

## Learnings and Project Insights
- Personalization hints are lightweight and unobtrusive
- Inline `<style>` blocks can be used per-activity for scoped animations when Tailwind tokens are not sufficient
