import React from 'react';
import {
  Sun, Shield, Droplets, Wind, Thermometer, Heart, Eye, Zap,
  AlertTriangle, CheckCircle, Activity, Umbrella, Shirt,
  TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

const getUVIndex = (condition, temperature) => {
  const isSunny = condition.toLowerCase().includes('sun') || condition.toLowerCase().includes('clear');
  if (!isSunny) return { level: 1, description: 'Minimal' };
  if (temperature > 30) return { level: 9, description: 'Very High' };
  if (temperature > 25) return { level: 7, description: 'High' };
  if (temperature > 20) return { level: 5, description: 'Moderate' };
  return { level: 3, description: 'Low' };
};

const getComfortIndex = (temperature, humidity, windSpeed) => {
  let score = 0;
  if (temperature >= 18 && temperature <= 24) score += 40;
  else if (temperature >= 15 && temperature <= 27) score += 30;
  else if (temperature >= 10 && temperature <= 32) score += 20;
  else if (temperature >= 5 && temperature <= 35) score += 10;

  if (humidity >= 40 && humidity <= 60) score += 30;
  else if (humidity >= 30 && humidity <= 70) score += 20;
  else if (humidity >= 20 && humidity <= 80) score += 10;

  if (windSpeed >= 5 && windSpeed <= 15) score += 30;
  else if (windSpeed >= 2 && windSpeed <= 25) score += 20;
  else if (windSpeed <= 35) score += 10;

  return Math.max(0, Math.min(100, score));
};

const getAirQualityIndex = (condition, windSpeed, humidity) => {
  const isRainy = condition.toLowerCase().includes('rain');
  const isWindy = windSpeed > 15;
  const isHumid = humidity > 70;

  let aqi = 50;
  if (isRainy) aqi -= 25;
  if (isWindy) aqi -= 15;
  if (isHumid) aqi += 10;

  aqi = Math.max(10, Math.min(100, aqi));

  if (aqi <= 25) return { value: aqi, description: 'Excellent', status: 'excellent' };
  if (aqi <= 50) return { value: aqi, description: 'Good', status: 'good' };
  if (aqi <= 75) return { value: aqi, description: 'Moderate', status: 'moderate' };
  return { value: aqi, description: 'Poor', status: 'poor' };
};

const getHydrationIndex = (temperature, humidity, condition) => {
  let needs = 50;
  if (temperature > 25) needs += 30;
  else if (temperature > 20) needs += 15;
  else if (temperature < 10) needs -= 10;

  if (humidity < 30) needs += 20;
  else if (humidity > 70) needs += 10;

  if (condition.toLowerCase().includes('sun')) needs += 15;

  return Math.max(20, Math.min(100, needs));
};

const getSkinProtectionIndex = (temperature, condition, humidity) => {
  let protection = 30;
  const isSunny = condition.toLowerCase().includes('sun') || condition.toLowerCase().includes('clear');
  if (isSunny) {
    protection += 40;
    if (temperature > 25) protection += 20;
    if (temperature > 30) protection += 10;
  }
  if (humidity < 40) protection += 15;
  if (temperature < 5) protection += 25;
  return Math.max(10, Math.min(100, protection));
};

const getHealthMetrics = (temperature, humidity, windSpeed, condition) => {
  const comfort = getComfortIndex(temperature, humidity, windSpeed);
  const airQuality = getAirQualityIndex(condition, windSpeed, humidity);
  const hydration = getHydrationIndex(temperature, humidity, condition);
  const skinProtection = getSkinProtectionIndex(temperature, condition, humidity);
  const uv = getUVIndex(condition, temperature);

  const getStatus = (value) => {
    if (value >= 85) return 'excellent';
    if (value >= 70) return 'good';
    if (value >= 50) return 'moderate';
    if (value >= 30) return 'poor';
    return 'dangerous';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-emerald-400';
      case 'good': return 'text-blue-400';
      case 'moderate': return 'text-amber-400';
      case 'poor': return 'text-orange-400';
      case 'dangerous': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getComfortTips = (comfort, temperature, humidity) => {
    if (comfort >= 50) return ['Enjoy the comfortable conditions!'];
    const tips = [];
    if (temperature > 25) tips.push('Seek shade or air conditioning');
    else if (temperature < 15) tips.push('Layer clothing for warmth');
    else tips.push('Adjust activity level');
    if (humidity > 70) tips.push('Choose breathable fabrics');
    else if (humidity < 30) tips.push('Use moisturizer');
    return tips;
  };

  const getSkinTips = (skinProtection, temperature) => {
    if (skinProtection >= 70) {
      return [
        'Apply SPF 30+ sunscreen',
        'Wear protective clothing',
        'Seek shade during peak hours'
      ];
    } else if (temperature < 5) {
      return [
        'Protect from wind and cold',
        'Use moisturizing cream'
      ];
    } else {
      return ['Basic sun protection recommended'];
    }
  };

  return [
    {
      label: 'Overall Comfort',
      value: comfort,
      description: comfort >= 80 ? 'Excellent conditions' : comfort >= 60 ? 'Comfortable' : comfort >= 40 ? 'Acceptable' : 'Uncomfortable',
      status: getStatus(comfort),
      icon: Heart,
      color: getStatusColor(getStatus(comfort)),
      tips: getComfortTips(comfort, temperature, humidity)
    },
    {
      label: 'Air Quality',
      value: 100 - airQuality.value,
      description: airQuality.description,
      status: airQuality.status,
      icon: Wind,
      color: getStatusColor(airQuality.status),
      tips: airQuality.status === 'poor'
        ? ['Limit outdoor exercise', 'Consider wearing a mask', 'Stay hydrated']
        : ['Great air quality for outdoor activities']
    },
    {
      label: 'Hydration Needs',
      value: hydration,
      description: hydration >= 80 ? 'High fluid needs' : hydration >= 60 ? 'Moderate fluid needs' : hydration >= 40 ? 'Normal fluid needs' : 'Low fluid needs',
      status: hydration >= 70 ? 'poor' : hydration >= 50 ? 'moderate' : 'good',
      icon: Droplets,
      color: hydration >= 70 ? 'text-red-400' : hydration >= 50 ? 'text-amber-400' : 'text-blue-400',
      tips: hydration >= 70
        ? ['Drink water every 15-30 minutes', 'Avoid alcohol and caffeine', 'Choose water-rich foods']
        : ['Maintain regular hydration']
    },
    {
      label: 'Skin Protection',
      value: skinProtection,
      description: skinProtection >= 80 ? 'High protection needed' : skinProtection >= 60 ? 'Moderate protection' : skinProtection >= 40 ? 'Basic protection' : 'Minimal protection',
      status: skinProtection >= 70 ? 'poor' : skinProtection >= 50 ? 'moderate' : 'good',
      icon: Shield,
      color: skinProtection >= 70 ? 'text-red-400' : skinProtection >= 50 ? 'text-amber-400' : 'text-emerald-400',
      tips: getSkinTips(skinProtection, temperature)
    }
  ];
};

const getHealthTips = (temperature, humidity, condition, windSpeed) => {
  const tips = [];
  const isSunny = condition.toLowerCase().includes('sun');
  const isRainy = condition.toLowerCase().includes('rain');
  const isWindy = windSpeed > 20;

  if (temperature > 30) {
    tips.push({ icon: AlertTriangle, type: 'warning', message: 'Heat warning: Avoid strenuous outdoor activities between 10AM-4PM' });
  } else if (temperature > 25 && isSunny) {
    tips.push({ icon: Sun, type: 'caution', message: 'High UV exposure: Apply sunscreen and stay hydrated' });
  }
  if (temperature < 5) {
    tips.push({ icon: Shirt, type: 'info', message: 'Dress in layers and protect extremities from cold' });
  }
  if (humidity > 75) {
    tips.push({ icon: Droplets, type: 'info', message: 'High humidity: Choose moisture-wicking, breathable fabrics' });
  } else if (humidity < 30) {
    tips.push({ icon: Eye, type: 'info', message: 'Low humidity: Stay hydrated and use moisturizer' });
  }
  if (isRainy) {
    tips.push({ icon: Umbrella, type: 'info', message: 'Stay dry to maintain body temperature and avoid illness' });
  }
  if (isWindy) {
    tips.push({ icon: Wind, type: 'caution', message: 'Windy conditions: Secure loose items and be cautious outdoors' });
  }
  return tips;
};

const StatusIndicator = ({ status }) => {
  const getIcon = () => {
    switch (status) {
      case 'excellent': return CheckCircle;
      case 'good': return TrendingUp;
      case 'moderate': return Minus;
      case 'poor': return TrendingDown;
      case 'dangerous': return AlertTriangle;
      default: return Minus;
    }
  };
  const Icon = getIcon();
  return <Icon className="w-4 h-4" />;
};

export function HealthIndex({ temperature, humidity, windSpeed, condition }) {
  const healthMetrics = getHealthMetrics(temperature, humidity, windSpeed, condition);
  const healthTips = getHealthTips(temperature, humidity, condition, windSpeed);
  const uvIndex = getUVIndex(condition, temperature);

  return (
    <div className="p-6 bg-white/25 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 dark:bg-black/20 dark:border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white drop-shadow-md">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 drop-shadow-md">Health & Comfort</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 drop-shadow-sm">Your wellbeing at {temperature}°C</p>
        </div>
      </div>

      {uvIndex.level >= 6 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-amber-500/20 to-red-500/20 rounded-xl border border-amber-300/30 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">High UV Alert</span>
            <Badge className="bg-red-500/20 text-red-700 dark:text-red-300 border-red-300/30 text-xs">
              Level {uvIndex.level}
            </Badge>
          </div>
          <p className="text-xs text-gray-800 dark:text-gray-200">
            {uvIndex.level >= 8 ? 'Extreme UV levels - minimize sun exposure' : 'High UV levels - protection essential'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {healthMetrics.map((metric, index) => (
          <div key={index} className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{metric.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <StatusIndicator status={metric.status} />
                <span className="text-xs text-gray-700 dark:text-gray-300">{metric.value}%</span>
              </div>
            </div>
            <Progress value={metric.value} className="mb-2 h-2" />
            <div className="mb-3">
              <p className="text-xs text-gray-800 dark:text-gray-200 mb-1">{metric.description}</p>
            </div>
            <div className="space-y-1">
              {metric.tips.slice(0, 2).map((tip, tipIndex) => (
                <div key={tipIndex} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {healthTips.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Health Tips</h4>
          </div>
          <div className="space-y-2">
            {healthTips.map((tip, index) => {
              const IconComponent = tip.icon;
              const typeColors = {
                warning: 'bg-red-500/20 border-red-300/30 text-red-800 dark:text-red-200',
                caution: 'bg-amber-500/20 border-amber-300/30 text-amber-800 dark:text-amber-200',
                info: 'bg-blue-500/20 border-blue-300/30 text-blue-800 dark:text-blue-200'
              };
              return (
                <div key={index} className={`p-3 rounded-lg border backdrop-blur-sm ${typeColors[tip.type]}`}>
                  <div className="flex items-start gap-2">
                    <IconComponent className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{tip.message}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
