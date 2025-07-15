'use client'

import { useState } from 'react'
import { Menu, FolderPlus } from 'lucide-react'
import { useNotesStore, Folder } from '@/lib/store'
import { NewFolderDialog } from './new-folder-dialog'
import { FolderItem } from './folder-item'
import { ThemeToggle } from './theme-toggle'
import { cn } from '@/lib/utils'

export function NotesSidebar() {
  const {
    folders,
    sidebarCollapsed,
    moveFolder,
    setSidebarCollapsed,
  } = useNotesStore()

  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [draggedFolder, setDraggedFolder] = useState<Folder | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, folder: Folder) => {
    setDraggedFolder(folder)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetFolder: Folder) => {
    e.preventDefault()
    if (draggedFolder && draggedFolder.id !== targetFolder.id) {
      moveFolder(draggedFolder.id, targetFolder.id)
    }
    setDraggedFolder(null)
    setDragOverId(null)
  }

  const handleDropOnRoot = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedFolder && draggedFolder.parentId) {
      moveFolder(draggedFolder.id, null)
    }
    setDraggedFolder(null)
    setDragOverId(null)
  }

  // Get only root-level folders
  const rootFolders = folders.filter(f => !f.parentId)

  return (
    <div className="notes-sidebar h-full flex flex-col overflow-hidden w-64 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-[hsl(var(--note-hover))] rounded transition-colors"
            title="Toggle sidebar"
          >
            <Menu className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          </button>
          <h1 className="text-[15px] font-semibold text-[hsl(var(--foreground))]">Folders</h1>
        </div>
      </div>

      {/* Folders */}
      <div 
        className="flex-1 overflow-y-auto"
        onDragOver={handleDragOver}
        onDrop={handleDropOnRoot}
      >
        {rootFolders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            onDragStart={handleDragStart}
            onDragOver={(e) => {
              handleDragOver(e)
              setDragOverId(folder.id)
            }}
            onDrop={handleDrop}
            isDragging={draggedFolder?.id === folder.id}
            dragOverId={dragOverId}
          />
        ))}
      </div>

      {/* Bottom actions */}
      <div className="mt-auto border-t border-[hsl(var(--sidebar-border))]">
        <button
          onClick={() => setShowNewFolderDialog(true)}
          className="flex items-center gap-2 justify-center w-full px-2 py-2 text-sm text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--note-hover))] transition-colors"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Folder</span>
        </button>
        <div className="flex items-center justify-between px-4 py-2 border-t border-[hsl(var(--sidebar-border))]">
          <span className="text-xs text-[hsl(var(--muted-foreground))]">Theme</span>
          <ThemeToggle />
        </div>
      </div>
      <NewFolderDialog open={showNewFolderDialog} onClose={() => setShowNewFolderDialog(false)} />
    </div>
  )
}
