'use client';

import { useState, useEffect } from "react";
import { Search, MapPin, Star, StarOff } from "lucide-react";
import { geocodeCity } from "@/lib/services/geocodingService";

export function CitySearch({ onCitySelect, favoriteCities, onToggleFavorite }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch city suggestions as user types (API applied here)
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await geocodeCity(searchTerm, 8); // fetch up to 8 results
        setSuggestions(results);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400); // debounce typing

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleCitySelect = (city, country, lat, lon) => {
    onCitySelect(city, country, lat, lon);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const handleToggleFavorite = (city, country) => {
    const cityCountry = `${city}, ${country}`;
    onToggleFavorite(cityCountry);
  };

  const getFavoriteCityList = () =>
    favoriteCities.map((cityCountry) => {
      const [city, country] = cityCountry.split(", ");
      return { city, country };
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5 z-10" />
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="pl-12 pr-4 py-3 w-full bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 dark:bg-black/20 dark:border-white/20 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400/50 dark:focus:border-blue-400/50 shadow-lg"
          />
        </div>

        {showSuggestions && searchTerm && (
          <div className="absolute top-full left-0 right-0 z-20 mt-2 max-h-64 overflow-y-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 dark:bg-gray-900/90 dark:border-gray-700/50">
            <div className="p-2">
              {loading ? (
                <div className="p-6 text-center text-gray-600 dark:text-gray-400">
                  Loading...
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map(({ city, country, lat, lon }, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-800/60 group transition-all duration-200"
                    onClick={() => handleCitySelect(city, country, lat, lon)}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {city}, {country}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(city, country);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-700/60"
                    >
                      {favoriteCities.includes(`${city}, ${country}`) ? (
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ) : (
                        <StarOff className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-600 dark:text-gray-400">
                  No cities found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {favoriteCities.length > 0 && (
        <div>
          <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
            ⭐ Favorite Cities
          </h4>
          <div className="flex flex-wrap gap-2">
            {getFavoriteCityList().map(({ city, country }, index) => (
              <span
                key={index}
                className="cursor-pointer px-3 py-2 bg-white/25 backdrop-blur-sm text-gray-800 dark:text-gray-200 rounded-xl border border-white/30 text-sm flex items-center gap-2 hover:bg-white/35 hover:scale-105 transition-all duration-200 shadow-md dark:bg-black/20 dark:border-white/20 dark:hover:bg-black/30"
                onClick={() => handleCitySelect(city, country)}
              >
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {city}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
