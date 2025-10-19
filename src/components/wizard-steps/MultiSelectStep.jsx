// File purpose: Multi-select step with badge UI for wizards
// Related: Used in food wizards for selecting ingredients, extras, tags
// Should not include: Single-select logic or complex filtering beyond search

import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { X, Search } from 'lucide-react';

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
 * MultiSelectStep - multi-select with badge UI and "Show more" modal
 * @param {Object} props
 * @param {string} props.label - Label for the selection
 * @param {Array} props.items - All available items
 * @param {Array<string>} props.selectedIds - Array of selected item IDs
 * @param {Function} props.onChange - Change handler (receives array of IDs)
 * @param {Function} props.renderBadge - Badge renderer (receives item) => string or JSX
 * @param {boolean} [props.allowCreate=false] - Allow creating new items
 * @param {Function} [props.onCreateNew] - Handler for creating new item (receives name)
 * @param {number} [props.topCount=8] - Number of top items to show initially
 * @param {Function} [props.groupBy] - Optional grouping function (item) => category
 */
export const MultiSelectStep = memo(function MultiSelectStep({
  label,
  items,
  selectedIds,
  onChange,
  renderBadge,
  allowCreate = false,
  onCreateNew,
  topCount = 8,
  groupBy,
}) {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Get top N items (by usage count if available, otherwise first N)
  const topItems = useMemo(() => 
    [...items]
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, topCount),
    [items, topCount]
  );

  // Filter items based on debounced search
  const filteredItems = useMemo(() => 
    debouncedSearchQuery.trim()
      ? items.filter(item => 
          item.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          item.id?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        )
      : items,
    [items, debouncedSearchQuery]
  );

  // Group items if groupBy function provided
  const groupedItems = useMemo(() => 
    groupBy
      ? filteredItems.reduce((acc, item) => {
          const category = groupBy(item);
          if (!acc[category]) acc[category] = [];
          acc[category].push(item);
          return acc;
        }, {})
      : { 'All': filteredItems },
    [filteredItems, groupBy]
  );

  // Toggle selection
  const toggleItem = useCallback((id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }, [selectedIds, onChange]);

  // Handle add new
  const handleAddNew = useCallback(() => {
    if (newItemName.trim() && onCreateNew) {
      onCreateNew(newItemName.trim());
      setNewItemName('');
    }
  }, [newItemName, onCreateNew]);

  // Render badge for an item
  const renderItemBadge = (item, isSelected) => {
    const badgeContent = typeof renderBadge === 'function' 
      ? renderBadge(item) 
      : item.name;

    return (
      <button
        key={item.id}
        type="button"
        role="checkbox"
        aria-checked={isSelected}
        aria-label={`${isSelected ? 'Deselect' : 'Select'} ${item.name || item.id}`}
        onClick={() => toggleItem(item.id)}
        className={`
          px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap
          ${isSelected 
            ? 'bg-blue-500 text-white shadow-sm hover:bg-blue-600' 
            : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:border-gray-400 hover:shadow-sm'
          }
        `}
      >
        {badgeContent}
      </button>
    );
  };

  const groupId = `multi-select-${label?.replace(/\s+/g, '-').toLowerCase() || 'group'}`;
  
  return (
    <div className="space-y-3">
      {label && (
        <label
          id={`${groupId}-label`}
          className="block text-xs font-semibold text-gray-700 uppercase tracking-wide"
        >
          {label}
        </label>
      )}

      {/* Top items as badges */}
      <div
        role="group"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        className="flex flex-wrap gap-2 min-h-[2rem]"
      >
        {topItems.map(item => 
          renderItemBadge(item, selectedIds.includes(item.id))
        )}
      </div>

      {/* Show more button */}
      {items.length > topCount && (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          aria-label={`Show more ${label || 'items'}`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
        >
          + Show more
        </button>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="multi-select-modal-title"
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 id="multi-select-modal-title" className="text-lg font-semibold text-gray-900">
                {label || 'Select Items'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
                className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Search bar */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="relative">
                <Search 
                  size={18} 
                  className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  aria-label="Search items"
                  className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Scrollable badge grid with optional grouping */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category} className="mb-5 last:mb-0">
                  {groupBy && (
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                      {category}
                    </h4>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {categoryItems.map(item => 
                      renderItemBadge(item, selectedIds.includes(item.id))
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add new section */}
            {allowCreate && onCreateNew && (
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/30">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNew()}
                    placeholder="Add new item..."
                    aria-label="New item name"
                    className="flex-1 px-3.5 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleAddNew}
                    aria-label="Add new item"
                    className="px-5 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 active:bg-blue-700 transition-all shadow-sm"
                  >
                    + Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
