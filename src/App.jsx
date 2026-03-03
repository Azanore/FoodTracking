// File purpose: Root component with sidebar layout and view routing.
// Related: Sidebar.jsx for navigation, TodayView.jsx and FoodsView.jsx for content.

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TodayView } from './views/TodayView';
import { FoodsView } from './views/FoodsView';

function App() {
  const [activeView, setActiveView] = useState('today');

  return (
    <div className="flex h-screen bg-[var(--color-bg-secondary)]">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="flex-1 overflow-auto">
        {activeView === 'today' && <TodayView />}
        {activeView === 'foods' && <FoodsView />}
      </main>
    </div>
  );
}

export default App;
