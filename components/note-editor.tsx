'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNotesStore, Note } from '@/lib/store'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { NoteToolbar } from './note-toolbar'

export function NoteEditor() {
  const { notes, selectedNoteId, updateNote, deleteNote, selectNote } = useNotesStore()
  const [localNote, setLocalNote] = useState<Note | null>(null)

  const selectedNote = notes.find((note) => note.id === selectedNoteId)

  useEffect(() => {
    if (selectedNote) {
      setLocalNote(selectedNote)
    } else {
      setLocalNote(null)
    }
  }, [selectedNote])

  // Auto-save with debounce
  useEffect(() => {
    if (!localNote || !selectedNoteId) return

    const timeoutId = setTimeout(() => {
      updateNote(selectedNoteId, {
        title: localNote.title,
        content: localNote.content,
      })
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [localNote?.title, localNote?.content, selectedNoteId, updateNote])

  const handleDelete = useCallback(() => {
    if (!selectedNoteId) return
    deleteNote(selectedNoteId)
    selectNote(null)
  }, [selectedNoteId, deleteNote, selectNote])

  if (!localNote) {
    return (
      <div className="flex h-full items-center justify-center bg-[hsl(var(--background))] flex-1">
        <p className="text-[hsl(var(--muted-foreground))]">Select a note or create a new one</p>
      </div>
    )
  }

  return (
    <motion.div
      key={selectedNoteId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col bg-[hsl(var(--background))] flex-1"
    >
      {/* Toolbar */}
      <NoteToolbar 
        onDelete={handleDelete}
        onSearch={() => {
          // TODO: Implement in-note search
          console.log('Search in note')
        }}
        onShare={() => {
          // TODO: Implement share functionality
          console.log('Share note')
        }}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto px-8 py-6 max-w-3xl">
          {/* Date */}
          <div className="text-[13px] text-[hsl(var(--muted-foreground))] mb-4">
            {format(new Date(localNote.updatedAt), 'MMMM d, yyyy \'at\' h:mm a')}
          </div>

          {/* Title */}
          <input
            value={localNote.title}
            onChange={(e) => setLocalNote({ ...localNote, title: e.target.value })}
            placeholder="Title"
            className="w-full mb-4 bg-transparent text-[28px] font-bold placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none"
          />

          {/* Content */}
          <textarea
            value={localNote.content}
            onChange={(e) => setLocalNote({ ...localNote, content: e.target.value })}
            placeholder="Start writing or drag files here..."
            className={cn(
              "w-full min-h-[calc(100vh-200px)] resize-none bg-transparent",
              "placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none",
              "text-[16px] leading-[1.5] font-normal"
            )}
          />
        </div>
      </div>
    </motion.div>
  )
}
