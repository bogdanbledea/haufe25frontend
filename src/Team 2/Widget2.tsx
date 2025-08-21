import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import axios from "axios";

axios
  .get(
    "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&forecast_days=3"
  )
  .then((response) => {
    console.log(response.data);
  });

const Widget2 = () => {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>3-Day Forecast Chart</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        <p className="text-gray-500">We are starting here!</p>
      </CardContent>
    </Card>
  );
};

export default Widget2;
