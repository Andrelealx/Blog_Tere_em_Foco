import { NextResponse } from "next/server";

const TERESOPOLIS_COORDS = {
  lat: -22.4167,
  lon: -42.975,
};

export async function GET() {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      city: "Teresópolis",
      temp: 18,
      feelsLike: 17,
      description: "nublado com aberturas de sol",
      updatedAt: new Date().toISOString(),
      source: "fallback",
    });
  }

  try {
    const url = new URL("https://api.openweathermap.org/data/2.5/weather");
    url.searchParams.set("lat", `${TERESOPOLIS_COORDS.lat}`);
    url.searchParams.set("lon", `${TERESOPOLIS_COORDS.lon}`);
    url.searchParams.set("appid", apiKey);
    url.searchParams.set("lang", "pt_br");
    url.searchParams.set("units", "metric");

    const response = await fetch(url.toString(), {
      next: { revalidate: 600 },
    });
    if (!response.ok) {
      throw new Error("Falha no OpenWeather");
    }

    const data = (await response.json()) as {
      name: string;
      main: { temp: number; feels_like: number };
      weather: Array<{ description: string }>;
      dt: number;
    };

    return NextResponse.json({
      city: data.name,
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      description: data.weather[0]?.description ?? "tempo estável",
      updatedAt: new Date(data.dt * 1000).toISOString(),
      source: "openweather",
    });
  } catch {
    return NextResponse.json({
      city: "Teresópolis",
      temp: 19,
      feelsLike: 18,
      description: "frio leve e céu parcialmente aberto",
      updatedAt: new Date().toISOString(),
      source: "fallback",
    });
  }
}
