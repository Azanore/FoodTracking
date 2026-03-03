// File purpose: Unified modal for logging food/drink items into a specific meal.
// Related: MealCard.jsx triggers this. Always locked to the meal that opened it.
// Should not include: Meal creation logic, meal routing, tag management.

import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { getAllFoods, getAllDrinks, incrementFoodUsage, incrementDrinkUsage } from '../services/db';

const FOOD_UNITS = ['pieces', 'slices', 'plate', 'bowl', 'cup', 'g', 'oz', 'serving', 'spoon', 'tablespoon', 'teaspoon'];
const DRINK_UNITS = ['ml', 'L', 'glass', 'cup', 'oz', 'can', 'bottle', 'serving', 'tablespoon', 'teaspoon'];
const COOKING_METHODS = ['raw', 'fried', 'baked', 'boiled', 'steamed', 'grilled', 'roasted', 'stewed', 'sautéed', 'blanched'];

/**
 * LogItemModal – 2-phase modal: search → quantity/unit/cooking.
 * Always saves to the meal that opened it (no meal-switching inside modal).
 *
 * @param {boolean}     isOpen          – controls visibility
 * @param {Function}    onClose         – close callback
 * @param {Function}    onSave          – called with the pointer entry object
 * @param {string}      mealLabel       – display label shown in the header
 * @param {Object|null} preSelectedItem – if set, skip search and jump to quantity phase
 */
export function LogItemModal({ isOpen, onClose, onSave, mealLabel, preSelectedItem = null }) {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('');
  const [cookingMethod, setCookingMethod] = useState('');
  const searchRef = useRef(null);

  // Load all foods + drinks on open, reset form state
  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      const foods = await getAllFoods();
      const drinks = await getAllDrinks();
      setItems([...foods, ...drinks].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)));
    };
    load();
    setSearchQuery('');
    setCookingMethod('');

    // If a specific item is pre-selected (Quick Log), jump straight to quantity phase
    if (preSelectedItem) {
      setSelectedItem(preSelectedItem);
      setQuantity(preSelectedItem.defaultMeasurement?.amount ?? preSelectedItem.defaultQuantity ?? 1);
      setUnit(preSelectedItem.defaultMeasurement?.unit ?? preSelectedItem.defaultUnit ?? 'pieces');
      setCookingMethod(preSelectedItem.defaultCookingMethod ?? '');
    } else {
      setSelectedItem(null);
      setQuantity(1);
      setUnit('');
    }
  }, [isOpen]);

  // Auto-focus
  useEffect(() => {
    if (isOpen && !selectedItem) setTimeout(() => searchRef.current?.focus(), 50);
  }, [isOpen, selectedItem]);

  // Escape to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items.slice(0, 20);
    return items
      .filter(i => i.name.toLowerCase().includes(q) || (i.category && i.category.toLowerCase().includes(q)))
      .slice(0, 20);
  }, [items, searchQuery]);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setQuantity(item.defaultMeasurement?.amount ?? item.defaultQuantity ?? 1);
    setUnit(item.defaultMeasurement?.unit ?? item.defaultUnit ?? 'pieces');
    setCookingMethod(item.defaultCookingMethod ?? '');
  };

  const handleSave = async () => {
    if (!selectedItem || Number(quantity) <= 0) return;

    const entry = {
      refId: selectedItem.id,
      name: selectedItem.name,
      quantity: Number(quantity),
      unit,
      cookingMethod: cookingMethod || null,
      type: selectedItem.type || 'food',
      category: selectedItem.category || '',
    };

    try {
      if (selectedItem.type === 'drink') await incrementDrinkUsage(selectedItem.id);
      else await incrementFoodUsage(selectedItem.id);
    } catch (e) {
      console.error('Failed to increment usage:', e);
    }

    onSave(entry);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full md:max-w-md bg-[var(--color-bg-primary)] rounded-t-2xl md:rounded-2xl shadow-2xl border-t md:border border-[var(--color-border-primary)] flex flex-col max-h-[90vh] md:max-h-[85vh]">

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Log Item</h2>
            {mealLabel && (
              <p className="text-xs text-[var(--color-accent)] font-medium mt-0.5">{mealLabel}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 md:p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)] transition-colors touch-manipulation"
          >
            <X size={18} className="md:w-[17px] md:h-[17px]" />
          </button>
        </div>

        {/* ── Phase 1: Search ── */}
        {!selectedItem ? (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="px-5 pb-3 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={15} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search foods and drinks…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 md:py-2 text-sm border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none bg-[var(--color-bg-secondary)] transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-4">
              {filteredItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full flex justify-between items-center px-3 py-3 md:py-2.5 text-left hover:bg-[var(--color-hover-bg)] rounded-lg transition-colors touch-manipulation"
                >
                  <div>
                    <div className="text-sm font-medium text-[var(--color-text-primary)]">{item.name}</div>
                    <div className="text-xs text-[var(--color-text-secondary)] capitalize">
                      {item.category || item.type} · {item.defaultQuantity} {item.defaultUnit}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2.5 md:px-2 py-1 md:py-0.5 rounded-full ml-2 shrink-0">
                    Select
                  </span>
                </button>
              ))}
              {filteredItems.length === 0 && searchQuery && (
                <p className="text-center text-sm text-[var(--color-text-secondary)] py-10">
                  No matches for "{searchQuery}"
                </p>
              )}
            </div>
          </div>
        ) : (
          /* ── Phase 2: Quantity / unit / cooking ── */
          <div className="px-5 pb-5 overflow-y-auto flex-1">
            {/* Selected item chip */}
            <div className="flex items-center gap-3 mb-5 p-3 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-primary)]">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-[var(--color-text-primary)] truncate">{selectedItem.name}</div>
                <div className="text-xs text-[var(--color-text-secondary)] capitalize">{selectedItem.category || selectedItem.type}</div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-xs text-[var(--color-accent)] hover:underline font-medium whitespace-nowrap touch-manipulation px-2 py-1"
              >
                Change
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Quantity */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--color-text-secondary)] uppercase tracking-wide">Quantity</label>
                <input
                  autoFocus
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="w-full px-3 py-2.5 md:py-2 border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none text-sm transition-all"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--color-text-secondary)] uppercase tracking-wide">Unit</label>
                <select
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-full px-3 py-2.5 md:py-2 border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] outline-none text-sm bg-[var(--color-bg-primary)] transition-all"
                >
                  {(selectedItem.type === 'drink' ? DRINK_UNITS : FOOD_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            {/* Cooking method — foods only */}
            {selectedItem.type !== 'drink' && (
              <div className="mb-5">
                <label className="block text-xs font-semibold mb-1 text-[var(--color-text-secondary)] uppercase tracking-wide">Cooking Method</label>
                <select
                  value={cookingMethod}
                  onChange={e => setCookingMethod(e.target.value)}
                  className="w-full px-3 py-2.5 md:py-2 border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] outline-none text-sm bg-[var(--color-bg-primary)] transition-all"
                >
                  <option value="">Not specified</option>
                  {COOKING_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2.5 md:gap-2 mt-4">
              {/* Back button only shown when user picked from search, not when item was pre-selected */}
              {!preSelectedItem && (
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 py-3 md:py-2.5 text-sm font-medium border border-[var(--color-border-primary)] rounded-lg hover:bg-[var(--color-hover-bg)] transition-colors touch-manipulation"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!quantity || Number(quantity) <= 0}
                className="flex-[2] py-3 md:py-2.5 text-sm font-semibold bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all touch-manipulation"
              >
                Save to {mealLabel?.split(' ·')[0] ?? 'Meal'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
