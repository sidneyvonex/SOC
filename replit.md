# SOC Dashboard (G4S Security)

## Overview
A React + Vite + TypeScript single-page application for a Security Operations Centre dashboard, with login (auth context), protected routes, and dashboard views built with Tailwind CSS, React Router, Recharts, and SweetAlert2.

## Tech Stack
- **Frontend:** React 19, React Router 7, TypeScript
- **Build tool:** Vite 8
- **Styling:** Tailwind CSS 4 (via `@tailwindcss/vite`)
- **Charts:** Recharts
- **Icons:** lucide-react
- **Package manager:** pnpm

## Project Structure
- `src/` — application source (components, context, data, utils, types, assets, constants)
- `public/` — static public assets (favicon, icons)
- `index.html` — Vite entry HTML
- `vite.config.ts` — Vite config (configured for Replit: host `0.0.0.0`, port `5000`, all hosts allowed)

## Replit Setup
- **Workflow:** `Start application` runs `pnpm dev` on port 5000 (webview).
- **Vite dev server** is configured with `host: 0.0.0.0`, `port: 5000`, and `allowedHosts: true` so the Replit iframe proxy can reach it.
- **Deployment:** Static deployment — builds with `pnpm run build` and serves `dist/`.

## Development
- Install: `pnpm install`
- Dev server: `pnpm dev`
- Build: `pnpm build`
