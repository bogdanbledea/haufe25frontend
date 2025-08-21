import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

const Widget2 = () => {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>3-Day Forecast Chart</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        <p className="text-gray-500">Team 2: Start here</p>
      </CardContent>
    </Card>
  );
};

export default Widget2;
