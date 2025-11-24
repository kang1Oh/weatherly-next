export async function getWeather(lat, lon, city, country) {
    const res = await fetch(
        `/api/weather?lat=${lat}&lon=${lon}&city=${city}&country=${country}`
    );
    if (!res.ok) throw new Error("Weather fetch failed");
    return res.json();
}
