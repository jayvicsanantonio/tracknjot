# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains the Next.js App Router surface: `layout.tsx` wires global providers, `page.tsx` renders the notes workspace, and `globals.css` loads Tailwind layers.
- `components/` houses reusable UI; `components/ui/` mirrors shadcn primitives and feature modules like `note-editor.tsx` and `notes-sidebar.tsx`.
- `lib/` stores shared logic (`store.ts` for Zustand state, `utils.ts` for helpers); keep side effects and data shaping here instead of inside views.
- Static assets belong in `public/`; update root configs (`tailwind.config.ts`, `eslint.config.mjs`, `components.json`) alongside styling or lint changes.

## Build, Test, and Development Commands
- `pnpm install` syncs dependencies after checkout or rebase.
- `pnpm dev` starts Turbopack at `http://localhost:3000` for live iteration.
- `pnpm build` creates the production bundle; pair with `pnpm start` to smoke-test deployments.
- `pnpm lint` runs ESLint with the Next.js shareable config; resolve warnings before committing.

## Coding Style & Naming Conventions
- TypeScript strict mode is on—type component props, Zustand slices, and utility returns explicitly.
- Components use PascalCase, hooks use `useCamelCase`, utilities stay camelCase; match filenames to their default export.
- Tailwind CSS is the styling baseline; compose classes inline and promote repeated variants to `class-variance-authority`.
- Enforce 2-space indentation and Prettier defaults via editor format-on-save; run linting before pushing.

## Testing Guidelines
- No automated suite exists yet. Introduce React Testing Library + Vitest (or Jest) as features demand, storing specs as `*.spec.tsx` next to the target module.
- Document manual checks in PRs: create/edit/delete notes, tagging, search, theming, and refresh cycles to confirm `localStorage` persistence.
- Block merges on failing lint or missing smoke coverage once relevant tests ship.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`); keep subjects under 72 characters and scope them to the touched feature.
- Squash WIP commits locally, reference issues with `Closes #123`, and include release notes when applicable.
- PR descriptions must summarize changes, list commands executed (`pnpm dev`, `pnpm lint`, tests), and attach UI screenshots or GIFs.
- Call out known follow-ups or risks, and request review only after lint/tests are clean.

## Environment & Configuration Tips
- Develop on Node.js ≥18 with pnpm (enable via `corepack` if missing) to match CI expectations.
- Clear browser `localStorage` between manual test passes to validate onboarding flows.
- Manage shadcn additions through `pnpm dlx shadcn-ui@latest` so `components.json` stays authoritative; note new primitives in the PR body.
