'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Trash2,
  Type,
  List,
  ListOrdered,
  Table,
  Minus,
  Image,
  Pen,
  Link,
  Lock,
  Share,
  Search,
  Grid3X3,
  Rows3,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNotesStore } from '@/lib/store'

interface NoteToolbarProps {
  onDelete?: () => void
  onSearch?: () => void
  onShare?: () => void
}

type ViewMode = 'list' | 'grid'

export function NoteToolbar({ onDelete, onSearch, onShare }: NoteToolbarProps) {
  const { selectedNoteId } = useNotesStore()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = useCallback(() => {
    if (showDeleteConfirm) {
      onDelete?.()
      setShowDeleteConfirm(false)
    } else {
      setShowDeleteConfirm(true)
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000)
    }
  }, [showDeleteConfirm, onDelete])

  if (!selectedNoteId) return null

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]">
      {/* Left side - View toggles and actions */}
      <div className="flex items-center gap-3">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-[hsl(var(--secondary))] rounded-md p-0.5">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'px-2 py-1 rounded transition-all duration-200',
              viewMode === 'list'
                ? 'bg-[hsl(var(--background))] shadow-sm'
                : 'hover:bg-[hsl(var(--background))]/50'
            )}
            title="List view"
          >
            <Rows3 className="w-4 h-4 text-[hsl(var(--foreground))]" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'px-2 py-1 rounded transition-all duration-200',
              viewMode === 'grid'
                ? 'bg-[hsl(var(--background))] shadow-sm'
                : 'hover:bg-[hsl(var(--background))]/50'
            )}
            title="Grid view"
          >
            <Grid3X3 className="w-4 h-4 text-[hsl(var(--foreground))]" />
          </button>
        </div>

        {/* Delete button with confirmation */}
        <div className="relative">
          <button
            onClick={handleDelete}
            className={cn(
              'p-1.5 rounded transition-colors',
              showDeleteConfirm
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'hover:bg-[hsl(var(--secondary))]'
            )}
            title={showDeleteConfirm ? 'Click again to confirm' : 'Delete note'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 mt-1 px-2 py-1 bg-red-500 text-white text-xs rounded shadow-lg whitespace-nowrap"
            >
              Click again to delete
            </motion.div>
          )}
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-[hsl(var(--border))]" />

        {/* Formatting tools */}
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 hover:bg-[hsl(var(--secondary))] rounded transition-colors disabled:opacity-50"
            title="Text formatting"
          >
            <Type className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          </button>
          
          <button
            className="p-1.5 hover:bg-[hsl(var(--secondary))] rounded transition-colors disabled:opacity-50"
            title="Bullet list"
          >
            <List className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          </button>
          
          <button
            className="p-1.5 hover:bg-[hsl(var(--secondary))] rounded transition-colors disabled:opacity-50"
            title="Numbered list"
          >
            <ListOrdered className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          </button>
          
          <button
            className="p-1.5 hover:bg-[hsl(var(--secondary))] rounded transition-colors disabled:opacity-50"
            title="Insert table"
          >
            <Table className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          </button>
          
          <button
            className="p-1.5 hover:bg-[hsl(var(--secondary))] rounded transition-colors disabled:opacity-50"
            title="Horizontal line"
          >
            <Minus className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>

        {/* Media tools */}
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 hover:bg-[hsl(var(--secondary))] rounded transition-colors"
            title="Insert image"
          >
            <Image className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          </button>
          
          <button
            className="p-1.5 hover:bg-[hsl(var(--secondary))] rounded transition-colors"
            title="Sketch"
          >
            <Pen className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>

        {/* Link */}
        <button
          className="p-1.5 hover:bg-[hsl(var(--secondary))] rounded transition-colors disabled:opacity-50"
          title="Add link"
        >
          <Link className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        </button>
      </div>

      {/* Right side - Lock, Share, Search */}
      <div className="flex items-center gap-1">
        <button
          className="p-1.5 hover:bg-[hsl(var(--secondary))] rounded transition-colors"
          title="Lock note"
        >
          <Lock className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        </button>
        
        <button
          onClick={onShare}
          className="p-1.5 hover:bg-[hsl(var(--secondary))] rounded transition-colors"
          title="Share"
        >
          <Share className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        </button>
        
        <button
          onClick={onSearch}
          className="p-1.5 hover:bg-[hsl(var(--secondary))] rounded transition-colors"
          title="Search in note"
        >
          <Search className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        </button>

        <button
          className="p-1.5 hover:bg-[hsl(var(--secondary))] rounded transition-colors"
          title="More options"
        >
          <MoreHorizontal className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        </button>
      </div>
    </div>
  )
}
