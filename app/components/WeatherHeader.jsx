import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const weatherBackgrounds = {
  sunny: "https://images.unsplash.com/photo-1491929007750-dce8ba76e610?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2067",
  rainy: "https://images.unsplash.com/photo-1507027682794-35e6c12ad5b4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1974",
  cloudy: "https://images.unsplash.com/photo-1692541184196-88b71a2a06d5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1974"
};

const getWeatherIcon = (condition) => {
  const cond = condition.toLowerCase();
  if (cond.includes('sun') || cond.includes('clear')) return Sun;
  if (cond.includes('rain') || cond.includes('storm')) return CloudRain;
  if (cond.includes('cloud')) return Cloud;
  return Sun;
};

const getBackgroundImage = (condition) => {
  const cond = condition.toLowerCase();
  if (cond.includes('sun') || cond.includes('clear')) return weatherBackgrounds.sunny;
  if (cond.includes('rain') || cond.includes('storm')) return weatherBackgrounds.rainy;
  return weatherBackgrounds.cloudy;
};

export function WeatherHeader({ weather }) {
  const WeatherIcon = getWeatherIcon(weather.condition);
  const backgroundImage = getBackgroundImage(weather.condition);

  return (
    <div className="relative overflow-hidden rounded-3xl h-80 bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl">
      <div className="absolute inset-0">
        <ImageWithFallback
          src={backgroundImage}
          alt="Weather background"
          className="w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-white-500/30" />
      </div>
      
      <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold drop-shadow-lg">{weather.city}</h1>
            <p className="text-white/90 drop-shadow-md">{weather.country}</p>
          </div>
          <WeatherIcon className="w-12 h-12 drop-shadow-lg" />
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-light drop-shadow-lg">{weather.temperature}°</span>
            <span className="text-xl text-white/90 drop-shadow-md">C</span>
          </div>
          
          <div>
            <p className="text-xl drop-shadow-md">{weather.condition}</p>
            <p className="text-white/90 drop-shadow-sm">{weather.description}</p>
          </div>
          
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Thermometer className="w-4 h-4 drop-shadow-sm" />
              <span className="drop-shadow-sm">Feels like {weather.feelsLike}°</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplets className="w-4 h-4 drop-shadow-sm" />
              <span className="drop-shadow-sm">{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="w-4 h-4 drop-shadow-sm" />
              <span className="drop-shadow-sm">{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
