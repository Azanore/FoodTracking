// File purpose: Root component with responsive layout and view routing.
// Related: Sidebar.jsx for navigation, TodayView.jsx and FoodsView.jsx for content.

import { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { StorageWarning } from './components/StorageWarning';
import { Sidebar } from './components/Sidebar';
import { Onboarding } from './components/Onboarding';
import { TodayView } from './views/TodayView';
import { FoodsView } from './views/FoodsView';
import { StatsView } from './views/StatsView';
import { SettingsView } from './views/SettingsView';
import { FeelingTimelineView } from './views/FeelingTimelineView';
import { getStorageInfo, shouldShowWarning, dismissWarning } from './utils/storageQuota';

// Check if user has completed onboarding
const hasCompletedOnboarding = () => {
  return localStorage.getItem('onboarding_completed') === 'true';
};

// Mark onboarding as complete
const completeOnboarding = () => {
  localStorage.setItem('onboarding_completed', 'true');
};

function App() {
  const [activeView, setActiveView] = useState('today');
  const [selectedDate, setSelectedDate] = useState(null); // For navigating to specific date from Stats
  const [selectedFeeling, setSelectedFeeling] = useState(null); // For feeling timeline view
  const [showOnboarding, setShowOnboarding] = useState(!hasCompletedOnboarding());
  const [showStorageWarning, setShowStorageWarning] = useState(false);
  const [storageInfo, setStorageInfo] = useState(null);

  const handleOnboardingComplete = () => {
    completeOnboarding();
    setShowOnboarding(false);
  };

  // Navigate to specific date or feeling timeline from Stats
  const handleNavigateToDate = (target) => {
    if (target.startsWith('feeling:')) {
      const feeling = target.replace('feeling:', '');
      setSelectedFeeling(feeling);
      setActiveView('feeling-timeline');
    } else {
      setSelectedDate(target);
      setActiveView('today');
    }
  };

  // Back from feeling timeline to stats
  const handleBackToStats = () => {
    setSelectedFeeling(null);
    setActiveView('stats');
  };

  // Check storage quota on mount
  useEffect(() => {
    if (shouldShowWarning()) {
      const info = getStorageInfo();
      setStorageInfo(info);
      setShowStorageWarning(true);
    }
  }, []);

  const handleDismissWarning = () => {
    dismissWarning();
    setShowStorageWarning(false);
  };

  const handleExport = () => {
    try {
      const data = {};
      const relevantPrefixes = ['day_', 'food_', 'drink_'];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const isRelevant = relevantPrefixes.some(prefix => key.startsWith(prefix)) || key === 'user_preferences' || key === 'app_seeded';
        if (!isRelevant) continue;

        try {
          data[key] = JSON.parse(localStorage.getItem(key));
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `food-diary-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShowStorageWarning(false);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  // Show onboarding if not completed
  if (showOnboarding) {
    return (
      <ErrorBoundary>
        <Onboarding onComplete={handleOnboardingComplete} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      {showStorageWarning && storageInfo && (
        <StorageWarning
          storageInfo={storageInfo}
          onDismiss={handleDismissWarning}
          onExport={handleExport}
        />
      )}
      <div className="flex flex-col md:flex-row h-screen bg-[var(--color-bg-secondary)]">
        {/* Navigation - bottom on mobile, left side on desktop */}
        <Sidebar activeView={activeView} onNavigate={setActiveView} />

        {/* Main content - full height minus bottom nav on mobile */}
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          {activeView === 'today' && <TodayView initialDate={selectedDate} onDateChange={() => setSelectedDate(null)} />}
          {activeView === 'foods' && <FoodsView />}
          {activeView === 'stats' && <StatsView onNavigateToDate={handleNavigateToDate} />}
          {activeView === 'settings' && <SettingsView />}
          {activeView === 'feeling-timeline' && selectedFeeling && (
            <FeelingTimelineView
              feeling={selectedFeeling}
              onBack={handleBackToStats}
              onNavigateToDate={(date) => {
                setSelectedDate(date);
                setActiveView('today');
              }}
            />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
