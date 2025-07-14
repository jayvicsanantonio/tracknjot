import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

interface NotesState {
  notes: Note[]
  selectedNoteId: string | null
  tagFilter: string | null
  searchQuery: string
  
  // Actions
  createNote: () => string
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  selectNote: (id: string | null) => void
  setTagFilter: (tag: string | null) => void
  setSearchQuery: (query: string) => void
  getFilteredNotes: () => Note[]
  getAllTags: () => string[]
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      selectedNoteId: null,
      tagFilter: null,
      searchQuery: '',

      createNote: () => {
        const newNote: Note = {
          id: Date.now().toString(),
          title: 'New Note',
          content: '',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        set((state) => ({
          notes: [newNote, ...state.notes],
          selectedNoteId: newNote.id,
        }))
        
        return newNote.id
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          ),
        }))
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId,
        }))
      },

      selectNote: (id) => {
        set({ selectedNoteId: id })
      },

      setTagFilter: (tag) => {
        set({ tagFilter: tag })
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query })
      },

      getFilteredNotes: () => {
        const { notes, tagFilter, searchQuery } = get()
        
        return notes.filter((note) => {
          // Filter by tag
          if (tagFilter && !note.tags.includes(tagFilter)) {
            return false
          }
          
          // Filter by search query
          if (searchQuery) {
            const query = searchQuery.toLowerCase()
            return (
              note.title.toLowerCase().includes(query) ||
              note.content.toLowerCase().includes(query) ||
              note.tags.some((tag) => tag.toLowerCase().includes(query))
            )
          }
          
          return true
        })
      },

      getAllTags: () => {
        const { notes } = get()
        const tagsSet = new Set<string>()
        
        notes.forEach((note) => {
          note.tags.forEach((tag) => tagsSet.add(tag))
        })
        
        return Array.from(tagsSet).sort()
      },
    }),
    {
      name: 'notes-storage',
    }
  )
)
