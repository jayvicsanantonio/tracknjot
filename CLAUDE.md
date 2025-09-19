# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- `pnpm dev` - Start development server with Turbopack (runs on http://localhost:3000)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint for code linting

## Tech Stack & Architecture

This is an Apple Notes-like MVP built with:

- **Next.js 15.3.5** with App Router and Turbopack for development
- **TypeScript** with strict mode enabled
- **Tailwind CSS** with shadcn/ui components and custom theming
- **Zustand** for client-side state management with persistence
- **Framer Motion** for animations and transitions
- **pnpm** as the package manager

## State Management Architecture

The application uses **Zustand** with localStorage persistence (`lib/store.ts`):

- **Notes**: CRUD operations, search, tag filtering, folder organization
- **Folders**: Hierarchical folder structure with expand/collapse states
- **UI State**: Selected note/folder, sidebar collapse, search queries

Key interfaces:
- `Note`: id, title, content, tags, folderId, isPinned, timestamps
- `Folder`: id, name, icon, isExpanded, parentId (supports nesting)

## Component Architecture

- **App Router structure**: `app/page.tsx` is the main notes interface
- **UI Components**: Located in `components/ui/` (shadcn/ui components)
- **Feature Components**:
  - `notes-sidebar.tsx` - Left sidebar with folders and notes list
  - `note-editor.tsx` - Main content editor with auto-save
  - `global-toolbar.tsx` - Top toolbar with actions
  - Folder management components for hierarchical organization

## Styling System

- **Tailwind CSS** with CSS variables for theming
- **Dark mode** support via `next-themes`
- **Custom animations** using tailwindcss-animate plugin
- **Apple-inspired design** with system fonts and native styling

## Development Notes

- Uses **TypeScript strict mode** - all code must be type-safe
- **Auto-save functionality** with debouncing for note content
- **Local storage persistence** - no backend required for MVP
- **Responsive design** with sidebar collapse on mobile
- **Tag-based filtering** and real-time search across title/content/tags

## File Organization

- Path aliases configured: `@/*` maps to project root
- Component imports use absolute paths from project root
- UI components follow shadcn/ui patterns and naming conventions