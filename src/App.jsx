// File purpose: Root component with sidebar layout and view routing
// Related: Sidebar.jsx for navigation, TodayView.jsx and FoodsView.jsx for content
// Should not include: Complex state management, business logic

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TodayView } from './views/TodayView';
import { FoodsView } from './views/FoodsView';
import { VerifyIngredientsView } from './views/VerifyIngredientsView';
import { WizardAnalyticsDashboard } from './components/WizardAnalyticsDashboard';

function App() {
  const [activeView, setActiveView] = useState('today');

  return (
    <div className="flex h-screen bg-[var(--color-bg-secondary)]">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      
      <main className="flex-1 overflow-auto">
        {activeView === 'today' && <TodayView />}
        {activeView === 'foods' && <FoodsView />}
        {activeView === 'verify' && <VerifyIngredientsView />}
      </main>
      
      {/* Wizard analytics dashboard (dev tool) */}
      <WizardAnalyticsDashboard />
    </div>
  );
}

export default App;

