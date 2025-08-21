import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

const Widget1 = () => {
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
