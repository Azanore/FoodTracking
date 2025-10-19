// File purpose: Navigation sidebar with icon-only buttons
// Related: App.jsx uses this for navigation
// Should not include: View content, complex state management

import { Calendar, UtensilsCrossed, FlaskConical } from 'lucide-react';

export function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="w-16 bg-[var(--color-bg-primary)] border-r border-[var(--color-border-primary)] flex flex-col items-center py-4 gap-2">
      <button
        onClick={() => onNavigate('today')}
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-[var(--transition-fast)] ease-[var(--ease-in-out)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 cursor-pointer ${
          activeView === 'today'
            ? 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-active)]'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)] hover:text-[var(--color-text-primary)] active:bg-[var(--color-active-bg)]'
        }`}
        title="Today"
      >
        <Calendar size={20} />
      </button>
      
      <button
        onClick={() => onNavigate('foods')}
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-[var(--transition-fast)] ease-[var(--ease-in-out)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 cursor-pointer ${
          activeView === 'foods'
            ? 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-active)]'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)] hover:text-[var(--color-text-primary)] active:bg-[var(--color-active-bg)]'
        }`}
        title="Foods"
      >
        <UtensilsCrossed size={20} />
      </button>
      
      <button
        onClick={() => onNavigate('verify')}
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-[var(--transition-fast)] ease-[var(--ease-in-out)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 cursor-pointer ${
          activeView === 'verify'
            ? 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-active)]'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)] hover:text-[var(--color-text-primary)] active:bg-[var(--color-active-bg)]'
        }`}
        title="Verify Ingredients"
      >
        <FlaskConical size={20} />
      </button>
    </aside>
  );
}
