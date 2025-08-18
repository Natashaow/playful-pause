# Project Brief: Playful Pause

## Overview
Playful Pause is a small, single-page React app offering short, joyful activities you can do in under 3 minutes. It focuses on calm visuals, gentle motion, and zero-stress interactions. The home page shows activity cards; each activity opens full-screen with a simple Back action.

## Core Requirements
- Home grid lists 6 activities: Emotional Breathing, Sound Shapes, Whimsy Wishes, Doodle Play, Mood Garden, Creative Spark.
- "Surprise me" button starts a random activity.
- Each activity renders a self-contained experience with `onBack` to return home.
- Accessibility basics: descriptive labels/titles, button roles, reduced cognitive load.
- No backend; minimal persistence via `localStorage` for personalization and saved responses.
- Built with Vite + React + TypeScript, styled with Tailwind and shadcn/ui components.

## Goals
- Deliver delightful micro-breaks with minimal friction and zero setup.
- Keep interactions obvious and gentle; run smoothly on mobile and desktop.
- Avoid console errors; maintain fast startup and responsive animations.

## Project Scope
- In scope: SPA with one route (`/`) and a 404, activity components, Tailwind theming/animations, localStorage-based personalization.
- Out of scope: authentication, accounts, remote APIs, analytics, heavy state management, server-side rendering.

