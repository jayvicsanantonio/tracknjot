# Apple Notes Clone

An Apple Notes-like MVP built with modern web technologies, featuring a clean interface and smooth animations.

## Tech Stack

- **Next.js** v15.3.5 - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** v3 - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components
- **Framer Motion** - Smooth animations
- **Zustand** - Lightweight state management
- **pnpm** - Fast, disk space efficient package manager

## Features

- **Note Management**
  - Create, edit, and delete notes
  - Auto-save functionality with debouncing
  - Persistent storage using localStorage

- **Tagging System**
  - Add multiple tags to notes
  - Filter notes by tags
  - Visual tag management with animations

- **Search & Filter**
  - Real-time search across note titles, content, and tags
  - Tag-based filtering with visual feedback

- **Apple-like UI**
  - Clean, minimal interface inspired by Apple Notes
  - Sidebar + detail view layout
  - Smooth transitions and animations
  - Native system font support (-apple-system)
  - Custom scrollbar styling

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (install with `npm install -g pnpm`)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/apple-notes-clone.git
cd apple-notes-clone
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
apple-notes-clone/
├── app/
│   ├── globals.css        # Global styles and Tailwind directives
│   ├── layout.tsx         # Root layout with font configuration
│   └── page.tsx           # Main page with Notes app
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── note-editor.tsx    # Note editing interface
│   └── notes-sidebar.tsx  # Sidebar with notes list
├── lib/
│   ├── store.ts           # Zustand store for state management
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## Key Components

### Zustand Store (`lib/store.ts`)
Manages all application state including:
- Notes array with full CRUD operations
- Selected note tracking
- Tag filtering
- Search functionality
- LocalStorage persistence

### Notes Sidebar (`components/notes-sidebar.tsx`)
- Displays list of all notes
- Search input with real-time filtering
- Tag filter badges
- Animated transitions

### Note Editor (`components/note-editor.tsx`)
- Title and content editing
- Tag management
- Auto-save with debouncing
- Delete confirmation dialog

## Future Enhancements

The app is structured to easily support:
- Backend API integration
- Database persistence
- User authentication
- Rich text editing
- File attachments
- Collaborative editing
- Export functionality

## Development

### Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Code Style

The project uses:
- ESLint for code linting
- Prettier formatting (recommended)
- TypeScript strict mode

## License

MIT License - feel free to use this project for your own purposes.
