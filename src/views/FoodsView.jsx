// File purpose: Food and drink library — browse, add, edit, delete, and quick-log to today.
// Related: App.jsx renders this, ItemForm.jsx for add/edit, LogItemModal.jsx for quick-log.
// Should not include: Daily meal management, settings.

import { useState, useEffect, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { FoodCard } from '../components/FoodCard';
import { DrinkCard } from '../components/DrinkCard';
import { ItemForm } from '../components/ItemForm';
import { LogItemModal } from '../components/LogItemModal';
import { getAllFoods, getAllDrinks, deleteFood, deleteDrink, getDailyLog, saveDailyLog } from '../services/db';

// ── Helpers ──────────────────────────────────────────────────────────────────

const getTodayDate = () => new Date().toISOString().split('T')[0];
const generateId   = (p) => `${p}_${crypto.randomUUID().slice(0, 8)}`;

const getMealTypeForTime = (time) => {
  const [h] = time.split(':').map(Number);
  if (h >= 5  && h < 11) return 'Breakfast';
  if (h >= 11 && h < 16) return 'Lunch';
  if (h >= 16 && h < 22) return 'Dinner';
  return 'Snack';
};

const getCurrentTime = () => {
  const n = new Date();
  return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
};

const buildDefaultMeals = () => [
  { id: generateId('meal'), type: 'Breakfast', time: '07:30', tags: [], notes: null, foods: [], drinks: [] },
  { id: generateId('meal'), type: 'Lunch',     time: '13:00', tags: [], notes: null, foods: [], drinks: [] },
  { id: generateId('meal'), type: 'Snack',     time: '16:00', tags: [], notes: null, foods: [], drinks: [] },
  { id: generateId('meal'), type: 'Dinner',    time: '20:00', tags: [], notes: null, foods: [], drinks: [] },
];

// ── Component ────────────────────────────────────────────────────────────────

export function FoodsView() {
  const [activeTab, setActiveTab]     = useState('foods');
  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods]             = useState([]);
  const [drinks, setDrinks]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // ItemForm state
  const [showItemForm, setShowItemForm]     = useState(false);
  const [editingItem, setEditingItem]       = useState(null);
  const [itemFormType, setItemFormType]     = useState('food');

  // Quick-log modal state
  const [quickLogItem, setQuickLogItem]           = useState(null); // { item, log, targetMeal }
  const [quickLogMealLabel, setQuickLogMealLabel] = useState('');

  // ── Data loading ──────────────────────────────────────────────────────────

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [f, d] = await Promise.all([getAllFoods(), getAllDrinks()]);
      setFoods(f);
      setDrinks(d);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── Filtering ─────────────────────────────────────────────────────────────

  const filteredFoods = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return foods.filter(f =>
      f.name.toLowerCase().includes(q) ||
      (f.tags && f.tags.some(t => t.toLowerCase().includes(q)))
    );
  }, [foods, searchQuery]);

  const filteredDrinks = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return drinks.filter(d =>
      d.name.toLowerCase().includes(q) ||
      (d.category && d.category.toLowerCase().includes(q)) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(q)))
    );
  }, [drinks, searchQuery]);

  // ── Add / Edit ────────────────────────────────────────────────────────────

  const openAdd = (type) => {
    setEditingItem(null);
    setItemFormType(type);
    setShowItemForm(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setItemFormType(item.type ?? (item.category ? 'drink' : 'food'));
    setShowItemForm(true);
  };

  const handleItemSave = async () => {
    setShowItemForm(false);
    setEditingItem(null);
    await fetchData();
  };

  // ── Delete (handled in cards with 2-step confirm) ─────────────────────────

  const handleDeleteFood = async (id) => {
    try { await deleteFood(id); await fetchData(); }
    catch (err) { setError(err.message); }
  };

  const handleDeleteDrink = async (id) => {
    try { await deleteDrink(id); await fetchData(); }
    catch (err) { setError(err.message); }
  };

  // ── Quick log to today ────────────────────────────────────────────────────
  // Opens LogItemModal pre-loaded with the item, targeting today's relevant meal.

  const handleQuickLog = async (item) => {
    const date = getTodayDate();
    let log = await getDailyLog(date);
    if (!log) {
      log = {
        id: generateId('day'), date,
        tags: [], dayNotes: null,
        meals: buildDefaultMeals(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveDailyLog(log);
    } else if (!log.meals) {
      log.meals = buildDefaultMeals();
    }

    const time = getCurrentTime();
    const targetType = getMealTypeForTime(time);
    const targetMeal = log.meals.find(m => m.type === targetType) ?? log.meals[0];

    setQuickLogMealLabel(`${targetMeal.type} · ${targetMeal.time}`);
    setQuickLogItem({ item, log, targetMeal });
  };

  const handleQuickLogSave = async (entry) => {
    if (!quickLogItem) return;
    const { log, targetMeal } = quickLogItem;
    const updatedMeal = entry.type === 'drink'
      ? { ...targetMeal, drinks: [...targetMeal.drinks, entry] }
      : { ...targetMeal, foods:  [...targetMeal.foods,  entry] };
    const updatedLog = {
      ...log,
      meals: log.meals.map(m => m.id === targetMeal.id ? updatedMeal : m),
      updatedAt: new Date().toISOString(),
    };
    await saveDailyLog(updatedLog);
    setQuickLogItem(null);
    await fetchData(); // refresh usage counts
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="flex-1 p-[var(--spacing-2xl)]">
      <p className="text-sm text-[var(--color-text-secondary)]">Loading…</p>
    </div>
  );

  if (error) return (
    <div className="flex-1 p-[var(--spacing-2xl)]">
      <p className="text-sm text-[var(--color-danger)]">Error: {error}</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0">

      {/* ── Sticky header (title + add button + tabs + search) ── */}
      <div className="sticky top-0 z-10 bg-[var(--color-bg-secondary)] px-[var(--spacing-2xl)] pt-[var(--spacing-2xl)] pb-4 border-b border-[var(--color-border-primary)]">

        {/* Title row */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Library</h1>
          <button
            onClick={() => openAdd(activeTab === 'drinks' ? 'drink' : 'food')}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-all"
          >
            <Plus size={15} />
            Add {activeTab === 'drinks' ? 'Drink' : 'Food'}
          </button>
        </div>

        {/* Tabs + Search */}
        <div className="flex items-center gap-4">
          <div className="flex border-b border-[var(--color-border-primary)] shrink-0">
            {['foods', 'drinks'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 mr-4 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                    : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {tab === 'foods' ? `Foods (${foods.length})` : `Drinks (${drinks.length})`}
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}…`}
              className="w-full pl-8 pr-4 py-1.5 text-sm border border-[var(--color-border-primary)] rounded-lg focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none bg-[var(--color-bg-secondary)] transition-all"
            />
          </div>
        </div>
      </div>{/* end sticky header */}

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto p-[var(--spacing-2xl)]">

      {/* ── Foods grid ── */}
      {activeTab === 'foods' && (
        filteredFoods.length === 0 ? (
          <p className="text-center text-sm text-[var(--color-text-secondary)] py-16">
            {searchQuery ? `No foods match "${searchQuery}"` : 'No custom foods yet. Add your first!'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-lg)]">
            {filteredFoods.map(food => (
              <FoodCard
                key={food.id}
                food={food}
                onEdit={food.id.startsWith('g_') ? null : () => openEdit(food)}
                onDelete={food.id.startsWith('g_') ? null : () => handleDeleteFood(food.id)}
                onQuickLog={() => handleQuickLog(food)}
              />
            ))}
          </div>
        )
      )}

      {/* ── Drinks grid ── */}
      {activeTab === 'drinks' && (
        filteredDrinks.length === 0 ? (
          <p className="text-center text-sm text-[var(--color-text-secondary)] py-16">
            {searchQuery ? `No drinks match "${searchQuery}"` : 'No custom drinks yet. Add your first!'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-lg)]">
            {filteredDrinks.map(drink => (
              <DrinkCard
                key={drink.id}
                drink={drink}
                onEdit={drink.id.startsWith('g_') ? null : () => openEdit(drink)}
                onDelete={drink.id.startsWith('g_') ? null : () => handleDeleteDrink(drink.id)}
                onQuickLog={() => handleQuickLog(drink)}
              />
            ))}
          </div>
        )
      )}

        {/* ── Item add/edit form ── */}
        {showItemForm && (
          <ItemForm
            item={editingItem}
            defaultType={itemFormType}
            onSave={handleItemSave}
            onCancel={() => { setShowItemForm(false); setEditingItem(null); }}
          />
        )}

        {/* ── Quick-log modal ── */}
        {quickLogItem && (
          <LogItemModal
            isOpen
            onClose={() => setQuickLogItem(null)}
            onSave={handleQuickLogSave}
            mealLabel={quickLogMealLabel}
            preSelectedItem={quickLogItem.item}
          />
        )}
      </div>{/* end scrollable content */}
    </div>
  );
}
