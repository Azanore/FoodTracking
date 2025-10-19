# Design Document

## Overview

A desktop food tracking app with React frontend, Electron wrapper, and SQLite backend. The architecture follows a simple client-side pattern where React components communicate with SQLite via Electron IPC. The UI prioritizes speed and minimal clicks with a sidebar layout, inline editing, and persistent Quick Add bar.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Electron Main Process                 │
│  - Window management                                     │
│  - SQLite database connection (better-sqlite3)           │
│  - IPC handlers for CRUD operations                      │
└─────────────────────────────────────────────────────────┘
                          ↕ IPC
┌─────────────────────────────────────────────────────────┐
│                  Electron Renderer Process               │
│  ┌───────────────────────────────────────────────────┐  │
│  │              React Application                     │  │
│  │  - Components (views, forms, cards)                │  │
│  │  - State management (React hooks)                  │  │
│  │  - Database service (IPC wrapper)                  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                    SQLite Database                       │
│  - dailyLogs table                                       │
│  - userFoods table                                       │
│  - ingredientsLibrary table                              │
│  - userPreferences table                                 │
└─────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Core Components

1. **App.jsx** - Root component with sidebar layout
2. **Sidebar.jsx** - Navigation (Today, Foods icons)
3. **TodayView.jsx** - Daily log with meals and Quick Add bar
4. **FoodsView.jsx** - Food and drink library with tabs
5. **MealCard.jsx** - Collapsible meal display with inline add
6. **FoodForm.jsx** - Add/edit food in library
7. **DrinkForm.jsx** - Add/edit drink in library
8. **QuickAddBar.jsx** - Persistent bottom bar for fast logging

### Component Hierarchy

```
App
├── Sidebar
└── MainContent
    ├── TodayView
    │   ├── DateNavigation
    │   ├── DayMeta (notes, tags)
    │   ├── MealCard[] (expandable)
    │   │   ├── FoodItem[]
    │   │   ├── DrinkItem[]
    │   │   └── InlineAddFood
    │   └── QuickAddBar
    └── FoodsView
        ├── Tabs (Foods / Drinks)
        ├── SearchBar
        ├── FoodCard[] or DrinkCard[]
        ├── FoodForm (modal/slide-in)
        └── DrinkForm (modal/slide-in)
```

### Database Service Interface

```javascript
// Wrapper for Electron IPC calls
const db = {
  // Daily logs
  getDailyLog(date: string): Promise<DailyLog | null>
  saveDailyLog(log: DailyLog): Promise<void>
  
  // Foods
  getAllFoods(): Promise<UserFood[]>
  getFoodById(id: string): Promise<UserFood | null>
  saveFood(food: UserFood): Promise<void>
  deleteFood(id: string): Promise<void> // Soft delete: mark as deleted, preserve data
  incrementFoodUsage(id: string): Promise<void>
  
  // Drinks
  getAllDrinks(): Promise<UserDrink[]>
  getDrinkById(id: string): Promise<UserDrink | null>
  saveDrink(drink: UserDrink): Promise<void>
  deleteDrink(id: string): Promise<void> // Soft delete: mark as deleted, preserve data
  incrementDrinkUsage(id: string): Promise<void>
  
  // Ingredients (for food creation)
  getAllIngredients(): Promise<Ingredient[]>
  saveIngredient(ingredient: Ingredient): Promise<void>
  
  // Preferences
  getPreferences(): Promise<UserPreferences>
  savePreferences(prefs: UserPreferences): Promise<void>
}
```

## Data Models

### TypeScript Interfaces

```typescript
// Enums
type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
type Unit = 'pieces' | 'slices' | 'plate' | 'bowl' | 'cup' | 'glass' | 'spoon' | 'tablespoon' | 'teaspoon'
type Portion = 'tiny' | 'small' | 'medium' | 'large' | 'full' | 'half' | 'quarter' | null
type CookingMethod = 'raw' | 'fried' | 'baked' | 'boiled' | 'steamed' | 'grilled' | 'roasted' | 'stewed' | 'sauteed' | 'blanched' | null
type IngredientCategory = 'Protein' | 'Grain' | 'Vegetable' | 'Fruit' | 'Legume' | 'Dairy' | 'Fat' | 'Spice' | 'Herb' | 'Other'
type DrinkCategory = 'Dairy' | 'Juice' | 'Tea' | 'Coffee' | 'Water' | 'Soda' | 'Other'

// Core models
interface Ingredient {
  id: string
  name: string
  category: IngredientCategory
  tags: string[]
  aliases: string[]
  usageCount: number
  createdAt: string
}

interface UserFood {
  id: string
  name: string
  defaultQuantity: number
  defaultUnit: Unit
  defaultPortion: Portion
  defaultCookingMethod: CookingMethod
  ingredients: { id: string; name: string; category: IngredientCategory }[]
  defaultExtras: { id: string; name: string; category: IngredientCategory }[]
  tags: string[]
  lastUsed: string
  usageCount: number
  createdAt: string
}

interface UserDrink {
  id: string
  name: string
  category: DrinkCategory
  defaultQuantity: number
  defaultUnit: Unit
  tags: string[]
  lastUsed: string
  usageCount: number
  createdAt: string
}

interface FoodEntry {
  foodId: string | null
  name: string
  quantity: number
  unit: Unit
  portion: Portion
  cookingMethod: CookingMethod
  ingredients: { id: string; name: string; category: IngredientCategory }[]
  extras: { id: string; name: string; category: IngredientCategory }[]
  tags: string[]
  notes: string | null
}

interface DrinkEntry {
  drinkId: string | null
  name: string
  category: DrinkCategory
  quantity: number
  unit: Unit
  tags: string[]
  notes: string | null
}

interface Meal {
  id: string
  type: MealType
  time: string // HH:MM
  tags: string[]
  foods: FoodEntry[]
  drinks: DrinkEntry[]
  notes: string | null
}

interface DailyLog {
  id: string
  date: string // YYYY-MM-DD
  tags: string[]
  dayNotes: string | null
  meals: Meal[]
  notices: Notice[]
  createdAt: string
  updatedAt: string
}

interface Notice {
  text: string
  time: string | null
  severity: 1 | 2 | 3 | 4 | 5
  tags: string[]
}

interface UserPreferences {
  userId: string // Default: "user_123" for single-user MVP
  defaultMealTimes: {
    Breakfast: string
    Lunch: string
    Dinner: string
    Snack: string | null
  }
  favoritesByMeal: {
    Breakfast: string[] // Mix of foodIds and drinkIds
    Lunch: string[]
    Dinner: string[]
    Snack: string[]
  }
  recentFoods: string[]
  recentDrinks: string[]
  customTags: {
    day: string[]
    meal: string[]
    food: string[]
    drink: string[]
    notice: string[]
  }
  createdAt: string
  updatedAt: string
}
```

## Database Schema

### SQLite Tables

```sql
-- Daily logs stored as JSON blobs for flexibility
CREATE TABLE IF NOT EXISTS daily_logs (
  id TEXT PRIMARY KEY,
  date TEXT UNIQUE NOT NULL,
  data TEXT NOT NULL, -- JSON stringified DailyLog
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- User foods library
CREATE TABLE IF NOT EXISTS user_foods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  data TEXT NOT NULL, -- JSON stringified UserFood
  usage_count INTEGER DEFAULT 0,
  last_used TEXT,
  is_deleted INTEGER DEFAULT 0, -- Soft delete flag
  created_at TEXT NOT NULL
);

-- User drinks library
CREATE TABLE IF NOT EXISTS user_drinks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  data TEXT NOT NULL, -- JSON stringified UserDrink
  usage_count INTEGER DEFAULT 0,
  last_used TEXT,
  is_deleted INTEGER DEFAULT 0, -- Soft delete flag
  created_at TEXT NOT NULL
);

-- Ingredients library
CREATE TABLE IF NOT EXISTS ingredients_library (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  data TEXT NOT NULL, -- JSON stringified Ingredient
  usage_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY,
  data TEXT NOT NULL, -- JSON stringified UserPreferences
  updated_at TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(date);
CREATE INDEX IF NOT EXISTS idx_user_foods_name ON user_foods(name);
CREATE INDEX IF NOT EXISTS idx_user_drinks_name ON user_drinks(name);
CREATE INDEX IF NOT EXISTS idx_ingredients_name ON ingredients_library(name);
```

## UI Design Patterns

### Layout Structure

```
┌──────┬──────────────────────────────────────────────────────┐
│      │                                                       │
│ 📅   │                  Main Content Area                    │
│      │              (TodayView or FoodsView)                 │
│ 🍽️   │                                                       │
│      │                                                       │
│      │                                                       │
│      │                                                       │
│      │                                                       │
├──────┴──────────────────────────────────────────────────────┤
│              Quick Add Bar (TodayView only)                  │
└─────────────────────────────────────────────────────────────┘
```

### Styling Approach

- **CSS variables** - only for colors and spacing that are reused (YAGNI principle)
  - `--color-bg-primary`, `--color-bg-secondary`, `--color-border`, `--color-text-primary`, `--color-text-secondary`, `--color-accent`
  - `--spacing-card`, `--spacing-section`
- **Custom scrollbar** - thin (4px), minimal, defined in index.css
- **Box-border** - apply globally via `* { box-sizing: border-box }`
- **Color palette** - professional neutral scheme
  - Background: white (#ffffff) and light gray (#f9fafb)
  - Borders: subtle gray (#e5e7eb)
  - Text: dark gray (#111827) for primary, medium gray (#6b7280) for secondary
  - Accent: blue (#3b82f6) for interactive elements
- **Typography** - system font stack, clear hierarchy
  - Headings: 18px (meal type), 16px (section headers), 14px (labels)
  - Body: 14px for content, 13px for metadata
  - Font weights: 600 for headings, 500 for labels, 400 for body
- **Spacing** - consistent scale for professional feel
  - Card padding: 16px
  - Section gaps: 24px
  - Element spacing: 8px between related items, 16px between groups
  - Sidebar width: 64px (icon-only)
- **Contrast** - ensure readability
  - Primary text on white: #111827 (high contrast)
  - Secondary text: #6b7280 (medium contrast)
  - Borders: #e5e7eb (subtle but visible)
- **Alignment** - pixel-perfect layouts
  - Left-align text content
  - Center-align icons in sidebar
  - Consistent vertical rhythm with 8px grid

### Key UI Patterns

1. **Collapsible Meal Cards**
   - Collapsed: Show meal type, time, food summary
   - Expanded: Show full food/drink list with inline edit
   - Click anywhere to toggle

2. **Inline Add Food**
   - Appears within meal card
   - Dropdown search with keyboard navigation
   - Auto-fills from library defaults

3. **Quick Add Bar**
   - Fixed at bottom
   - Search input with autocomplete
   - Quantity/unit/cooking method dropdowns
   - Target meal selector
   - Single "Add" button

4. **Food Library Cards**
   - Display name, defaults, ingredients, usage stats
   - Hover shows edit/delete actions
   - Click to edit in modal or slide-in panel

5. **Tags Display**
   - Small badges with subtle background
   - Click to remove (×)
   - Dropdown to add from custom tags or type new

6. **Dropdowns/Selects**
   - All enums rendered as select dropdowns
   - Portions, units, cooking methods, meal types, categories
   - Custom tags shown as suggestions

## Error Handling

### Database Errors

- Wrap all IPC calls in try-catch
- Display toast notifications for errors
- Log errors to console for debugging
- Graceful degradation (show cached data if available)

### Validation

- Required fields: name, quantity, unit for foods
- Date format validation (YYYY-MM-DD, HH:MM)
- Prevent duplicate food names in library
- Ensure meal times are valid

### Edge Cases

- Empty states (no meals, no foods in library)
- First-time user (seed with example data or show onboarding)
- Date navigation beyond available data (show empty log)
- Deleting food that's in recent/favorites (remove from those lists)

## Testing Strategy

**MVP: No automated tests**

Manual testing checklist:
- Add/edit/delete meals
- Add/edit/delete foods in library
- Quick Add functionality
- Date navigation
- Data persistence (close/reopen app)
- Electron window behavior

## Implementation Notes

### Electron Setup

- Use `electron-builder` for packaging
- Main process handles SQLite with `better-sqlite3`
- Preload script exposes safe IPC methods to renderer
- Dev mode: run Vite dev server + Electron concurrently

### State Management

- React `useState` and `useEffect` for local state
- Custom hooks for data fetching (`useDailyLog`, `useFoods`)
- Context for global state (current date, preferences)
- No Redux/Zustand needed for MVP

### ID Generation

- Use `crypto.randomUUID()` for unique IDs
- Prefix IDs: `food_`, `ing_`, `drink_`, `day_`, `meal_`
- Generate IDs: `food_${crypto.randomUUID().slice(0, 8)}`

### Seed Data

- Seed Moroccan foods on first launch (couscous, tagine, mar9a, harira, etc.)
- Seed common ingredients (egg, olive oil, wheat flour, tomato, onion, etc.)
- Seed common drinks (mint tea, water, milk, coffee)
- Check for existing data before seeding (localStorage flag: `isSeeded`)

### Date Handling

- Use native `Date` object
- Format with `toISOString()` for storage
- Display with `toLocaleDateString()` and `toLocaleTimeString()`

### Performance Considerations

**MVP: Not a priority**

- SQLite queries are fast enough for local data
- React re-renders are minimal with proper key usage
- No virtualization needed for food lists (< 100 items expected)
