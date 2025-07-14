import { NotesSidebar } from '@/components/notes-sidebar'
import { NoteEditor } from '@/components/note-editor'

export default function Home() {
  return (
    <main className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      <NotesSidebar />
      <div className="flex-1">
        <NoteEditor />
      </div>
    </main>
  )
}
