// File purpose: Single-screen modal for creating/editing a food OR drink in the library.
// Replaces: FoodLibraryWizard (4 steps) + DrinkForm. Consistent with MealForm / LogItemModal.
// Should not include: Daily logging, meal management.

import { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { saveFood, saveDrink } from '../services/db';

const FOOD_UNITS = ['pieces', 'slices', 'plate', 'bowl', 'cup', 'g', 'oz', 'serving', 'spoon', 'tablespoon', 'teaspoon'];
const DRINK_UNITS = ['ml', 'L', 'glass', 'cup', 'oz', 'can', 'bottle', 'serving', 'tablespoon', 'teaspoon'];
const COOKING_METHODS = ['raw', 'fried', 'baked', 'boiled', 'steamed', 'grilled', 'roasted', 'stewed', 'sautéed', 'blanched'];
const DRINK_CATEGORIES = ['Water', 'Juice', 'Tea', 'Coffee', 'Dairy', 'Soda', 'Other'];

/**
 * ItemForm – unified modal for food/drink library items.
 * Type toggle (Food / Drink) visible only in create mode.
 *
 * @param {Object|null} props.item    – Existing item to edit; null = create mode
 * @param {'food'|'drink'} props.defaultType – Pre-select type in create mode
 * @param {Function}    props.onSave  – Called after successful save (no args)
 * @param {Function}    props.onCancel
 */
export function ItemForm({ item, defaultType = 'food', onSave, onCancel }) {
  const isEditing = !!item;
  const lockedType = isEditing ? (item.type ?? (item.category ? 'drink' : 'food')) : null;

  const [type, setType] = useState(lockedType ?? defaultType);
  const [name, setName] = useState(item?.name ?? '');
  const [defaultQuantity, setDefaultQty] = useState(item?.defaultQuantity ?? 1);
  const [defaultUnit, setDefaultUnit] = useState(item?.defaultUnit ?? (defaultType === 'drink' ? 'glass' : 'pieces'));
  const [cookingMethod, setCookingMethod] = useState(item?.defaultCookingMethod ?? '');
  const [category, setCategory] = useState(item?.category ?? 'Other');
  const [tags, setTags] = useState(item?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [notes, setNotes] = useState(item?.notes ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const tagRef = useRef(null);
  const nameRef = useRef(null);

  // Focus name on open
  useEffect(() => { setTimeout(() => nameRef.current?.focus(), 50); }, []);

  // Keyboard shortcuts: ESC to cancel, Enter to submit
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter' && !e.shiftKey && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel, handleSubmit]);

  // Reset unit default when type changes in create mode
  useEffect(() => {
    if (!isEditing) setDefaultUnit(type === 'drink' ? 'glass' : 'pieces');
  }, [type]);

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim();
      if (!tags.includes(tag)) setTags([...tags, tag]);
      setTagInput('');
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim()) {
      const tag = tagInput.trim();
      if (!tags.includes(tag)) setTags([...tags, tag]);
      setTagInput('');
      tagRef.current?.focus();
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Name is required.'); return; }
    if (Number(defaultQuantity) <= 0) { setError('Default quantity must be greater than 0.'); return; }
    setError('');
    setSaving(true);
    try {
      const base = {
        ...(item ?? {}),
        name: name.trim(),
        defaultQuantity: Number(defaultQuantity),
        defaultUnit,
        tags,
        notes: notes.trim() || null,
        type,
      };

      if (type === 'drink') {
        await saveDrink({ ...base, category });
      } else {
        await saveFood({ ...base, defaultCookingMethod: cookingMethod || null });
      }
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      {/* Panel */}
      <div className="relative w-full sm:max-w-md bg-[var(--color-bg-primary)] rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[var(--color-border-primary)] overflow-hidden max-h-[95vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
            {isEditing ? `Edit ${type === 'drink' ? 'Drink' : 'Food'}` : 'Add to Library'}
          </h2>
          <button onClick={onCancel} className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)] transition-colors">
            <X size={17} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-5 space-y-4">

          {/* ── Type toggle (create mode only) ── */}
          {!isEditing && (
            <div className="grid grid-cols-2 gap-2">
              {['food', 'drink'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 rounded-xl border text-sm font-medium capitalize transition-all ${type === t
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                    : 'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-hover-bg)]'
                    }`}
                >
                  {t === 'food' ? '🍽 Food' : '🥤 Drink'}
                </button>
              ))}
            </div>
          )}

          {/* ── Name ── */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-[var(--color-text-secondary)] uppercase tracking-wide">Name *</label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={type === 'drink' ? 'e.g., Mint Tea' : 'e.g., Chicken Breast'}
              className="w-full px-3 py-2.5 md:py-2 border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none text-sm transition-all"
            />
          </div>

          {/* ── Drink category ── */}
          {type === 'drink' && (
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-[var(--color-text-secondary)] uppercase tracking-wide">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {DRINK_CATEGORIES.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${category === c
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                      : 'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/40'
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Default quantity + unit ── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-[var(--color-text-secondary)] uppercase tracking-wide">Default Qty *</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={defaultQuantity}
                onChange={e => setDefaultQty(e.target.value)}
                className="w-full px-3 py-2.5 md:py-2 border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-[var(--color-text-secondary)] uppercase tracking-wide">Default Unit *</label>
              <select
                value={defaultUnit}
                onChange={e => setDefaultUnit(e.target.value)}
                className="w-full px-3 py-2.5 md:py-2 border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] outline-none text-sm bg-[var(--color-bg-primary)] transition-all"
              >
                {(type === 'drink' ? DRINK_UNITS : FOOD_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* ── Cooking method (food only) ── */}
          {type === 'food' && (
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-[var(--color-text-secondary)] uppercase tracking-wide">
                Default Cooking <span className="normal-case font-normal opacity-70">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COOKING_METHODS.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setCookingMethod(cookingMethod === m ? '' : m)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border capitalize transition-all ${cookingMethod === m
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                      : 'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/40'
                      }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Tags ── */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-[var(--color-text-secondary)] uppercase tracking-wide">
              Tags <span className="normal-case font-normal opacity-70">(optional)</span>
            </label>
            {/* Tag pills display */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs rounded-full font-medium">
                    {tag}
                    <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:opacity-60">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* Tag input */}
            <div className="flex gap-2">
              <input
                ref={tagRef}
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tag…"
                className="flex-1 px-3 py-2 md:py-1.5 text-xs border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none bg-[var(--color-bg-primary)] transition-all"
              />
              <button
                type="button"
                onClick={handleTagAdd}
                className="shrink-0 p-2 text-white bg-[var(--color-accent)] hover:opacity-90 rounded-lg transition-all touch-manipulation"
                title="Add tag"
              >
                <Plus size={16} className="md:w-[14px] md:h-[14px]" />
              </button>
            </div>
          </div>

          {/* ── Notes ── */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-[var(--color-text-secondary)] uppercase tracking-wide">
              Notes <span className="normal-case font-normal opacity-70">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Anything worth remembering about this item…"
              rows={2}
              className="w-full px-3 py-2 border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none text-sm resize-none bg-[var(--color-bg-primary)] transition-all"
            />
          </div>

          {/* ── Error ── */}
          {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}

          {/* ── Actions ── */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 text-sm font-medium border border-[var(--color-border-primary)] rounded-lg hover:bg-[var(--color-hover-bg)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex-[2] py-2.5 text-sm font-semibold bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {saving ? 'Saving…' : isEditing ? 'Save Changes' : `Add ${type === 'drink' ? 'Drink' : 'Food'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
