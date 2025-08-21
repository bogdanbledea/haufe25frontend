import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

const Widget4 = () => {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>City Info</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        <p className="text-gray-500">Team 4: Start here</p>
      </CardContent>
    </Card>
  );
};

export default Widget4;
