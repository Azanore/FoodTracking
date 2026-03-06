// File purpose: Modal for logging feelings/symptoms with flexible time options.
// Related: TodayView.jsx triggers this, timeline stores feeling events.
// Should not include: Meal management, food library.

import { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';

// Feeling categories with common options
const FEELING_CATEGORIES = {
  Digestive: ['bloated', 'nauseous', 'cramping', 'gassy', 'constipated', 'diarrhea', 'heartburn', 'reflux'],
  Energy: ['energetic', 'tired', 'exhausted', 'sluggish', 'alert', 'drowsy'],
  Mental: ['focused', 'foggy', 'clear-headed', 'confused', 'sharp', 'distracted'],
  Mood: ['happy', 'anxious', 'irritable', 'calm', 'stressed', 'content', 'sad'],
  Physical: ['headache', 'migraine', 'joint-pain', 'muscle-ache', 'dizzy', 'weak'],
  Sleep: ['slept-well', 'insomnia', 'restless', 'woke-up-refreshed', 'nightmares'],
};

// Time granularity options
const TIME_OPTIONS = [
  { value: 'specific', label: 'Specific time' },
  { value: 'time-of-day', label: 'Time of day' },
  { value: 'after-meal', label: 'After a meal' },
];

const TIME_OF_DAY_OPTIONS = ['morning', 'afternoon', 'evening', 'night'];

const getCurrentTime = () => {
  const n = new Date();
  return `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
};

/**
 * FeelingModal - log how you felt with flexible time tracking
 */
export function FeelingModal({ isOpen, onClose, onSave, meals = [] }) {
  const [selectedFeelings, setSelectedFeelings] = useState([]);
  const [customFeeling, setCustomFeeling] = useState('');
  const [timeGranularity, setTimeGranularity] = useState('specific');
  const [specificTime, setSpecificTime] = useState(getCurrentTime());
  const [timeOfDay, setTimeOfDay] = useState('afternoon');
  const [relatedMealId, setRelatedMealId] = useState('');
  const [severity, setSeverity] = useState(null);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const customInputRef = useRef(null);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedFeelings([]);
      setCustomFeeling('');
      setTimeGranularity('specific');
      setSpecificTime(getCurrentTime());
      setTimeOfDay('afternoon');
      setRelatedMealId('');
      setSeverity(null);
      setDuration('');
      setNotes('');
      setError('');
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const toggleFeeling = (feeling) => {
    setSelectedFeelings(prev =>
      prev.includes(feeling) ? prev.filter(f => f !== feeling) : [...prev, feeling]
    );
  };

  const handleAddCustom = () => {
    const custom = customFeeling.trim().toLowerCase();
    if (custom && !selectedFeelings.includes(custom)) {
      setSelectedFeelings([...selectedFeelings, custom]);
      setCustomFeeling('');
      customInputRef.current?.focus();
    }
  };

  const handleCustomKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  };

  const handleSave = () => {
    if (selectedFeelings.length === 0) {
      setError('Select at least one feeling.');
      return;
    }

    const feeling = {
      id: `feeling_${crypto.randomUUID().slice(0, 8)}`,
      type: 'feeling',
      timeGranularity,
      feelings: selectedFeelings,
      severity: severity || null,
      duration: duration || null,
      notes: notes.trim() || null,
    };

    // Add time-specific fields
    if (timeGranularity === 'specific') {
      feeling.time = specificTime;
    } else if (timeGranularity === 'time-of-day') {
      feeling.timeOfDay = timeOfDay;
    } else if (timeGranularity === 'after-meal') {
      feeling.relatedMealId = relatedMealId;
    }

    onSave(feeling);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full md:max-w-2xl bg-[var(--color-bg-primary)] rounded-t-2xl md:rounded-2xl shadow-2xl border-t md:border border-[var(--color-border-primary)] flex flex-col max-h-[90vh] md:max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0 border-b border-[var(--color-border-primary)]">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">How I Felt</h2>
          <button
            onClick={onClose}
            className="p-2 md:p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)] transition-colors touch-manipulation"
          >
            <X size={18} className="md:w-[17px] md:h-[17px]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 overflow-y-auto flex-1">
          <div className="space-y-5 py-4">

            {/* Feelings selection */}
            <div>
              <label className="block text-xs font-semibold mb-3 text-[var(--color-text-secondary)] uppercase tracking-wide">
                Select Feelings *
              </label>
              {Object.entries(FEELING_CATEGORIES).map(([category, feelings]) => (
                <div key={category} className="mb-4">
                  <h3 className="text-xs font-medium text-[var(--color-text-primary)] mb-2">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {feelings.map(feeling => (
                      <button
                        key={feeling}
                        type="button"
                        onClick={() => toggleFeeling(feeling)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all touch-manipulation ${selectedFeelings.includes(feeling)
                            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                            : 'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/40'
                          }`}
                      >
                        {feeling}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Custom feeling input */}
              <div className="flex gap-2 mt-3">
                <input
                  ref={customInputRef}
                  type="text"
                  value={customFeeling}
                  onChange={(e) => setCustomFeeling(e.target.value)}
                  onKeyDown={handleCustomKeyDown}
                  placeholder="Add custom feeling…"
                  className="flex-1 px-3 py-2 md:py-1.5 text-xs border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none bg-[var(--color-bg-primary)] transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddCustom}
                  className="shrink-0 p-2 text-white bg-[var(--color-accent)] hover:opacity-90 rounded-lg transition-all touch-manipulation"
                  title="Add custom"
                >
                  <Plus size={16} className="md:w-[14px] md:h-[14px]" />
                </button>
              </div>

              {/* Selected feelings display */}
              {selectedFeelings.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 p-3 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-primary)]">
                  {selectedFeelings.map(feeling => (
                    <span
                      key={feeling}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs rounded-full font-medium"
                    >
                      {feeling}
                      <button
                        type="button"
                        onClick={() => toggleFeeling(feeling)}
                        className="hover:opacity-60"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Time tracking */}
            <div>
              <label className="block text-xs font-semibold mb-2 text-[var(--color-text-secondary)] uppercase tracking-wide">
                When? *
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {TIME_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTimeGranularity(opt.value)}
                    className={`py-2 rounded-lg border text-xs font-medium transition-all touch-manipulation ${timeGranularity === opt.value
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                        : 'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/40'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Specific time */}
              {timeGranularity === 'specific' && (
                <input
                  type="time"
                  value={specificTime}
                  onChange={(e) => setSpecificTime(e.target.value)}
                  className="w-full px-3 py-2.5 md:py-2 border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none text-sm bg-[var(--color-bg-primary)] transition-all"
                />
              )}

              {/* Time of day */}
              {timeGranularity === 'time-of-day' && (
                <div className="grid grid-cols-4 gap-2">
                  {TIME_OF_DAY_OPTIONS.map(tod => (
                    <button
                      key={tod}
                      type="button"
                      onClick={() => setTimeOfDay(tod)}
                      className={`py-2 rounded-lg border text-xs font-medium capitalize transition-all touch-manipulation ${timeOfDay === tod
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                          : 'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/40'
                        }`}
                    >
                      {tod}
                    </button>
                  ))}
                </div>
              )}

              {/* After meal */}
              {timeGranularity === 'after-meal' && (
                <select
                  value={relatedMealId}
                  onChange={(e) => setRelatedMealId(e.target.value)}
                  className="w-full px-3 py-2.5 md:py-2 border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] outline-none text-sm bg-[var(--color-bg-primary)] transition-all"
                >
                  <option value="">Select meal…</option>
                  {meals.map(meal => (
                    <option key={meal.id} value={meal.id}>
                      {meal.mealType} · {meal.time}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Severity (optional) */}
            <div>
              <label className="block text-xs font-semibold mb-2 text-[var(--color-text-secondary)] uppercase tracking-wide">
                Severity <span className="normal-case font-normal opacity-70">(optional)</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSeverity(severity === level ? null : level)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all touch-manipulation ${severity === level
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                        : 'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/40'
                      }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">1 = mild, 5 = severe</p>
            </div>

            {/* Duration (optional) */}
            <div>
              <label className="block text-xs font-semibold mb-2 text-[var(--color-text-secondary)] uppercase tracking-wide">
                Duration <span className="normal-case font-normal opacity-70">(optional)</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['< 1 hour', '1-3 hours', '3-6 hours', '> 6 hours'].map(dur => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDuration(duration === dur ? '' : dur)}
                    className={`py-2 rounded-lg border text-xs font-medium transition-all touch-manipulation ${duration === dur
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                        : 'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/40'
                      }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes (optional) */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-[var(--color-text-secondary)] uppercase tracking-wide">
                Notes <span className="normal-case font-normal opacity-70">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional context…"
                rows={2}
                className="w-full px-3 py-2 border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none text-sm resize-none bg-[var(--color-bg-primary)] transition-all"
              />
            </div>

            {/* Error */}
            {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 md:py-2.5 text-sm font-medium border border-[var(--color-border-primary)] rounded-lg hover:bg-[var(--color-hover-bg)] transition-colors touch-manipulation"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-[2] py-3 md:py-2.5 text-sm font-semibold bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-all touch-manipulation"
              >
                Save Feeling
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
