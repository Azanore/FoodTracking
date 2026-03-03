// File purpose: Food and drink library management view
// Related: App.jsx renders this view, FoodCard.jsx and DrinkCard.jsx for display
// Wizard Integration: Includes FoodLibraryWizard for guided food creation/editing (accessible via "Add Food (Wizard)" button)
// Should not include: Daily logging, meal management

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { FoodCard } from '../components/FoodCard';
import { DrinkCard } from '../components/DrinkCard';
import { DrinkForm } from '../components/DrinkForm';
import { FoodLibraryWizard } from '../components/food-wizards/FoodLibraryWizard';
import { Button } from '../components/ui/Button';
import { getAllFoods, getAllDrinks, deleteFood, deleteDrink, getDailyLog, saveDailyLog, incrementFoodUsage, incrementDrinkUsage } from '../services/db';

export function FoodsView() {
  const [activeTab, setActiveTab] = useState('foods');
  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showDrinkForm, setShowDrinkForm] = useState(false);
  const [showFoodWizard, setShowFoodWizard] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [editingDrink, setEditingDrink] = useState(null);

  // Fetch foods and drinks
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [foodsData, drinksData] = await Promise.all([
        getAllFoods(),
        getAllDrinks()
      ]);

      setFoods(foodsData);
      setDrinks(drinksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle add food (wizard)
  const handleAddFoodWizard = () => {
    setEditingFood(null);
    setShowFoodWizard(true);
  };

  // Handle edit food (wizard)
  const handleEditFoodWizard = (food) => {
    setEditingFood(food);
    setShowFoodWizard(true);
  };

  // Handle delete food
  const handleDeleteFood = async (foodId) => {
    if (!confirm('Are you sure you want to delete this food? It will be removed from the library but preserved in historical logs.')) {
      return;
    }
    
    try {
      await deleteFood(foodId);
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle food wizard complete
  const handleFoodWizardComplete = async () => {
    setShowFoodWizard(false);
    setEditingFood(null);
    await fetchData();
  };

  // Handle add drink
  const handleAddDrink = () => {
    setEditingDrink(null);
    setShowDrinkForm(true);
  };

  // Handle edit drink
  const handleEditDrink = (drink) => {
    setEditingDrink(drink);
    setShowDrinkForm(true);
  };

  // Handle delete drink
  const handleDeleteDrink = async (drinkId) => {
    if (!confirm('Are you sure you want to delete this drink? It will be removed from the library but preserved in historical logs.')) {
      return;
    }
    
    try {
      await deleteDrink(drinkId);
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle drink form save
  const handleDrinkSave = async () => {
    setShowDrinkForm(false);
    setEditingDrink(null);
    await fetchData();
  };

  // Handle one-tap quick log
  const handleQuickLogItem = async (item, type) => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      let log = await getDailyLog(currentDate);
      
      if (!log) {
        log = {
          id: `day_${currentDate}_${crypto.randomUUID().slice(0, 8)}`,
          date: currentDate,
          tags: [],
          dayNotes: null,
          meals: [],
          foods: [],
          drinks: [],
          notices: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } else {
        if (!log.foods) log.foods = [];
        if (!log.drinks) log.drinks = [];
      }
      
      const quantity = item.defaultMeasurement?.amount || item.defaultQuantity || 1;
      const unit = item.defaultMeasurement?.unit || item.defaultUnit || 'pieces';
      
      const entry = {
        refId: item.id,
        name: item.name,
        quantity: quantity,
        unit: unit,
        type: type,
        category: item.category || ''
      };
      
      if (type === 'food') {
        log.foods.push(entry);
        await incrementFoodUsage(item.id);
      } else if (type === 'drink') {
        log.drinks.push(entry);
        await incrementDrinkUsage(item.id);
      }
      
      await saveDailyLog(log);
      await fetchData(); // Refresh usage stats
    } catch (err) {
      console.error("Failed to quick log:", err);
    }
  };

  // Filter foods based on search query
  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (food.tags && food.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
    (food.ingredients && food.ingredients.some(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Filter drinks based on search query
  const filteredDrinks = drinks.filter(drink =>
    drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (drink.category && drink.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (drink.tags && drink.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  if (loading) {
    return (
      <div className="flex-1" style={{ padding: 'var(--spacing-2xl)' }}>
        <p style={{ 
          fontSize: 'var(--font-size-sm)', 
          color: 'var(--color-text-secondary)' 
        }}>
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1" style={{ padding: 'var(--spacing-2xl)' }}>
        <p style={{ 
          fontSize: 'var(--font-size-sm)', 
          color: 'var(--color-danger)' 
        }}>
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1" style={{ padding: 'var(--spacing-2xl)' }}>
      {/* Header with add button */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <h1 style={{ 
          fontSize: 'var(--font-size-xl)', 
          fontWeight: 'var(--font-weight-semibold)', 
          color: 'var(--color-text-primary)' 
        }}>
          Foods Library
        </h1>
        {activeTab === 'foods' ? (
          <Button onClick={handleAddFoodWizard} variant="primary">
            <div className="flex items-center" style={{ gap: 'var(--spacing-sm)' }}>
              <Plus size={16} />
              Add Food
            </div>
          </Button>
        ) : (
          <Button onClick={handleAddDrink} variant="primary">
            <div className="flex items-center" style={{ gap: 'var(--spacing-sm)' }}>
              <Plus size={16} />
              Add Drink
            </div>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div 
        className="flex border-b" 
        style={{ 
          gap: 'var(--spacing-lg)', 
          marginBottom: 'var(--spacing-2xl)',
          borderColor: 'var(--color-border-primary)'
        }}
      >
        <button
          onClick={() => setActiveTab('foods')}
          className="focus:outline-none focus:ring-2 rounded-t cursor-pointer"
          style={{
            paddingBottom: 'var(--spacing-sm)',
            paddingLeft: 'var(--spacing-xs)',
            paddingRight: 'var(--spacing-xs)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            transition: `all var(--transition-fast) var(--ease-in-out)`,
            color: activeTab === 'foods' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            borderBottom: activeTab === 'foods' ? 'var(--border-width-medium) solid var(--color-accent)' : 'none',
            marginBottom: activeTab === 'foods' ? 'calc(var(--border-width-medium) * -1)' : '0'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'foods') {
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'foods') {
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }
          }}
        >
          Foods ({foods.length})
        </button>
        <button
          onClick={() => setActiveTab('drinks')}
          className="focus:outline-none focus:ring-2 rounded-t cursor-pointer"
          style={{
            paddingBottom: 'var(--spacing-sm)',
            paddingLeft: 'var(--spacing-xs)',
            paddingRight: 'var(--spacing-xs)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            transition: `all var(--transition-fast) var(--ease-in-out)`,
            color: activeTab === 'drinks' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            borderBottom: activeTab === 'drinks' ? 'var(--border-width-medium) solid var(--color-accent)' : 'none',
            marginBottom: activeTab === 'drinks' ? 'calc(var(--border-width-medium) * -1)' : '0'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'drinks') {
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'drinks') {
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }
          }}
        >
          Drinks ({drinks.length})
        </button>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={`Search ${activeTab}...`}
        />
      </div>

      {/* Foods tab content */}
      {activeTab === 'foods' && (
        <div>
          {filteredFoods.length === 0 ? (
            <p 
              className="text-center" 
              style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--color-text-secondary)',
                paddingTop: 'var(--spacing-3xl)',
                paddingBottom: 'var(--spacing-3xl)'
              }}
            >
              {searchQuery
                ? 'No foods found matching your search'
                : 'No foods in library yet. Add your first food!'}
            </p>
          ) : (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              style={{ gap: 'var(--spacing-lg)' }}
            >
              {filteredFoods.map((food) => (
                <FoodCard 
                  key={food.id} 
                  food={food}
                  onEdit={food.id.startsWith('g_') ? null : () => handleEditFoodWizard(food)}
                  onDelete={food.id.startsWith('g_') ? null : () => handleDeleteFood(food.id)}
                  onQuickLog={() => handleQuickLogItem(food, 'food')}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Drinks tab content */}
      {activeTab === 'drinks' && (
        <div>
          {filteredDrinks.length === 0 ? (
            <p 
              className="text-center" 
              style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--color-text-secondary)',
                paddingTop: 'var(--spacing-3xl)',
                paddingBottom: 'var(--spacing-3xl)'
              }}
            >
              {searchQuery
                ? 'No drinks found matching your search'
                : 'No drinks in library yet. Add your first drink!'}
            </p>
          ) : (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              style={{ gap: 'var(--spacing-lg)' }}
            >
              {filteredDrinks.map((drink) => (
                <DrinkCard 
                  key={drink.id} 
                  drink={drink}
                  onEdit={drink.id.startsWith('g_') ? null : () => handleEditDrink(drink)}
                  onDelete={drink.id.startsWith('g_') ? null : () => handleDeleteDrink(drink.id)}
                  onQuickLog={() => handleQuickLogItem(drink, 'drink')}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Food wizard modal */}
      {showFoodWizard && (
        <FoodLibraryWizard
          food={editingFood}
          onComplete={handleFoodWizardComplete}
          onCancel={() => {
            setShowFoodWizard(false);
            setEditingFood(null);
          }}
        />
      )}

      {/* Drink form modal */}
      {showDrinkForm && (
        <DrinkForm
          drink={editingDrink}
          onClose={() => {
            setShowDrinkForm(false);
            setEditingDrink(null);
          }}
          onSave={handleDrinkSave}
        />
      )}
    </div>
  );
}
