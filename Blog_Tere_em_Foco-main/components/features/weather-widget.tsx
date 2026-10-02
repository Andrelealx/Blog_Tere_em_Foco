"use client";

import { useEffect, useState } from "react";
import { CloudSun, Thermometer } from "lucide-react";
import { Skeleton } from "@/components/ui";
import type { WeatherData } from "@/lib/weather-types";

interface WeatherResponse {
  ok: boolean;
  data: WeatherData;
}

interface WeatherSummary {
  city: string;
  temp: number;
  feelsLike: number;
  description: string;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchWeather = async () => {
      try {
        const response = await fetch("/api/weather", { signal: controller.signal });
        if (!response.ok) {
          throw new Error("Falha ao carregar clima");
        }
        const json = (await response.json()) as WeatherResponse;
        const current = json.data?.current;
        if (!json.ok || !current) {
          throw new Error("Resposta de clima inválida");
        }
        if (mounted) {
          setWeather({
            city: "Teresópolis",
            temp: current.temp,
            feelsLike: current.feels_like,
            description: current.weather[0]?.description ?? "clima serrano estável",
          });
        }
      } catch {
        if (mounted) {
          setWeather({
            city: "Teresópolis",
            temp: 18,
            feelsLike: 17,
            description: "clima serrano estável",
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchWeather();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  if (loading) {
    return <Skeleton className="h-28 w-full" />;
  }

  if (!weather) return null;

  return (
    <aside className="rounded-2xl border border-black/5 bg-white/80 p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-600 dark:text-stone-300">Agora em {weather.city}</p>
        <CloudSun size={18} className="text-accent" />
      </div>
      <div className="mt-3 flex items-end gap-3">
        <span className="font-display text-4xl text-terra dark:text-cume">
          {Math.round(weather.temp)}°
        </span>
        <span className="mb-1 inline-flex items-center gap-1 text-sm text-stone-600 dark:text-stone-300">
          <Thermometer size={14} aria-hidden />
          sensação {Math.round(weather.feelsLike)}°
        </span>
      </div>
      <p className="mt-2 text-sm capitalize text-stone-700 dark:text-stone-200">{weather.description}</p>
    </aside>
  );
}
