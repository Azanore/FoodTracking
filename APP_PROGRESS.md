# Food Diary App — Progress Tracker

## App Goal

A **food diary/journal** for tracking eating patterns and habits — NOT a nutrition/calorie tracker.

**Core purpose:**
- Track what you ate and when
- Add notes and tags for context
- Identify patterns and trigger foods
- Keep a simple, flexible food log

**What we DON'T do:**
- Calorie counting
- Macro/micro nutrient tracking
- Weight/body metrics
- Nutrition goals

---

## Current Status: MVP Complete ✅

**Working features:**
- Daily meal logging (Today view)
- Food/drink library with global + custom items
- Tag system (day/meal/food/drink)
- Search, filter, and sort library
- Quick-log from library to today
- Usage tracking (count + last used)
- Collapsible meal cards
- 2-step delete confirmation
- Responsive design (mobile + desktop)

---

## Next Priorities

### 1. Data Export/Import (High Priority)
- Export all data as JSON (backup)
- Import JSON to restore data
- Simple button in Settings view

### 2. Stats View (High Priority)
- Overview: total days logged, meals, unique items
- Top 10 foods/drinks by usage
- Tag frequency analysis
- Date range selection (last 7/30 days, all time)
- Simple charts (bar/line)

### 3. Historical Data Loading
- Query multiple daily logs from localStorage
- Aggregation helpers for stats
- Date range picker for navigation

---

## Future Considerations (Not Immediate)

**Notices/Symptoms Tracking:**
- UI to log health observations (headache, bloated, etc.)
- Link symptoms to meals/foods
- Severity levels (1-5)
- Currently defined in types but no UI

**Polish:**
- Keyboard shortcuts (Enter/Esc)
- ARIA labels for accessibility
- Input validation
- Empty state illustrations
- Skeleton loaders

**Advanced Stats:**
- Timeline charts (items per day)
- Meal timing patterns
- Logging streaks
- Week-over-week comparisons

---

## Won't Add (Scope Creep)

- Nutrition/calorie tracking
- Photo uploads
- Social/sharing features
- Multi-device sync
- Meal templates/favorites
- Recipe builder

---

**Last Updated:** 2026-03-03
