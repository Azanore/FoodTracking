// File purpose: Daily food log view — smart auto-initialised meals, compact header.
// Related: App.jsx renders this, MealCard.jsx per meal, MealForm.jsx for editing meal metadata.
// Should not include: Food library, settings.

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { DayHeader } from '../components/DayHeader';
import { MealCard } from '../components/MealCard';
import { MealForm } from '../components/MealForm';
import { getDailyLog, saveDailyLog } from '../services/db';

// ── Helpers ──────────────────────────────────────────────────────────────────

const generateId = (prefix) => `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
const getTodayDate = () => new Date().toISOString().split('T')[0];

const DEFAULT_MEAL_TEMPLATES = [
  { type: 'Breakfast', time: '07:30' },
  { type: 'Lunch',     time: '13:00' },
  { type: 'Snack',     time: '16:00' },
  { type: 'Dinner',    time: '20:00' },
];

const buildDefaultMeals = () =>
  DEFAULT_MEAL_TEMPLATES.map(t => ({
    id: generateId('meal'),
    type: t.type,
    time: t.time,
    tags: [],
    notes: null,
    foods: [],
    drinks: [],
  }));

// ── Component ────────────────────────────────────────────────────────────────

export function TodayView() {
  const [currentDate, setCurrentDate] = useState(getTodayDate());
  const [dailyLog, setDailyLog]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);

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
            dayNotes: null,
            meals: buildDefaultMeals(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        } else {
          if (!log.meals) log.meals = buildDefaultMeals();
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

  const handleNotesChange = (dayNotes) => persist({ ...dailyLog, dayNotes });
  const handleTagAdd      = (tag) => persist({ ...dailyLog, tags: [...dailyLog.tags, tag] });
  const handleTagRemove   = (tag) => persist({ ...dailyLog, tags: dailyLog.tags.filter(t => t !== tag) });

  // ── Meal handlers ─────────────────────────────────────────────────────────

  const handleMealUpdate = (updatedMeal) => {
    const meals = dailyLog.meals.map(m => m.id === updatedMeal.id ? updatedMeal : m);
    persist({ ...dailyLog, meals });
  };

  const handleMealDelete = (mealId) => {
    const meals = dailyLog.meals.filter(m => m.id !== mealId);
    persist({ ...dailyLog, meals });
  };

  const handleMealFormSave = (mealData) => {
    let meals;
    if (dailyLog.meals.find(m => m.id === mealData.id)) {
      meals = dailyLog.meals.map(m => m.id === mealData.id ? mealData : m);
    } else {
      meals = [...dailyLog.meals, mealData];
    }
    meals.sort((a, b) => a.time.localeCompare(b.time));
    persist({ ...dailyLog, meals });
    setEditingMeal(null);
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
    <div className="flex-1 p-[var(--spacing-2xl)]">

      {/* Compact date + tags + notes header */}
      <DayHeader
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        dayNotes={dailyLog.dayNotes}
        tags={dailyLog.tags}
        onNotesChange={handleNotesChange}
        onTagAdd={handleTagAdd}
        onTagRemove={handleTagRemove}
      />

      {/* Meal cards — items-start prevents height sync between cards in same row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[var(--spacing-lg)] items-start">
        {dailyLog.meals.map(meal => (
          <MealCard
            key={meal.id}
            meal={meal}
            onEdit={setEditingMeal}
            onDelete={handleMealDelete}
            onMealUpdate={handleMealUpdate}
          />
        ))}

        {/* Add custom meal */}
        <button
          onClick={() => setEditingMeal({})}
          className="flex items-center justify-center gap-2 py-4 text-sm text-[var(--color-text-secondary)] border border-dashed border-[var(--color-border-primary)] rounded-[var(--radius-md)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
        >
          <Plus size={15} />
          Add custom meal
        </button>
      </div>

      {/* Meal edit / create form */}
      {editingMeal !== null && (
        <MealForm
          meal={Object.keys(editingMeal).length > 0 ? editingMeal : null}
          onSave={handleMealFormSave}
          onCancel={() => setEditingMeal(null)}
        />
      )}
    </div>
  );
}
