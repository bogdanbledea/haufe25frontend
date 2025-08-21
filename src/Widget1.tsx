import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { useAppContext } from "./AppContext";

const Widget1 = () => {
  const { selectedCity: city } = useAppContext();

  const [weather, setWeatherData] = useState<any>(null);

  useEffect(() => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${city?.latitude}&longitude=${city?.longitude}&current_weather=true`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeatherData(data.current_weather);
      })
      .catch((err) => console.error(err));
  }, [city]);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Current Weather Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        <p className="text-gray-500">Team 1: Start here</p>
      </CardContent>
    </Card>
  );
};

export default Widget1;
