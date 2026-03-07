// File purpose: Statistics and analytics view with empty state for < 7 days.
// Related: App.jsx renders this
// Should not include: Data management, settings

import { BarChart3 } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export function StatsView() {
  // TODO: Check actual logged days count
  const daysLogged = 0; // Placeholder
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

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <h1 className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] mb-4">
        Statistics
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)]">
        Coming soon: View your nutrition trends, meal patterns, and insights.
      </p>
    </div>
  );
}
