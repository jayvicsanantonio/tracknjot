'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useNotesStore } from '@/lib/store';
import { Folder, List, Grid2X2, Trash2 } from 'lucide-react';

type ViewMode = 'list' | 'grid';

interface GlobalToolbarProps {
  onToggleSidebar?: () => void;
  onViewModeChange?: (mode: ViewMode) => void;
  onDeleteNote?: () => void;
}

export function GlobalToolbar({
  onToggleSidebar,
  onViewModeChange,
  onDeleteNote,
}: GlobalToolbarProps) {
  const { selectedNoteId, sidebarCollapsed, setSidebarCollapsed } =
    useNotesStore();
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    onViewModeChange?.(mode);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    onToggleSidebar?.();
  };

  const iconButtonClass = (isActive = false, isDisabled = false) =>
    cn(
      'p-1.5 rounded transition-all duration-150',
      'hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.1)]',
      isActive && 'text-[rgba(255,204,0,1)] bg-[rgba(255,204,0,0.1)]',
      !isActive &&
        !isDisabled &&
        'text-[rgba(0,0,0,0.7)] dark:text-[rgba(255,255,255,0.7)]',
      isDisabled &&
        'text-[rgba(0,0,0,0.3)] dark:text-[rgba(255,255,255,0.3)] cursor-not-allowed'
    );

  // Calculate sidebar width based on collapsed state
  const sidebarWidth = sidebarCollapsed ? 28 : 256;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-9 bg-[rgba(240,240,240,1)] dark:bg-[rgba(50,50,50,1)] border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(0,0,0,0.2)]">
      <div className="relative h-full flex items-center">
        {/* Left Section - Window Controls & App View Toggle */}
        <div className="absolute left-0 flex items-center px-2.5">
          {/* Sidebar Toggle */}
          <button
            onClick={handleToggleSidebar}
            className="p-1.5 rounded hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.1)] transition-all"
            title="Toggle sidebar"
          >
            <Folder className="w-5 h-5 text-[rgba(100,100,100,1)] dark:text-[rgba(100,100,100,1)]" />
          </button>
        </div>

        {/* Middle Section - Second Column Context - Always aligned with notes list */}
        <div
          className="absolute flex items-center px-4 transition-all duration-200"
          style={{
            left: `${sidebarWidth}px`,
            width: '280px',
          }}
        >
          <div className="flex justify-between w-full">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-3.5">
              <button
                onClick={() => handleViewModeChange('list')}
                className={iconButtonClass(viewMode === 'list')}
                title="List view"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleViewModeChange('grid')}
                className={iconButtonClass(viewMode === 'grid')}
                title="Grid view"
              >
                <Grid2X2 className="w-5 h-5" />
              </button>
            </div>

            {/* <div className="w-px h-5 bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]" /> */}

            {/* Note Actions */}
            <div className="flex items-center space-x-3.5">
              <button
                onClick={onDeleteNote}
                className={iconButtonClass(false, !selectedNoteId)}
                disabled={!selectedNoteId}
                title="Delete note"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
