import React, { useEffect, useState } from "react";
import "./App.css";
import sunny from "./icons/sunny.png";
import cloudy from "./icons/cloudy.png";
import rain from "./icons/rain.png";
import thunder from "./icons/thunder.png";

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm&timezone=Europe%2FCopenhagen`
          )
            .then((res) => res.json())
            .then((data) => {
              setWeather(data.current_weather);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        },
        () => setLoading(false)
      );
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="weather">Loading weather...</div>;
  if (!weather) return <div className="weather">Failed to load weather</div>;

  const weatherCode = weather.weathercode;
  let icon = sunny;
  if (weatherCode >= 51 && weatherCode < 80) icon = rain;
  else if (weatherCode >= 80) icon = thunder;
  else if (weatherCode >= 1 && weatherCode < 50) icon = cloudy;

  return (
    <div className="weather-container">
      <img src={icon} alt="Weather Icon" className="weather-icon" />
      <div className="temperature">{weather.temperature}°C</div>
      <div className="details">
        <p>💨 Wind: {weather.windspeed} km/h</p>
        <p>🧭 Wind Direction: {weather.winddirection}°</p>
      </div>
    </div>
  );
}

export default App