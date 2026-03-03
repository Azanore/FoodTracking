// File purpose: Settings and preferences view placeholder
// Related: App.jsx renders this
// Should not include: Data management, statistics

export function SettingsView() {
  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      <h1 className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] mb-4">
        Settings
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)]">
        Coming soon: Customize your preferences, manage data, and configure the app.
      </p>
    </div>
  );
}
