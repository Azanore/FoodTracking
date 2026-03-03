// File purpose: Root component with responsive layout and view routing.
// Related: Sidebar.jsx for navigation, TodayView.jsx and FoodsView.jsx for content.

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TodayView } from './views/TodayView';
import { FoodsView } from './views/FoodsView';
import { StatsView } from './views/StatsView';
import { SettingsView } from './views/SettingsView';

function App() {
  const [activeView, setActiveView] = useState('today');

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
