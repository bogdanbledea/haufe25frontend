import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { useAppContext } from "./AppContext";

// Function to get weather icon and description
const getWeatherInfo = (weatherCode: number) => {
  const weatherMap: {
    [key: number]: { icon: string; description: string; color: string };
  } = {
    0: { icon: "☀️", description: "Clear sky", color: "text-yellow-500" },
    1: {
      icon: "🌤️",
      description: "Mainly clear",
      color: "text-yellow-400",
    },
    2: { icon: "⛅", description: "Partly cloudy", color: "text-blue-400" },
    3: { icon: "☁️", description: "Overcast", color: "text-gray-500" },
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
