# Food Diary App — Living Context Document

> **📌 IMPORTANT: This is the single source of truth for the entire project.**
>
> **Purpose:** Track all decisions, features, progress, and context in one place.
>
> **How to use:**
> - Read this BEFORE starting any new work
> - Update this AFTER completing features (mark ✅)
> - Update this AFTER making decisions (add to relevant section)
> - Keep context intact (don't delete history, append updates)
>
> **Sections:**
> - Vision & Goals (what we're building and why)
> - Current Status (what's done, what's in progress)
> - Roadmap (what's next, in order)
> - Design Decisions (why we made each choice)
> - Scope Boundaries (what we're NOT building)
> - Technical Notes (implementation details)

---

## 🎯 App Vision

A **food-symptom correlation tracker** that helps users identify trigger foods through simple logging and automated pattern analysis.

**Core Value Proposition:**
> "Log what you eat and how you feel. We'll show you what causes what."

**Target Users:**
- People with food intolerances (lactose, gluten, FODMAPs)
- IBS/digestive issue sufferers
- Migraine/headache trackers
- Anyone trying to identify trigger foods

**What Makes Us Different:**
- ✅ Focus on correlation, not nutrition
- ✅ Simple logging (no calorie counting)
- ✅ Automated pattern detection
- ✅ Privacy-first (all data local)
- ✅ Free, no account needed

**What We DON'T Do:**
- ❌ Calorie/macro tracking
- ❌ Weight/body metrics
- ❌ Nutrition goals
- ❌ Meal planning
- ❌ Social features

---

## 📍 Current Status: Phase 1 Complete

### **What's Working (v1.0)**

**Daily Logging:**
- Meal-based structure (Breakfast, Lunch, Dinner, Snack)
- Food/drink entries with quantity, unit, cooking method
- Collapsible meal cards
- 2-step delete confirmation
- Date navigation (prev/next/today)

**Library Management:**
- Food/drink CRUD operations
- Search, filter by tag, sort (name/usage/recent)
- Quick-log from library to today
- Usage tracking (count + last used)
- 26 seed foods + 15 seed drinks (Moroccan cuisine)

**Data Management:**
- localStorage persistence
- Export/import (JSON backup/restore)
- Reset with confirmation
- Soft delete (isDeleted flag)

**UI/UX:**
- Responsive (mobile + desktop)
- Bottom nav on mobile, sidebar on desktop
- Touch-friendly targets
- Consistent design system (CSS variables)

---

## 🚧 Current Limitations (To Be Fixed)

### **Critical Issues:**

1. **No correlation analysis** (the killer feature)
   - Can log meals, but can't see patterns
   - No symptom/feeling tracking
   - Stats view is empty placeholder

2. **No historical browsing**
   - Can only view one day at a time
   - No calendar picker (must click prev/next repeatedly)
   - No way to jump to specific date

3. **Meal-centric model doesn't fit use case**
   - Symptoms happen between meals (not tied to meal structure)
   - Can't log "felt bloated at 2pm" naturally
   - Timeline is fragmented (meals here, symptoms... nowhere)

4. **Notes are unstructured**
   - Day notes, meal notes (free-form text)
   - Can't analyze patterns from text
   - No structured symptom data

---

## 🎯 The Big Pivot: Timeline Model

### **Why We're Changing:**

**Current mental model:** "Meals with items"
```
Breakfast → [Eggs, Khobz, Tea]
Lunch → [Tagine, Salad]
[Where do symptoms go?]
```

**New mental model:** "Chronological timeline"
```
8:00 AM  - 🌅 Breakfast: Eggs, Khobz, Tea
2:00 PM  - 💨 Felt bloated (after lunch)
7:00 PM  - 🌙 Dinner: Tagine, Salad
10:00 PM - 😴 Slept well
```

**Benefits:**
- ✅ Natural (how humans remember days)
- ✅ Flexible (meals, feelings, notes, anything)
- ✅ Correlation-ready (time relationships preserved)
- ✅ Retroactive logging is easier (add events in order)

---

## 📋 Roadmap: Next 6 Weeks

### **Phase 2: Timeline + Feelings + Onboarding (Week 1-2)**

**Data Model Migration:**
```javascript
// OLD: Separate meals array
{
  date: "2026-03-03",
  meals: [...],
  dayNotes: "...",
  tags: [...]
}

// NEW: Unified timeline
{
  date: "2026-03-03",
  tags: ["home", "relaxed"], // Day-level only
  timeline: [
    {
      type: "meal",
      time: "08:00",
      mealType: "Breakfast",
      foods: [...],
      drinks: [...],
      tags: ["quick", "homemade"]
    },
    {
      type: "feeling",
      time: "14:00",
      timeGranularity: "after-meal", // or "time-of-day" or "specific"
      relatedMealId: "evt_1",
      feelings: ["bloated", "tired"], // Multi-select
      severity: 3, // 1-5, optional
      duration: "1-3 hours", // optional
      notes: "Felt uncomfortable" // optional
    }
  ]
}
```

**UI Changes:**
- Migrate TodayView to timeline display
- Add "Log Feeling" button + modal
- Feeling categories: Digestive, Energy, Mental, Mood, Physical, Sleep
- Multi-select feelings (can log "bloated + tired")
- Flexible time: "after meal" / "time of day" / "specific time"
- Optional: severity (1-5), duration, notes

**Migration Script:**
- Convert existing meals to timeline events
- Preserve all data (no loss)

**Onboarding Flow (CRITICAL ADDITION):**
- Welcome screen on first launch
- "How it works" explanation (3 steps)
- Example timeline (show what a logged day looks like)
- "Get Started" button → TodayView

**Empty States (CRITICAL ADDITION):**
- TodayView (no logs): "Log your first meal" with CTA
- Library (no items): "Add foods you eat often" with CTA
- Stats (< 7 days): "Log for 7+ days to see patterns" with progress

**Why these are critical:**
- Without onboarding: Users don't understand value → abandon
- Without empty states: Users don't know what to do → confused

**Deliverable:** Can log meals + feelings chronologically. New users understand the app.

---

### **Phase 3: Stats View MVP (Week 3)**

**Overview Section:**
- Total days logged
- Total meals logged
- Unique foods/drinks eaten
- Logging streak

**Top Items:**
- Top 10 foods (last 7/30/90 days, all time)
- Top 10 drinks (same date ranges)
- Last eaten date (clickable → jump to that day)

**Meal Patterns:**
- Meal frequency (Breakfast: 25/30 days, 83%)
- Meal timing patterns (Breakfast usually 7-8:30am)

**Feeling Frequency:**
- List of logged feelings with counts
- "bloated: 8 times in last 30 days"
- Click → see list of dates

**Tag Frequency:**
- Most used day tags
- Most used meal tags

**Deliverable:** Useful stats without correlation yet.

---

### **Phase 4: Correlation Analysis ⚠️ DEFERRED TO PHASE 7**

> **Why deferred:** This is the most impactful feature (the core value proposition), but requires sufficient feeling data to be meaningful. Test data shows only 8 feelings across 56 days - too sparse for statistical significance. We're polishing the app first to encourage consistent feeling logging, then building correlation when there's enough data.

**See Phase 7 below for full correlation analysis plan.**

---

### **Phase 5: Calendar Picker ✅ COMPLETE**

**Calendar Picker:**
- Click date in TodayView → opens date picker
- Jump to any date instantly
- Show indicator dots on days with logs
- Month navigation (prev/next)
- Today button (quick navigation)
- ESC to close

**Deliverable:** Fast date navigation without clicking prev/next repeatedly.

---

### **Phase 6: Polish & Refinement ✅ COMPLETE**

> **Goal:** Make the app feel production-ready without adding new features. Focus on quality, performance, and user experience improvements.

**High Priority (Completed):**
- ✅ **Keyboard shortcuts** - Enter to submit forms, ESC everywhere
- ✅ **Error boundary** - Prevent full app crashes, show friendly error message + reload button
- ✅ **localStorage quota warning** - Banner at 80% usage, storage indicator in Settings

**Optional Features (Deferred):**
- ❌ **Loading skeletons** - localStorage is instant (<50ms), skeletons would add complexity for zero benefit
- ❌ **CSV export** - Deferred initially, but later implemented (see Minor Additions below)
- ❌ **Undo delete** - 2-step confirmation already prevents accidental deletes
- ❌ **Search in Stats** - Top 10 lists are short enough to scan visually

**Explicitly Deferred (Not Phase 6):**
- ❌ Retroactive logging (Quick Log button) - Complex, low value
- ❌ Tag management UI (edit/delete tags) - Edge case, can add later
- ❌ Bulk operations (delete multiple items) - Low usage, adds complexity
- ❌ Dark mode toggle - CSS variables ready, but low priority
- ❌ Print-friendly view - Low usage, can add later
- ❌ Empty state illustrations - Text-only states are clear enough

**Deliverable:** Polished, professional-feeling app ready for real users.

**Completed:** March 9, 2026

---

### **Minor Additions (Post-Phase 6)**

> **Purpose:** Small, high-value features added after core phases complete.

**Completed:**
- ✅ **Clickable "last eaten" dates in Stats** - Click date → navigate to TodayView with that date selected
- ✅ **CSV export** - Export timeline data as CSV with locale-aware delimiter detection (semicolon for regions using comma as decimal separator)
- ✅ **Feeling Timeline View** - Click feeling in Stats → see all occurrences with full timeline context for each day

**Completed:** March 9, 2026

---

### **Phase 7: Correlation Analysis 🎯 THE KILLER FEATURE**

> **Why last:** This is the most impactful feature and core value proposition ("Log what you eat and how you feel. We'll show you what causes what."). We're building it last because:
> 1. Requires sufficient feeling data (15-20+ occurrences per feeling)
> 2. Complex algorithm needs testing with real user data
> 3. Polished app encourages consistent logging, making correlation viable
> 4. Better to ship working MVP than broken correlation

**Algorithm:**
```javascript
// Symptom-specific time windows (science-based)
const WINDOWS = {
  'bloated': { min: 0.5, max: 6, typical: 2 }, // hours
  'headache': { min: 1, max: 12, typical: 4 },
  'tired': { min: 0.5, max: 3, typical: 1.5 },
  'insomnia': { min: 4, max: 12, typical: 6 },
  // ... etc
};

// For each feeling occurrence:
// 1. Find meals in the time window before feeling
// 2. Extract all foods from those meals
// 3. Count how often each food appears
// 4. Calculate percentage (appearances / total occurrences)
// 5. Rank by strength: strong (80%+), moderate (50-79%), weak (30-49%)
```

**Confidence Scoring:**
- High: Feeling has specific time, meals have times
- Medium: Feeling has "time of day", meals have times
- Low: Feeling has no time (checks all meals that day)

**UI Display:**
```
🩺 Feeling Analysis: "bloated"

Strong correlation (7/8 times) ⭐⭐⭐ High confidence
• Dairy products
  [View 7 days →]

Moderate correlation (4/8 times) ⭐⭐ Medium confidence
• Fried foods
  [View 4 days →]

💡 Insight:
"bloated" happens most often after lunch (6/8 times),
usually 1-3 hours after eating.
```

**Copy Report Feature:**
- "Copy Report" button in Stats view
- Generates plain text summary of correlations
- Shareable with doctor/nutritionist

```
Food Diary Report (March 1-30, 2026)

Summary:
- 28 days logged
- 84 meals tracked
- 12 symptoms logged

Findings:
"Bloated" (8 times) → Dairy (87%), Fried foods (50%)
"Headache" (5 times) → Caffeine (80%)

Generated by Food Diary App
```

**Deliverable:** Automated trigger food detection + shareable reports.

**Estimated Time:** 3-4 days

**Prerequisites:** Real user data with 15-20+ feeling occurrences

---

## 📊 Progress Tracking

### **Phase 1: Foundation ✅ COMPLETE**
- ✅ Meal logging (meal-based structure)
- ✅ Food/drink library (CRUD operations)
- ✅ Tag system (day/meal/food/drink)
- ✅ Search, filter, sort
- ✅ Quick-log from library
- ✅ Usage tracking
- ✅ Data export/import/reset
- ✅ Responsive design
- ✅ 26 seed foods + 15 seed drinks

**Completed:** March 3, 2026

---

### **Phase 2: Timeline + Feelings + Onboarding ✅ COMPLETE**
- ✅ Data model migration (meals → timeline)
- ✅ Migration script (convert existing data)
- ✅ Timeline display in TodayView
- ✅ Feeling logging UI (search-first, single feeling per card)
- ✅ Flexible time granularity (after meal / time of day / specific)
- ✅ Custom feelings storage (localStorage)
- ✅ Timeline sorting fix (time-of-day mapped to approximate times)
- ✅ Onboarding flow (3-step intro with examples)
- ✅ Empty states (TodayView, Library, Stats)

**Completed:** March 7, 2026

---

### **Phase 3: Stats MVP ✅ COMPLETE**
- ✅ Overview stats (days logged, meals, unique items)
- ✅ Logging streak calculation (consecutive days with 🔥 indicator)
- ✅ Top 10 foods/drinks (7/30/90 days, all time)
- ✅ Last eaten dates (shown under each food/drink)
- ✅ Meal frequency breakdown
- ✅ Feeling frequency list
- ✅ Tag frequency list

**Completed:** March 7, 2026

---

### **Phase 4: Correlation Analysis ⚠️ DEFERRED TO PHASE 7**
- See Phase 7 in Roadmap section for details
- Deferred until sufficient feeling data exists

---

### **Phase 5: Calendar Picker ✅ COMPLETE**
- ✅ Calendar picker (jump to any date)
- ✅ Date indicators (show which days have logs)
- ✅ Month navigation (prev/next)
- ✅ Today button (quick navigation)
- ✅ ESC to close
- ✅ Integrated into DayHeader

**Completed:** March 7, 2026

---

### **Phase 6: Polish & Refinement ✅ COMPLETE**
- ✅ Keyboard shortcuts (Enter/ESC)
- ✅ Error boundary (prevent crashes)
- ✅ localStorage quota warning (banner at 80%, indicator in Settings)

**Completed:** March 7, 2026

**Optional features (deferred):**
- Loading skeletons - localStorage is instant, no need
- Undo delete - 2-step confirmation already prevents accidental deletes
- Search in Stats - Top 10 lists are short enough to scan visually

---

### **Minor Additions (Post-Phase 6) ✅ COMPLETE**
- ✅ Clickable "last eaten" dates in Stats (navigate to TodayView)
- ✅ CSV export with locale-aware delimiter detection
- ✅ Feeling Timeline View (see all occurrences of a specific feeling)

**Completed:** March 9, 2026

---

### **Phase 7: Correlation Analysis ⏳ NEXT**
- ⬜ Symptom-specific time windows (implement algorithm)
- ⬜ Confidence scoring (high/medium/low)
- ⬜ Correlation display (strong/moderate/weak)
- ⬜ Detailed correlation view (click → see specific days)
- ⬜ Copy report feature (plain text export)
- ⬜ Empty state (not enough data message)

**Prerequisites:** Real user data with 15-20+ feeling occurrences
**Estimated time:** 3-4 days

---

## 🎯 Feature Completion Checklist

Use this to track individual features as they're completed:

### **Core Features**
- ✅ Daily meal logging
- ✅ Food/drink library
- ✅ Tag system
- ✅ Data export/import
- ✅ Timeline model
- ✅ Feeling logging
- ✅ Stats view
- ⬜ Correlation analysis (deferred)
- ✅ Calendar picker

### **UX Features**
- ✅ Responsive design
- ✅ 2-step delete
- ✅ Collapsible cards
- ✅ Onboarding flow
- ✅ Empty states
- ✅ Keyboard shortcuts
- ✅ Error boundary
- ✅ localStorage quota warning

### **Analysis Features**
- ✅ Top foods/drinks
- ✅ Meal patterns (frequency)
- ✅ Feeling frequency
- ✅ Logging streak
- ⬜ Symptom-specific windows (Phase 7)
- ⬜ Confidence scoring (Phase 7)
- ⬜ Correlation display (Phase 7)
- ⬜ Copy report (Phase 7)

---

## 🎯 Design Decisions (Context for Devs)

### **Why Timeline Over Meals?**

**Problem:** Symptoms don't fit meal structure.
- User eats breakfast at 8am
- Feels bloated at 2pm
- Where does "bloated" go? Not in breakfast, not in lunch.

**Solution:** Timeline = chronological events (meals, feelings, notes).
- Natural mental model (how humans remember days)
- Correlation-ready (time relationships preserved)

---

### **Why "Feelings" Not "Symptoms"?**

**Problem:** "Symptom" implies negative. But we track positive too (energetic, focused, slept well).

**Solution:** "How I Felt" = neutral term.
- Covers positive, negative, neutral
- Less medical, more journaling
- Categories: Digestive, Energy, Mental, Mood, Physical, Sleep

---

### **Why Flexible Time Granularity?**

**Problem:** Users don't remember exact times retroactively.
- "I felt bloated... sometime after lunch?"
- Forcing exact time = friction = users give up

**Solution:** Three options:
1. **After a meal** → "after Breakfast" (meal-relative)
2. **Time of day** → "afternoon" (broad window)
3. **Specific time** → "2:00 PM" (precise)

**Algorithm adapts:**
- "After meal" → correlate with that meal's foods
- "Time of day" → correlate with meals before that time
- "Specific time" → correlate with meals in symptom-specific window

---

### **Why Symptom-Specific Windows?**

**Problem:** Different symptoms have different digestion timings.
- Bloating: 30 min - 6 hours
- Headaches: 1 - 12 hours
- Insomnia: 4 - 12 hours

**Solution:** Each feeling has its own time window (science-based).
- Bloating checks last 6 hours
- Insomnia checks last 12 hours
- More accurate correlations

---

### **Why Confidence Scoring?**

**Problem:** Self-reported data is fuzzy. Users forget times, approximate, guess.

**Solution:** Show confidence levels.
- High: Specific times logged
- Medium: Approximate times ("afternoon")
- Low: No time info (checks whole day)

**Benefits:**
- Transparent (users understand limitations)
- Encourages better logging (without forcing it)
- Statistically honest (not claiming certainty)

---

### **Why Tags Over Notes?**

**Problem:** Free-form notes can't be analyzed.
- "Felt bloated" vs "stomach hurt" vs "gassy" → same symptom?
- Algorithm can't parse text

**Solution:** Structured tags everywhere.
- Day tags: "home", "restaurant", "busy", "relaxed"
- Meal tags: "quick", "homemade", "takeout", "shared"
- Feeling tags: Pre-defined + custom

**Compromise:** Keep notes for feelings (important context), remove elsewhere.

---

## 🚫 What We're NOT Building (Scope Decisions)

### **Skipped (Not Worth Complexity):**

1. **Meal Templates/Favorites**
   - Why: Quick-log from library is fast enough
   - Alternative: Usage tracking bubbles up frequent items

2. **Global Search Across Days**
   - Why: Stats view shows "last eaten" dates (clickable)
   - Alternative: Calendar picker + Stats = good enough

3. **Custom Date Ranges**
   - Why: Presets (7/30/90 days, all time) cover 99% of use cases
   - Alternative: Add later if users request

4. **Combination Analysis** (e.g., "Milk + Coffee")
   - Why: Exponential complexity, needs lots of data
   - Alternative: Phase 2 feature (show "often eaten together")

5. **Quantity/Portion Analysis**
   - Why: Dose-dependent reactions are edge case
   - Alternative: Phase 2 feature (threshold analysis)

---

### **Delayed (Phase 2+):**

1. **Charts/Visualizations**
   - Phase 1: Simple lists and percentages
   - Phase 2: Add Chart.js for bar/line charts

2. **"Often Eaten Together" Insights**
   - Phase 1: Individual food correlation
   - Phase 2: Show common combinations

3. **Quantity Threshold Analysis**
   - Phase 1: Binary (ate it / didn't eat it)
   - Phase 2: "Small amounts OK, large amounts trigger"

4. **Advanced Stats**
   - Meal timing patterns (heatmaps)
   - Logging streaks (gamification)
   - Week-over-week comparisons

---

### **Never (Scope Creep):**

- ❌ Nutrition/calorie tracking (different app)
- ❌ Photo uploads (adds complexity, little value)
- ❌ Social/sharing features (privacy-first)
- ❌ Multi-device sync (localStorage only)
- ❌ Recipe builder (not our niche)
- ❌ Meal planning (not our niche)

---

## 🎯 Success Metrics

**MVP is successful if:**
1. Users can log meals + feelings in < 30 seconds
2. Correlation analysis shows triggers after 2-3 weeks of logging
3. Users say "I found my trigger food" (qualitative feedback)

**Long-term success:**
1. 70%+ of users log for 30+ days (retention)
2. 50%+ of users find at least one correlation (value delivered)
3. Users recommend to friends with similar issues (word-of-mouth)

---

## 📝 Technical Notes

### **Data Migration Strategy:**

```javascript
// Migration script (run once on app load)
function migrateToTimeline(oldLog) {
  if (oldLog.timeline) return oldLog; // Already migrated
  
  return {
    ...oldLog,
    tags: oldLog.tags || [],
    timeline: oldLog.meals.map(meal => ({
      id: meal.id,
      type: "meal",
      time: meal.time,
      mealType: meal.type,
      foods: meal.foods,
      drinks: meal.drinks,
      tags: meal.tags || []
    }))
  };
}
```

### **localStorage Structure:**

```
day_2026-03-03 → Daily log (timeline model)
food_* → Food library items
drink_* → Drink library items
user_preferences → User settings
app_seeded → Seed flag
```

### **Performance Considerations:**

- Stats view loads all days (could be 100+ logs)
- Solution: Lazy load, show loading skeleton
- Correlation algorithm is O(n*m) where n=feelings, m=meals
- Solution: Run in background, cache results

---

## 🚀 Next Steps

1. **Review this document** (ensure alignment)
2. **Start Phase 2** (timeline migration)
3. **Ship incrementally** (don't wait for perfection)

---

## 📝 Decision Log

Track all major decisions made during development:

### **March 6, 2026: Critical Feature Additions**
**Decision:** Add onboarding flow, empty states, and copy report to roadmap.

**Rationale:**
- Onboarding: Without it, users don't understand value → high abandonment
- Empty states: Without them, users don't know what to do → confusion
- Copy report: Users need to share insights with healthcare providers

**Impact:** +2 days to timeline (now 6 weeks total)

**Status:** Approved, added to Phase 2 and Phase 4

---

### **March 6, 2026: Timeline Model Pivot**
**Decision:** Migrate from meal-centric to timeline-based model.

**Rationale:**
- Symptoms don't fit meal structure (happen between meals)
- Timeline is more natural (chronological story)
- Enables better correlation (time relationships preserved)

**Impact:** Requires data migration, but worth it for UX

**Status:** Approved, starting Phase 2

---

### **March 6, 2026: "Feelings" Not "Symptoms"**
**Decision:** Use "How I Felt" instead of "Symptoms".

**Rationale:**
- "Symptom" implies negative only
- We track positive states too (energetic, focused, slept well)
- Less medical, more journaling

**Status:** Approved, implemented in Phase 2

---

### **March 6, 2026: Flexible Time Granularity**
**Decision:** Support three time options: after meal / time of day / specific time.

**Rationale:**
- Users don't remember exact times retroactively
- Forcing precision = friction = abandonment
- Algorithm can adapt to different granularities

**Status:** Approved, implemented in Phase 2

---

### **March 6, 2026: Symptom-Specific Windows**
**Decision:** Use different time windows for different feelings (bloating: 0.5-6h, insomnia: 4-12h).

**Rationale:**
- Different symptoms have different digestion timings (science-based)
- More accurate correlations than fixed 6-hour window
- Transparent (show user which window was used)

**Status:** Approved, implemented in Phase 4

---

### **March 6, 2026: Confidence Scoring**
**Decision:** Show high/medium/low confidence for correlations.

**Rationale:**
- Self-reported data is fuzzy (users forget, approximate)
- Transparency builds trust
- Encourages better logging without forcing it

**Status:** Approved, implemented in Phase 4

---

### **March 6, 2026: Tags Over Notes**
**Decision:** Remove day notes and meal notes. Keep only feeling notes. Use tags everywhere else.

**Rationale:**
- Free-form notes can't be analyzed by algorithm
- Tags are structured (analyzable) but flexible
- Reduces clutter (fewer note fields)

**Status:** Approved, implemented in Phase 2

---

### **March 6, 2026: Scope Boundaries**
**Decision:** Skip meal templates, global search, custom date ranges, combination analysis, quantity analysis.

**Rationale:**
- Meal templates: Quick-log is fast enough
- Global search: Stats + calendar solve this
- Custom ranges: Presets cover 99% of use cases
- Combinations: Too complex, needs lots of data
- Quantity: Edge case, can add later

**Status:** Approved, documented in "What We're NOT Building"

---

### **March 7, 2026: One Feeling Per Card**
**Decision:** Changed from multi-select feelings to single feeling per card.

**Rationale:**
- Severity/duration apply to individual feelings, not groups
- "bloated (severity 4)" + "tired (severity 2)" need separate cards
- Medically accurate data for correlation analysis
- Users can log multiple feelings by creating multiple cards

**Impact:** More logging steps if multiple symptoms, but accurate data

**Status:** Implemented in Phase 2

---

### **March 7, 2026: Search-First Feeling UI**
**Decision:** Search box first, categories collapsed by default, recent feelings shown.

**Rationale:**
- 40+ feelings is cognitive overload
- Users know what they feel ("bloated" not "digestive symptom")
- Search matches mental model
- Recent feelings reduce repeat typing
- Categories available for discovery

**Impact:** Faster logging, less overwhelming

**Status:** Implemented in Phase 2

---

### **March 7, 2026: Custom Feelings Storage**
**Decision:** Store custom feelings in localStorage for reuse.

**Rationale:**
- Users create personal vocabulary ("gassy-after-dairy")
- Should be reusable like library items
- Shows in "Recent & Custom" section

**Impact:** Better UX, no re-typing

**Status:** Implemented in Phase 2

---

### **March 7, 2026: Timeline Sorting Fix**
**Decision:** Map time-of-day to approximate times for proper sorting.

**Rationale:**
- "afternoon" → 14:00, "morning" → 09:00, etc.
- "after-meal" → uses meal's time
- Timeline displays chronologically

**Impact:** Timeline makes sense visually

**Status:** Implemented in Phase 2

---

### **March 7, 2026: Overnight Symptoms Deferred**
**Decision:** Defer overnight symptom tracking to Phase 4+.

**Rationale:**
- Edge case (most symptoms same-day)
- Requires cross-day correlation (complex)
- Correlation algorithm already checks previous day
- Users can log symptom on day they feel it

**Impact:** Known limitation, document for users

**Status:** Deferred to Phase 4+

---

### **March 7, 2026: Onboarding Back Button**
**Decision:** Add Back button to onboarding steps 2-3, keep Skip only on step 1.

**Rationale:**
- Standard UX pattern (users expect to review previous steps)
- Allows correction of accidental clicks
- Reduces anxiety (users know they can go back)
- Skip on step 1 only (no previous step to return to)

**Impact:** Better user control, more confidence in onboarding flow

**Status:** Implemented in Phase 2

---

### **March 7, 2026: Remove Usage Tracking**
**Decision:** Remove usageCount and lastUsed fields entirely from foods/drinks.

**Rationale:**
- Stats View calculates "Top 10" by counting actual timeline occurrences (more accurate)
- Inconsistent tracking (only incremented from library quick-log, not TodayView)
- Simpler codebase (no tracking logic)
- No confusion about when/how counts increment/decrement

**Impact:** Cleaner data model, Stats View shows real usage patterns

**Status:** Implemented in Phase 3

---

### **March 7, 2026: Test Data Generation System**
**Decision:** Create dynamic test data generator for 60 days with planted correlations.

**Rationale:**
- Need realistic data to test Stats View and Correlation Analysis
- Dynamic (always ends today, no hardcoded dates)
- Planted correlations: dairy→bloated (85%), fried→nauseous (80%), caffeine→headache (70%)
- 80% coverage (48/60 days logged) mimics realistic user behavior
- Includes proper food/drink objects with names, quantities, units

**Impact:** Can test both Stats and Correlation phases with one click

**Status:** Implemented in Phase 3

---

### **March 7, 2026: Skip Phase 4, Complete Phase 3 First**
**Decision:** Defer Phase 4 (Correlation Analysis) and complete Phase 3 fully, then move to Phase 5.

**Rationale:**
- Test data has only 8 feelings across 56 days (too sparse for meaningful correlation)
- Correlation needs ~15-20 occurrences per feeling to be statistically useful
- Phase 3 is incomplete (missing streak, last eaten dates, meal timing patterns)
- Phase 5 (calendar picker, retroactive logging) provides more immediate value
- Calendar/retroactive logging helps users log MORE feelings, making Phase 4 viable later

**Impact:** Ship polished MVP without correlation, add Phase 4 when real users have real data

**New Priority Order:**
1. Complete Phase 3 (add streak + last eaten dates)
2. Phase 5 (calendar picker + retroactive logging)
3. Phase 4 (correlation analysis) - when users have sufficient feeling data

**Status:** Approved, March 7, 2026

---

### **March 7, 2026: Phase 5 Complete - Calendar Picker**
**Decision:** Mark Phase 5 as complete. Defer remaining polish features (loading skeletons, error boundary, localStorage quota check, keyboard shortcuts, retroactive logging).

**Rationale:**
- Calendar picker is fully functional and provides immediate value
- Users can now jump to any date instantly (no more clicking prev/next repeatedly)
- Indicator dots show which days have logs
- Today button provides quick navigation back to current date
- Polish features are nice-to-have, not blockers for MVP
- Retroactive logging can be added later if users request it

**Impact:** MVP is essentially feature-complete. Ready to evaluate next steps.

**Status:** Phase 5 complete, March 7, 2026

---

### **March 7, 2026: Skip Loading Skeletons**
**Decision:** Remove loading skeletons from Phase 6. Skip loading states entirely.

**Rationale:**
- Loading skeletons are for slow operations (>300-500ms)
- localStorage reads are synchronous and near-instant (<50ms)
- Current "Loading..." text probably flickers for 10-50ms (worse UX than showing content immediately)
- Skeletons would add complexity for zero benefit
- If we add API calls later, we can add skeletons then

**Impact:** Simpler codebase, better UX (no loading flicker), Phase 6 reduced from 2-3 days to 1-2 days

**Status:** Approved, March 7, 2026

---

### **March 7, 2026: Phase 6 Complete - Skip Optional Features**
**Decision:** Mark Phase 6 complete. Skip CSV export, undo delete, and search in Stats.

**Rationale:**
- **CSV export:** JSON export already exists. CSV adds complexity (need to flatten nested timeline data). Users can convert JSON to CSV externally if needed. Low value vs effort.
- **Undo delete:** 2-step confirmation already prevents accidental deletes. Undo would require state management (toast notifications, undo stack). Over-engineering for edge case.
- **Search in Stats:** Top 10 lists are short (10 items max). Visual scanning is fast enough. Search adds UI complexity for minimal benefit.

**Impact:** Phase 6 complete in <1 day. Ready for Phase 7 (Correlation Analysis).

**Status:** Approved, March 7, 2026

---

### **March 7, 2026: Restructure Roadmap - Phase 6 & 7**
**Decision:** Split remaining work into Phase 6 (Polish) and Phase 7 (Correlation). Make it explicit that correlation is the killer feature but intentionally saved for last.

**Rationale:**
- Phase 5 originally included "Calendar + Polish" but we only completed calendar
- Remaining polish items (loading skeletons, error boundary, keyboard shortcuts, localStorage quota) are still needed
- Correlation analysis is the most impactful feature but requires sufficient feeling data
- Better to polish the app first, encourage consistent logging, then build correlation
- Clear separation prevents scope creep (Phase 6 = no new features, just quality improvements)

**Phase 6 Scope (Polish & Refinement):**
- High priority: Keyboard shortcuts, loading skeletons, error boundary, localStorage quota warning
- Medium priority: CSV export, undo delete, search in Stats
- Low priority: Dark mode toggle, print-friendly view, empty state illustrations
- Explicitly deferred: Retroactive logging, tag management, bulk operations

**Phase 7 Scope (Correlation Analysis):**
- The killer feature, saved for last
- Requires 15-20+ feeling occurrences per feeling (real user data)
- Symptom-specific time windows, confidence scoring, correlation display, copy report

**Impact:** Clear roadmap, no scope creep, correlation built when data supports it

**Status:** Approved, March 7, 2026

---

### **March 7, 2026: Masonry Layout Implementation**
**Decision:** Implement Pinterest-style masonry layout for TodayView and FoodsView.

**Rationale:**
- **Problem:** CSS Grid creates rigid rows. When expanding a card in column 1, the entire row below (all 4 cards) shifts down, even though cards in columns 2-4 are unrelated.
- **Solution:** Masonry layout assigns cards to columns. When a card expands, only cards below it in the same column shift down. Cards in other columns stay put.
- **Implementation:** Used react-masonry-css library (2KB, minimal overhead)
- **Breakpoints:** 1 col (mobile), 2 cols (tablet), 3 cols (desktop), 4 cols (large desktop)
- **Handles edge cases:** Automatically recalculates on add/delete/filter/search

**Impact:** Much smoother UX when expanding/collapsing cards. No jarring layout shifts.

**Status:** Implemented, March 7, 2026

---

### **March 9, 2026: Clickable "Last Eaten" Dates**
**Decision:** Make "last eaten" dates in Stats View clickable, navigating to TodayView with that date selected.

**Rationale:**
- Users see "Last eaten: Jan 15" and want to see what else they ate that day
- Natural workflow: Stats → specific day → full context
- Requires passing date navigation handler from App → Stats → TodayView

**Implementation:**
- Added `onNavigateToDate` prop to StatsView
- Updated App.jsx to handle `date:YYYY-MM-DD` navigation
- TodayView accepts `initialDate` prop to load specific date

**Impact:** Better discoverability, users can explore their data more naturally

**Status:** Implemented, March 9, 2026

---

### **March 9, 2026: CSV Export with Locale-Aware Delimiter**
**Decision:** Add CSV export alongside JSON export, with automatic delimiter detection based on user's locale.

**Rationale:**
- **Problem:** Excel uses different CSV delimiters based on regional settings (comma in US, semicolon in Europe/Middle East)
- **Solution:** Detect user's locale via `Intl.NumberFormat().format(1.1)` - if it includes comma (like `1,1`), use semicolon as delimiter; otherwise use comma
- **Format:** One row per timeline event (meal or feeling), with columns: Date, Time, Type, Meal Type, Foods, Drinks, Feeling, Severity, Notes
- **Cleanup:** Skip meals with no foods AND no drinks (empty entries)

**Implementation:**
```javascript
const delimiter = new Intl.NumberFormat().format(1.1).includes(',') ? ';' : ',';
```

**Impact:** CSV opens correctly in Excel without manual import configuration, works globally

**Status:** Implemented, March 9, 2026

---

### **March 9, 2026: Feeling Timeline View**
**Decision:** Add dedicated view to show all occurrences of a specific feeling with full timeline context.

**Rationale:**
- Users see "bloated: 8 times" in Stats and want to explore those specific days
- Manual pattern discovery: "What did I eat on days I felt bloated?"
- Bridges gap until Phase 7 correlation analysis is built
- Each day shows full timeline (meals + feeling cards) for context

**Implementation:**
- Created `FeelingTimelineView.jsx` component
- Made feelings in Stats View clickable (passes `feeling:feelingName` to navigation handler)
- Shows chronological list of days with that feeling
- "View full day" button navigates to TodayView for that date
- Back button returns to Stats

**Impact:** Users can manually discover patterns before automated correlation is built

**Status:** Implemented, March 9, 2026

---

## 💡 UI/UX Refinement Backlog

> **Purpose:** Track UI/UX improvement ideas proposed by the developer. These are NOT committed features - each must be discussed, evaluated, and approved before implementation.
>
> **Evaluation Criteria:**
> - Does it improve UX without adding complexity?
> - Does it solve a real problem users face?
> - Is the effort worth the value?
> - Does it align with the app's minimalist philosophy?

### **Proposed Ideas (Not Yet Approved):**

1. ~~**Pinterest-style grid for TodayView timeline**~~ ✅ **IMPLEMENTED**
   - **Problem:** When expanding a meal card, the entire row underneath shifts down (jarring)
   - **Solution:** Masonry/Pinterest grid layout - only cards directly underneath shift
   - **Implementation:** Used react-masonry-css library (2KB)
   - **Status:** Implemented March 7, 2026

2. *(Add more ideas here as they come up)*

### **Approved for Implementation:**
- ✅ Masonry layout (TodayView + FoodsView) - Completed March 7, 2026

### **Rejected Ideas:**
*(None yet)*

---

## 🔄 Update Instructions

**When completing a feature:**
1. Find it in "Progress Tracking" section
2. Change ⬜ to ✅
3. Add completion date
4. Update "Last Updated" at bottom

**When making a decision:**
1. Add entry to "Decision Log" section
2. Include: date, decision, rationale, impact, status
3. Update relevant roadmap sections if needed

**When changing scope:**
1. Update roadmap sections
2. Add decision to "Decision Log"
3. Update timeline estimates

---

**Last Updated:** March 9, 2026
**Current Phase:** All phases complete except Phase 7 (Correlation Analysis)
**Timeline:** Phases 1-6 complete. Minor additions complete (clickable dates, CSV export, feeling timeline view). Phase 7 (Correlation) is the only remaining major feature.
**Next Milestone:** Build Phase 7 correlation analysis (3-4 days) OR ship MVP as-is
