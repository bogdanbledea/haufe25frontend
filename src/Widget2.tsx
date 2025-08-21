import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { useAppContext } from "./AppContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="w-[80px]">Hour</TableHead>
                <TableHead className="text-right">Temperature (°C)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                const mainHours = ["00:00", "06:00", "12:00", "18:00"];
                const times: string[] = forecast.hourly.time;
                const temps: number[] = forecast.hourly.temperature_2m;
                const rows: { date: string; hour: string; temp: number }[] = [];
                times.forEach((iso, idx) => {
                  const [date, hour] = iso.split("T");
                  if (mainHours.includes(hour)) {
                    rows.push({ date, hour, temp: temps[idx] });
                  }
                });
                const days = Array.from(new Set(rows.map((r) => r.date))).slice(
                  0,
                  3
                );
                const filteredRows = rows.filter((r) => days.includes(r.date));
                return filteredRows.map((row, idx) => (
                  <TableRow key={row.date + row.hour}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.hour}</TableCell>
                    <TableCell className="text-right">{row.temp}</TableCell>
                  </TableRow>
                ));
              })()}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default Widget2;
