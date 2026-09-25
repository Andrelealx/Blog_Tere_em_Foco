/**
 * @file app/api/weather/route.ts
 * @description Rota real de clima — consulta a OpenWeather One Call API 3.0.
 *
 * ─── Correção aplicada (AV1) ────────────────────────────────────────────────
 * A versão anterior desta rota devolvia um objeto simplificado
 * ({ city, temp, feelsLike, description, ... }), mas o hook `useWeather`
 * (hooks/useWeather.ts) espera o formato completo `WeatherData` da
 * OpenWeather One Call API 3.0 (current/hourly/daily/alerts), o mesmo
 * formato usado em `lib/weather-mock.ts`. Isso fazia a página de Clima
 * quebrar sempre que NEXT_PUBLIC_USE_WEATHER_MOCK não estivesse em "true".
 *
 * Agora a rota:
 *   1. Sem OPENWEATHER_API_KEY configurada → devolve o mock (getMockWeatherData),
 *      no MESMO formato que a API real usaria — sem dados fixos duplicados.
 *   2. Com a chave configurada → consulta a OpenWeather de verdade e converte
 *      a velocidade do vento de m/s (padrão da OpenWeather) para km/h,
 *      unidade usada pelos limiares de risco em hooks/useWeather.ts.
 *   3. Qualquer falha na chamada externa → fallback gracioso para o mock,
 *      sem derrubar a página.
 */

import { NextResponse } from "next/server";
import type { WeatherData, HourlyWeather, DailyWeather } from "@/lib/weather-types";
import { getMockWeatherData } from "@/lib/weather-mock";

const TERESOPOLIS_COORDS = { lat: -22.4122, lon: -42.9657 };

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

  if (!apiKey) {
    // Sem chave configurada: usa o mesmo dataset mockado do front-end,
    // já no formato correto (WeatherData completo).
    return NextResponse.json(getMockWeatherData("normal"));
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
    const dados = normalizarRespostaOpenWeather(bruto);

    return NextResponse.json(dados);
  } catch (error) {
    console.error("[/api/weather] Falha ao consultar OpenWeather:", error);
    // Fallback gracioso: nunca deixa a página de Clima quebrar.
    return NextResponse.json(getMockWeatherData("normal"));
  }
}
