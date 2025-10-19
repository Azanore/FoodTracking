// File purpose: Date navigation with arrows and date display
// Related: TodayView.jsx uses this for date selection
// Should not include: Data fetching, meal management

import { ChevronLeft, ChevronRight } from 'lucide-react';

// Format date as "Day, Month DD, YYYY"
const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export function DateNavigation({ currentDate, onDateChange }) {
  // Navigate to previous day
  const handlePrevious = () => {
    const date = new Date(currentDate + 'T00:00:00');
    date.setDate(date.getDate() - 1);
    onDateChange(date.toISOString().split('T')[0]);
  };

  // Navigate to next day
  const handleNext = () => {
    const date = new Date(currentDate + 'T00:00:00');
    date.setDate(date.getDate() + 1);
    onDateChange(date.toISOString().split('T')[0]);
  };

  // Navigate to today
  const handleToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onDateChange(today);
  };

  const isToday = currentDate === new Date().toISOString().split('T')[0];

  return (
    <div className="flex items-center justify-between mb-[var(--spacing-2xl)]">
      <button
        onClick={handlePrevious}
        className="p-[var(--spacing-sm)] hover:bg-[var(--color-hover-bg)] rounded-[var(--radius-md)] transition-colors duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] cursor-pointer"
        aria-label="Previous day"
      >
        <ChevronLeft size={20} className="text-[var(--color-text-primary)]" />
      </button>

      <div className="flex flex-col items-center gap-[var(--spacing-xs)]">
        <h2 className="text-[var(--font-size-xl)] font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]">
          {formatDate(currentDate)}
        </h2>
        {!isToday && (
          <button
            onClick={handleToday}
            className="text-[var(--font-size-xs)] text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] rounded-[var(--radius-sm)] px-[var(--spacing-xs)] transition-colors duration-[var(--transition-fast)] cursor-pointer"
          >
            Go to today
          </button>
        )}
      </div>

      <button
        onClick={handleNext}
        className="p-[var(--spacing-sm)] hover:bg-[var(--color-hover-bg)] rounded-[var(--radius-md)] transition-colors duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] cursor-pointer"
        aria-label="Next day"
      >
        <ChevronRight size={20} className="text-[var(--color-text-primary)]" />
      </button>
    </div>
  );
}
