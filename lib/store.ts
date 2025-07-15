import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  folderId?: string
  isPinned?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Folder {
  id: string
  name: string
  icon?: string
  isExpanded?: boolean
  parentId?: string | null
}

interface NotesState {
  notes: Note[]
  folders: Folder[]
  selectedNoteId: string | null
  selectedFolderId: string | null
  tagFilter: string | null
  searchQuery: string
  sidebarCollapsed: boolean
  
  // Actions
  createNote: (folderId?: string) => string
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  selectNote: (id: string | null) => void
  selectFolder: (id: string | null) => void
  toggleFolder: (id: string) => void
  createFolder: (name: string, parentId?: string) => void
  deleteFolder: (id: string) => void
  renameFolder: (id: string, name: string) => void
  moveFolder: (folderId: string, newParentId: string | null) => void
  setTagFilter: (tag: string | null) => void
  setSearchQuery: (query: string) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  getFilteredNotes: () => Note[]
  getAllTags: () => string[]
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      folders: [
        { id: 'notes', name: 'Notes', icon: '📝', isExpanded: true },
      ],
      selectedNoteId: null,
      selectedFolderId: 'notes',
      tagFilter: null,
      searchQuery: '',
      sidebarCollapsed: false,

      createNote: (folderId) => {
        const newNote: Note = {
          id: Date.now().toString(),
          title: 'New Note',
          content: '',
          tags: [],
          folderId: folderId || get().selectedFolderId || 'notes',
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

      selectFolder: (id) => {
        set({ selectedFolderId: id })
      },

      toggleFolder: (id) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, isExpanded: !folder.isExpanded } : folder
          ),
        }))
      },

      createFolder: (name, parentId) => {
        const newFolder: Folder = {
          id: Date.now().toString(),
          name,
          icon: '📁',
          isExpanded: false,
          parentId: parentId || null,
        }
        
        set((state) => ({
          folders: [...state.folders, newFolder],
          selectedFolderId: newFolder.id,
        }))
      },

      deleteFolder: (id) => {
        if (id === 'notes') return // Can't delete the default Notes folder
        
        set((state) => {
          // Move all notes from deleted folder to Notes folder
          const updatedNotes = state.notes.map((note) =>
            note.folderId === id ? { ...note, folderId: 'notes' } : note
          )
          
          return {
            folders: state.folders.filter((folder) => folder.id !== id),
            notes: updatedNotes,
            selectedFolderId: state.selectedFolderId === id ? 'notes' : state.selectedFolderId,
          }
        })
      },

      renameFolder: (id, name) => {
        if (id === 'notes') return // Can't rename the default Notes folder
        
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, name } : folder
          ),
        }))
      },

      moveFolder: (folderId, newParentId) => {
        if (folderId === 'notes') return // Can't move the default Notes folder
        if (folderId === newParentId) return // Can't move folder into itself
        
        // Check if the new parent is a descendant of the folder being moved
        const isDescendant = (parentId: string | null | undefined): boolean => {
          if (!parentId) return false
          if (parentId === folderId) return true
          const parent = get().folders.find(f => f.id === parentId)
          return parent ? isDescendant(parent.parentId) : false
        }
        
        if (isDescendant(newParentId)) return // Prevent circular references
        
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === folderId ? { ...folder, parentId: newParentId } : folder
          ),
        }))
      },

      setTagFilter: (tag) => {
        set({ tagFilter: tag })
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query })
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed })
      },

      getFilteredNotes: () => {
        const { notes, tagFilter, searchQuery, selectedFolderId } = get()
        
        return notes.filter((note) => {
          // Filter by folder
          if (selectedFolderId && selectedFolderId !== 'all') {
            if (note.folderId !== selectedFolderId) {
              return false
            }
          }
          
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
