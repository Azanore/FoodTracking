// File purpose: Statistics and analytics — overview, top items, patterns, feelings, tags
// Related: App.jsx renders this, db.js for data loading
// Should not include: Correlation analysis (Phase 4), daily management, settings

import { useState, useEffect } from 'react';
import { BarChart3, Calendar, UtensilsCrossed, Heart, Tag, TrendingUp } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

// Date range options
const DATE_RANGES = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: 'all', label: 'All time' }
];

// Get all daily logs from localStorage
const getAllDailyLogs = () => {
  const logs = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('day_')) {
      try {
        const log = JSON.parse(localStorage.getItem(key));
        logs.push(log);
      } catch (e) {
        console.error('Failed to parse log:', key, e);
      }
    }
  }
  return logs.sort((a, b) => b.date.localeCompare(a.date));
};

// Calculate logging streak (consecutive days)
const calculateStreak = (logs) => {
  if (logs.length === 0) return 0;

  const sortedDates = logs.map(log => log.date).sort((a, b) => b.localeCompare(a));
  const today = new Date().toISOString().split('T')[0];

  // Check if most recent log is today or yesterday
  const mostRecent = sortedDates[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (mostRecent !== today && mostRecent !== yesterdayStr) {
    return 0; // Streak broken
  }

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i]);
    const previous = new Date(sortedDates[i - 1]);
    const diffDays = Math.round((previous - current) / 86400000);

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

// Filter logs by date range
const filterByDateRange = (logs, range) => {
  if (range === 'all') return logs;

  const days = parseInt(range);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];

  return logs.filter(log => log.date >= cutoffStr);
};

// Count unique foods/drinks
const countUniqueItems = (logs) => {
  const foodIds = new Set();
  const drinkIds = new Set();

  logs.forEach(log => {
    log.timeline?.forEach(evt => {
      if (evt.type === 'meal') {
        evt.foods?.forEach(f => foodIds.add(f.id));
        evt.drinks?.forEach(d => drinkIds.add(d.id));
      }
    });
  });

  return { foods: foodIds.size, drinks: drinkIds.size };
};

// Count total meals
const countTotalMeals = (logs) => {
  return logs.reduce((sum, log) => {
    return sum + (log.timeline?.filter(evt => evt.type === 'meal').length || 0);
  }, 0);
};

// Get top N foods by frequency
const getTopFoods = (logs, n = 10) => {
  const foodCounts = {};
  const foodDetails = {};
  const foodLastEaten = {};

  logs.forEach(log => {
    log.timeline?.forEach(evt => {
      if (evt.type === 'meal') {
        evt.foods?.forEach(f => {
          foodCounts[f.id] = (foodCounts[f.id] || 0) + 1;
          if (!foodDetails[f.id]) {
            foodDetails[f.id] = { id: f.id, name: f.name };
          }
          if (!foodLastEaten[f.id] || log.date > foodLastEaten[f.id]) {
            foodLastEaten[f.id] = log.date;
          }
        });
      }
    });
  });

  return Object.entries(foodCounts)
    .map(([id, count]) => ({ ...foodDetails[id], count, lastEaten: foodLastEaten[id] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
};

// Get top N drinks by frequency
const getTopDrinks = (logs, n = 10) => {
  const drinkCounts = {};
  const drinkDetails = {};
  const drinkLastEaten = {};

  logs.forEach(log => {
    log.timeline?.forEach(evt => {
      if (evt.type === 'meal') {
        evt.drinks?.forEach(d => {
          drinkCounts[d.id] = (drinkCounts[d.id] || 0) + 1;
          if (!drinkDetails[d.id]) {
            drinkDetails[d.id] = { id: d.id, name: d.name };
          }
          if (!drinkLastEaten[d.id] || log.date > drinkLastEaten[d.id]) {
            drinkLastEaten[d.id] = log.date;
          }
        });
      }
    });
  });

  return Object.entries(drinkCounts)
    .map(([id, count]) => ({ ...drinkDetails[id], count, lastEaten: drinkLastEaten[id] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
};

// Get meal frequency breakdown
const getMealFrequency = (logs) => {
  const mealCounts = { Breakfast: 0, Lunch: 0, Dinner: 0, Snack: 0 };

  logs.forEach(log => {
    log.timeline?.forEach(evt => {
      if (evt.type === 'meal' && evt.mealType) {
        mealCounts[evt.mealType] = (mealCounts[evt.mealType] || 0) + 1;
      }
    });
  });

  return mealCounts;
};

// Get feeling frequency
const getFeelingFrequency = (logs) => {
  const feelingCounts = {};

  logs.forEach(log => {
    log.timeline?.forEach(evt => {
      if (evt.type === 'feeling' && evt.feeling) {
        feelingCounts[evt.feeling] = (feelingCounts[evt.feeling] || 0) + 1;
      }
    });
  });

  return Object.entries(feelingCounts)
    .map(([feeling, count]) => ({ feeling, count }))
    .sort((a, b) => b.count - a.count);
};

// Get tag frequency
const getTagFrequency = (logs) => {
  const tagCounts = {};

  logs.forEach(log => {
    // Day tags
    log.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    // Meal tags
    log.timeline?.forEach(evt => {
      if (evt.type === 'meal') {
        evt.tags?.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
};

export function StatsView() {
  const [dateRange, setDateRange] = useState('30');
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const logs = getAllDailyLogs();
    setAllLogs(logs);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        <p className="text-sm text-[var(--color-text-secondary)]">Loading…</p>
      </div>
    );
  }

  const daysLogged = allLogs.length;
  const needsMoreData = daysLogged < 7;

  if (needsMoreData) {
    return (
      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        <h1 className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] mb-4">
          Statistics
        </h1>
        <EmptyState
          icon={BarChart3}
          title="Not enough data yet"
          description={`Log for at least 7 days to see patterns and insights. You've logged ${daysLogged} day${daysLogged === 1 ? '' : 's'} so far. Keep going!`}
        />
      </div>
    );
  }

  const filteredLogs = filterByDateRange(allLogs, dateRange);
  const streak = calculateStreak(allLogs);
  const uniqueItems = countUniqueItems(filteredLogs);
  const totalMeals = countTotalMeals(filteredLogs);
  const topFoods = getTopFoods(filteredLogs);
  const topDrinks = getTopDrinks(filteredLogs);
  const mealFrequency = getMealFrequency(filteredLogs);
  const feelingFrequency = getFeelingFrequency(filteredLogs);
  const tagFrequency = getTagFrequency(filteredLogs);

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === yesterdayStr) return 'Yesterday';

    const diffDays = Math.floor((new Date(today) - date) / 86400000);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)]">
          Statistics
        </h1>

        {/* Date range selector */}
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-2 text-sm border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none bg-[var(--color-bg-primary)]"
        >
          {DATE_RANGES.map(range => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
      </div>

      {/* Overview Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-[var(--color-accent)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">Days Logged</span>
          </div>
          <p className="text-2xl font-semibold text-[var(--color-text-primary)]">{filteredLogs.length}</p>
          {streak > 0 && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">🔥 {streak} day streak</p>
          )}
        </div>

        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <UtensilsCrossed size={16} className="text-[var(--color-accent)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">Meals Logged</span>
          </div>
          <p className="text-2xl font-semibold text-[var(--color-text-primary)]">{totalMeals}</p>
        </div>

        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[var(--color-accent)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">Unique Foods</span>
          </div>
          <p className="text-2xl font-semibold text-[var(--color-text-primary)]">{uniqueItems.foods}</p>
        </div>

        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[var(--color-accent)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">Unique Drinks</span>
          </div>
          <p className="text-2xl font-semibold text-[var(--color-text-primary)]">{uniqueItems.drinks}</p>
        </div>
      </section>

      {/* Top Foods & Drinks */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Top Foods */}
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Top 10 Foods</h2>
          {topFoods.length === 0 ? (
            <p className="text-xs text-[var(--color-text-secondary)]">No foods logged yet</p>
          ) : (
            <div className="space-y-2">
              {topFoods.map((food, i) => (
                <div key={food.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xs text-[var(--color-text-secondary)] w-5">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-text-primary)] truncate">{food.name}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">{formatDate(food.lastEaten)}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-accent)]">{food.count}×</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Drinks */}
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Top 10 Drinks</h2>
          {topDrinks.length === 0 ? (
            <p className="text-xs text-[var(--color-text-secondary)]">No drinks logged yet</p>
          ) : (
            <div className="space-y-2">
              {topDrinks.map((drink, i) => (
                <div key={drink.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xs text-[var(--color-text-secondary)] w-5">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-text-primary)] truncate">{drink.name}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">{formatDate(drink.lastEaten)}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-accent)]">{drink.count}×</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Meal Patterns */}
      <section className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg p-4 mb-6">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Meal Frequency</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(mealFrequency).map(([mealType, count]) => {
            const percentage = filteredLogs.length > 0 ? Math.round((count / filteredLogs.length) * 100) : 0;
            return (
              <div key={mealType} className="text-center">
                <p className="text-xs text-[var(--color-text-secondary)] mb-1">{mealType}</p>
                <p className="text-xl font-semibold text-[var(--color-text-primary)]">{count}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{percentage}% of days</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feeling Frequency */}
      {feelingFrequency.length > 0 && (
        <section className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={16} className="text-[var(--color-accent)]" />
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Feeling Frequency</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {feelingFrequency.map(({ feeling, count }) => (
              <div key={feeling} className="flex items-center justify-between p-2 bg-[var(--color-bg-secondary)] rounded">
                <span className="text-sm text-[var(--color-text-primary)] capitalize">{feeling}</span>
                <span className="text-sm font-medium text-[var(--color-accent)]">{count}×</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tag Frequency */}
      {tagFrequency.length > 0 && (
        <section className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={16} className="text-[var(--color-accent)]" />
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Most Used Tags</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {tagFrequency.map(({ tag, count }) => (
              <span key={tag} className="px-3 py-1.5 text-sm bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-full border border-[var(--color-border-primary)]">
                {tag} <span className="text-[var(--color-accent)] font-medium">({count})</span>
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
