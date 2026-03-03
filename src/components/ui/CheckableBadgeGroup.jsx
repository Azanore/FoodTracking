// File purpose: Multi-select badge group with "Show all" modal
// Related: Used in forms for multi-select functionality
// Should not include: Single-select logic or complex filtering beyond search

import { useState } from 'react';
import { X, Search } from 'lucide-react';

/**
 * CheckableBadgeGroup - multi-select badge group with modal for full list
 * @param {Object} props
 * @param {Array<{id: string, name: string, usageCount: number}>} props.items - All available items
 * @param {Array<string>} props.selectedIds - Array of selected item IDs
 * @param {Function} props.onChange - Change handler (receives array of IDs)
 * @param {Function} props.onAddNew - Handler for adding new item (receives name string)
 * @param {number} [props.topCount=8] - Number of top items to show initially
 * @param {string} [props.label] - Optional label text
 * @param {string} [props.className] - Additional classes
 */
export function CheckableBadgeGroup({
  items,
  selectedIds,
  onChange,
  onAddNew,
  topCount = 8,
  label,
  className = ''
}) {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItemName, setNewItemName] = useState('');

  // Sort by usage count and get top N
  const topItems = [...items]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, topCount);

  // Filter items based on search
  const filteredItems = searchQuery
    ? items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : items;

  // Toggle selection
  const toggleItem = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  // Handle add new
  const handleAddNew = () => {
    if (newItemName.trim()) {
      onAddNew(newItemName.trim());
      setNewItemName('');
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-[var(--color-text-primary)] mb-2 uppercase tracking-wide">
          {label}
        </label>
      )}

      {/* Top items as badges */}
      <div className="flex flex-wrap gap-2 mb-2">
        {topItems.map(item => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              className={`
                px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap
                ${isSelected
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:bg-[var(--color-hover-bg)] hover:border-[var(--color-border-secondary)]'
                }
              `}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      {/* Show all button */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="text-xs font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] hover:underline"
      >
        + Show all
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[var(--color-text-primary)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--color-bg-primary)] rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col border border-[var(--color-border-primary)]">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-primary)]">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Select Items</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search bar */}
            <div className="p-4 border-b border-[var(--color-border-primary)]">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items..."
                  className="w-full pl-10 pr-3 py-2 border border-[var(--color-border-primary)] rounded text-sm text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
                />
              </div>
            </div>

            {/* Scrollable badge grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-wrap gap-2">
                {filteredItems.map(item => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className={`
                        px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap
                        ${isSelected
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:bg-[var(--color-hover-bg)] hover:border-[var(--color-border-secondary)]'
                        }
                      `}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add new section */}
            <div className="p-4 border-t border-[var(--color-border-primary)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNew()}
                  placeholder="Add new item..."
                  className="flex-1 px-3 py-2 border border-[var(--color-border-primary)] rounded text-sm text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
                />
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="px-4 py-2 bg-[var(--color-accent)] text-white rounded text-sm font-medium hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-active)] transition-colors"
                >
                  + Add new
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
