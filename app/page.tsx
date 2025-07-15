'use client'

import { NotesSidebar } from '@/components/notes-sidebar'
import { NotesList } from '@/components/notes-list'
import { NoteContentEditor } from '@/components/note-content-editor'
import { useNotesStore } from '@/lib/store'

export default function Home() {
  const { sidebarCollapsed, notes, selectedNoteId, updateNote } = useNotesStore()
  const selectedNote = notes.find(note => note.id === selectedNoteId) || null

  return (
    <main className="flex h-screen overflow-hidden">
      {!sidebarCollapsed && <NotesSidebar />}
      <NotesList />
      <NoteContentEditor 
        note={selectedNote}
        onUpdateNote={updateNote}
      />
    </main>
  )
}
