import { useAppContext } from "./AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { hasFlag } from "country-flag-icons";

const Widget4 = () => {
  const { selectedCity } = useAppContext();

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>City Info</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-full space-y-2">
        {selectedCity ? (
          <div className="flex flex-col gap-4 items-center text-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            {/* Country + flag */}
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-800">
                🌐 {selectedCity.name}, {selectedCity.country}
              </span>
              {hasFlag(selectedCity.country_code.toUpperCase()) ? (
                <img
                  alt={selectedCity.country}
                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selectedCity.country_code.toUpperCase()}.svg`}
                  className="w-8 h-6 rounded-sm shadow-sm border"
                />
              ) : (
                <span className="text-2xl">🌍</span>
              )}
            </div>

            {/* Latitude */}
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-blue-600">📍 Latitude:</span>
              <span className="font-mono text-blue-900">
                {selectedCity.latitude}
              </span>
            </div>

            {/* Longitude */}
            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-indigo-600">📍 Longitude:</span>
              <span className="font-mono text-indigo-900">
                {selectedCity.longitude}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No city selected.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Widget4;
