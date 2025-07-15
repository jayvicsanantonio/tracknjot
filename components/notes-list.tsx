'use client';

import { useMemo } from 'react';
import {
  format,
  isToday,
  isYesterday,
  differenceInDays,
  startOfDay,
} from 'date-fns';
import { Pin } from 'lucide-react';
import { useNotesStore, Note } from '@/lib/store';
import { cn } from '@/lib/utils';

export function NotesList() {
  const {
    selectedNoteId,
    selectedFolderId,
    selectNote,
    getFilteredNotes,
    folders,
  } = useNotesStore();

  const filteredNotes = getFilteredNotes();
  const selectedFolder = folders.find(
    (f) => f.id === selectedFolderId
  );

  // Get notes grouped by their timestamps
  const groupedNotes = useMemo(() => {
    const pinnedNotes = filteredNotes.filter((note) => note.isPinned);
    const otherNotes = filteredNotes.filter((note) => !note.isPinned);

    const today = startOfDay(new Date());

    const groups = {
      pinned: { label: 'Pinned', notes: pinnedNotes },
      today: { label: 'Today', notes: [] },
      pastWeek: { label: 'Previous 7 Days', notes: [] },
      pastMonth: { label: 'Previous 30 Days', notes: [] },
    };

    otherNotes.forEach((note) => {
      const noteDate = startOfDay(new Date(note.updatedAt));
      if (isToday(noteDate)) {
        groups.today.notes.push(note);
      } else if (differenceInDays(today, noteDate) <= 7) {
        groups.pastWeek.notes.push(note);
      } else if (differenceInDays(today, noteDate) <= 30) {
        groups.pastMonth.notes.push(note);
      }
    });

    return groups;
  }, [filteredNotes]);

  return (
    <div className="h-full flex flex-col bg-[rgba(245, 245, 245, 1)] border-r border-[hsl(var(--sidebar-border))] w-[280px] flex-shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[hsl(var(--sidebar-border))]">
        <h2 className="text-lg font-semibold text-[rgba(0, 0, 0, 0.9)]">
          {selectedFolder?.name || 'All Notes'}
        </h2>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto scrollbar">
        {Object.entries(groupedNotes).map(([key, group]) =>
          group.notes.length > 0 ? (
            <div key={key} className="px-4">
              <div className="pt-3 pb-1">
                <h3 className="text-[14px] font-medium text-[rgba(0, 0, 0, 0.5)]">
                  {group.label}
                </h3>
                <div className="border-b border-[rgba(0, 0, 0, 0.1)] my-1"></div>
              </div>
              {group.notes.map((note: Note) => (
                <div
                  key={note.id}
                  onClick={() => selectNote(note.id)}
                  className={cn(
                    'min-h-[64px] my-2 px-3 py-2 cursor-pointer transition-colors rounded',
                    selectedNoteId === note.id
                      ? 'bg-[rgba(255, 204, 0, 1)] text-black'
                      : 'hover:bg-[rgba(0, 0, 0, 0.05)]'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[16px] text-[rgba(0, 0, 0, 0.9)] line-clamp-1">
                      {note.title || 'Untitled Note'}
                    </h3>
                    {note.isPinned && (
                      <Pin className="w-4 h-4 text-[rgba(0, 0, 0, 0.5)]" />
                    )}
                  </div>
                  <p className="text-[13px] text-[rgba(0, 0, 0, 0.7)] line-clamp-2">
                    {note.content || 'No additional text'}
                  </p>
                  <p className="text-[13px] text-[rgba(0, 0, 0, 0.6)]">
                    {isToday(new Date(note.updatedAt))
                      ? 'Today'
                      : isYesterday(new Date(note.updatedAt))
                      ? 'Yesterday'
                      : format(new Date(note.updatedAt), 'MM/dd/yy')}
                  </p>
                </div>
              ))}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
