// File purpose: Root component with responsive layout and view routing.
// Related: Sidebar.jsx for navigation, TodayView.jsx and FoodsView.jsx for content.

import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Onboarding } from './components/Onboarding';
import { TodayView } from './views/TodayView';
import { FoodsView } from './views/FoodsView';
import { StatsView } from './views/StatsView';
import { SettingsView } from './views/SettingsView';

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
  const [showOnboarding, setShowOnboarding] = useState(!hasCompletedOnboarding());

  const handleOnboardingComplete = () => {
    completeOnboarding();
    setShowOnboarding(false);
  };

  // Show onboarding if not completed
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[var(--color-bg-secondary)]">
      {/* Navigation - bottom on mobile, left side on desktop */}
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      {/* Main content - full height minus bottom nav on mobile */}
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        {activeView === 'today' && <TodayView />}
        {activeView === 'foods' && <FoodsView />}
        {activeView === 'stats' && <StatsView />}
        {activeView === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}

export default App;
