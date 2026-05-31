let currentLat = 19.0760; // Default: Mumbai
let currentLon = 72.8777;

async function getWeather(lat, lon) {
    try {
        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
        );
        const data = await res.json();

        const wmoCodes = {
            0: "Clear sky ☀️",
            1: "Mainly clear 🌤️",
            2: "Partly cloudy ⛅",
            3: "Overcast ☁️",
            45: "Fog 🌫️",
            51: "Light drizzle 🌧️",
            61: "Rain 🌧️",
            71: "Snow ❄️",
            95: "Thunderstorm ⛈️"
            // Add more if needed
        };

        document.getElementById('location').textContent = `📍 ${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        document.getElementById('temp').textContent = `${Math.round(data.current.temperature_2m)}°C`;
        document.getElementById('condition').textContent = wmoCodes[data.current.weather_code] || "Unknown";
        document.getElementById('humidity').textContent = data.current.relative_humidity_2m;
        document.getElementById('wind').textContent = Math.round(data.current.wind_speed_10m * 3.6); // km/h
        document.getElementById('feels').textContent = Math.round(data.current.apparent_temperature);
        
    } catch (e) {
        alert("Failed to fetch weather. Check your connection.");
    }
}

// Search by city (uses a free geocoding service)
async function searchCity() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) return;

    try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
        const geoData = await geoRes.json();
        
        if (geoData.results && geoData.results.length > 0) {
            const loc = geoData.results[0];
            currentLat = loc.latitude;
            currentLon = loc.longitude;
            document.getElementById('location').textContent = `📍 ${loc.name}, ${loc.country}`;
            getWeather(currentLat, currentLon);
        } else {
            alert("City not found!");
        }
    } catch (e) {
        alert("Geocoding error.");
    }
}

async function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            currentLat = pos.coords.latitude;
            currentLon = pos.coords.longitude;
            getWeather(currentLat, currentLon);
        }, () => alert("Location access denied."));
    }
}

// Load default weather
window.onload = () => getWeather(currentLat, currentLon);
