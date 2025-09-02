import React, { useEffect, useState } from "react";
import "./App.css";

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

  if (loading) return <div className="weather">Načítám počasí...</div>;
  if (!weather) return <div className="weather">Nepodařilo se načíst počasí</div>;

  return (
    <div className="weather">
      <h3>Aktuální počasí</h3>
      <p>🌡️ Teplota: {weather.temperature} °C</p>
      <p>💨 Vítr: {weather.windspeed} km/h</p>
      <p>🧭 Směr větru: {weather.winddirection}°</p>
    </div>
  );
}

export default App;
