'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Hash, X } from 'lucide-react'
import { useNotesStore, Note } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export function NoteEditor() {
  const { notes, selectedNoteId, updateNote, deleteNote, selectNote } = useNotesStore()
  const [tagInput, setTagInput] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
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

  const handleAddTag = useCallback(() => {
    if (!tagInput.trim() || !selectedNoteId) return

    const newTag = tagInput.trim()
    if (!localNote?.tags.includes(newTag)) {
      const updatedTags = [...(localNote?.tags || []), newTag]
      updateNote(selectedNoteId, { tags: updatedTags })
      setLocalNote(prev => prev ? { ...prev, tags: updatedTags } : null)
    }
    
    setTagInput('')
    setShowTagInput(false)
  }, [tagInput, selectedNoteId, localNote, updateNote])

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    if (!selectedNoteId || !localNote) return
    
    const updatedTags = localNote.tags.filter((tag) => tag !== tagToRemove)
    updateNote(selectedNoteId, { tags: updatedTags })
    setLocalNote({ ...localNote, tags: updatedTags })
  }, [selectedNoteId, localNote, updateNote])

  const handleDelete = useCallback(() => {
    if (!selectedNoteId) return
    
    deleteNote(selectedNoteId)
    setShowDeleteDialog(false)
    selectNote(null)
  }, [selectedNoteId, deleteNote, selectNote])

  if (!localNote) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        <p>Select a note or create a new one</p>
      </div>
    )
  }

  return (
    <motion.div
      key={selectedNoteId}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="text-sm text-gray-500">
          {format(new Date(localNote.updatedAt), 'MMMM d, yyyy \'at\' h:mm a')}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl p-8">
          {/* Title */}
          <Input
            value={localNote.title}
            onChange={(e) => setLocalNote({ ...localNote, title: e.target.value })}
            placeholder="Title"
            className="mb-4 border-0 text-3xl font-bold shadow-none placeholder:text-gray-400 focus-visible:ring-0"
          />

          {/* Tags */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {localNote.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="group cursor-pointer pr-1"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            
            {showTagInput ? (
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag()
                  } else if (e.key === 'Escape') {
                    setShowTagInput(false)
                    setTagInput('')
                  }
                }}
                onBlur={handleAddTag}
                placeholder="Add tag..."
                className="h-7 w-32"
                autoFocus
              />
            ) : (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 gap-1 text-xs"
                onClick={() => setShowTagInput(true)}
              >
                <Hash className="h-3 w-3" />
                Add Tag
              </Button>
            )}
          </div>

          {/* Content */}
          <Textarea
            value={localNote.content}
            onChange={(e) => setLocalNote({ ...localNote, content: e.target.value })}
            placeholder="Start writing..."
            className={cn(
              "min-h-[calc(100vh-300px)] resize-none border-0 shadow-none",
              "placeholder:text-gray-400 focus-visible:ring-0",
              "text-base leading-relaxed"
            )}
          />
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
