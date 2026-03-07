// File purpose: Modal for logging a single feeling with search-first UI.
// Related: TodayView.jsx triggers this, timeline stores feeling events.
// Should not include: Meal management, food library.

import { useState, useEffect, useRef } from 'react';
import { X, Search, ChevronDown, ChevronUp } from 'lucide-react';

// Feeling categories with common options
const FEELING_CATEGORIES = {
  Digestive: ['bloated', 'nauseous', 'cramping', 'gassy', 'constipated', 'diarrhea', 'heartburn', 'reflux'],
  Energy: ['energetic', 'tired', 'exhausted', 'sluggish', 'alert', 'drowsy'],
  Mental: ['focused', 'foggy', 'clear-headed', 'confused', 'sharp', 'distracted'],
  Mood: ['happy', 'anxious', 'irritable', 'calm', 'stressed', 'content', 'sad'],
  Physical: ['headache', 'migraine', 'joint-pain', 'muscle-ache', 'dizzy', 'weak'],
  Sleep: ['slept-well', 'insomnia', 'restless', 'woke-up-refreshed', 'nightmares'],
};

// Flatten all feelings for search
const ALL_FEELINGS = Object.values(FEELING_CATEGORIES).flat();

// Time granularity options
const TIME_OPTIONS = [
  { value: 'specific', label: 'Specific time' },
  { value: 'time-of-day', label: 'Time of day' },
  { value: 'after-meal', label: 'After a meal' },
];

const TIME_OF_DAY_OPTIONS = ['morning', 'afternoon', 'evening', 'night'];

// Map time-of-day to approximate times for sorting
const TIME_OF_DAY_MAP = {
  morning: '09:00',
  afternoon: '14:00',
  evening: '18:00',
  night: '21:00',
};

const getCurrentTime = () => {
  const n = new Date();
  return `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
};

// Get custom feelings from localStorage
const getCustomFeelings = () => {
  try {
    const stored = localStorage.getItem('custom_feelings');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save custom feeling to localStorage
const saveCustomFeeling = (feeling) => {
  try {
    const customs = getCustomFeelings();
    if (!customs.includes(feeling) && !ALL_FEELINGS.includes(feeling)) {
      customs.push(feeling);
      localStorage.setItem('custom_feelings', JSON.stringify(customs));
    }
  } catch (e) {
    console.error('Failed to save custom feeling:', e);
  }
};

/**
 * FeelingModal - log a single feeling with search-first UI
 */
export function FeelingModal({ isOpen, onClose, onSave, meals = [], recentFeelings = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [timeGranularity, setTimeGranularity] = useState('specific');
  const [specificTime, setSpecificTime] = useState(getCurrentTime());
  const [timeOfDay, setTimeOfDay] = useState('afternoon');
  const [relatedMealId, setRelatedMealId] = useState('');
  const [severity, setSeverity] = useState(null);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const searchRef = useRef(null);
  const [customFeelings, setCustomFeelings] = useState([]);

  // Load custom feelings
  useEffect(() => {
    setCustomFeelings(getCustomFeelings());
  }, []);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedFeeling('');
      setExpandedCategories({});
      setTimeGranularity('specific');
      setSpecificTime(getCurrentTime());
      setTimeOfDay('afternoon');
      setRelatedMealId('');
      setSeverity(null);
      setDuration('');
      setNotes('');
      setError('');
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Filter feelings by search
  const filteredFeelings = searchQuery.trim()
    ? [...ALL_FEELINGS, ...customFeelings].filter(f =>
      f.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const selectFeeling = (feeling) => {
    setSelectedFeeling(feeling);
    setSearchQuery('');

    // Save as custom if not in predefined list
    if (!ALL_FEELINGS.includes(feeling)) {
      saveCustomFeeling(feeling);
      setCustomFeelings(getCustomFeelings());
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      const custom = searchQuery.trim().toLowerCase();
      selectFeeling(custom);
    }
  };

  const handleSave = () => {
    if (!selectedFeeling) {
      setError('Select a feeling.');
      return;
    }

    const feeling = {
      id: `feeling_${crypto.randomUUID().slice(0, 8)}`,
      type: 'feeling',
      timeGranularity,
      feeling: selectedFeeling,
      severity: severity || null,
      duration: duration || null,
      notes: notes.trim() || null,
    };

    // Add time-specific fields and sortable time
    if (timeGranularity === 'specific') {
      feeling.time = specificTime;
    } else if (timeGranularity === 'time-of-day') {
      feeling.timeOfDay = timeOfDay;
      feeling.time = TIME_OF_DAY_MAP[timeOfDay]; // For sorting
    } else if (timeGranularity === 'after-meal') {
      feeling.relatedMealId = relatedMealId;
      // Find meal time for sorting
      const meal = meals.find(m => m.id === relatedMealId);
      if (meal) {
        feeling.time = meal.time;
      }
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

            {/* Search box */}
            <div>
              <label className="block text-xs font-semibold mb-2 text-[var(--color-text-secondary)] uppercase tracking-wide">
                How did you feel? *
              </label>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search or type custom feeling…"
                  className="w-full pl-9 pr-4 py-2.5 md:py-2 text-sm border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none bg-[var(--color-bg-secondary)] transition-all"
                />
              </div>

              {/* Search results */}
              {searchQuery && filteredFeelings.length > 0 && (
                <div className="mt-2 p-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-lg max-h-48 overflow-y-auto">
                  {filteredFeelings.map(feeling => (
                    <button
                      key={feeling}
                      type="button"
                      onClick={() => selectFeeling(feeling)}
                      className="w-full text-left px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-hover-bg)] rounded transition-colors"
                    >
                      {feeling}
                    </button>
                  ))}
                </div>
              )}

              {/* Selected feeling display */}
              {selectedFeeling && (
                <div className="mt-3 p-3 bg-[var(--color-accent)]/10 border border-[var(--color-accent)] rounded-lg flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--color-accent)]">{selectedFeeling}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedFeeling('')}
                    className="text-xs text-[var(--color-accent)] hover:underline"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Recent feelings (if no search) */}
            {!searchQuery && !selectedFeeling && (recentFeelings.length > 0 || customFeelings.length > 0) && (
              <div>
                <h3 className="text-xs font-medium text-[var(--color-text-primary)] mb-2">Recent & Custom</h3>
                <div className="flex flex-wrap gap-2">
                  {[...new Set([...recentFeelings, ...customFeelings])].slice(0, 10).map(feeling => (
                    <button
                      key={feeling}
                      type="button"
                      onClick={() => selectFeeling(feeling)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/40 transition-all"
                    >
                      {feeling}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Categories (collapsed by default) */}
            {!searchQuery && !selectedFeeling && (
              <div>
                <h3 className="text-xs font-medium text-[var(--color-text-primary)] mb-2">Browse by Category</h3>
                {Object.entries(FEELING_CATEGORIES).map(([category, feelings]) => (
                  <div key={category} className="mb-2">
                    <button
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-hover-bg)] rounded-lg transition-colors"
                    >
                      <span>{category} ({feelings.length})</span>
                      {expandedCategories[category] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {expandedCategories[category] && (
                      <div className="flex flex-wrap gap-2 mt-2 px-3">
                        {feelings.map(feeling => (
                          <button
                            key={feeling}
                            type="button"
                            onClick={() => selectFeeling(feeling)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/40 transition-all"
                          >
                            {feeling}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

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
