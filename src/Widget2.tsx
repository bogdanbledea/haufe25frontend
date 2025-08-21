import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { useAppContext } from "./AppContext";

const Widget2 = () => {
    const { selectedCity } = useAppContext();
    const [forecast, setForecast] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedCity) return;

        async function getData() {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&hourly=temperature_2m&timezone=auto&forecast_days=3`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                const result = await response.json();
                console.log(result);
                setForecast(result);
            } catch (err: any) {
                console.error(err.message);
                setError(err.message);
            }
        }

        getData();
    }, [selectedCity]);

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle>
                    {selectedCity
                        ? `3-Day Forecast for ${selectedCity.name}`
                        : "3-Day Forecast"}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
                {error && <p className="text-red-500">Error: {error}</p>}
                {!selectedCity ? (
                    <p className="text-gray-500">Select a city to see forecast.</p>
                ) : !forecast ? (
                    <p>Loading...</p>
                ) : (
                    <pre className="text-xs">
            {JSON.stringify(forecast.hourly.temperature_2m.slice(0, 10), null, 2)}
          </pre>
                )}
            </CardContent>
        </Card>
    );
};

export default Widget2;
