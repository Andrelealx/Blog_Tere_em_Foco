/**
 * @file lib/weather-service.ts
 * @description Service de integração com a OpenWeather usando os endpoints
 * GRATUITOS (Current Weather 2.5 + Forecast 2.5), mapeando para o contrato
 * interno `WeatherData` — sem depender da One Call API 3.0 (que é paga).
 *
 * - `data/2.5/weather`  → condições atuais
 * - `data/2.5/forecast` → previsão 5 dias / 3h (agregada em horária e diária)
 *
 * Fallback para dados mockados quando a chave não está configurada ou a API falha.
 */

import type {
  WeatherData,
  HourlyWeather,
  DailyWeather,
  WeatherCondition,
} from "@/lib/weather-types";
import { getMockWeatherData } from "@/lib/weather-mock";

const TERESOPOLIS_COORDS = { lat: -22.4122, lon: -42.9657 };
const PLACEHOLDER_KEY = "coloque_sua_chave_aqui";
const CACHE_REVALIDATE = 600; // segundos (10 min)

// ── Tipos crus dos endpoints 2.5 ────────────────────────────────────────────

interface RawCurrent {
  dt: number;
  timezone: number; // offset UTC em segundos
  weather: WeatherCondition[];
  main: { temp: number; feels_like: number; pressure: number; humidity: number };
  visibility?: number;
  wind: { speed: number; deg: number };
  rain?: { "1h"?: number; "3h"?: number };
  sys?: { sunrise?: number; sunset?: number };
}

interface RawForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  weather: WeatherCondition[];
  visibility?: number;
  wind: { speed: number; deg: number };
  pop?: number;
  rain?: { "3h"?: number };
}

interface RawForecast {
  list: RawForecastItem[];
  city?: { sunrise?: number; sunset?: number };
}

// ── Normalização ─────────────────────────────────────────────────────────────

/** A OpenWeather devolve vento em m/s; o app trabalha em km/h. */
function msParaKmh(metrosPorSegundo: number): number {
  return Math.round(metrosPorSegundo * 3.6 * 10) / 10;
}

function rainTo1h(rain: { "1h"?: number; "3h"?: number } | undefined): { "1h": number } | undefined {
  if (!rain) return undefined;
  const value = rain["1h"] ?? rain["3h"];
  return value != null && value > 0 ? { "1h": value } : undefined;
}

function mapCurrent(raw: RawCurrent): HourlyWeather {
  return {
    dt: raw.dt,
    temp: raw.main.temp,
    feels_like: raw.main.feels_like,
    humidity: raw.main.humidity,
    wind_speed: msParaKmh(raw.wind.speed),
    wind_deg: raw.wind.deg,
    pop: 0, // o endpoint atual não informa probabilidade de chuva
    rain: rainTo1h(raw.rain),
    uvi: 0, // os endpoints 2.5 gratuitos não fornecem índice UV
    visibility: raw.visibility ?? 10_000,
    pressure: raw.main.pressure,
    weather: raw.weather,
  };
}

function mapForecastItem(raw: RawForecastItem): HourlyWeather {
  const rain3h = raw.rain?.["3h"];
  return {
    dt: raw.dt,
    temp: raw.main.temp,
    feels_like: raw.main.feels_like,
    humidity: raw.main.humidity,
    wind_speed: msParaKmh(raw.wind.speed),
    wind_deg: raw.wind.deg,
    pop: raw.pop ?? 0,
    rain: rain3h != null && rain3h > 0 ? { "1h": rain3h / 3 } : undefined,
    uvi: 0,
    visibility: raw.visibility ?? 10_000,
    pressure: raw.main.pressure,
    weather: raw.weather,
  };
}

function localHour(dt: number): number {
  return new Date(dt * 1000).getHours();
}

/** Agrega os itens de 3h em dias (mín/máx, períodos, umidade, vento, chuva). */
function buildDaily(list: RawForecastItem[], sunrise: number, sunset: number): DailyWeather[] {
  const grupos = new Map<string, RawForecastItem[]>();
  for (const item of list) {
    const d = new Date(item.dt * 1000);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const arr = grupos.get(key);
    if (arr) arr.push(item);
    else grupos.set(key, [item]);
  }

  const days: DailyWeather[] = [];
  let index = 0;
  for (const items of grupos.values()) {
    const temps = items.map((i) => i.main.temp);
    const min = Math.min(...temps);
    const max = Math.max(...temps);

    const dayItem =
      items.find((i) => { const h = localHour(i.dt); return h >= 11 && h <= 15; }) ?? items[0];
    const nightItem =
      items.find((i) => { const h = localHour(i.dt); return h >= 0 && h <= 3; }) ?? items[0];
    const eveItem =
      items.find((i) => { const h = localHour(i.dt); return h >= 18 && h <= 21; }) ?? items[0];
    const mornItem =
      items.find((i) => { const h = localHour(i.dt); return h >= 8 && h <= 10; }) ?? items[0];

    const midnight = new Date(items[0].dt * 1000);
    midnight.setHours(0, 0, 0, 0);
    const dt = Math.floor(midnight.getTime() / 1000);

    const humidity = Math.round(items.reduce((s, i) => s + i.main.humidity, 0) / items.length);
    const windSpeed = msParaKmh(Math.max(...items.map((i) => i.wind.speed)));
    const windDeg = dayItem.wind.deg;
    const pop = Math.max(...items.map((i) => i.pop ?? 0));
    const rainTotal = items.reduce((s, i) => s + (i.rain?.["3h"] ?? 0), 0);

    days.push({
      dt,
      temp: {
        min,
        max,
        day: dayItem.main.temp,
        night: nightItem.main.temp,
        eve: eveItem.main.temp,
        morn: mornItem.main.temp,
      },
      feels_like: {
        day: dayItem.main.feels_like,
        night: nightItem.main.feels_like,
        eve: eveItem.main.feels_like,
        morn: mornItem.main.feels_like,
      },
      humidity,
      wind_speed: windSpeed,
      wind_deg: windDeg,
      pop,
      rain: rainTotal > 0 ? rainTotal : undefined,
      weather: dayItem.weather,
      uvi: 0,
      sunrise: index === 0 ? sunrise : sunrise + index * 86_400,
      sunset: index === 0 ? sunset : sunset + index * 86_400,
    });

    index++;
  }

  return days;
}

function buildUrl(path: string, apiKey: string): string {
  const url = new URL(`https://api.openweathermap.org/data/2.5/${path}`);
  url.searchParams.set("lat", `${TERESOPOLIS_COORDS.lat}`);
  url.searchParams.set("lon", `${TERESOPOLIS_COORDS.lon}`);
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "pt_br");
  return url.toString();
}

/**
 * Consulta a OpenWeather (endpoints gratuitos) para Teresópolis/RJ.
 *
 * - Sem chave configurada → retorna mock (fallback).
 * - Erro de rede/API → registra no console e retorna mock (fallback gracioso).
 *
 * @returns Dados de clima normalizados no formato WeatherData.
 */
export async function getWeatherData(): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === PLACEHOLDER_KEY) {
    return getMockWeatherData("normal");
  }

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(buildUrl("weather", apiKey), { next: { revalidate: CACHE_REVALIDATE } }),
      fetch(buildUrl("forecast", apiKey), { next: { revalidate: CACHE_REVALIDATE } }),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error(`OpenWeather respondeu com status ${currentRes.status}/${forecastRes.status}`);
    }

    const currentRaw = (await currentRes.json()) as RawCurrent;
    const forecastRaw = (await forecastRes.json()) as RawForecast;

    const current = mapCurrent(currentRaw);
    const hourly = [current, ...forecastRaw.list.map(mapForecastItem)];
    const sunrise = currentRaw.sys?.sunrise ?? forecastRaw.city?.sunrise ?? 0;
    const sunset = currentRaw.sys?.sunset ?? forecastRaw.city?.sunset ?? 0;

    return {
      lat: TERESOPOLIS_COORDS.lat,
      lon: TERESOPOLIS_COORDS.lon,
      timezone: "America/Sao_Paulo",
      timezone_offset: currentRaw.timezone,
      current,
      hourly,
      daily: buildDaily(forecastRaw.list, sunrise, sunset),
    };
  } catch (error) {
    console.error("[weather-service] Falha ao consultar OpenWeather:", error);
    return getMockWeatherData("normal");
  }
}
