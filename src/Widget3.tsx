import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

const Widget3 = () => {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Hourly Weather Timeline</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        <p className="text-gray-500">Team 3: Start here</p>
      </CardContent>
    </Card>
  );
};

export default Widget3;
