import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "./components/ui/input";
import { useAppContext } from "./AppContext";
import Widget1 from "./Widget1";
import Widget2 from "./Widget2.tsx";
import Widget3 from "./Widget3";
import Widget4 from "./Widget4";
import { CountryDropdown } from "@/components/ui/country-dropdown";

function App() {
  const {
    query,
    setQuery,
    results,
    setSelectedCity,
    searchCities,
    loading,
    error,
  } = useAppContext();

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-4">
      {/* Search Section */}
      <div className="mb-4">
        <CountryDropdown
          placeholder="Select country"
          defaultValue="USA"
          onChange={() => {}}
        />
      </div>

      <div className="">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>1. Search & Select City</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 space-y-2">
              <Input
                placeholder="Enter city name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchCities()}
              />
              <Button onClick={searchCities} disabled={loading}>
                {loading ? "Loading..." : "Search"}
              </Button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {results.length > 0 && (
              <ul className="mt-4 space-y-2">
                {results.map((city) => (
                  <li key={city.id}>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setSelectedCity(city)}
                    >
                      {city.name}, {city.country}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 4 Widgets Grid */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 mt-8">
        <Widget1 />
        <Widget2 />
        <Widget3 />
        <Widget4 />
      </div>
    </div>
  );
}

export default App;
