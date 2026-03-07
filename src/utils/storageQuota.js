// File purpose: Check localStorage usage and warn before quota is full
// Related: App.jsx uses this on mount, SettingsView shows storage info
// Should not include: Data management, UI components

// Get localStorage usage info
export const getStorageInfo = () => {
  let used = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length;
    }
  }

  // localStorage limit is typically 5-10MB (5MB is common)
  const limit = 5 * 1024 * 1024; // 5MB in bytes
  const usedMB = (used / 1024 / 1024).toFixed(2);
  const limitMB = (limit / 1024 / 1024).toFixed(0);
  const percentage = Math.round((used / limit) * 100);

  return {
    used,
    usedMB,
    limit,
    limitMB,
    percentage,
    isNearLimit: percentage >= 80, // Warn at 80%
    isCritical: percentage >= 95, // Critical at 95%
  };
};

// Check if user has dismissed the warning recently
const WARNING_DISMISS_KEY = 'storage_warning_dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export const shouldShowWarning = () => {
  const info = getStorageInfo();
  if (!info.isNearLimit) return false;

  const dismissed = localStorage.getItem(WARNING_DISMISS_KEY);
  if (!dismissed) return true;

  const dismissedTime = parseInt(dismissed);
  const now = Date.now();
  return now - dismissedTime > DISMISS_DURATION;
};

export const dismissWarning = () => {
  localStorage.setItem(WARNING_DISMISS_KEY, Date.now().toString());
};
