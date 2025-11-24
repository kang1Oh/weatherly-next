// /src/services/weatherService.js

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Fetch current weather + daily forecast for a city (via lat/lon).
 * @param {number} lat
 * @param {number} lon
 * @param {string} city
 * @param {string} country
 * @returns {Promise<{current: object, forecast: object[]}>}
 */
export async function fetchWeather(lat, lon, city, country) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current_weather: "true",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode",
    timezone: "auto",
  });

  const url = `${BASE_URL}?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch weather data");
    const data = await res.json();

    // Map Open-Meteo weathercode to human-readable condition
    const conditionMap = {
      0: "Clear",
      1: "Mainly Clear",
      2: "Partly Cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Rime Fog",
      51: "Light Drizzle",
      61: "Light Rain",
      63: "Moderate Rain",
      65: "Heavy Rain",
      71: "Snow",
      80: "Rain Showers",
      95: "Thunderstorm",
    };

    // Current weather
    const current = {
      city,
      country,
      temperature: data.current_weather.temperature,
      condition: conditionMap[data.current_weather.weathercode] || "Unknown",
      humidity: data.daily.relative_humidity_2m_max?.[0] ?? 60, // fallback
      windSpeed: data.current_weather.windspeed,
      feelsLike: data.current_weather.temperature, // Open-Meteo lacks feels-like
      description: "Live weather update",
    };

    // Weekly forecast
    const forecast = data.daily.time.map((date, i) => ({
      day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      temperature: {
        high: data.daily.temperature_2m_max[i],
        low: data.daily.temperature_2m_min[i],
      },
      condition: conditionMap[data.daily.weathercode[i]] || "Unknown",
      precipitation: data.daily.precipitation_sum[i],
      windSpeed: data.daily.windspeed_10m_max[i],
    }));

    return { current, forecast };
  } catch (err) {
    console.error(err);
    return { current: null, forecast: [] };
  }
}
