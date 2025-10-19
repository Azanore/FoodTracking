// File purpose: Daily log view with meals and Quick Add bar
// Related: App.jsx renders this view, MealCard.jsx for meal display
// Should not include: Food library management, settings

import { useState, useEffect } from 'react';
import { DateNavigation } from '../components/DateNavigation';
import { DayMeta } from '../components/DayMeta';
import { MealCard } from '../components/MealCard';
import { AddMealButton } from '../components/AddMealButton';
import { MealForm } from '../components/MealForm';
import { QuickAddBar } from '../components/QuickAddBar';
import { getDailyLog, saveDailyLog } from '../services/db';

// Generate unique ID for daily log
const generateDayId = (date) => `day_${date}_${crypto.randomUUID().slice(0, 8)}`;

// Get current date in YYYY-MM-DD format
const getTodayDate = () => new Date().toISOString().split('T')[0];

export function TodayView() {
  const [currentDate, setCurrentDate] = useState(getTodayDate());
  const [dailyLog, setDailyLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMealForm, setShowMealForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);

  // Fetch daily log when date changes
  useEffect(() => {
    const fetchDailyLog = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let log = await getDailyLog(currentDate);
        
        // Create empty log if none exists
        if (!log) {
          log = {
            id: generateDayId(currentDate),
            date: currentDate,
            tags: [],
            dayNotes: null,
            meals: [],
            notices: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
        
        setDailyLog(log);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyLog();
  }, [currentDate]);

  // Save daily log to database
  const saveDailyLogData = async (updatedLog) => {
    try {
      await saveDailyLog(updatedLog);
      setDailyLog(updatedLog);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle day notes change
  const handleNotesChange = (notes) => {
    const updatedLog = { ...dailyLog, dayNotes: notes };
    saveDailyLogData(updatedLog);
  };

  // Handle tag add
  const handleTagAdd = (tag) => {
    const updatedLog = { 
      ...dailyLog, 
      tags: [...dailyLog.tags, tag] 
    };
    saveDailyLogData(updatedLog);
  };

  // Handle tag remove
  const handleTagRemove = (tagToRemove) => {
    const updatedLog = { 
      ...dailyLog, 
      tags: dailyLog.tags.filter(tag => tag !== tagToRemove) 
    };
    saveDailyLogData(updatedLog);
  };

  // Handle add meal button click
  const handleAddMealClick = () => {
    setEditingMeal(null);
    setShowMealForm(true);
  };

  // Handle meal edit
  const handleMealEdit = (meal) => {
    setEditingMeal(meal);
    setShowMealForm(true);
  };

  // Handle meal delete
  const handleMealDelete = (mealId) => {
    const updatedLog = {
      ...dailyLog,
      meals: dailyLog.meals.filter(meal => meal.id !== mealId),
      updatedAt: new Date().toISOString()
    };
    saveDailyLogData(updatedLog);
  };

  // Handle meal update (for inline add)
  const handleMealUpdate = (updatedMeal) => {
    const updatedMeals = dailyLog.meals.map(meal =>
      meal.id === updatedMeal.id ? updatedMeal : meal
    );

    const updatedLog = {
      ...dailyLog,
      meals: updatedMeals,
      updatedAt: new Date().toISOString()
    };

    saveDailyLogData(updatedLog);
  };

  // Handle meal save (add or edit)
  const handleMealSave = (mealData) => {
    let updatedMeals;
    
    if (editingMeal) {
      // Update existing meal
      updatedMeals = dailyLog.meals.map(meal => 
        meal.id === mealData.id ? mealData : meal
      );
    } else {
      // Add new meal
      updatedMeals = [...dailyLog.meals, mealData];
    }

    // Sort meals by time
    updatedMeals.sort((a, b) => a.time.localeCompare(b.time));

    const updatedLog = {
      ...dailyLog,
      meals: updatedMeals,
      updatedAt: new Date().toISOString()
    };

    saveDailyLogData(updatedLog);
    setShowMealForm(false);
    setEditingMeal(null);
  };

  // Handle meal form cancel
  const handleMealFormCancel = () => {
    setShowMealForm(false);
    setEditingMeal(null);
  };

  // Handle quick add (from QuickAddBar)
  const handleQuickAdd = (updatedMeals) => {
    const updatedLog = {
      ...dailyLog,
      meals: updatedMeals,
      updatedAt: new Date().toISOString()
    };
    saveDailyLogData(updatedLog);
  };

  if (loading) {
    return (
      <div className="flex-1 p-[var(--spacing-2xl)]">
        <p className="text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-[var(--spacing-2xl)]">
        <p className="text-[var(--font-size-sm)] text-[var(--color-danger)]">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-[var(--spacing-2xl)] pb-20">
      <DateNavigation 
        currentDate={currentDate} 
        onDateChange={setCurrentDate} 
      />

      <DayMeta
        dayNotes={dailyLog.dayNotes}
        tags={dailyLog.tags}
        onNotesChange={handleNotesChange}
        onTagAdd={handleTagAdd}
        onTagRemove={handleTagRemove}
      />

      {/* Add Meal Button */}
      <div className="mt-[var(--spacing-2xl)]">
        <AddMealButton onClick={handleAddMealClick} />
      </div>

      {/* Meals section */}
      <div className="mt-[var(--spacing-2xl)]">
        {dailyLog.meals.length === 0 ? (
          <p className="text-[var(--font-size-sm)] text-[var(--color-text-secondary)] text-center py-[var(--spacing-3xl)]">
            No meals logged yet. Add your first meal!
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-[var(--spacing-lg)]">
            {dailyLog.meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onEdit={handleMealEdit}
                onDelete={handleMealDelete}
                onMealUpdate={handleMealUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Meal Form Modal */}
      {showMealForm && (
        <MealForm
          meal={editingMeal}
          onSave={handleMealSave}
          onCancel={handleMealFormCancel}
        />
      )}

      {/* Quick Add Bar */}
      <QuickAddBar meals={dailyLog.meals} onAddFood={handleQuickAdd} />
    </div>
  );
}
