import React, { useEffect, useState } from "react";
import "./App.css";
import sunny from "./icons/sunny.png";
import cloudy from "./icons/cloudy.png";
import rain from "./icons/rain.png";
import thunder from "./icons/thunder.png";

function App() {
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm&timezone=Europe%2FCopenhagen&hourly=temperature_2m,weathercode`
          )
            .then((res) => res.json())
            .then((data) => {
              setWeather(data.current_weather);

              const now = new Date();
              const currentHour = now.getHours();
              const next3Hours = data.hourly.time
                .map((time, i) => ({
                  time,
                  temp: data.hourly.temperature_2m[i],
                  code: data.hourly.weathercode[i],
                }))
                .filter((_, i) => i >= currentHour && i < currentHour + 3);

              setHourly(next3Hours);
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

  const getIcon = (code) => {
    if (code >= 51 && code < 80) return rain;
    if (code >= 80) return thunder;
    if (code >= 1 && code < 50) return cloudy;
    return sunny;
  };

  const getText = (code) => {
    if (code >= 51 && code < 80) return "Rainy";
    if (code >= 80) return "Thunderstorm";
    if (code >= 1 && code < 50) return "Cloudy";
    return "Sunny";
  };

  return (
    <div className="weather-container">
      <h1><span>You</span>Weather</h1>
      <img src={getIcon(weather.weathercode)} alt="Weather Icon" className="weather-icon" />
      <div className="temperature">{weather.temperature}°C</div>
      <div className="condition">{getText(weather.weathercode)}</div>
      <div className="details">
        <p>💨 Wind: {weather.windspeed} km/h</p>
        <p>🧭 Wind Direction: {weather.winddirection}°</p>
      </div>

      <div className="hourly-forecast">
        {hourly.map((h, index) => {
          const hour = new Date(h.time).getHours();
          return (
            <div key={index} className="hourly-item">
              <img src={getIcon(h.code)} alt="Weather Icon" className="hourly-icon" />
              <div className="hourly-temp">{h.temp}°C</div>
              <div className="hourly-time">{hour}:00</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;