import { Sun, Cloud, CloudRain, Wind } from 'lucide-react';

const getWeatherIcon = (condition) => {
  const cond = condition.toLowerCase();
  if (cond.includes('sun') || cond.includes('clear')) return Sun;
  if (cond.includes('rain') || cond.includes('storm')) return CloudRain;
  if (cond.includes('cloud')) return Cloud;
  return Sun;
};

const getOutfitSuggestion = (temp, condition) => {
  const isRainy = condition.toLowerCase().includes('rain');
  
  if (temp < 10) return isRainy ? '🧥 Heavy coat + umbrella' : '🧥 Winter coat';
  if (temp < 20) return isRainy ? '🧥 Jacket + umbrella' : '👕 Light jacket';
  if (temp < 28) return isRainy ? '☂️ Light layer + umbrella' : '👕 T-shirt & pants';
  return isRainy ? '☂️ Light clothes + umbrella' : '🩳 Shorts & t-shirt';
};

const getActivitySuggestion = (temp, condition, windSpeed) => {
  const isRainy = condition.toLowerCase().includes('rain');
  const isWindy = windSpeed > 20;
  
  if (isRainy) return '📚 Indoor activities';
  if (temp < 5) return '🏠 Stay warm inside';
  if (temp < 15) return '🚶 Brisk walk';
  if (temp < 25) return isWindy ? '🏃 Sheltered exercise' : '🚴 Cycling';
  return '🏊 Swimming or beach';
};

export function WeeklyForecast({ forecast, mode }) {
  return (
    <div className="p-6 bg-white/25 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 dark:bg-black/20 dark:border-white/20">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white drop-shadow-md">7-Day Forecast</h3>
      
      <div className="flex flex-col gap-3">
        {forecast.map((day, index) => {
          const WeatherIcon = getWeatherIcon(day.condition);
          const avgTemp = Math.round((day.temperature.high + day.temperature.low) / 2);
          
          return (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 hover:bg-white/25 transition-all duration-300 dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/15"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="text-center min-w-16">
                  <div className="font-medium text-gray-800 dark:text-white drop-shadow-sm">{day.day}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300 drop-shadow-sm">{day.date}</div>
                </div>
                
                <WeatherIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400 drop-shadow-sm" />
                
                <div className="flex-1">
                  <div className="font-medium text-gray-800 dark:text-white drop-shadow-sm">{day.condition}</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 drop-shadow-sm">
                    {day.temperature.high}° / {day.temperature.low}°
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 items-end min-w-48">
                {(mode === 'outfit' || mode === 'both') && (
                  <span className="text-xs px-3 py-1.5 bg-[#35bcde] text-white rounded-xl border border-[#35bcde]/30 backdrop-blur-sm shadow-md font-medium">
                    {getOutfitSuggestion(avgTemp, day.condition)}
                  </span>
                )}
                {(mode === 'activity' || mode === 'both') && (
                  <span className="text-xs px-3 py-1.5 bg-[#6fd7ec] text-gray-800 rounded-xl border border-[#6fd7ec]/30 backdrop-blur-sm shadow-md font-medium">
                    {getActivitySuggestion(avgTemp, day.condition, day.windSpeed)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
