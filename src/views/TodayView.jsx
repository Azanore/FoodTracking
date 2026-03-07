// File purpose: Timeline view — meals and feelings displayed chronologically.
// Related: App.jsx renders this, MealCard/FeelingCard for events, MealForm/FeelingModal for logging.
// Should not include: Food library, settings.

import { useState, useEffect } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { DayHeader } from '../components/DayHeader';
import { MealCard } from '../components/MealCard';
import { FeelingCard } from '../components/FeelingCard';
import { MealForm } from '../components/MealForm';
import { FeelingModal } from '../components/FeelingModal';
import { EmptyState } from '../components/EmptyState';
import { getDailyLog, saveDailyLog } from '../services/db';

// ── Helpers ──────────────────────────────────────────────────────────────────

const generateId = (prefix) => `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
const getTodayDate = () => new Date().toISOString().split('T')[0];

const DEFAULT_MEAL_TEMPLATES = [
  { type: 'Breakfast', time: '07:30' },
  { type: 'Lunch', time: '13:00' },
  { type: 'Snack', time: '16:00' },
  { type: 'Dinner', time: '20:00' },
];

// Build default timeline with meal events
const buildDefaultTimeline = () =>
  DEFAULT_MEAL_TEMPLATES.map(t => ({
    id: generateId('meal'),
    type: 'meal',
    time: t.time,
    mealType: t.type,
    tags: [],
    foods: [],
    drinks: [],
  }));

// ── Component ────────────────────────────────────────────────────────────────

export function TodayView() {
  const [currentDate, setCurrentDate] = useState(getTodayDate());
  const [dailyLog, setDailyLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);
  const [showFeelingModal, setShowFeelingModal] = useState(false);

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let log = await getDailyLog(currentDate);
        if (!log) {
          log = {
            id: generateId('day'),
            date: currentDate,
            tags: [],
            timeline: buildDefaultTimeline(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        } else {
          if (!log.timeline || log.timeline.length === 0) {
            log.timeline = buildDefaultTimeline();
          }
        }
        setDailyLog(log);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentDate]);

  // ── Persist ───────────────────────────────────────────────────────────────

  const persist = async (updatedLog) => {
    try {
      const withTs = { ...updatedLog, updatedAt: new Date().toISOString() };
      await saveDailyLog(withTs);
      setDailyLog(withTs);
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Day-level handlers ────────────────────────────────────────────────────

  const handleTagAdd = (tag) => persist({ ...dailyLog, tags: [...dailyLog.tags, tag] });
  const handleTagRemove = (tag) => persist({ ...dailyLog, tags: dailyLog.tags.filter(t => t !== tag) });

  // ── Meal handlers ─────────────────────────────────────────────────────────

  const handleMealUpdate = (updatedMeal) => {
    const timeline = dailyLog.timeline.map(evt => evt.id === updatedMeal.id ? updatedMeal : evt);
    persist({ ...dailyLog, timeline });
  };

  const handleMealDelete = (mealId) => {
    const timeline = dailyLog.timeline.filter(evt => evt.id !== mealId);
    persist({ ...dailyLog, timeline });
  };

  const handleMealFormSave = (mealData) => {
    let timeline;
    if (dailyLog.timeline.find(evt => evt.id === mealData.id)) {
      timeline = dailyLog.timeline.map(evt => evt.id === mealData.id ? mealData : evt);
    } else {
      timeline = [...dailyLog.timeline, mealData];
    }
    timeline.sort((a, b) => a.time.localeCompare(b.time));
    persist({ ...dailyLog, timeline });
    setEditingMeal(null);
  };

  // ── Feeling handlers ──────────────────────────────────────────────────────

  const handleFeelingSave = (feelingData) => {
    const timeline = [...dailyLog.timeline, feelingData];
    // Sort by time
    timeline.sort((a, b) => {
      const aTime = a.time || '23:59';
      const bTime = b.time || '23:59';
      return aTime.localeCompare(bTime);
    });
    persist({ ...dailyLog, timeline });
  };

  const handleFeelingDelete = (feelingId) => {
    const timeline = dailyLog.timeline.filter(evt => evt.id !== feelingId);
    persist({ ...dailyLog, timeline });
  };

  // Get recent feelings for quick access
  const getRecentFeelings = () => {
    const feelings = dailyLog.timeline
      .filter(evt => evt.type === 'feeling' && evt.feeling)
      .map(evt => evt.feeling);
    return [...new Set(feelings)].slice(0, 5);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="flex-1 p-[var(--spacing-2xl)]">
      <p className="text-sm text-[var(--color-text-secondary)]">Loading…</p>
    </div>
  );

  if (error) return (
    <div className="flex-1 p-[var(--spacing-2xl)]">
      <p className="text-sm text-[var(--color-danger)]">Error: {error}</p>
    </div>
  );

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">

      {/* Compact date + tags header */}
      <DayHeader
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        tags={dailyLog.tags}
        onTagAdd={handleTagAdd}
        onTagRemove={handleTagRemove}
      />

      {/* Action buttons */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setEditingMeal({})}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-all touch-manipulation"
        >
          <Plus size={16} />
          Log Meal
        </button>
        <button
          onClick={() => setShowFeelingModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-[var(--color-accent)] text-[var(--color-accent)] rounded-lg hover:bg-[var(--color-accent)]/10 transition-all touch-manipulation"
        >
          <Plus size={16} />
          Log Feeling
        </button>
      </div>

      {/* Timeline — responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 items-start">
        {dailyLog.timeline.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Calendar}
              title="No entries yet"
              description="Start by logging your first meal or how you're feeling. Track consistently to discover patterns."
              actionLabel="Log Your First Meal"
              onAction={() => setEditingMeal({})}
            />
          </div>
        ) : (
          dailyLog.timeline.map(evt => {
            if (evt.type === 'meal') {
              return (
                <MealCard
                  key={evt.id}
                  meal={evt}
                  onEdit={setEditingMeal}
                  onDelete={handleMealDelete}
                  onMealUpdate={handleMealUpdate}
                />
              );
            }
            if (evt.type === 'feeling') {
              return (
                <FeelingCard
                  key={evt.id}
                  feeling={evt}
                  onDelete={handleFeelingDelete}
                />
              );
            }
            return null;
          })
        )}
      </div>

      {/* Meal edit / create form */}
      {editingMeal !== null && (
        <MealForm
          meal={Object.keys(editingMeal).length > 0 ? editingMeal : null}
          onSave={handleMealFormSave}
          onCancel={() => setEditingMeal(null)}
        />
      )}

      {/* Feeling modal */}
      <FeelingModal
        isOpen={showFeelingModal}
        onClose={() => setShowFeelingModal(false)}
        onSave={handleFeelingSave}
        meals={dailyLog.timeline.filter(evt => evt.type === 'meal')}
        recentFeelings={getRecentFeelings()}
      />
    </div>
  );
}
