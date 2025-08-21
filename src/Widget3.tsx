import { useEffect, useState } from "react";
import { useAppContext } from "./AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Widget3 = () => {
  const { selectedCity } = useAppContext();
  const [chartData, setChartData] = useState<ChartData<"line"> | null>(null);
  const longitude = selectedCity?.longitude;
  const latitude = selectedCity?.latitude;

  const start_hour = dayjs().format("YYYY-MM-DDTHH:mm");
  const end_hour = dayjs().add(12, "hour").format("YYYY-MM-DDTHH:mm");

  useEffect(() => {
    getData();
  }, [selectedCity]);

  const getData = async () => {
    if (!selectedCity) return;

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&start_hour=${start_hour}&end_hour=${end_hour}`
      );
      const data = await response.json();

      const labels = data?.hourly?.time.map((t: any) =>
        dayjs(t).format("HH:mm")
      );
      const temperatures = data?.hourly?.temperature_2m;

      const formattedData = {
        labels,
        datasets: [
          {
            label: "Temperature (°C)",
            data: temperatures,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.3,
          },
        ],
      };

      setChartData(formattedData);
    } catch (err) {
      console.error("Failed to fetch chart data:", err);
    }
  };

  // Chart options to control sizing and responsiveness
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // This is key!
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
    },
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Hourly Weather Timeline</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center min-h-0">
        {chartData ? (
          <div className="w-full h-full min-h-[300px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p className="text-gray-500">Loading chart...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Widget3;
