# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository: tracknjot — an Apple Notes-like MVP built with Next.js (TypeScript), Tailwind CSS, shadcn/ui, Zustand, and Framer Motion.

- Package manager: pnpm
- Node: 18+

Common commands
- Install deps: pnpm install
- Dev server (Next.js + Turbopack): pnpm dev  # http://localhost:3000
- Build: pnpm build
- Start (after build): pnpm start
- Lint: pnpm lint
- Tests: not configured (no "test" script or test runner present)

Architecture overview
- Framework and routing
  - Next.js 15 with the App Router.
  - app/layout.tsx sets up global UI: Next Themes provider (dark by default), global toolbar, and global CSS.
  - app/page.tsx composes a three-pane layout: left sidebar (folders), middle notes list, right note editor. The sidebar can be collapsed via global toolbar/store state.

- State management (lib/store.ts)
  - Zustand store persisted to localStorage under key "notes-storage".
  - Core models: Note { id, title, content, tags, folderId?, isPinned?, createdAt, updatedAt } and Folder { id, name, icon?, isExpanded?, parentId? }.
  - Actions: create/update/delete/select notes; create/rename/delete/move/toggle folders (supports hierarchy); UI state flags (sidebarCollapsed); filters (searchQuery, tagFilter). Helpers: getFilteredNotes (applies folder, tag, and text search), getAllTags.

- UI composition
  - GlobalToolbar (components/global-toolbar.tsx): fixed top bar; toggles sidebar visibility; exposes list/grid view modes (UI-only state) and delete affordance.
  - NotesSidebar (components/notes-sidebar.tsx): folder tree with drag-and-drop to re-parent folders; new-folder dialog; theme toggle. Root-level vs nested folders are derived from parentId.
  - NotesList (components/notes-list.tsx): shows filtered notes grouped into Pinned, Today, Previous 7 Days, and Previous 30 Days; respects selectedFolderId; supports note selection.
  - NoteContentEditor (components/note-content-editor.tsx): contentEditable editor with debounced auto-save (500ms) for title/content via onUpdateNote; shows updatedAt.
  - Additional feature components exist (e.g., note-editor.tsx, note-toolbar.tsx) but the primary editor in use is NoteContentEditor from app/page.tsx.

- Styling and theming
  - Tailwind CSS with CSS variables defined in app/globals.css for Apple Notes-inspired light/dark palettes; tailwindcss-animate plugin enabled in tailwind.config.ts.
  - Dark mode via next-themes (ThemeProvider wrapper component), defaultTheme="dark".

- Conventions and tooling
  - TypeScript strict mode; path alias @/* → project root (tsconfig.json).
  - ESLint via next lint (eslint-config-next). No test runner or config present.

Notes from existing docs
- README.md summarizes tech stack, features, and the high-level structure (app/, components/, lib/). Use pnpm for all scripts. Dev, build, start, lint commands match package.json.
- CLAUDE.md mirrors the above commands and details the same core architecture (App Router, Zustand with persistence, Tailwind/shadcn/ui, and component responsibilities). Use that as corroborating context for state shape and UI breakdown.
