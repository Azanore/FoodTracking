# Requirements Document

## Introduction

A desktop food tracking application built with React, Vite, Tailwind, Electron, and SQLite. The app enables users to log daily meals (foods and drinks) with detailed metadata, manage a personal food library, and track health notices. The focus is on quick, practical logging with minimal clicks and a clean, minimalistic UI.

**MVP Scope:** Core logging functionality only. Today view, food library, and basic data persistence. No analytics, no ingredient management, no advanced features.

## Requirements

### Requirement 1: Daily Food Logging

**User Story:** As a user, I want to log my daily meals with foods and drinks, so that I can track what I consume each day.

#### Acceptance Criteria

1. WHEN the app opens THEN the system SHALL display today's date and an empty daily log
2. WHEN I click "Add Meal" THEN the system SHALL create a new meal entry with current time and allow me to select meal type (Breakfast, Lunch, Dinner, Snack)
3. WHEN I add a food to a meal THEN the system SHALL allow me to specify name, quantity, unit, portion, and cooking method
4. WHEN I add a drink to a meal THEN the system SHALL allow me to specify name, quantity, and unit
5. WHEN I save a meal THEN the system SHALL persist it to the SQLite database and display it in the daily log
6. WHEN I view a meal THEN the system SHALL display all foods and drinks in a collapsed card format
7. WHEN I click a meal card THEN the system SHALL expand to show full details
8. WHEN I edit a meal THEN the system SHALL allow inline editing and save changes to the database
9. WHEN I delete a meal THEN the system SHALL remove it from the database and UI

### Requirement 2: Food and Drink Library Management

**User Story:** As a user, I want to maintain a personal library of commonly eaten foods and drinks with default values, so that I can quickly log meals without re-entering details.

#### Acceptance Criteria

1. WHEN I navigate to Foods Library THEN the system SHALL display tabs for Foods and Drinks
2. WHEN I click "Add New Food" THEN the system SHALL open a form to create a food with name, default quantity, unit, portion, cooking method, and ingredients
3. WHEN I type a new ingredient name that doesn't exist THEN the system SHALL auto-create it in the ingredients library
4. WHEN I click "Add New Drink" THEN the system SHALL open a form to create a drink with name, category, default quantity, and unit
5. WHEN I save a food or drink THEN the system SHALL persist it to the database with a unique ID prefixed with 'food_' or 'drink_'
6. WHEN I select a food or drink from the library while logging a meal THEN the system SHALL auto-fill all default values
7. WHEN I edit a food or drink in the library THEN the system SHALL update the database and reflect changes in future meal logs
8. WHEN I delete a food or drink from the library THEN the system SHALL mark it as deleted but preserve historical meal logs that reference it by storing the name in the meal entry
9. WHEN I use a food or drink in a meal THEN the system SHALL increment its usage count and update last used timestamp

### Requirement 3: Quick Add Functionality

**User Story:** As a user, I want to quickly add foods to meals without multiple clicks, so that I can log meals efficiently in the moment.

#### Acceptance Criteria

1. WHEN I view today's log THEN the system SHALL display a persistent Quick Add bar at the bottom
2. WHEN I type in the Quick Add search field THEN the system SHALL show matching foods from my library
3. WHEN I select a food from Quick Add THEN the system SHALL auto-fill quantity, unit, and cooking method from defaults
4. WHEN I click "Add" in Quick Add THEN the system SHALL add the food to the selected meal without opening a modal
5. WHEN no meal exists for the current time THEN the system SHALL auto-create an appropriate meal (Breakfast/Lunch/Dinner/Snack based on time)
6. WHEN I add a food inline to a meal THEN the system SHALL show a dropdown search within the meal card

### Requirement 4: Data Persistence with SQLite

**User Story:** As a user, I want my data stored locally in a database, so that my food logs persist across app sessions.

#### Acceptance Criteria

1. WHEN the app initializes THEN the system SHALL create or connect to a SQLite database file
2. WHEN the app initializes THEN the system SHALL create tables for dailyLogs, userFoods, and ingredientsLibrary if they don't exist
3. WHEN I add, edit, or delete data THEN the system SHALL immediately persist changes to SQLite
4. WHEN I close and reopen the app THEN the system SHALL load all data from the database
5. IF a database operation fails THEN the system SHALL display an error message to the user

### Requirement 5: Electron Desktop Integration

**User Story:** As a user, I want to use the app as a native desktop application, so that I can access it without a browser.

#### Acceptance Criteria

1. WHEN I launch the app THEN the system SHALL open in an Electron window
2. WHEN the Electron window opens THEN the system SHALL have a minimum size of 1024x768 pixels
3. WHEN I close the window THEN the system SHALL save window size and position for next launch
4. WHEN the app runs THEN the system SHALL use Electron's IPC to communicate between renderer and main process for database operations

### Requirement 6: Navigation and Layout

**User Story:** As a user, I want a simple navigation system, so that I can switch between today's log and my food library.

#### Acceptance Criteria

1. WHEN the app loads THEN the system SHALL display a sidebar with navigation options (Today, Foods)
2. WHEN I click "Today" THEN the system SHALL display the daily log view
3. WHEN I click "Foods" THEN the system SHALL display the food library view
4. WHEN I navigate between views THEN the system SHALL preserve unsaved changes or prompt to save
5. WHEN I view today's log THEN the system SHALL display date navigation arrows to view previous/next days

### Requirement 7: Minimal UI Styling

**User Story:** As a user, I want a clean, professional interface, so that the app is pleasant to use and not visually cluttered.

#### Acceptance Criteria

1. WHEN I view any screen THEN the system SHALL use a minimalistic design with subtle borders and no shadows
2. WHEN I scroll content THEN the system SHALL display a thin custom scrollbar
3. WHEN I interact with buttons and inputs THEN the system SHALL provide clear visual feedback
4. WHEN I view meal cards THEN the system SHALL use consistent spacing and typography
5. WHEN the UI renders THEN the system SHALL use box-border sizing for all elements
