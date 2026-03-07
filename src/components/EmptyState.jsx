// File purpose: Reusable empty state component with icon, message, and CTA.
// Related: Used in TodayView, FoodsView, StatsView for first-time guidance.
// Should not include: Specific business logic, data fetching.

import { ArrowRight } from 'lucide-react';

/**
 * EmptyState - reusable empty state with icon, message, and optional action
 */
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      {Icon && (
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-bg-secondary)] border-2 border-dashed border-[var(--color-border-primary)] mb-6">
          <Icon size={32} className="text-[var(--color-text-secondary)]" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-[var(--color-text-secondary)] max-w-md mb-6">
        {description}
      </p>

      {/* Action */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-all"
        >
          {actionLabel}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
