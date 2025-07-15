'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Note } from '@/lib/store';
import { cn } from '@/lib/utils';

interface NoteContentEditorProps {
  note: Note | null;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
}

export function NoteContentEditor({
  note,
  onUpdateNote,
}: NoteContentEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleAutoSave = (
    field: 'title' | 'content',
    value: string
  ) => {
    if (!note) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save (debounce)
    saveTimeoutRef.current = setTimeout(() => {
      onUpdateNote(note.id, {
        [field]: value,
        updatedAt: new Date(),
      });
    }, 500);
  };

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    handleAutoSave('title', newTitle);
  };

  const handleContentChange = (
    e: React.FormEvent<HTMLDivElement>
  ) => {
    const newContent = e.currentTarget.textContent || '';
    setContent(newContent);
    handleAutoSave('content', newContent);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return dateObj.toLocaleDateString('en-US', options);
  };

  if (!note) {
    return (
      <div className="flex-1 bg-[rgb(32,32,32)] dark:bg-[rgb(32,32,32)] bg-white h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-center h-full">
          <p className="text-base text-[hsl(var(--muted-foreground))]">
            Select a note to view
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[rgb(32,32,32)] dark:bg-[rgb(32,32,32)] bg-white h-full overflow-hidden flex flex-col">
      <div className="py-[30px] px-[50px] overflow-y-auto flex-1 relative">
        {/* Timestamp */}
        <div className="absolute top-[15px] right-0 text-[13px] font-normal text-[rgba(255,255,255,0.5)] dark:text-[rgba(255,255,255,0.5)] text-[rgba(0,0,0,0.5)]">
          {formatDate(note.updatedAt)}
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="New Note"
          className={cn(
            'w-full mt-5 mb-5 p-0 border-none outline-none bg-transparent',
            'text-[28px] font-bold leading-tight',
            'text-[rgba(255,255,255,0.9)] dark:text-[rgba(255,255,255,0.9)] text-[rgba(0,0,0,0.9)]',
            'placeholder:text-[hsl(var(--muted-foreground))]',
            'focus:outline-none caret-[hsl(var(--primary))]'
          )}
        />

        {/* Content */}
        <div
          ref={contentRef}
          contentEditable
          onInput={handleContentChange}
          data-placeholder="Start typing your note..."
          suppressContentEditableWarning={true}
          className={cn(
            'min-h-[300px] outline-none',
            'text-base font-normal leading-relaxed',
            'text-[rgba(255,255,255,0.8)] dark:text-[rgba(255,255,255,0.8)] text-[rgba(0,0,0,0.8)]',
            'break-words whitespace-pre-wrap',
            'focus:outline-none caret-[hsl(var(--primary))]',
            'empty:before:content-[attr(data-placeholder)]',
            'empty:before:text-[hsl(var(--muted-foreground))] empty:before:opacity-50',
            '[&_strong]:font-semibold [&_strong]:text-[hsl(var(--foreground))]',
            '[&_em]:italic',
            '[&_a]:text-[hsl(var(--primary))] [&_a]:no-underline [&_a]:cursor-pointer [&_a:hover]:underline',
            '[&_ul]:my-4 [&_ul]:pl-8 [&_ul]:leading-relaxed [&_ul_li]:list-disc',
            '[&_ol]:my-4 [&_ol]:pl-8 [&_ol]:leading-relaxed [&_ol_li]:list-decimal',
            '[&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg',
            '[&_h1,&_h2,&_h3,&_h4,&_h5,&_h6]:text-[hsl(var(--foreground))] [&_h1,&_h2,&_h3,&_h4,&_h5,&_h6]:mt-5 [&_h1,&_h2,&_h3,&_h4,&_h5,&_h6]:mb-2 [&_h1,&_h2,&_h3,&_h4,&_h5,&_h6]:font-semibold',
            '[&_img]:max-w-full [&_img]:h-auto [&_img]:my-4 [&_img]:rounded-lg [&_img]:block',
            '[&_pre]:bg-[hsl(var(--muted))] [&_pre]:rounded-md [&_pre]:p-4 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:leading-normal',
            '[&_code]:bg-[hsl(var(--muted))] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm',
            '[&_blockquote]:border-l-[3px] [&_blockquote]:border-[hsl(var(--border))] [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:text-[hsl(var(--foreground))] [&_blockquote]:italic',
            '[&_table]:border-collapse [&_table]:my-4 [&_table]:w-full',
            '[&_th]:border [&_th]:border-[hsl(var(--border))] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:bg-[hsl(var(--muted))] [&_th]:font-semibold',
            '[&_td]:border [&_td]:border-[hsl(var(--border))] [&_td]:px-3 [&_td]:py-2 [&_td]:text-left',
            '[&_hr]:border-none [&_hr]:border-t [&_hr]:border-[hsl(var(--border))] [&_hr]:my-5',
            'selection:bg-[hsl(var(--primary)/0.3)] selection:text-[hsl(var(--foreground))]'
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
