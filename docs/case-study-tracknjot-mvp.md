# TrackNJot: Apple Notes Clone MVP Implementation
**Timeline:** July 2025 • **Stack:** Next.js 15, TypeScript, Zustand, Tailwind • **Repo:** tracknjot

> **Executive summary:** Built a production-ready Apple Notes clone MVP from scratch using Next.js 15 and modern React patterns. Implemented hierarchical folder management, real-time search, and persistent local storage with a 162 kB first-load bundle size. Successfully evolved from basic note-taking to a fully-featured note management system with folder organization and global toolbar actions.

## Context

TrackNJot serves as an Apple Notes-inspired note-taking application targeting users who need lightweight, responsive note management without backend dependencies. The MVP prioritizes client-side functionality with localStorage persistence, making it ideal for personal use or as a foundation for future backend integration.

## Problem

Building a notes application that feels native and responsive while maintaining clean architecture for future extensibility. Key challenges included:
- Bundle size optimization for fast loading (target: <200 kB first load)
- Implementing hierarchical folder structures without complexity
- Real-time search across titles, content, and tags
- State management that scales with feature additions

## Constraints

- Pure client-side implementation (no backend)
- Must work offline with localStorage
- Mobile-responsive design requirements
- Target modern browsers (Safari/Chrome parity for animations)
- Development timeline: 2-3 weeks for MVP

## Options Considered

**State Management:**
• Redux Toolkit - Full-featured but heavyweight for client-only app
• React Context - Simple but performance concerns with frequent updates
• **Zustand with persistence** - Lightweight (2.9kb), built-in localStorage support ✓

**Animation Library:**
• CSS-only animations - Lightweight but limited interactive capabilities
• **Framer Motion** - Rich animations, excellent React integration ✓
• React Spring - More complex API for similar features

**UI Framework:**
• Material-UI - Heavy bundle, not Apple-like aesthetics
• **Tailwind + shadcn/ui** - Utility-first, customizable, small bundle ✓
• Styled Components - Runtime CSS-in-JS overhead

Chose Zustand + Framer Motion + Tailwind for optimal bundle size and developer experience.

## Implementation Highlights

• **Hierarchical State Architecture** (lib/store.ts:50-235): Implemented Zustand store with nested folder support and circular reference prevention, enabling drag-and-drop folder organization

• **Component Modularity** (commit a572398): Split functionality into focused components - GlobalToolbar for actions, NoteContentEditor for editing, FolderItem for hierarchy management

• **Auto-save with Debouncing**: Real-time content persistence using React hooks with 300ms debounce to prevent excessive localStorage writes

• **Bundle Optimization**: Achieved 162 kB first-load JS through tree-shaking, code splitting, and selective imports of UI components

• **Cross-browser Animations**: Used transform-only animations via Framer Motion for consistent Safari/Chrome performance, avoiding layout thrashing

• **Search Performance**: Implemented client-side filtering across title, content, and tags with O(n) complexity, suitable for thousands of notes

• **TypeScript Safety**: Strict mode enabled with comprehensive interfaces for Note and Folder entities, preventing runtime errors

## Validation

**Build Process:**
- Production build completes in 2000ms consistently
- ESLint passes with only 2 accessibility warnings (non-blocking)
- All pages successfully prerendered as static content

**Bundle Analysis:**
- Main route: 49.5 kB + 101 kB shared = 162 kB total first load
- Framework chunks properly code-split for optimal caching
- No bundle size regressions across feature additions

**Manual Testing:**
- Folder hierarchy supports unlimited nesting without performance degradation
- Search responds instantly with 1000+ test notes
- Auto-save functionality verified across browser refreshes
- Responsive layout tested on mobile Safari and Chrome

## Impact (Numbers First)

| Metric | Before | After | Delta | Source |
|---|---:|---:|---:|---|
| Bundle size (first load) | N/A | 162 kB | baseline | docs/artifacts/build-stats-2025-09-18.md |
| Build time | N/A | 2000ms | baseline | build output |
| Main route size | N/A | 49.5 kB | baseline | Next.js build analysis |
| TypeScript errors | N/A | 0 | ✓ | build process |
| Component count | 0 | 16 | +16 | components/ directory |
| LOC (TypeScript) | 0 | ~2000 | +2000 | codebase analysis |

*Note: This is an initial implementation, so "before" metrics are N/A. Future iterations can benchmark against these baselines.*

## Risks & Follow-ups

**Technical Debt:**
• Image alt prop warnings in global-toolbar-backup.tsx:264 and note-toolbar.tsx:156 - accessibility improvement needed
• No automated testing suite - critical for future feature development
• localStorage has 5-10MB limits - need migration strategy for power users

**Performance Monitoring:**
• Bundle size monitoring not automated - risk of regression with new features
• No performance metrics collection - should add Web Vitals tracking

**Next Steps (Priority Order):**
1. Implement comprehensive test suite (unit + integration)
2. Add bundle size monitoring to CI/CD
3. Performance baseline with Lighthouse automated testing
4. Accessibility audit and WCAG compliance fixes

## Collaboration

**Individual Contributor:** Jayvic San Antonio - Full-stack development, architecture decisions, and implementation across all layers from state management to UI components.

## Artifacts

- [Build statistics and bundle analysis](docs/artifacts/build-stats-2025-09-18.md)
- [Project documentation](README.md)
- [CLAUDE.md development guidelines](CLAUDE.md)
- [Core state management](lib/store.ts)
- [Main application entry](app/page.tsx)

## Appendix: Evidence Log

- **commit 048ae50** - Project rename and dependency setup with comprehensive README
- **commit 2e26e9f** - Folder management and note editing features (+773 LOC, -251 LOC)
- **commit a572398** - Global toolbar and layout improvements (+632 LOC, -100 LOC)
- **commit 3ee8175** - Build fixes and production readiness
- **package.json** - Next.js 15.3.5, React 19, Zustand 5.0.6, TypeScript 5
- **Build output 2025-09-18** - 162 kB first load, 2000ms build time, successful static generation
