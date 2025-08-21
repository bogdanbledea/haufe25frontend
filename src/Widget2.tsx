import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppContext } from "./AppContext";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { Sun, CloudSun, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog } from "lucide-react";

/**
 * Single chart + day switcher
 * - 3-day forecast, one chart visible at a time
 * - Tabs to switch day, °C/°F toggle, min/max band line
 */

type Unit = "c" | "f";

interface Hourly { time: string[]; temperature_2m: number[]; }
interface Daily { time: string[]; temperature_2m_min: number[]; temperature_2m_max: number[]; weathercode: number[]; }
interface ForecastResponse { timezone: string; hourly?: Hourly; daily?: Daily; }

const weatherIcon = (code?: number) => {
    if (code == null) return <Cloud className="w-5 h-5" />;
    if (code === 0) return <Sun className="w-5 h-5" />; // clear
    if ([1, 2, 3].includes(code)) return <CloudSun className="w-5 h-5" />; // partly
    if ([45, 48].includes(code)) return <CloudFog className="w-5 h-5" />; // fog
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return <CloudRain className="w-5 h-5" />; // rain
    if ([71, 73, 75, 77, 85, 86].includes(code)) return <Snowflake className="w-5 h-5" />; // snow
    if ([95, 96, 97, 98, 99].includes(code)) return <CloudLightning className="w-5 h-5" />; // thunder
    return <Cloud className="w-5 h-5" />;
};

export default function Widget2() {
    const { selectedCity } = useAppContext();
    const [unit, setUnit] = useState<Unit>("c");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ForecastResponse | null>(null);
    const [activeDay, setActiveDay] = useState<string | null>(null); // yyyy-mm-dd

    const fetchData = async (signal?: AbortSignal) => {
        if (!selectedCity) return;
        setLoading(true);
        setError(null);

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity?.latitude}&longitude=${selectedCity?.longitude}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=3`;

        try {
            const res = await fetch(url, { signal });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json: ForecastResponse = await res.json();
            if (!json.hourly || !json.daily) throw new Error("Unexpected API response");
            setData(json);
            setActiveDay(json.daily.time[0] ?? null);
        } catch (e: any) {
            if (e?.name === "AbortError") return;
            setError(e?.message ?? "Failed to load forecast");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!selectedCity) return;
        const controller = new AbortController();
        fetchData(controller.signal);
        return () => controller.abort();
    }, [selectedCity?.latitude, selectedCity?.longitude]);

    const convert = (c: number) => (unit === "c" ? c : c * 9/5 + 32);
    const unitLabel = unit === "c" ? "°C" : "°F";

    const prettyDate = (yyyyMmDd: string) => {
        const d = new Date(`${yyyyMmDd}T00:00:00`);
        return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
    };

    // Series for the active day
    const chartSeries = useMemo(() => {
        if (!data?.hourly || !data?.daily || !activeDay) return [] as { hour: string; temp: number }[];
        const { time, temperature_2m } = data.hourly;
        const out: { hour: string; temp: number }[] = [];
        for (let i = 0; i < time.length; i++) {
            const [date, hour] = time[i].split("T");
            if (date === activeDay) out.push({ hour: hour.slice(0,5), temp: convert(temperature_2m[i]) });
        }
        return out;
    }, [data, activeDay, unit]);

    const minMax = useMemo(() => {
        if (!data?.daily || !activeDay) return null as null | { min: number; max: number; code?: number };
        const idx = data.daily.time.indexOf(activeDay);
        if (idx === -1) return null;
        return {
            min: convert(data.daily.temperature_2m_min[idx]),
            max: convert(data.daily.temperature_2m_max[idx]),
            code: data.daily.weathercode[idx],
        };
    }, [data, activeDay, unit]);

    return (
        <Card className="w-full h-full">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2">
                    {selectedCity ? (
                        <>
                            <span>3-Day Forecast</span>
                            <span>for</span>
                            <span className="font-semibold">{selectedCity.name}</span>
                        </>
                    ) : (
                        "3-Day Forecast"
                    )}
                </CardTitle>
                <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-xl border p-1 backdrop-blur-sm">
                        <Button size="sm" variant={unit === "c" ? "default" : "ghost"} onClick={() => setUnit("c")}>°C</Button>
                        <Button size="sm" variant={unit === "f" ? "default" : "ghost"} onClick={() => setUnit("f")}>°F</Button>
                    </div>
                    {error && (
                        <Button size="sm" variant="outline" onClick={() => fetchData()}>Retry</Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {!selectedCity ? (
                    <p className="text-muted-foreground">Selectează un oraș pentru prognoză.</p>
                ) : loading ? (
                    <p className="animate-pulse text-muted-foreground">Se încarcă prognoza…</p>
                ) : error ? (
                    <p className="text-destructive">Eroare: {error}</p>
                ) : !data?.daily || !activeDay ? (
                    <p className="text-muted-foreground">Nu există date disponibile.</p>
                ) : (
                    <>
                        <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
                            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                                {data.daily.time.slice(0,3).map((d) => (
                                    <TabsTrigger key={d} value={d} className="text-xs sm:text-sm">
                                        {prettyDate(d)}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {data.daily.time.slice(0,3).map((d) => (
                                <TabsContent key={d} value={d}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div>{weatherIcon(minMax?.code)}</div>
                                            <div className="font-medium">{prettyDate(d)}</div>
                                        </div>
                                        {minMax && (
                                            <div className="text-sm text-muted-foreground">
                                                Min <span className="font-semibold">{minMax.min.toFixed(0)}{unitLabel}</span>
                                                <span className="mx-1">·</span>
                                                Max <span className="font-semibold">{minMax.max.toFixed(0)}{unitLabel}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="h-64 w-full mt-2 rounded-xl border p-2 bg-card">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartSeries} margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
                                                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                                                <YAxis width={40} tick={{ fontSize: 12 }} />
                                                <Tooltip formatter={(v: any) => `${(v as number).toFixed(1)}${unitLabel}`} labelFormatter={(l) => `Ora ${l}`} />
                                                {minMax && (
                                                    <>
                                                        <ReferenceLine y={minMax.min} strokeDasharray="3 3" />
                                                        <ReferenceLine y={minMax.max} strokeDasharray="3 3" />
                                                    </>
                                                )}
                                                <Line type="monotone" dataKey="temp" dot={false} strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>

                        <Separator />
                        <p className="text-xs text-muted-foreground">Sfat: poți schimba ziua din tab-urile de mai sus. Temperaturi afișate în {unitLabel}.</p>
                    </>
                )}
            </CardContent>
        </Card>
    );
}