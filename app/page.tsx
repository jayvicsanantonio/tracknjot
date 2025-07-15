'use client'

import { NotesSidebar } from '@/components/notes-sidebar'
import { NoteEditor } from '@/components/note-editor'
import { motion, AnimatePresence } from 'framer-motion'
import { PanelLeftOpen } from 'lucide-react'
import { useNotesStore } from '@/lib/store'

export default function Home() {
  const { sidebarCollapsed, setSidebarCollapsed } = useNotesStore()

  return (
    <main className="flex h-screen overflow-hidden relative">
      <NotesSidebar />
      
      {/* Floating sidebar toggle when collapsed */}
      <AnimatePresence>
        {sidebarCollapsed && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarCollapsed(false)}
            className="absolute left-4 top-4 z-50 p-2 bg-[hsl(var(--card))] hover:bg-[hsl(var(--secondary))] rounded-lg shadow-lg border border-[hsl(var(--border))] transition-colors"
            title="Show sidebar"
          >
            <PanelLeftOpen className="w-5 h-5 text-[hsl(var(--foreground))]" />
          </motion.button>
        )}
      </AnimatePresence>
      
      <div className="flex-1">
        <NoteEditor />
      </div>
    </main>
  )
}
