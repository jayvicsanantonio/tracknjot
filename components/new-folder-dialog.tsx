'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotesStore } from '@/lib/store'

interface NewFolderDialogProps {
  open: boolean
  onClose: () => void
}

export function NewFolderDialog({ open, onClose }: NewFolderDialogProps) {
  const { createFolder } = useNotesStore()
  const [folderName, setFolderName] = useState('')

  const handleCreate = () => {
    if (folderName.trim()) {
      createFolder(folderName.trim())
      setFolderName('')
      onClose()
    }
  }

  const handleCancel = () => {
    setFolderName('')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[400px]"
          >
            <div className="bg-[hsl(var(--card))] rounded-lg shadow-2xl border border-[hsl(var(--border))]">
              {/* Header */}
              <div className="px-6 py-4 border-b border-[hsl(var(--border))]">
                <h2 className="text-lg font-semibold">New Folder</h2>
              </div>
              
              {/* Content */}
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-[hsl(var(--muted-foreground))] mb-1.5 block">
                      Name:
                    </label>
                    <input
                      type="text"
                      value={folderName}
                      onChange={(e) => setFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreate()
                        if (e.key === 'Escape') handleCancel()
                      }}
                      placeholder="New Folder"
                      className="w-full px-3 py-1.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
                      autoFocus
                    />
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-6 py-3 border-t border-[hsl(var(--border))] flex justify-end gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-1.5 text-sm bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!folderName.trim()}
                  className="px-4 py-1.5 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 rounded-md transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  OK
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
