// File purpose: Calendar picker modal for date navigation
// Related: DayHeader.jsx triggers this, TodayView.jsx uses selected date
// Should not include: Meal/feeling logging, data management

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Get all dates that have logs
const getDatesWithLogs = () => {
  const dates = new Set();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('day_')) {
      dates.add(key.replace('day_', ''));
    }
  }
  return dates;
};

// Get days in month
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Get first day of month (0 = Sunday, 6 = Saturday)
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function DatePicker({ isOpen, onClose, currentDate, onDateSelect }) {
  const [viewDate, setViewDate] = useState(new Date(currentDate));
  const [datesWithLogs, setDatesWithLogs] = useState(new Set());

  useEffect(() => {
    if (isOpen) {
      setViewDate(new Date(currentDate));
      setDatesWithLogs(getDatesWithLogs());
    }
  }, [isOpen, currentDate]);

  // ESC to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date().toISOString().split('T')[0];

  // Previous month
  const handlePrevMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
  };

  // Next month
  const handleNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
  };

  // Select date
  const handleDateClick = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateSelect(dateStr);
    onClose();
  };

  // Build calendar grid
  const calendarDays = [];

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = dateStr === today;
    const isSelected = dateStr === currentDate;
    const hasLog = datesWithLogs.has(dateStr);

    calendarDays.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={`
          aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all relative
          ${isSelected
            ? 'bg-[var(--color-accent)] text-white font-semibold'
            : isToday
              ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium'
              : 'text-[var(--color-text-primary)] hover:bg-[var(--color-hover-bg)]'
          }
        `}
      >
        {day}
        {hasLog && !isSelected && (
          <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--color-accent)]" />
        )}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Calendar */}
      <div className="relative w-full max-w-sm bg-[var(--color-bg-primary)] rounded-2xl shadow-2xl border border-[var(--color-border-primary)] p-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg hover:bg-[var(--color-hover-bg)] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button
              onClick={() => {
                const todayDate = new Date().toISOString().split('T')[0];
                onDateSelect(todayDate);
                onClose();
              }}
              className="px-2 py-1 text-xs font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 rounded transition-colors"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-[var(--color-hover-bg)] transition-colors"
            >
              <ChevronRight size={20} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--color-hover-bg)] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_NAMES.map(day => (
            <div key={day} className="text-center text-xs font-medium text-[var(--color-text-secondary)] py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-[var(--color-border-primary)]">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
            <span>Has logs</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <div className="w-6 h-6 rounded bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] font-medium">
              {new Date().getDate()}
            </div>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
