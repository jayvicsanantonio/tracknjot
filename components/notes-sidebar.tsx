'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { Plus, Search, Hash, X } from 'lucide-react'
import { useNotesStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function NotesSidebar() {
  const {
    selectedNoteId,
    tagFilter,
    searchQuery,
    createNote,
    selectNote,
    setTagFilter,
    setSearchQuery,
    getFilteredNotes,
    getAllTags,
  } = useNotesStore()

  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const filteredNotes = getFilteredNotes()
  const allTags = getAllTags()

  return (
    <div className="flex h-full w-80 flex-col border-r bg-gray-50/50 dark:bg-gray-900/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h1 className="text-xl font-semibold">Notes</h1>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={createNote}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative p-4">
        <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className="pl-10 bg-white dark:bg-gray-800"
        />
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="border-b px-4 pb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <Hash className="h-3 w-3" />
            <span>Tags</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <AnimatePresence mode="popLayout">
              {allTags.map((tag) => (
                <motion.div
                  key={tag}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Badge
                    variant={tagFilter === tag ? "default" : "secondary"}
                    className="cursor-pointer text-xs"
                    onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                  >
                    {tag}
                    {tagFilter === tag && (
                      <X className="ml-1 h-2 w-2" />
                    )}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              <div
                onClick={() => selectNote(note.id)}
                className={cn(
                  "cursor-pointer border-b p-4 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                  selectedNoteId === note.id && "bg-blue-50 dark:bg-blue-900/20"
                )}
              >
                <h3 className="mb-1 font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                  {note.title || 'Untitled'}
                </h3>
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {note.content || 'No content'}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {note.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{note.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {format(new Date(note.updatedAt), 'MMM d')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
