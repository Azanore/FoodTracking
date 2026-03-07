// File purpose: Day header with date navigation and tags.
// Related: TodayView.jsx renders this at the top of the page.
// Should not include: Meal management, food library.

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Tag, Plus, Calendar } from 'lucide-react';
import { DatePicker } from './DatePicker';

// Format date as "Tuesday, March 3"
const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

const formatYear = (dateStr) => new Date(dateStr + 'T00:00:00').getFullYear();

// DayHeader – date navigation + day-level tags
export function DayHeader({ currentDate, onDateChange, tags, onTagAdd, onTagRemove }) {
  const [showTagInput, setShowTagInput] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const tagRef = useRef(null);
  const today = new Date().toISOString().split('T')[0];
  const isToday = currentDate === today;

  useEffect(() => { if (showTagInput) tagRef.current?.focus(); }, [showTagInput]);

  const navigate = (delta) => {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const [tagInput, setTagInput] = useState('');

  const handleTagKey = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim();
      if (!tags.includes(tag)) onTagAdd(tag);
      setTagInput('');
    }
    if (e.key === 'Escape') setShowTagInput(false);
  };

  const handleTagAdd = () => {
    if (tagInput.trim()) {
      const tag = tagInput.trim();
      if (!tags.includes(tag)) onTagAdd(tag);
      setTagInput('');
      tagRef.current?.focus();
    }
  };

  return (
    <div className="mb-5 md:mb-6">
      {/* ── Main row ── */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Prev */}
        <button
          onClick={() => navigate(-1)}
          className="p-2 md:p-1.5 hover:bg-[var(--color-hover-bg)] rounded-lg transition-colors shrink-0 touch-manipulation"
          aria-label="Previous day"
        >
          <ChevronLeft size={20} className="text-[var(--color-text-primary)] md:w-[18px] md:h-[18px]" />
        </button>

        {/* Date */}
        <button
          onClick={() => setShowDatePicker(true)}
          className="flex flex-col md:flex-row md:items-baseline gap-0 md:gap-2 min-w-0 flex-1 text-left hover:opacity-80 transition-opacity"
        >
          <h1 className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] leading-tight">
            {formatDate(currentDate)}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm text-[var(--color-text-secondary)]">{formatYear(currentDate)}</span>
            {!isToday && (
              <span
                onClick={(e) => { e.stopPropagation(); onDateChange(today); }}
                className="text-xs text-[var(--color-accent)] hover:underline whitespace-nowrap"
              >
                → Today
              </span>
            )}
          </div>
        </button>

        {/* Next */}
        <button
          onClick={() => navigate(1)}
          className="p-2 md:p-1.5 hover:bg-[var(--color-hover-bg)] rounded-lg transition-colors shrink-0 touch-manipulation"
          aria-label="Next day"
        >
          <ChevronRight size={20} className="text-[var(--color-text-primary)] md:w-[18px] md:h-[18px]" />
        </button>

        {/* Add tag toggle */}
        <button
          onClick={() => setShowTagInput(v => !v)}
          title="Add day tag"
          className={`p-2 md:p-1.5 rounded-lg transition-colors shrink-0 touch-manipulation ${showTagInput ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'hover:bg-[var(--color-hover-bg)] text-[var(--color-text-secondary)]'}`}
        >
          <Tag size={16} className="md:w-[15px] md:h-[15px]" />
        </button>
      </div>

      {/* Tag pills row (mobile: below date, desktop: inline would be too cramped) */}
      {tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mt-2 md:mt-3">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 md:py-0.5 text-xs bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-primary)] rounded-full"
            >
              {tag}
              <button
                onClick={() => onTagRemove(tag)}
                className="hover:text-[var(--color-danger)] transition-colors touch-manipulation"
                aria-label={`Remove ${tag}`}
              >
                <X size={11} className="md:w-[10px] md:h-[10px]" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* ── Tag input (inline, slides in) ── */}
      {showTagInput && (
        <div className="mt-2 flex items-center gap-2">
          <input
            ref={tagRef}
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKey}
            placeholder="Add tag…"
            className="flex-1 px-3 py-2 md:py-1.5 text-xs border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none bg-[var(--color-bg-secondary)] transition-all"
          />
          <button
            onClick={handleTagAdd}
            className="p-2 md:p-1.5 text-white bg-[var(--color-accent)] hover:opacity-90 rounded-lg transition-all touch-manipulation"
            title="Add tag"
          >
            <Plus size={16} className="md:w-[14px] md:h-[14px]" />
          </button>
          <button
            onClick={() => { setShowTagInput(false); setTagInput(''); }}
            className="p-2 md:p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-hover-bg)] rounded-lg transition-all touch-manipulation"
            title="Cancel"
          >
            <X size={16} className="md:w-[14px] md:h-[14px]" />
          </button>
        </div>
      )}

      {/* Date Picker Modal */}
      <DatePicker
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        currentDate={currentDate}
        onDateSelect={onDateChange}
      />
    </div>
  );
}
