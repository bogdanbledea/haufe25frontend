import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { useAppContext } from "./AppContext";

// Function to get weather icon and description
const getWeatherInfo = (weatherCode: number) => {
  const weatherMap: {
    [key: number]: { icon: string; description: string; color: string };
  } = {
    0: { icon: "☀️", description: "Clear sky", color: "text-yellow-500" },
    1: { icon: "🌤️", description: "Mainly clear", color: "text-yellow-400" },
    2: { icon: "⛅", description: "Partly cloudy", color: "text-blue-400" },
    3: { icon: "☁️", description: "Overcast", color: "text-gray-500" },

    45: { icon: "🌫️", description: "Fog", color: "text-gray-400" },
    48: {
      icon: "🌫️",
      description: "Depositing rime fog",
      color: "text-gray-400",
    },

    51: { icon: "🌦️", description: "Light drizzle", color: "text-blue-300" },
    53: { icon: "🌦️", description: "Moderate drizzle", color: "text-blue-400" },
    55: { icon: "🌧️", description: "Dense drizzle", color: "text-blue-500" },

    56: {
      icon: "🌧️❄️",
      description: "Light freezing drizzle",
      color: "text-cyan-400",
    },
    57: {
      icon: "🌧️❄️",
      description: "Dense freezing drizzle",
      color: "text-cyan-500",
    },

    61: { icon: "🌦️", description: "Slight rain", color: "text-blue-400" },
    63: { icon: "🌧️", description: "Moderate rain", color: "text-blue-500" },
    65: { icon: "🌧️", description: "Heavy rain", color: "text-blue-600" },

    66: {
      icon: "🌨️",
      description: "Light freezing rain",
      color: "text-cyan-400",
    },
    67: {
      icon: "🌨️",
      description: "Heavy freezing rain",
      color: "text-cyan-600",
    },

    71: { icon: "🌨️", description: "Slight snow fall", color: "text-white" },
    73: {
      icon: "🌨️",
      description: "Moderate snow fall",
      color: "text-gray-200",
    },
    75: { icon: "❄️", description: "Heavy snow fall", color: "text-gray-300" },

    77: { icon: "❄️", description: "Snow grains", color: "text-gray-200" },

    80: {
      icon: "🌧️",
      description: "Slight rain showers",
      color: "text-blue-400",
    },
    81: {
      icon: "🌧️",
      description: "Moderate rain showers",
      color: "text-blue-500",
    },
    82: {
      icon: "🌧️",
      description: "Violent rain showers",
      color: "text-blue-700",
    },

    85: { icon: "🌨️", description: "Slight snow showers", color: "text-white" },
    86: {
      icon: "❄️",
      description: "Heavy snow showers",
      color: "text-gray-300",
    },

    95: { icon: "⛈️", description: "Thunderstorm", color: "text-purple-600" },
    96: {
      icon: "⛈️🌨️",
      description: "Thunderstorm with slight hail",
      color: "text-purple-700",
    },
    99: {
      icon: "⛈️❄️",
      description: "Thunderstorm with heavy hail",
      color: "text-purple-800",
    },
  };

  return (
    weatherMap[weatherCode] || {
      icon: "❓",
      description: "Unknown",
      color: "text-gray-500",
    }
  );
};

const Widget1 = () => {
  const { selectedCity: city } = useAppContext();
  const [weather, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city) return;

    setLoading(true);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${city?.latitude}&longitude=${city?.longitude}&current_weather=true`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeatherData(data.current_weather);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [city]);

  const weatherInfo = weather ? getWeatherInfo(weather.weathercode) : null;

  return (
    <Card className="w-full h-full bg-white border border-gray-200 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          Current Weather Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-full space-y-6">
        {loading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-600">Loading weather data...</p>
          </div>
        ) : !city ? (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🏙️</div>
            <p className="text-gray-600 text-lg">
              Select a city to see the current weather
            </p>
          </div>
        ) : weather ? (
          <div className="text-center space-y-6 w-full">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">{city.name}</h2>
              <p className="text-gray-600">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="space-y-4">
              <div className={`text-8xl ${weatherInfo?.color}`}>
                {weatherInfo?.icon}
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-gray-800">
                  {Math.round(weather.temperature)}°C
                </div>
                <p className={`text-lg font-medium ${weatherInfo?.color}`}>
                  {weatherInfo?.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center space-y-2">
                <div className="text-2xl">💨</div>
                <div className="text-sm text-gray-600">Wind</div>
                <div className="font-semibold text-gray-800">
                  {Math.round(weather.windspeed)} km/h
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl">🧭</div>
                <div className="text-sm text-gray-600">Direction</div>
                <div className="font-semibold text-gray-800">
                  {weather.winddirection}°
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-gray-600">Failed to load weather data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Widget1;
