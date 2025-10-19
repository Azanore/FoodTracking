// File purpose: Reusable search and select step for wizards
// Related: Used in food wizards for selecting from searchable lists
// Should not include: Multi-select logic or complex state management

import { useState, useEffect, useMemo, memo } from 'react';
import { Search } from 'lucide-react';

// Debounce hook for search input with cleanup on unmount
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel pending timeout on unmount or value change
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * SearchSelectStep - search and select from a list with optional create new
 * @param {Object} props
 * @param {Array} props.items - Array of items to search
 * @param {string} props.selectedId - Currently selected item ID
 * @param {Function} props.onSelect - Selection handler (receives item)
 * @param {string} [props.searchPlaceholder='Search...'] - Search input placeholder
 * @param {Function} props.renderItem - Custom item renderer (receives item)
 * @param {Function} [props.filterFn] - Custom filter function (item, query) => boolean
 * @param {string} [props.emptyMessage='No items found'] - Message when no results
 * @param {boolean} [props.allowCreate=false] - Show "Create new" option
 * @param {Function} [props.onCreateNew] - Handler for creating new item (receives name)
 */
export const SearchSelectStep = memo(function SearchSelectStep({
  items,
  selectedId,
  onSelect,
  searchPlaceholder = 'Search...',
  renderItem,
  filterFn,
  emptyMessage = 'No items found',
  allowCreate = false,
  onCreateNew,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Default filter function
  const defaultFilterFn = (item, query) => {
    const searchStr = query.toLowerCase();
    return item.name?.toLowerCase().includes(searchStr) || 
           item.id?.toLowerCase().includes(searchStr);
  };

  const filter = filterFn || defaultFilterFn;

  // Filter items based on debounced search query
  const filteredItems = useMemo(() => {
    if (!debouncedQuery.trim()) return items;
    return items.filter(item => filter(item, debouncedQuery));
  }, [items, debouncedQuery, filter]);

  const hasResults = filteredItems.length > 0;
  const showCreateOption = allowCreate && debouncedQuery.trim() && !hasResults;

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search 
          size={18} 
          className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <input
          id="search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          aria-controls="search-results"
          className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          autoFocus
        />
      </div>

      {/* Filtered list */}
      <div
        id="search-results"
        role="listbox"
        aria-label="Search results"
        className="max-h-96 overflow-y-auto border-2 border-gray-200 rounded-lg shadow-sm"
      >
        {hasResults ? (
          <div className="divide-y divide-gray-100">
            {filteredItems.map(item => {
              const isSelected = selectedId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelect(item)}
                  className={`
                    w-full text-left px-4 py-3.5 transition-all
                    ${isSelected 
                      ? 'bg-blue-50 border-l-4 border-blue-500 font-medium' 
                      : 'hover:bg-gray-50 border-l-4 border-transparent'
                    }
                  `}
                >
                  {renderItem(item)}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-4 py-12 text-center text-gray-500 text-sm" role="status">
            {emptyMessage}
          </div>
        )}
      </div>

      {/* Create new option */}
      {showCreateOption && (
        <button
          type="button"
          onClick={() => onCreateNew(debouncedQuery)}
          aria-label={`Create new item: ${debouncedQuery}`}
          className="w-full px-4 py-3.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all"
        >
          + Create new: "{debouncedQuery}"
        </button>
      )}
    </div>
  );
});
