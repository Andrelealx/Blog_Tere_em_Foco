/**
 * @file app/api/clima/route.ts
 * @description Endpoint `/api/clima` com cache básico em memória (TTL de 10 min).
 *
 * Retorna o clima de Teresópolis no envelope padrão `{ ok: true, data }`.
 */

import { getWeatherData } from "@/lib/weather-service";
import { ok } from "@/backforge/http";
import type { WeatherData } from "@/lib/weather-types";

/** Tempo de vida do cache em memória (10 minutos). */
const CACHE_TTL_MS = 10 * 60 * 1000;

let cache: { data: WeatherData; expiresAt: number } | null = null;

export async function GET() {
  const now = Date.now();

  if (cache && cache.expiresAt > now) {
    return ok(cache.data);
  }

  const data = await getWeatherData();
  cache = { data, expiresAt: now + CACHE_TTL_MS };

  return ok(data);
}
