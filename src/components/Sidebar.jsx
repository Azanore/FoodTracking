// File purpose: Responsive navigation - bottom bar on mobile, sidebar on desktop
// Related: App.jsx uses this for navigation
// Should not include: View content, complex state management

import { Calendar, UtensilsCrossed, BarChart3, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'today', icon: Calendar, label: 'Today' },
  { id: 'foods', icon: UtensilsCrossed, label: 'Library' },
  { id: 'stats', icon: BarChart3, label: 'Stats' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ activeView, onNavigate }) {
  return (
    <>
      {/* Mobile: Bottom navigation bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-bg-primary)] border-t border-[var(--color-border-primary)] z-40">
        <div className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[68px] ${activeView === id
                ? 'text-[var(--color-accent)]'
                : 'text-[var(--color-text-secondary)]'
                }`}
            >
              <Icon size={22} strokeWidth={activeView === id ? 2.5 : 2} />
              <span className={`text-xs ${activeView === id ? 'font-semibold' : 'font-medium'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop: Side navigation bar */}
      <aside className="hidden md:flex w-16 bg-[var(--color-bg-primary)] border-r border-[var(--color-border-primary)] flex-col items-center py-4 gap-2">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${activeView === id
              ? 'bg-[var(--color-accent)] text-white'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)] hover:text-[var(--color-text-primary)]'
              }`}
            title={label}
          >
            <Icon size={20} strokeWidth={activeView === id ? 2.5 : 2} />
          </button>
        ))}
      </aside>
    </>
  );
}
