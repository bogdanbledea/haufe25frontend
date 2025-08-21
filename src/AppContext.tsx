import { createContext, useState, useContext, type ReactNode } from "react";

// --------------------
// Types
// --------------------
interface CityResult {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}


interface AppContextType {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
//  country:string;
  results: CityResult[];
  selectedCity: CityResult | null;
  setSelectedCity: React.Dispatch<React.SetStateAction<CityResult| null>>;
   // selectedCountry: CityResult | null;
//  setSelectedCountry: React.Dispatch<React.SetStateAction<CountryResult | null>>;
  loading: boolean;
  error: string | null;
  searchCities: () => Promise<void>;
}

// --------------------
// Context
// --------------------
const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used inside AppContextProvider");
  }
  return ctx;
};

// --------------------
// Provider
// --------------------
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CityResult[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
//  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const searchCities = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();

      if (data.results) {
        setResults(
          data.results.map((r: any, idx: number) => ({
            id: idx,
            name: r.name,
            country: r.country,
            latitude: r.latitude,
            longitude: r.longitude,
          }))
        );
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch cities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        query,
        setQuery,
        results,
        selectedCity,
        setSelectedCity,
    //    selectedCountry,
//  setSelectedCountry,

        loading,
        error,
        searchCities,

      }}
    >
      {children}
    </AppContext.Provider>
  );
};
