import type { WeatherData, HourlyWeather, DailyWeather } from "@/lib/weather-types";
import { getMockWeatherData } from "@/lib/weather-mock";
import { ok } from "@/backforge/http";

const TERESOPOLIS_COORDS = { lat: -22.4122, lon: -42.9657 };

/** Placeholder do .env.example — tratado como "chave não configurada". */
const PLACEHOLDER_KEY = "coloque_sua_chave_aqui";

/** A OpenWeather devolve vento em m/s; o app trabalha em km/h. */
function msParaKmh(metrosPorSegundo: number): number {
  return Math.round(metrosPorSegundo * 3.6 * 10) / 10;
}

function converterVelocidadeVento<T extends { wind_speed: number }>(item: T): T {
  return { ...item, wind_speed: msParaKmh(item.wind_speed) };
}

function normalizarRespostaOpenWeather(raw: WeatherData): WeatherData {
  return {
    ...raw,
    current: converterVelocidadeVento(raw.current) as HourlyWeather,
    hourly: raw.hourly.map((h) => converterVelocidadeVento(h) as HourlyWeather),
    daily: raw.daily.map((d) => converterVelocidadeVento(d) as DailyWeather),
  };
}

export async function GET() {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === PLACEHOLDER_KEY) {
    return ok(getMockWeatherData("normal"));
  }

  try {
    const url = new URL("https://api.openweathermap.org/data/3.0/onecall");
    url.searchParams.set("lat", `${TERESOPOLIS_COORDS.lat}`);
    url.searchParams.set("lon", `${TERESOPOLIS_COORDS.lon}`);
    url.searchParams.set("appid", apiKey);
    url.searchParams.set("lang", "pt_br");
    url.searchParams.set("units", "metric");
    url.searchParams.set("exclude", "minutely");

    const response = await fetch(url.toString(), {
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      throw new Error(`OpenWeather respondeu com status ${response.status}`);
    }

    const bruto = (await response.json()) as WeatherData;
    return ok(normalizarRespostaOpenWeather(bruto));
  } catch (error) {
    console.error("[/api/weather] Falha ao consultar OpenWeather:", error);
    return ok(getMockWeatherData("normal"));
  }
}
