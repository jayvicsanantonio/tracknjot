'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Edit2, Trash2, GripVertical } from 'lucide-react'
import { useNotesStore, Folder } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FolderItemProps {
  folder: Folder
  level?: number
  onDragStart: (e: React.DragEvent, folder: Folder) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, targetFolder: Folder) => void
  isDragging?: boolean
  dragOverId?: string | null
}

export function FolderItem({ 
  folder, 
  level = 0, 
  onDragStart, 
  onDragOver, 
  onDrop,
  isDragging,
  dragOverId
}: FolderItemProps) {
  const {
    folders,
    selectedFolderId,
    deleteFolder,
    renameFolder,
    selectFolder,
    toggleFolder,
    moveFolder,
  } = useNotesStore()

  const [hoveredFolderId, setHoveredFolderId] = useState<string | null>(null)
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editingFolderName, setEditingFolderName] = useState('')

  const hasSubfolders = folders.some(f => f.parentId === folder.id)
  const subfolders = folders.filter(f => f.parentId === folder.id)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDragOver(e)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDrop(e, folder)
  }

  return (
    <>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, folder)}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => {
          selectFolder(folder.id)
          if (hasSubfolders) {
            toggleFolder(folder.id)
          }
        }}
        onMouseEnter={() => setHoveredFolderId(folder.id)}
        onMouseLeave={() => setHoveredFolderId(null)}
        className={cn(
          'folder-item group cursor-move',
          selectedFolderId === folder.id && 'bg-[hsl(var(--note-hover))]',
          isDragging && 'opacity-50',
          dragOverId === folder.id && 'bg-[hsl(var(--primary))]/10 border-[hsl(var(--primary))]'
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {hoveredFolderId === folder.id && (
          <GripVertical className="w-3 h-3 text-[hsl(var(--muted-foreground))] opacity-50 absolute left-0" />
        )}
        
        {hasSubfolders ? (
          <ChevronRight
            className={cn(
              'folder-arrow',
              folder.isExpanded && 'folder-arrow-open'
            )}
          />
        ) : (
          <div className="w-3" />
        )}
        
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
        
        {hoveredFolderId === folder.id && folder.id !== 'notes' && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
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
          </div>
        )}
      </div>

      {/* Nested Folders */}
      {folder.isExpanded && hasSubfolders && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {subfolders.map((subfolder) => (
            <FolderItem
              key={subfolder.id}
              folder={subfolder}
              level={level + 1}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              isDragging={isDragging}
              dragOverId={dragOverId}
            />
          ))}
        </motion.div>
      )}
    </>
  )
}
