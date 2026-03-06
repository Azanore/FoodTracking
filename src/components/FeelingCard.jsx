// File purpose: Display a feeling event from the timeline.
// Related: TodayView.jsx renders this alongside MealCard.
// Should not include: Meal management, food library.

import { useState } from 'react';
import { Heart, Trash2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

// Format time display based on granularity
const formatTime = (feeling) => {
  if (feeling.timeGranularity === 'specific' && feeling.time) {
    return feeling.time;
  }
  if (feeling.timeGranularity === 'time-of-day' && feeling.timeOfDay) {
    return feeling.timeOfDay;
  }
  if (feeling.timeGranularity === 'after-meal') {
    return 'after meal';
  }
  return 'unspecified';
};

/**
 * FeelingCard - displays a feeling event from timeline
 */
export function FeelingCard({ feeling, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const timeDisplay = formatTime(feeling);
  const primaryFeelings = feeling.feelings.slice(0, 3).join(', ');
  const hasMore = feeling.feelings.length > 3;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete(feeling.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] hover:border-[var(--color-accent)] transition-colors overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2 p-[var(--spacing-card-padding)]">

        {/* Icon + summary */}
        <button
          className="flex items-center gap-2 flex-1 min-w-0 text-left touch-manipulation"
          onClick={() => setIsExpanded(v => !v)}
        >
          <span className="text-[var(--color-accent)] shrink-0">
            <Heart size={16} className="md:w-[14px] md:h-[14px]" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 leading-none mb-1 md:mb-0.5">
              <span className="text-sm md:text-sm font-semibold text-[var(--color-text-primary)]">Feeling</span>
              <span className="text-xs text-[var(--color-text-secondary)] capitalize">{timeDisplay}</span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] truncate leading-snug">
              {primaryFeelings}{hasMore && '…'}
              {feeling.severity && <span className="ml-1 opacity-60">(severity: {feeling.severity})</span>}
            </p>
          </div>
          <span className="text-[var(--color-text-secondary)] shrink-0 ml-1">
            {isExpanded ? <ChevronUp size={15} className="md:w-[13px] md:h-[13px]" /> : <ChevronDown size={15} className="md:w-[13px] md:h-[13px]" />}
          </span>
        </button>

        {/* Delete */}
        <button
          onClick={handleDeleteClick}
          onBlur={() => setConfirmDelete(false)}
          className={`shrink-0 flex items-center gap-0.5 px-2 md:px-1.5 py-1.5 md:py-1 rounded transition-colors text-xs font-medium touch-manipulation ${confirmDelete
              ? 'bg-[var(--color-danger)] text-white'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-hover-bg)]'
            }`}
          title={confirmDelete ? 'Click again to confirm delete' : 'Delete feeling'}
        >
          {confirmDelete ? (
            <><AlertCircle size={15} className="md:w-[13px] md:h-[13px]" /> <span className="hidden md:inline">Delete?</span></>
          ) : (
            <Trash2 size={15} className="md:w-[13px] md:h-[13px]" />
          )}
        </button>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-[var(--spacing-card-padding)] py-2 border-t border-[var(--color-border-primary)]">

          {/* All feelings */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {feeling.feelings.map((f, i) => (
              <span key={i} className="px-2 py-0.5 text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-full font-medium">
                {f}
              </span>
            ))}
          </div>

          {/* Details */}
          <div className="space-y-1 text-xs text-[var(--color-text-secondary)]">
            {feeling.severity && (
              <p>Severity: {feeling.severity}/5</p>
            )}
            {feeling.duration && (
              <p>Duration: {feeling.duration}</p>
            )}
            {feeling.notes && (
              <p className="italic mt-2">{feeling.notes}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
