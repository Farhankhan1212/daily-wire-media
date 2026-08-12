import { useEffect, useState } from "react";
import {
  FiCloud,
  FiCloudRain,
  FiMapPin,
  FiSun,
  FiWind,
  FiDroplet,
} from "react-icons/fi";
import { fetchWeather } from "../services/api";

const WeatherBar = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("New Delhi");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWeather(city);
  }, []);

  const loadWeather = async (selectedCity) => {
    try {
      setLoading(true);
      setError("");

      const { data } = await fetchWeather(selectedCity);

      if (data.success) {
        setWeather(data.weather);
      } else {
        setError("Weather unavailable");
      }
    } catch (err) {
      console.error("Weather error:", err);
      setError("Weather unavailable");
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    loadWeather(selectedCity);
  };

  const getWeatherIcon = () => {
    const condition = weather?.condition?.toLowerCase() || "";

    if (condition.includes("rain")) {
      return <FiCloudRain size={22} />;
    }

    if (condition.includes("cloud")) {
      return <FiCloud size={22} />;
    }

    return <FiSun size={22} />;
  };

  return (
    <div className="border-b border-ink/10 dark:border-paper/10 bg-paper dark:bg-ink">
      <div className="max-w-7xl mx-auto px-6 py-2">
        <div className="flex items-center justify-between gap-4 text-xs">

          {/* Location */}
          <div className="flex items-center gap-2">
            <FiMapPin className="text-crimson" size={15} />

            <select
              value={city}
              onChange={handleCityChange}
              className="
                bg-transparent
                outline-none
                font-semibold
                cursor-pointer
                text-ink
                dark:text-paper
              "
            >
              <option value="New Delhi">New Delhi</option>
              <option value="Lucknow">Lucknow</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Chennai">Chennai</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>

          {/* Weather */}
          {loading ? (
            <span className="text-slate-500">
              Loading weather...
            </span>
          ) : error ? (
            <span className="text-slate-500">
              {error}
            </span>
          ) : weather ? (
            <div className="flex items-center gap-5">

              <div className="flex items-center gap-2">
                {getWeatherIcon()}

                <span className="font-bold text-base">
                  {Math.round(weather.temperature)}°C
                </span>

                <span className="hidden sm:inline text-slate-600 dark:text-paper-dim">
                  {weather.condition}
                </span>
              </div>

              <div className="hidden md:flex items-center gap-1 text-slate-600 dark:text-paper-dim">
                <FiDroplet size={13} />
                {weather.humidity}%
              </div>

              <div className="hidden md:flex items-center gap-1 text-slate-600 dark:text-paper-dim">
                <FiWind size={13} />
                {weather.windSpeed} km/h
              </div>
            </div>
          ) : null}

          <span className="hidden lg:block font-mono text-[10px] uppercase tracking-wider text-slate-500">
            Weather Desk
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherBar;