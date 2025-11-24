'use client';

import { useEffect, useState } from 'react';
import { Shirt, Shield, Sun, Snowflake } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { fetchOutfitImages } from '@/services/outfitImageService';

function useOutfitSuggestion(temp) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchOutfitImages().then((data) => setImages(data || []));
  }, []);

  // --- Helpers ---
  const getCategoryByTemp = (t) => {
    if (t < 5) return "cold";
    if (t < 15) return "cold";
    if (t < 25) return "warm";
    return "hot";
  };

  const getRandomItems = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // --- Outfit generation ---
  const outfit = {
    clothes: [],
    accessories: [],
    icon: Shirt,
    color: "#3b82f6",
  };

  // Determine category by temp
  const category = getCategoryByTemp(temp);

  // Filter by temperature category
  const categoryClothes = images.filter(
    (img) => img.category === category && img.type === "clothing"
  );
  const categoryAccessories = images.filter(
    (img) => img.category === category && img.type === "accessory"
  );

  // Randomly select 3–5 clothing items
  const randomCount = Math.floor(Math.random() * 3) + 3;
  outfit.clothes = getRandomItems(categoryClothes, randomCount).map((img) => ({
    name: img.item_name,
    image: img.url,
  }));

  // Add 1–2 accessories (prioritize same-category first)
  const accessoriesPool = [
    ...categoryAccessories
  ];
  outfit.accessories = getRandomItems(accessoriesPool, 2).map((img) => ({
    name: img.item_name,
    image: img.url,
  }));

  // --- Icons + Colors per temp range ---
  if (temp < 5) {
    outfit.icon = Snowflake;
    outfit.color = "#2563eb";
  } else if (temp < 15) {
    outfit.icon = Shield;
    outfit.color = "#3b82f6";
  } else if (temp < 25) {
    outfit.icon = Shirt;
    outfit.color = "#10b981";
  } else {
    outfit.icon = Sun;
    outfit.color = "#f59e0b";
  }

  return outfit;
}

const getMotivationalQuote = (condition) => {
  const cond = condition.toLowerCase();
  if (cond.includes('sun') || cond.includes('clear')) {
    return "Sunny days are perfect for new beginnings! ☀️";
  }
  if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('thunderstorm')) {
    return "Let the rain wash away yesterday's worries. 🌧️";
  }
  if (cond.includes('overcast') || cond.includes('cloudy')) {
    return "Every cloud has a silver lining. Stay positive! ☁️";
  }
  return "Make today amazing, regardless of the weather! 🌟";
};

export function OutfitSuggestion({ temperature, condition, humidity }) {
  const outfit = useOutfitSuggestion(temperature);
  const quote = getMotivationalQuote(condition);
  const OutfitIcon = outfit.icon;

  return (
    <div className="p-6 bg-white/25 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 dark:bg-black/20 dark:border-white/20">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="p-2 rounded-full text-white"
          style={{ backgroundColor: outfit.color }}
        >
          <OutfitIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white drop-shadow-md">
            Perfect Outfit
          </h3>
          <p className="text-sm text-white/80">Stay comfy at {temperature}°C</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Clothing */}
        <div>
          <h4 className="font-medium mb-3 text-white drop-shadow-sm">
            Recommended Clothing:
          </h4>
          <div className="flex gap-4 overflow-x-auto pb-2 scroll-smooth">
            {outfit.clothes.map((item, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex-shrink-0"
              >
                <div className="aspect-[4/5] w-32 sm:w-36 relative">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                    <h5 className="font-semibold text-xs leading-tight">
                      {item.name}
                    </h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accessories */}
        {outfit.accessories.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 text-white drop-shadow-sm">
              Don't Forget:
            </h4>
            <div className="flex gap-4 overflow-x-auto pb-2 scroll-smooth">
              {outfit.accessories.map((item, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex-shrink-0"
                >
                  <div className="aspect-[4/5] w-32 sm:w-36 relative">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                      <h5 className="font-semibold text-xs leading-tight">
                        {item.name}
                      </h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quote */}
        <div className="pt-2 border-t border-white/20 dark:border-white/10">
          <p className="text-sm text-white italic drop-shadow-sm">{quote}</p>
        </div>
      </div>
    </div>
  );
}
