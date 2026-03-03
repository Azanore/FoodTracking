// File purpose: Compact day header – date navigation + inline tags + collapsible notes.
// Related: TodayView.jsx renders this at the top of the page.
// Should not include: Meal management, food library.

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, StickyNote, X, Tag } from 'lucide-react';

// Format date as "Tuesday, March 3"
const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

const formatYear = (dateStr) => new Date(dateStr + 'T00:00:00').getFullYear();

/**
 * DayHeader – single compact row: ← date → | tags | notes toggle
 * Replaces the old DateNavigation + DayMeta combo.
 */
export function DayHeader({ currentDate, onDateChange, dayNotes, tags, onNotesChange, onTagAdd, onTagRemove }) {
  const [showNotes, setShowNotes]     = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const notesRef  = useRef(null);
  const tagRef    = useRef(null);
  const today     = new Date().toISOString().split('T')[0];
  const isToday   = currentDate === today;

  // Auto-focus note textarea when opened
  useEffect(() => { if (showNotes) notesRef.current?.focus(); }, [showNotes]);
  useEffect(() => { if (showTagInput) tagRef.current?.focus(); }, [showTagInput]);

  const navigate = (delta) => {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleTagKey = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const tag = e.target.value.trim();
      if (!tags.includes(tag)) onTagAdd(tag);
      e.target.value = '';
    }
    if (e.key === 'Escape') setShowTagInput(false);
  };

  return (
    <div className="mb-[var(--spacing-2xl)]">
      {/* ── Main row ── */}
      <div className="flex items-center gap-3">

        {/* Prev */}
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 hover:bg-[var(--color-hover-bg)] rounded-lg transition-colors shrink-0"
          aria-label="Previous day"
        >
          <ChevronLeft size={18} className="text-[var(--color-text-primary)]" />
        </button>

        {/* Date */}
        <div className="flex items-baseline gap-2 min-w-0">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] whitespace-nowrap">
            {formatDate(currentDate)}
          </h2>
          <span className="text-sm text-[var(--color-text-secondary)] shrink-0">{formatYear(currentDate)}</span>
          {!isToday && (
            <button
              onClick={() => onDateChange(today)}
              className="text-xs text-[var(--color-accent)] hover:underline whitespace-nowrap shrink-0"
            >
              → Today
            </button>
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => navigate(1)}
          className="p-1.5 hover:bg-[var(--color-hover-bg)] rounded-lg transition-colors shrink-0"
          aria-label="Next day"
        >
          <ChevronRight size={18} className="text-[var(--color-text-primary)]" />
        </button>

        <div className="flex-1" />

        {/* Tag pills (existing tags) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-primary)] rounded-full"
            >
              {tag}
              <button
                onClick={() => onTagRemove(tag)}
                className="hover:text-[var(--color-danger)] transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>

        {/* Add tag toggle */}
        <button
          onClick={() => setShowTagInput(v => !v)}
          title="Add day tag"
          className={`p-1.5 rounded-lg transition-colors ${showTagInput ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'hover:bg-[var(--color-hover-bg)] text-[var(--color-text-secondary)]'}`}
        >
          <Tag size={15} />
        </button>

        {/* Notes toggle */}
        <button
          onClick={() => setShowNotes(v => !v)}
          title={dayNotes ? 'Edit day notes' : 'Add day notes'}
          className={`p-1.5 rounded-lg transition-colors relative ${showNotes ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'hover:bg-[var(--color-hover-bg)] text-[var(--color-text-secondary)]'}`}
        >
          <StickyNote size={15} />
          {/* Dot indicator when notes exist */}
          {dayNotes && !showNotes && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full" />
          )}
        </button>
      </div>

      {/* ── Tag input (inline, slides in) ── */}
      {showTagInput && (
        <div className="mt-2 flex items-center gap-2">
          <input
            ref={tagRef}
            type="text"
            onKeyDown={handleTagKey}
            onBlur={() => setShowTagInput(false)}
            placeholder="Type tag + Enter to add…"
            className="flex-1 px-3 py-1.5 text-xs border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/30 outline-none bg-[var(--color-bg-secondary)] transition-all"
          />
          <button onClick={() => setShowTagInput(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Notes panel (slides in) ── */}
      {showNotes && (
        <div className="mt-2">
          <textarea
            ref={notesRef}
            value={dayNotes || ''}
            onChange={e => onNotesChange(e.target.value)}
            placeholder="Add notes about your day…"
            rows={2}
            className="w-full px-3 py-2 text-sm border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/30 outline-none resize-none bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] transition-all"
          />
        </div>
      )}
    </div>
  );
}
