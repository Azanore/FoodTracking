// File purpose: Compact modal for creating/editing a meal's metadata (type, time, tags, notes).
// Related: TodayView.jsx triggers this. Consistent with LogItemModal visual style.
// Should not include: Food/drink logging, database operations.

import { useState, useEffect, useRef } from 'react';
import { X, Sun, Coffee, Moon, Cookie } from 'lucide-react';

const MEAL_TYPES = [
  { value: 'Breakfast', icon: Sun    },
  { value: 'Lunch',     icon: Coffee },
  { value: 'Dinner',    icon: Moon   },
  { value: 'Snack',     icon: Cookie },
];

const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

const suggestMealType = (time) => {
  const [h] = time.split(':').map(Number);
  if (h >= 5  && h < 11) return 'Breakfast';
  if (h >= 11 && h < 16) return 'Lunch';
  if (h >= 16 && h < 22) return 'Dinner';
  return 'Snack';
};

/**
 * MealForm – compact modal matching LogItemModal's visual style.
 * Tags: simple "type + Enter" pill input (no nested modals).
 * Notes: single compact textarea.
 *
 * @param {Object|null} props.meal   – Meal to edit; null = new meal
 * @param {Function}    props.onSave
 * @param {Function}    props.onCancel
 */
export function MealForm({ meal, onSave, onCancel }) {
  const isEditing = !!meal;

  const [mealType, setMealType] = useState(meal?.type || '');
  const [time, setTime]         = useState(meal?.time || getCurrentTime());
  const [tags, setTags]         = useState(meal?.tags || []);
  const [notes, setNotes]       = useState(meal?.notes || '');
  const [error, setError]       = useState('');
  const tagInputRef = useRef(null);

  // Auto-suggest type on mount for new meals
  useEffect(() => {
    if (!isEditing && !mealType) setMealType(suggestMealType(time));
  }, []);

  // Update suggestion when time changes (new meals only)
  const handleTimeChange = (e) => {
    const t = e.target.value;
    setTime(t);
    if (!isEditing) setMealType(suggestMealType(t));
  };

  // Tag input: Enter adds, Backspace removes last if input empty
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (!tags.includes(tag)) setTags([...tags, tag]);
      e.target.value = '';
    }
    if (e.key === 'Backspace' && !e.target.value && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
    if (e.key === 'Escape') onCancel();
  };

  const removeTag = (tag) => setTags(tags.filter(t => t !== tag));

  const handleSubmit = () => {
    if (!mealType) { setError('Please select a meal type.'); return; }
    if (!time)     { setError('Please set a time.'); return; }
    setError('');

    onSave({
      id:     meal?.id || `meal_${crypto.randomUUID().slice(0, 8)}`,
      type:   mealType,
      time,
      tags,
      notes:  notes.trim() || null,
      foods:  meal?.foods  || [],
      drinks: meal?.drinks || [],
    });
  };

  // Escape to cancel
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      {/* Panel */}
      <div className="relative w-full sm:max-w-md bg-[var(--color-bg-primary)] rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[var(--color-border-primary)] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
            {isEditing ? 'Edit Meal' : 'Add Custom Meal'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)] transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-5 pb-5 space-y-5">

          {/* ── Meal type picker ── */}
          <div>
            <label className="block text-xs font-semibold mb-2 text-[var(--color-text-secondary)] uppercase tracking-wide">
              Meal Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {MEAL_TYPES.map(({ value, icon: Icon }) => {
                const active = mealType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMealType(value)}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      active
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                        : 'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-hover-bg)]'
                    }`}
                  >
                    <Icon size={16} />
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Time ── */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-[var(--color-text-secondary)] uppercase tracking-wide">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="w-full px-3 py-2 border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none text-sm bg-[var(--color-bg-primary)] transition-all"
            />
          </div>

          {/* ── Tags ── */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-[var(--color-text-secondary)] uppercase tracking-wide">
              Tags <span className="normal-case font-normal opacity-70">(optional)</span>
            </label>
            {/* Tag pill display + input inline */}
            <div
              className="flex flex-wrap gap-1.5 px-3 py-2 border border-[var(--color-border-primary)] rounded-lg focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[var(--color-accent)]/20 transition-all min-h-[40px] cursor-text"
              onClick={() => tagInputRef.current?.focus()}
            >
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs rounded-full font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); removeTag(tag); }}
                    className="hover:opacity-60 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              <input
                ref={tagInputRef}
                type="text"
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? 'Type tag + Enter…' : ''}
                className="flex-1 min-w-[80px] text-xs outline-none bg-transparent text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]"
              />
            </div>
          </div>

          {/* ── Notes ── */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-[var(--color-text-secondary)] uppercase tracking-wide">
              Notes <span className="normal-case font-normal opacity-70">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any notes about this meal…"
              rows={2}
              className="w-full px-3 py-2 border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none text-sm resize-none bg-[var(--color-bg-primary)] transition-all"
            />
          </div>

          {/* ── Error ── */}
          {error && (
            <p className="text-xs text-[var(--color-danger)] -mt-2">{error}</p>
          )}

          {/* ── Actions ── */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 text-sm font-medium border border-[var(--color-border-primary)] rounded-lg hover:bg-[var(--color-hover-bg)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-[2] py-2.5 text-sm font-semibold bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-all"
            >
              {isEditing ? 'Save Changes' : 'Create Meal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
