// /src/services/geocodingService.js
const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function geocodeCity(city, limit = 5) {
  const url = `${BASE_URL}?name=${encodeURIComponent(city)}&count=${limit}&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to geocode city");
  const data = await res.json();

  if (!data.results || data.results.length === 0) return [];

  return data.results.map(({ latitude, longitude, name, country }) => ({
    lat: latitude,
    lon: longitude,
    city: name,
    country,
  }));
}
