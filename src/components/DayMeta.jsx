// File purpose: Day notes input and tags display with badges
// Related: TodayView.jsx uses this for daily metadata
// Should not include: Meal management, food library

import { X } from 'lucide-react';

export function DayMeta({ dayNotes, tags, onNotesChange, onTagAdd, onTagRemove }) {
  // Handle tag input on Enter key
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!tags.includes(newTag)) {
        onTagAdd(newTag);
      }
      e.target.value = '';
    }
  };

  return (
    <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-[var(--radius-lg)] p-[var(--spacing-lg)] mb-[var(--spacing-2xl)]">
      {/* Day Notes */}
      <div className="mb-[var(--spacing-lg)]">
        <label className="block text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)] mb-[var(--spacing-sm)]">
          Day Notes
        </label>
        <textarea
          value={dayNotes || ''}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add notes about your day..."
          className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[var(--font-size-sm)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] resize-none transition-colors duration-[var(--transition-fast)]"
          rows={3}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)] mb-[var(--spacing-sm)]">
          Tags
        </label>
        
        {/* Tag badges */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-[var(--spacing-sm)] mb-[var(--spacing-sm)]">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] bg-[var(--color-bg-secondary)] text-[var(--font-size-xs)] text-[var(--color-text-primary)] rounded-[var(--radius-md)]"
              >
                {tag}
                <button
                  onClick={() => onTagRemove(tag)}
                  className="hover:text-[var(--color-accent)] transition-colors duration-[var(--transition-fast)] cursor-pointer"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Tag input */}
        <input
          type="text"
          onKeyDown={handleTagKeyDown}
          placeholder="Type a tag and press Enter..."
          className="w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[var(--font-size-sm)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] transition-colors duration-[var(--transition-fast)]"
        />
      </div>
    </div>
  );
}
