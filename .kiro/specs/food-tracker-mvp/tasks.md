# Implementation Plan

- [x] 1. Setup project foundation and styling





  - Install dependencies (lucide-react for icons)
  - Create global styles in index.css (CSS variables, scrollbar, box-sizing, base typography)
  - _Requirements: 7.1, 7.2, 7.5_
-

- [x] 2. Setup mock database service (web version)




  - Create database service wrapper (db.js) using localStorage for persistence
  - Implement mock CRUD operations for daily logs, foods, drinks, ingredients, and preferences
  - Use JSON.parse/stringify for data storage
  - Integrate existing seedDatabase.js utility (already created with Moroccan foods, ingredients, drinks)
  - Call seedDatabase() on app initialization to populate data if not already seeded
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 2.2_
-

- [x] 3. Create TypeScript type definitions




  - Create types.js file with JSDoc type definitions for all data models
  - Define enums (MealType, Unit, Portion, CookingMethod, IngredientCategory, DrinkCategory)
  - Define interfaces (Ingredient, UserFood, FoodEntry, DrinkEntry, Meal, DailyLog, UserPreferences)
  - _Requirements: All (type safety foundation)_
-

- [x] 4. Build core layout and navigation




  - Create App.jsx with sidebar + main content layout
  - Create Sidebar.jsx component with navigation icons (Today, Foods)
  - Implement view routing logic (show TodayView or FoodsView based on active nav)
  - Style sidebar (64px width, centered icons, active state)
  - Import and call seedDatabase() on app initialization
  - _Requirements: 6.1, 6.2, 6.3, 7.1_
-

- [x] 5. Implement TodayView foundation




  - Create TodayView.jsx component
  - Create DateNavigation component (arrows, date display)
  - Implement date state management (current date, navigate prev/next)
  - Create DayMeta component (day notes input, tags display with badges)
  - Fetch and display daily log data from database
  - _Requirements: 1.1, 6.5, 7.4_
-

- [x] 6. Build MealCard component




  - Create MealCard.jsx with collapsible functionality
  - Display meal type icon, time, food/drink summary when collapsed
  - Display full food and drink lists when expanded
  - Implement expand/collapse toggle on click
  - Style meal card (borders, padding, spacing, typography)
  - Add edit and delete buttons
  - _Requirements: 1.6, 1.7, 7.4_
-

- [x] 7. Implement meal CRUD operations




  - Create AddMealButton component
  - Create MealForm component (meal type select, time input, tags)
  - Implement add meal functionality (create new meal, save to database)
  - Implement edit meal functionality (inline editing, update database)
  - Implement delete meal functionality (remove from database, update UI)
  - Auto-suggest meal time based on current time
  - _Requirements: 1.2, 1.5, 1.8, 1.9_
-

- [x] 8. Build food entry components




  - Create FoodItem component (display food with all properties)
  - Create DrinkItem component (display drink with all properties)
  - Display quantity, unit, portion, cooking method, ingredients, extras as text
  - Display tags as small badges
  - Show notes if present
  - _Requirements: 1.3, 1.4, 7.4_

- [x] 9. Implement inline add food to meal




  - Create InlineAddFood component within MealCard
  - Implement search dropdown (filter foods from library as user types)
  - Auto-fill quantity, unit, portion, cooking method from selected food defaults
  - Add "Add" button to append food to meal
  - Update database and UI on add
  - _Requirements: 3.6, 1.3_

- [x] 10. Build FoodsView and food library





  - Create FoodsView.jsx component with tabs for Foods and Drinks
  - Create SearchBar component for filtering foods/drinks
  - Create FoodCard component (display food name, defaults, ingredients, usage stats)
  - Create DrinkCard component (display drink name, defaults, usage stats)
  - Fetch and display all foods and drinks from database
  - Implement search/filter functionality for both tabs
  - _Requirements: 2.1, 7.4_

- [x] 11. Implement food and drink CRUD in library





  - Create FoodForm component (modal or slide-in panel)
  - Create DrinkForm component (simpler version for drinks)
  - Implement add new food (name, defaults, ingredients, extras, tags)
  - Implement add new drink (name, category, defaults, tags)
  - Create ingredient selector with auto-create (dropdown from ingredients library, type to add new)
  - Auto-create new ingredients when typed in food form
  - Implement edit food/drink (load existing data, update database)
  - Implement soft delete food/drink (mark isDeleted flag, filter from library view, preserve historical logs)
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.8_
-

- [x] 12. Implement food usage tracking




  - Increment usage count when food is added to a meal
  - Update last used timestamp
  - Display usage stats in FoodCard
  - _Requirements: 2.7_

- [x] 13. Build QuickAddBar component




  - Create QuickAddBar.jsx (fixed at bottom of TodayView)
  - Implement search input with autocomplete from food library
  - Add quantity input, unit select, cooking method select
  - Add target meal selector (dropdown of today's meals)
  - Implement "Add" button to append food to selected meal
  - Auto-create meal if none exists for current time
  - Update database and UI on add
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_


- [x] 14. Verify ingredients library functionality




  - Verify seeded ingredients are accessible (seeded via seedDatabase.js)
  - Test auto-create ingredient functionality from food form
  - Ensure ingredients persist correctly in database
  - _Requirements: 2.2, 2.3_


- [x] 15. Build reusable UI components



  - Create Select component (styled dropdown for enums)
  - Create TagInput component (add/remove tags with badges)
  - Create Button component (primary, secondary, danger variants)
  - Create Input component (text, number, time inputs)
  - Style all components consistently
  - _Requirements: 7.3, 7.4_

- [ ] 16. Implement data persistence and error handling
  - Ensure all CRUD operations persist to database immediately (localStorage for web, SQLite for Electron)
  - Add error handling for database operations (try-catch, error messages)
  - Implement data loading on app initialization
  - Test close/reopen app to verify persistence
  - _Requirements: 4.3, 4.4, 4.5_

- [ ] 17. Implement user preferences
  - Create default preferences on first launch
  - Store default meal times
  - Track recent foods and drinks
  - Store custom tags for suggestions
  - Load preferences on app start
  - _Requirements: 3.5_
-

- [x] 18. Polish UI and final touches




  - Ensure all spacing is consistent (8px grid)
  - Verify typography hierarchy (font sizes, weights, colors)
  - Test all interactions (hover states, focus states, active states)
  - Ensure scrollbar styling is applied
  - Verify pixel-perfect alignment
  - Test responsive behavior (minimum 1024x768)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 19. Web version final testing
  - Test complete user flow (add food to library → log meal → view in today)
  - Test Quick Add functionality end-to-end
  - Test date navigation with localStorage persistence
  - Test all CRUD operations
  - Verify data integrity after multiple operations
  - Test edge cases (empty states, first-time user)
  - _Requirements: All_

- [x] 20. Improve form UI with checkable buttons and badges




- [x] 20.1 Create CheckableButtonGroup component


  - Create reusable CheckableButtonGroup component for single-select enums (radio-style)
  - Support grid layout (configurable columns, default 5 columns)
  - Style: border on unselected, filled background on selected, 1-click toggle
  - Props: options array, value, onChange, columns (optional)
  - _Requirements: 7.3, 7.4_


- [x] 20.2 Create CheckableBadgeGroup component

  - Create reusable CheckableBadgeGroup component for multi-select with "Show all" functionality
  - Display top N most-used items as checkable badges (sorted by usageCount)
  - Add "+ Show all" button that opens modal with search + full list
  - Add "+ Add new" button for creating new items
  - Props: items array, selectedIds, onChange, onAddNew, topCount (default 12)
  - Style modal: search bar at top, scrollable badge grid, selected items highlighted
  - _Requirements: 7.3, 7.4_

- [x] 20.3 Update FoodForm with new UI patterns


  - Replace cooking method select with CheckableButtonGroup (10 options, 5 columns)
  - Replace portion select with CheckableButtonGroup (7 options, 4 columns)
  - Replace unit select with CheckableButtonGroup (9 options, 5 columns)
  - Replace ingredients input/dropdown with CheckableBadgeGroup (top 12 most-used, multi-select)
  - Replace extras input/dropdown with CheckableBadgeGroup (top 12 most-used, multi-select)
  - Remove old select dropdowns and related state/handlers (ingredientSearch, showIngredientDropdown, etc.)
  - Keep tags input as-is (text input + badges)
  - Test all interactions and ensure data saves correctly
  - _Requirements: 2.2, 2.3, 7.3, 7.4_

- [x] 20.4 Update DrinkForm with new UI patterns


  - Replace category select with CheckableButtonGroup (7 drink categories, 4 columns)
  - Replace unit select with CheckableButtonGroup (9 options, 5 columns)
  - Remove old select dropdowns and related code
  - Keep tags input as-is (text input + badges)
  - Test all interactions and ensure data saves correctly
  - _Requirements: 2.4, 7.3, 7.4_

- [x] 20.5 Update MealForm with new UI patterns


  - Replace meal type select with CheckableButtonGroup (4 meal types: Breakfast, Lunch, Dinner, Snack)
  - Layout: 2x2 grid or 4 columns
  - Remove old select dropdown and related code
  - Keep time input and tags as-is
  - Test meal creation and editing
  - _Requirements: 1.2, 7.3, 7.4_

- [x] 20.6 Keep QuickAddBar and InlineAddFood with dropdowns


  - Verify QuickAddBar still uses select dropdowns (exception for speed optimization)
  - Verify InlineAddFood still uses inline dropdowns (exception for compactness)
  - Document this exception in code comments
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 21. Migrate to Electron with SQLite
- [ ] 21.1 Setup Electron foundation
  - Install Electron dependencies (electron, electron-builder, better-sqlite3)
  - Create Electron main process (main.js) with window management
  - Create preload script for secure IPC exposure
  - Configure Electron with Vite (update package.json scripts)
  - Set minimum window size (1024x768)
  - Implement window state persistence (size, position)
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 21.2 Implement SQLite database layer
  - Create SQLite database file on first launch
  - Implement table creation (daily_logs, user_foods, user_drinks, ingredients_library, user_preferences)
  - Add is_deleted column to user_foods and user_drinks tables
  - Create IPC handlers for all CRUD operations (getDailyLog, saveDailyLog, getAllFoods, saveFood, etc.)
  - Adapt existing seedData.json to SQLite on first launch (check for existing data)
  - _Requirements: 4.1, 4.2, 5.4_

- [ ] 21.3 Update frontend to use Electron IPC
  - Update db.js to use window.electron.invoke() instead of localStorage
  - Test all CRUD operations through IPC
  - Verify data persistence after app restart
  - Test all user flows in Electron environment
  - _Requirements: 4.3, 4.4, 5.4_
