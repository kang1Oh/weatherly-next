'use client';

import { useState, useEffect } from 'react';
import { WeatherHeader } from './components/WeatherHeader';
import { OutfitSuggestion } from './components/OutfitSuggestion';
import { ActivitySuggestion } from './components/ActivitySuggestion';
import { CitySearch } from './components/CitySearch';
import { WeeklyForecast } from './components/WeeklyForecast';
import { HealthIndex } from './components/HealthIndex';
import { LifestyleToggle } from './components/LifestyleToggle';
import { geocodeCity } from '@/lib/services/geocodingService';
import { fetchWeather } from '@/lib/services/weatherService';

export default function HomePage() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [lifestyleMode, setLifestyleMode] = useState('outfit');
  const [favoriteCities, setFavoriteCities] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('weatherly-favorites');
    if (saved) {
      setFavoriteCities(JSON.parse(saved));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('weatherly-favorites', JSON.stringify(favoriteCities));
  }, [favoriteCities]);

  const handleCitySelect = async (city, country) => {
    try {
      const geo = await geocodeCity(city, 1);
      if (!geo.length) throw new Error('City not found');

      const { lat, lon, city: foundCity, country: foundCountry } = geo[0];
      const weather = await fetchWeather(lat, lon, foundCity, foundCountry);

      setCurrentWeather(weather.current);
      setWeeklyForecast(weather.forecast);
    } catch (err) {
      console.error('Error fetching weather:', err);
    }
  };

  //Default city on load
  useEffect(() => {
    handleCitySelect('Chongqing', 'China');
  }, []);

  const handleToggleFavorite = (cityCountry) => {
    setFavoriteCities(prev =>
      prev.includes(cityCountry)
        ? prev.filter(c => c !== cityCountry)
        : [...prev, cityCountry]
    );
  };

  return (
    <div className="min-h-screen relative">
      {/* Fixed Landscape Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url(/assets/795b7537b2f79ce178703d9d142caf45502cf729.png)'
        }}
      ></div>
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            🌦 Weatherly
          </h1>
          <p className="text-white drop-shadow-md">
            Your Smart Weather & Lifestyle Companion
          </p>
        </div>

        {/* Search & Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="w-full sm:w-auto flex-1 max-w-md">
            <CitySearch
              onCitySelect={handleCitySelect}
              favoriteCities={favoriteCities}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
          <div className="w-full sm:w-auto">
            <LifestyleToggle mode={lifestyleMode} onModeChange={setLifestyleMode} />
          </div>
        </div>

        {currentWeather ? (
          <>
            {/* Weather Header */}
            <div className="mb-8">
              <WeatherHeader weather={currentWeather} />
            </div>

            {/* Lifestyle Suggestions */}
            <div className="flex flex-col space-y-6 mb-8">
              {(lifestyleMode === 'outfit' || lifestyleMode === 'both') && (
                <OutfitSuggestion
                  temperature={currentWeather.temperature}
                  condition={currentWeather.condition}
                  humidity={currentWeather.humidity}
                />
              )}
              {(lifestyleMode === 'activity' || lifestyleMode === 'both') && (
                <ActivitySuggestion
                  temperature={currentWeather.temperature}
                  condition={currentWeather.condition}
                  windSpeed={currentWeather.windSpeed}
                />
              )}
              <HealthIndex
                temperature={currentWeather.temperature}
                humidity={currentWeather.humidity}
                windSpeed={currentWeather.windSpeed}
                condition={currentWeather.condition}
              />
            </div>

            {/* Weekly Forecast */}
            <WeeklyForecast forecast={weeklyForecast} mode={lifestyleMode} />
          </>
        ) : (
          <div className="text-center text-white text-xl">Loading weather...</div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-white drop-shadow-md">
          <p className="mb-1">Weatherly helps you dress smart and plan better based on weather conditions</p>
          <p className="mb-1">Built with ❤️ for weather-conscious lifestyle planning</p>
        </div>
      </div>
    </div>
  );
}
