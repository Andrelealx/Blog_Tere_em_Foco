/**
 * @file app/api/weather/route.ts
 * @description Endpoint `GET /api/weather` — delega ao service de clima.
 * Retorna o envelope padrão `{ ok: true, data }` (fallback para mock quando
 * a chave não está configurada ou a API falha).
 */

import { getWeatherData } from "@/lib/weather-service";
import { ok } from "@/backforge/http";

export async function GET() {
  return ok(await getWeatherData());
}
