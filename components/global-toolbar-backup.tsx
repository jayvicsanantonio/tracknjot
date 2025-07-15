'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useNotesStore } from '@/lib/store';
import {
  Folder,
  List,
  Grid2X2,
  Trash2,
  Share,
  Type,
  ListOrdered,
  Table,
  Image,
  Paperclip,
  CheckSquare,
  Pencil,
  Info,
  Lock,
  LockOpen,
  Search,
  Bold,
  Italic,
  Underline,
} from 'lucide-react';

type ViewMode = 'list' | 'grid';
type ActiveTool =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'list'
  | 'table'
  | 'image'
  | 'attachment'
  | 'checklist'
  | 'pen'
  | null;

interface GlobalToolbarProps {
  onToggleSidebar?: () => void;
  onViewModeChange?: (mode: ViewMode) => void;
  onDeleteNote?: () => void;
  onShareNote?: () => void;
  onFormatText?: (format: string) => void;
  onShowInfo?: () => void;
  onToggleLock?: () => void;
  onOpenSearch?: () => void;
}

export function GlobalToolbar({
  onToggleSidebar,
  onViewModeChange,
  onDeleteNote,
  onShareNote,
  onFormatText,
  onShowInfo,
  onToggleLock,
  onOpenSearch,
}: GlobalToolbarProps) {
  const { selectedNoteId, sidebarCollapsed, setSidebarCollapsed } =
    useNotesStore();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isLocked, setIsLocked] = useState(false);
  const [activeTools, setActiveTools] = useState<Set<ActiveTool>>(
    new Set()
  );
  const [showFontOptions, setShowFontOptions] = useState(false);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    onViewModeChange?.(mode);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    onToggleSidebar?.();
  };

  const handleToggleLock = () => {
    setIsLocked(!isLocked);
    onToggleLock?.();
  };

  const toggleTool = (tool: ActiveTool) => {
    const newActiveTools = new Set(activeTools);
    if (newActiveTools.has(tool)) {
      newActiveTools.delete(tool);
    } else {
      newActiveTools.add(tool);
    }
    setActiveTools(newActiveTools);
    if (tool && onFormatText) {
      onFormatText(tool);
    }
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
  const sidebarWidth = sidebarCollapsed ? -130 : 256;

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
            left: `${sidebarWidth + 170}px`,
            width: '280px',
          }}
        >
          <div className="flex items-center space-x-3.5">
            {/* View Mode Toggle */}
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

            {/* <div className="w-px h-5 bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]" /> */}

            {/* Note Actions */}
            <button
              onClick={onDeleteNote}
              className={iconButtonClass(false, !selectedNoteId)}
              disabled={!selectedNoteId}
              title="Delete note"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onShareNote}
              className={iconButtonClass(false, !selectedNoteId)}
              disabled={!selectedNoteId}
              title="Share note"
            >
              <Share className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Section - Editor Tools & Global Actions */}
        <div
          className="absolute right-2.5 flex items-center space-x-3.5"
          style={{
            left: `${sidebarWidth + 280}px`,
            right: '10px',
          }}
        >
          <div className="flex items-center justify-end space-x-3.5">
            {/* Rich Text Formatting Tools */}
            <div className="relative">
              <button
                onClick={() => setShowFontOptions(!showFontOptions)}
                className={iconButtonClass(
                  showFontOptions,
                  !selectedNoteId
                )}
                disabled={!selectedNoteId}
                title="Text formatting"
              >
                <Type className="w-5 h-5" />
              </button>

              {/* Font Options Dropdown */}
              {showFontOptions && (
                <div className="absolute top-9 right-0 bg-white dark:bg-[rgba(60,60,60,1)] rounded-md shadow-lg p-2 flex items-center space-x-2 border border-[rgba(0,0,0,0.1)] dark:border-transparent">
                  <button
                    onClick={() => toggleTool('bold')}
                    className={iconButtonClass(
                      activeTools.has('bold')
                    )}
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleTool('italic')}
                    className={iconButtonClass(
                      activeTools.has('italic')
                    )}
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleTool('underline')}
                    className={iconButtonClass(
                      activeTools.has('underline')
                    )}
                    title="Underline"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => toggleTool('list')}
              className={iconButtonClass(
                activeTools.has('list'),
                !selectedNoteId
              )}
              disabled={!selectedNoteId}
              title="Bullet list"
            >
              <ListOrdered className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleTool('table')}
              className={iconButtonClass(
                activeTools.has('table'),
                !selectedNoteId
              )}
              disabled={!selectedNoteId}
              title="Insert table"
            >
              <Table className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleTool('image')}
              className={iconButtonClass(
                activeTools.has('image'),
                !selectedNoteId
              )}
              disabled={!selectedNoteId}
              title="Insert image"
            >
              <Image className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleTool('attachment')}
              className={iconButtonClass(
                activeTools.has('attachment'),
                !selectedNoteId
              )}
              disabled={!selectedNoteId}
              title="Add attachment"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleTool('checklist')}
              className={iconButtonClass(
                activeTools.has('checklist'),
                !selectedNoteId
              )}
              disabled={!selectedNoteId}
              title="Checklist"
            >
              <CheckSquare className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleTool('pen')}
              className={iconButtonClass(
                activeTools.has('pen'),
                !selectedNoteId
              )}
              disabled={!selectedNoteId}
              title="Drawing"
            >
              <Pencil className="w-5 h-5" />
            </button>

            <div className="w-px h-5 bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]" />

            {/* Global Actions */}
            <button
              onClick={onShowInfo}
              className={iconButtonClass(false, !selectedNoteId)}
              disabled={!selectedNoteId}
              title="Note info"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              onClick={handleToggleLock}
              className={iconButtonClass(isLocked, !selectedNoteId)}
              disabled={!selectedNoteId}
              title={isLocked ? 'Unlock note' : 'Lock note'}
            >
              {isLocked ? (
                <Lock className="w-5 h-5" />
              ) : (
                <LockOpen className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onOpenSearch}
              className={iconButtonClass()}
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
