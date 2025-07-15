'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { Plus, Search, ChevronRight, Menu, FolderPlus, MoreHorizontal, Trash2, Edit2 } from 'lucide-react'
import { useNotesStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { NewFolderDialog } from './new-folder-dialog'
import { cn } from '@/lib/utils'

export function NotesSidebar() {
  const {
    folders,
    selectedNoteId,
    selectedFolderId,
    searchQuery,
    sidebarCollapsed,
    createNote,
    createFolder,
    deleteFolder,
    renameFolder,
    selectNote,
    selectFolder,
    toggleFolder,
    setSearchQuery,
    setSidebarCollapsed,
    getFilteredNotes,
  } = useNotesStore()

  const filteredNotes = getFilteredNotes()
  const [hoveredFolderId, setHoveredFolderId] = useState<string | null>(null)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editingFolderName, setEditingFolderName] = useState('')

  return (
    <motion.div
      initial={false}
      animate={{ width: sidebarCollapsed ? 0 : 320 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="notes-sidebar h-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-[hsl(var(--note-hover))] rounded transition-colors"
          >
            <Menu className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          </button>
          <h1 className="text-lg font-semibold">Notes</h1>
        </div>
        <button
          onClick={() => createNote()}
          className="p-1 hover:bg-[hsl(var(--note-hover))] rounded transition-colors"
        >
          <Plus className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-box h-7 pl-7 pr-2 rounded-md"
          />
        </div>
      </div>

      {/* Folders and Notes */}
      <div className="flex-1 overflow-y-auto">
      {folders.map((folder) => (
        <div key={folder.id}>
            {/* Folder Item */}
            <div
              onClick={() => {
                selectFolder(folder.id)
                toggleFolder(folder.id)
              }}
              onMouseEnter={() => setHoveredFolderId(folder.id)}
              onMouseLeave={() => setHoveredFolderId(null)}
              className={cn(
                'folder-item group',
                selectedFolderId === folder.id && 'bg-[hsl(var(--note-hover))]'
              )}
            >
              <ChevronRight
                className={cn(
                  'folder-arrow',
                  folder.isExpanded && 'folder-arrow-open'
                )}
              />
              <span className="mr-1.5">{folder.icon}</span>
              {editingFolderId === folder.id ? (
                <Input
                  value={editingFolderName}
                  onChange={(e) => setEditingFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    if (e.key === 'Enter') {
                      renameFolder(folder.id, editingFolderName)
                      setEditingFolderId(null)
                    } else if (e.key === 'Escape') {
                      setEditingFolderId(null)
                    }
                  }}
                  onBlur={() => {
                    renameFolder(folder.id, editingFolderName)
                    setEditingFolderId(null)
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 h-5 px-1 text-sm"
                  autoFocus
                />
              ) : (
                <span className="flex-1">{folder.name}</span>
              )}
              {hoveredFolderId === folder.id && (
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      createNote(folder.id)
                    }}
                    className="p-0.5 hover:bg-[hsl(var(--secondary))] rounded"
                    title="New note"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  {folder.id !== 'notes' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingFolderId(folder.id)
                          setEditingFolderName(folder.name)
                        }}
                        className="p-0.5 hover:bg-[hsl(var(--secondary))] rounded"
                        title="Rename folder"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm(`Delete folder "${folder.name}"? Notes will be moved to the Notes folder.`)) {
                            deleteFolder(folder.id)
                          }
                        }}
                        className="p-0.5 hover:bg-[hsl(var(--secondary))] rounded"
                        title="Delete folder"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Notes in Folder */}
            <AnimatePresence>
              {folder.isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {filteredNotes
                    .filter(note => 
                      folder.id === 'all' || note.folderId === folder.id
                    )
                    .map((note) => (
                      <div
                        key={note.id}
                        onClick={() => selectNote(note.id)}
                        className={cn(
                          'note-item ml-5',
                          selectedNoteId === note.id && 'note-item-selected'
                        )}
                      >
                        <div className="flex flex-col gap-0.5">
                          <div className="note-title">
                            {note.title || 'New Note'}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="note-date">
                              {format(new Date(note.updatedAt), 'M/d/yy')}
                            </span>
                            <span className="note-preview">
                              {note.content.replace(/\n/g, ' ').substring(0, 50) || 'No additional text'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* New Folder Dialog */}
      <button
        onClick={() => setShowNewFolderDialog(true)}
        className="flex items-center gap-2 justify-center w-full px-2 py-2 mt-auto text-sm text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--note-hover))] border-t border-[hsl(var(--sidebar-border))] transition-colors"
      >
        <FolderPlus className="w-5 h-5" />
        <span>New Folder</span>
      </button>
      <NewFolderDialog open={showNewFolderDialog} onClose={() => setShowNewFolderDialog(false)} />
    </motion.div>
  )
}
