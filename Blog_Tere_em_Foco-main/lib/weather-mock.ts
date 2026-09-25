/**
 * @file lib/weather-mock.ts
 * @description Dados mockados de clima para Teresópolis, RJ.
 *
 * ─── Por que existem dois cenários? ────────────────────────────────────────
 * Durante o desenvolvimento, é inviável aguardar condições reais de tempestade
 * para testar o banner de alerta. Por isso criamos dois datasets completos:
 *
 *   MOCK_WEATHER_NORMAL  — Dia de verão com chuva leve: cenário padrão.
 *   MOCK_WEATHER_STORM   — Tempestade severa com alerta CRITICAL da Defesa Civil.
 *
 * ─── Compatibilidade com a API real ────────────────────────────────────────
 * Os dados espelham EXATAMENTE o formato da OpenWeather One Call API 3.0.
 * Para integrar a API real, basta criar a rota `/api/weather` que retorna
 * o mesmo JSON — os componentes não precisam de nenhuma alteração.
 *
 * ─── Como ativar cada cenário ───────────────────────────────────────────────
 *   Variável de ambiente:
 *     NEXT_PUBLIC_WEATHER_MOCK_SCENARIO=storm   → ativa tempestade
 *     NEXT_PUBLIC_WEATHER_MOCK_SCENARIO=normal  → ativa padrão (default)
 *
 *   Ou diretamente no componente (apenas para debug):
 *     <WeatherSection debugScenario="storm" />
 *
 * Coordenadas de Teresópolis: lat -22.4122, lon -42.9657
 *
 * @author  Terê em Foco Dev Team
 * @version 1.0.0
 */

import type { WeatherData } from "./weather-types";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de timestamp
// ─────────────────────────────────────────────────────────────────────────────

/** Retorna timestamp Unix (segundos) para N horas a partir de agora */
const hoursFromNow = (h: number): number =>
  Math.floor(Date.now() / 1000) + h * 3_600;

/** Retorna timestamp Unix (segundos) para a meia-noite de N dias a partir de hoje */
const daysFromNow = (d: number): number => {
  const date = new Date();
  date.setDate(date.getDate() + d);
  date.setHours(0, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
};

// ─────────────────────────────────────────────────────────────────────────────
// CENÁRIO A — Tarde de verão com chuva leve (padrão)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dia típico de Teresópolis na estação chuvosa:
 * temperatura amena, umidade alta, chuva passageira à tarde.
 * Não aciona nenhum banner de alerta (RiskLevel.LOW no máximo).
 */
export const MOCK_WEATHER_NORMAL: WeatherData = {
  lat: -22.4122,
  lon: -42.9657,
  timezone: "America/Sao_Paulo",
  timezone_offset: -10800, // UTC-3

  // ── Condição atual ────────────────────────────────────────────────────────
  current: {
    dt: hoursFromNow(0),
    temp: 22,
    feels_like: 24,
    humidity: 78,
    wind_speed: 12,
    wind_deg: 135,
    pop: 0.4,
    rain: { "1h": 0.8 }, // 0.8mm/h → chuva leve, RiskLevel.LOW
    uvi: 5.2,
    visibility: 9_000,
    pressure: 1_013,
    weather: [
      { id: 500, main: "Rain", description: "light rain", icon: "10d" },
    ],
  },

  // ── Previsão horária (próximas 12 horas) ──────────────────────────────────
  hourly: [
    {
      dt: hoursFromNow(0), temp: 22, feels_like: 24, humidity: 78,
      wind_speed: 12, wind_deg: 135, pop: 0.40, rain: { "1h": 0.8 },
      uvi: 5.2, visibility: 9_000, pressure: 1_013,
      weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10d" }],
    },
    {
      dt: hoursFromNow(1), temp: 21, feels_like: 23, humidity: 82,
      wind_speed: 14, wind_deg: 140, pop: 0.60, rain: { "1h": 1.2 },
      uvi: 4.0, visibility: 8_500, pressure: 1_012,
      weather: [{ id: 501, main: "Rain", description: "moderate rain", icon: "10d" }],
    },
    {
      dt: hoursFromNow(2), temp: 20, feels_like: 21, humidity: 88,
      wind_speed: 16, wind_deg: 150, pop: 0.75, rain: { "1h": 2.1 },
      uvi: 2.5, visibility: 7_000, pressure: 1_011,
      weather: [{ id: 501, main: "Rain", description: "moderate rain", icon: "10d" }],
    },
    {
      dt: hoursFromNow(3), temp: 19, feels_like: 20, humidity: 90,
      wind_speed: 15, wind_deg: 155, pop: 0.50, rain: { "1h": 1.5 },
      uvi: 1.0, visibility: 7_500, pressure: 1_012,
      weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10n" }],
    },
    {
      dt: hoursFromNow(4), temp: 19, feels_like: 20, humidity: 85,
      wind_speed: 10, wind_deg: 160, pop: 0.30,
      uvi: 0.5, visibility: 8_000, pressure: 1_013,
      weather: [{ id: 803, main: "Clouds", description: "broken clouds", icon: "04n" }],
    },
    {
      dt: hoursFromNow(5), temp: 18, feels_like: 19, humidity: 83,
      wind_speed: 9, wind_deg: 165, pop: 0.20,
      uvi: 0, visibility: 9_000, pressure: 1_014,
      weather: [{ id: 803, main: "Clouds", description: "broken clouds", icon: "04n" }],
    },
    {
      dt: hoursFromNow(6), temp: 18, feels_like: 18, humidity: 80,
      wind_speed: 8, wind_deg: 170, pop: 0.15,
      uvi: 0, visibility: 9_500, pressure: 1_015,
      weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02n" }],
    },
    {
      dt: hoursFromNow(7), temp: 17, feels_like: 17, humidity: 78,
      wind_speed: 7, wind_deg: 175, pop: 0.10,
      uvi: 0, visibility: 10_000, pressure: 1_015,
      weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01n" }],
    },
    {
      dt: hoursFromNow(8), temp: 17, feels_like: 17, humidity: 76,
      wind_speed: 7, wind_deg: 180, pop: 0.05,
      uvi: 0, visibility: 10_000, pressure: 1_016,
      weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01n" }],
    },
    {
      dt: hoursFromNow(9), temp: 18, feels_like: 18, humidity: 74,
      wind_speed: 8, wind_deg: 185, pop: 0.05,
      uvi: 1.5, visibility: 10_000, pressure: 1_016,
      weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
    },
    {
      dt: hoursFromNow(10), temp: 20, feels_like: 21, humidity: 72,
      wind_speed: 10, wind_deg: 190, pop: 0.10,
      uvi: 3.0, visibility: 10_000, pressure: 1_016,
      weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
    },
    {
      dt: hoursFromNow(11), temp: 22, feels_like: 23, humidity: 70,
      wind_speed: 11, wind_deg: 195, pop: 0.15,
      uvi: 5.0, visibility: 10_000, pressure: 1_015,
      weather: [{ id: 802, main: "Clouds", description: "scattered clouds", icon: "03d" }],
    },
  ],

  // ── Previsão diária (7 dias) ──────────────────────────────────────────────
  daily: [
    {
      dt: daysFromNow(0),
      temp: { min: 17, max: 27, day: 24, night: 18, eve: 21, morn: 19 },
      feels_like: { day: 26, night: 18, eve: 22, morn: 19 },
      humidity: 78, wind_speed: 12, wind_deg: 150, pop: 0.60, rain: 8.4, uvi: 6.2,
      sunrise: hoursFromNow(-5), sunset: hoursFromNow(7),
      weather: [{ id: 501, main: "Rain", description: "moderate rain", icon: "10d" }],
    },
    {
      dt: daysFromNow(1),
      temp: { min: 16, max: 28, day: 25, night: 17, eve: 22, morn: 18 },
      feels_like: { day: 27, night: 17, eve: 23, morn: 18 },
      humidity: 72, wind_speed: 10, wind_deg: 180, pop: 0.30, uvi: 7.0,
      sunrise: hoursFromNow(19), sunset: hoursFromNow(31),
      weather: [{ id: 802, main: "Clouds", description: "scattered clouds", icon: "03d" }],
    },
    {
      dt: daysFromNow(2),
      temp: { min: 15, max: 29, day: 27, night: 16, eve: 23, morn: 17 },
      feels_like: { day: 29, night: 16, eve: 24, morn: 17 },
      humidity: 65, wind_speed: 9, wind_deg: 200, pop: 0.10, uvi: 8.5,
      sunrise: hoursFromNow(43), sunset: hoursFromNow(55),
      weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
    },
    {
      dt: daysFromNow(3),
      temp: { min: 17, max: 26, day: 23, night: 18, eve: 20, morn: 18 },
      feels_like: { day: 25, night: 18, eve: 21, morn: 18 },
      humidity: 80, wind_speed: 14, wind_deg: 130, pop: 0.70, rain: 12.5, uvi: 5.0,
      sunrise: hoursFromNow(67), sunset: hoursFromNow(79),
      weather: [{ id: 502, main: "Rain", description: "heavy intensity rain", icon: "10d" }],
    },
    {
      dt: daysFromNow(4),
      temp: { min: 18, max: 24, day: 21, night: 19, eve: 20, morn: 19 },
      feels_like: { day: 23, night: 19, eve: 21, morn: 19 },
      humidity: 88, wind_speed: 18, wind_deg: 120, pop: 0.85, rain: 28.0, uvi: 3.0,
      sunrise: hoursFromNow(91), sunset: hoursFromNow(103),
      weather: [{ id: 211, main: "Thunderstorm", description: "thunderstorm", icon: "11d" }],
    },
    {
      dt: daysFromNow(5),
      temp: { min: 16, max: 25, day: 23, night: 17, eve: 21, morn: 17 },
      feels_like: { day: 25, night: 17, eve: 22, morn: 17 },
      humidity: 75, wind_speed: 11, wind_deg: 160, pop: 0.40, rain: 5.0, uvi: 6.0,
      sunrise: hoursFromNow(115), sunset: hoursFromNow(127),
      weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10d" }],
    },
    {
      dt: daysFromNow(6),
      temp: { min: 15, max: 28, day: 26, night: 16, eve: 22, morn: 17 },
      feels_like: { day: 28, night: 16, eve: 23, morn: 17 },
      humidity: 68, wind_speed: 8, wind_deg: 200, pop: 0.15, uvi: 8.0,
      sunrise: hoursFromNow(139), sunset: hoursFromNow(151),
      weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// CENÁRIO B — Tempestade severa com alerta da Defesa Civil (debug)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cenário de emergência: tempestade com 68mm/h de chuva.
 *
 * Aciona o banner de alerta no nível CRITICAL (vermelho, fixo, não colapsável).
 * Use apenas para desenvolvimento/testes do componente WeatherAlertBanner.
 *
 * Para ativar: NEXT_PUBLIC_WEATHER_MOCK_SCENARIO=storm
 * Ou no componente: <WeatherSection debugScenario="storm" />
 */
export const MOCK_WEATHER_STORM: WeatherData = {
  ...MOCK_WEATHER_NORMAL,

  // Substitui apenas os dados atuais — previsão diária permanece a mesma
  current: {
    dt: hoursFromNow(0),
    temp: 18,
    feels_like: 15,
    humidity: 97,
    wind_speed: 54,      // 54 km/h → acima do limiar HIGH (40 km/h)
    wind_deg: 115,
    pop: 1.0,
    rain: { "1h": 68 }, // 68mm/h → MUITO acima do limiar CRITICAL (50mm/h)
    uvi: 0,
    visibility: 1_500,   // Visibilidade crítica: 1,5km
    pressure: 995,       // Pressão baixa: sistema de baixa pressão ativo
    weather: [
      { id: 212, main: "Thunderstorm", description: "heavy thunderstorm", icon: "11d" },
    ],
  },

  // Alerta oficial simulado da Defesa Civil de Teresópolis
  alerts: [
    {
      sender_name: "Defesa Civil de Teresópolis",
      event: "Risco de Deslizamento — Nível Vermelho",
      start: hoursFromNow(-1),
      end: hoursFromNow(6),
      description:
        "Chuvas extremamente intensas (68mm/h) com risco IMINENTE de deslizamentos e " +
        "alagamentos nas áreas serranas. Evite trânsito nas vias da Serra. " +
        "Procure abrigo em local seguro e mantenha-se afastado de encostas.",
      tags: ["Chuva Extrema", "Deslizamento", "Inundação", "Vento Forte"],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Seletor de mock
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retorna o dataset mock apropriado para o cenário solicitado.
 *
 * Ordem de prioridade:
 *  1. Parâmetro `scenario` passado diretamente
 *  2. Variável de ambiente NEXT_PUBLIC_WEATHER_MOCK_SCENARIO
 *  3. Padrão: "normal"
 *
 * @param scenario - "normal" (chuva leve) | "storm" (tempestade severa)
 *
 * @example
 * // No hook useWeather:
 * const data = getMockWeatherData()
 *
 * // Para forçar tempestade em desenvolvimento:
 * const data = getMockWeatherData("storm")
 */
export function getMockWeatherData(
  scenario?: "normal" | "storm"
): WeatherData {
  const active =
    scenario ??
    (process.env.NEXT_PUBLIC_WEATHER_MOCK_SCENARIO as "normal" | "storm" | undefined) ??
    "normal";

  return active === "storm" ? MOCK_WEATHER_STORM : MOCK_WEATHER_NORMAL;
}
