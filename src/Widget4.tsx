import { useAppContext } from "./AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { hasFlag } from "country-flag-icons";

const Widget4 = () => {
  const { selectedCity } = useAppContext();

  if (selectedCity)
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>City Info</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full space-y-2">
          <p className="text-gray-500">
            Selected country: {selectedCity.country}{" "}
            {hasFlag(selectedCity.country_code.toUpperCase()) ? (
              <img
                alt={selectedCity.country}
                src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selectedCity.country_code.toUpperCase()}.svg`}
                className="w-8 h-6"
              />
            ) : (
              <span className="text-2xl">🌍</span>
            )}
          </p>
          <p className="text-gray-500">Latitude: {selectedCity.latitude}</p>
          <p className="text-gray-500">Longitude: {selectedCity.longitude}</p>
        </CardContent>
      </Card>
    );
  else
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
