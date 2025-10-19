// File purpose: Search/filter input component for foods and drinks
// Related: FoodsView.jsx uses this for filtering
// Should not include: Search logic, data fetching

import { Search } from 'lucide-react';

/**
 * SearchBar component - input field for filtering items
 * @param {Object} props
 * @param {string} props.value - Current search value
 * @param {Function} props.onChange - Search value change callback
 * @param {string} props.placeholder - Input placeholder text
 */
export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <div className="absolute left-[var(--spacing-md)] top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
        <Search size={16} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-[var(--spacing-lg)] py-[var(--spacing-sm)] text-[var(--font-size-sm)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] transition-colors duration-[var(--transition-fast)]"
      />
    </div>
  );
}
