// File purpose: Show all occurrences of a specific feeling with timeline context
// Related: StatsView links here, shows days with that feeling side-by-side
// Should not include: Correlation analysis, editing

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { MealCard } from '../components/MealCard';
import { FeelingCard } from '../components/FeelingCard';

// Get all daily logs with a specific feeling
const getLogsWithFeeling = (feeling) => {
  const logs = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('day_')) {
      try {
        const log = JSON.parse(localStorage.getItem(key));
        const hasFeeling = log.timeline?.some(evt => evt.type === 'feeling' && evt.feeling === feeling);
        if (hasFeeling) logs.push(log);
      } catch (e) {
        console.error('Failed to parse log:', key);
      }
    }
  }
  return logs.sort((a, b) => b.date.localeCompare(a.date));
};

// Format date for display
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (dateStr === today) return 'Today';
  if (dateStr === yesterdayStr) return 'Yesterday';

  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

export function FeelingTimelineView({ feeling, onBack, onNavigateToDate }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const logsWithFeeling = getLogsWithFeeling(feeling);
    setLogs(logsWithFeeling);
    setLoading(false);
  }, [feeling]);

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        <p className="text-sm text-[var(--color-text-secondary)]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-[var(--color-hover-bg)] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] capitalize">
            {feeling}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {logs.length} occurrence{logs.length === 1 ? '' : 's'} found
          </p>
        </div>
      </div>

      {/* Days with this feeling */}
      <div className="space-y-8">
        {logs.map(log => {
          const feelingEvents = log.timeline?.filter(evt => evt.type === 'feeling' && evt.feeling === feeling) || [];
          const mealEvents = log.timeline?.filter(evt => evt.type === 'meal') || [];

          return (
            <div key={log.date} className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg p-4">
              {/* Date header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border-primary)]">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[var(--color-accent)]" />
                  <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {formatDate(log.date)}
                  </h2>
                </div>
                <button
                  onClick={() => onNavigateToDate?.(log.date)}
                  className="text-xs text-[var(--color-accent)] hover:underline"
                >
                  View full day →
                </button>
              </div>

              {/* Timeline for this day */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {log.timeline?.map(evt => {
                  if (evt.type === 'meal') {
                    return (
                      <MealCard
                        key={evt.id}
                        meal={evt}
                        onEdit={null}
                        onDelete={null}
                        onMealUpdate={null}
                      />
                    );
                  }
                  if (evt.type === 'feeling' && evt.feeling === feeling) {
                    return (
                      <FeelingCard
                        key={evt.id}
                        feeling={evt}
                        onDelete={null}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
