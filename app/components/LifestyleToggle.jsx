import { Shirt, Activity, MoreHorizontal } from 'lucide-react';

export function LifestyleToggle({ mode, onModeChange }) {
  return (
    <div className="flex items-center gap-1 bg-white/25 backdrop-blur-xl border border-white/30 p-1 rounded-2xl shadow-lg dark:bg-black/20 dark:border-white/20">
      <button
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
          mode === 'outfit'
            ? 'bg-gradient-to-r from-[#1299ca] to-[#35bcde] text-white shadow-md scale-105'
            : 'text-gray-700 hover:bg-white/30 hover:scale-105 dark:text-gray-300 dark:hover:bg-white/10'
        }`}
        onClick={() => onModeChange('outfit')}
      >
        <Shirt className="w-4 h-4" />
        <span>Outfits</span>
      </button>
      
      <button
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
          mode === 'activity'
            ? 'bg-gradient-to-r from-[#35bcde] to-[#6fd7ec] text-white shadow-md scale-105'
            : 'text-gray-700 hover:bg-white/30 hover:scale-105 dark:text-gray-300 dark:hover:bg-white/10'
        }`}
        onClick={() => onModeChange('activity')}
      >
        <Activity className="w-4 h-4" />
        <span>Activities</span>
      </button>
      
      <button
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
          mode === 'both'
            ? 'bg-gradient-to-r from-[#6fd7ec] to-[#9ceff2] text-gray-800 shadow-md scale-105'
            : 'text-gray-700 hover:bg-white/30 hover:scale-105 dark:text-gray-300 dark:hover:bg-white/10'
        }`}
        onClick={() => onModeChange('both')}
      >
        <MoreHorizontal className="w-4 h-4" />
        <span>Both</span>
      </button>
    </div>
  );
}
