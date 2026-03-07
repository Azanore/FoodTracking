// File purpose: Warning banner for localStorage quota
// Related: App.jsx shows this when storage is near limit
// Should not include: Data management, export logic

import { AlertTriangle, X, Download } from 'lucide-react';

export function StorageWarning({ storageInfo, onDismiss, onExport }) {
  const { percentage, usedMB, limitMB, isCritical } = storageInfo;

  return (
    <div className={`fixed top-0 left-0 right-0 z-40 ${isCritical ? 'bg-[var(--color-danger)]' : 'bg-orange-500'} text-white shadow-lg`}>
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
        <AlertTriangle size={20} className="shrink-0" />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {isCritical ? 'Storage almost full!' : 'Storage running low'}
          </p>
          <p className="text-xs opacity-90">
            Using {usedMB}MB of {limitMB}MB ({percentage}%). Export your data to free up space.
          </p>
        </div>

        <button
          onClick={onExport}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors"
        >
          <Download size={14} />
          Export
        </button>

        <button
          onClick={onDismiss}
          className="shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
          title="Dismiss for 7 days"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
