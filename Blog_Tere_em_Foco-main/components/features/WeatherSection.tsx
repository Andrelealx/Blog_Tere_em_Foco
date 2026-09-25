/**
 * @file components/features/WeatherSection.tsx
 * @description Seção completa de clima de Teresópolis — Blog Terê em Foco.
 *
 * ─── Estrutura visual ────────────────────────────────────────────────────────
 *  ┌───────────────────────────────────────────────────────┐
 *  │ Cabeçalho: "Clima em Teresópolis" + botão Atualizar   │
 *  ├───────────────────────────────────────────────────────┤
 *  │ [WeatherAlertBanner] — renderizado se riskLevel > NONE│
 *  ├──────────────────────┬────────────────────────────────┤
 *  │ Card Clima Atual     │ Grade de Detalhes              │
 *  │ (temp, condição,     │ (umidade, vento, UV, pressão,  │
 *  │  emoji, min/max)     │  visibilidade, nascer/pôr sol) │
 *  ├──────────────────────┴────────────────────────────────┤
 *  │ Previsão por Hora — carrossel horizontal (próx. 12h)  │
 *  ├───────────────────────────────────────────────────────┤
 *  │ Previsão 7 Dias — com barras de temperatura relativas │
 *  ├───────────────────────────────────────────────────────┤
 *  │ Rodapé: atribuição OpenWeather                        │
 *  └───────────────────────────────────────────────────────┘
 *
 * ─── Design System ──────────────────────────────────────────────────────────
 * Segue os tokens do projeto (tailwind-tokens.ts):
 *   - Cores:   terra, nevoa, bruma, cume, accent, ceu
 *   - Sombras: shadow-card, shadow-soft
 *   - Gradientes: bg-mountain-glow (light), bg-night-fog (dark)
 *   - Fontes:  font-display (títulos), font-body (texto)
 *   - Animações: fadeUp (keyframe já definido no tailwind.config.ts)
 *
 * ─── Como usar ──────────────────────────────────────────────────────────────
 * // Em qualquer página do App Router:
 * import { WeatherSection } from "@/components/features/WeatherSection"
 *
 * export default function Page() {
 *   return <main><WeatherSection /></main>
 * }
 *
 * // Para testar o banner de emergência em desenvolvimento:
 * <WeatherSection debugScenario="storm" />
 *
 * ─── Performance ────────────────────────────────────────────────────────────
 *  - Skeleton loading previne CLS (Cumulative Layout Shift)
 *  - "use client" necessário por Framer Motion + hooks de estado
 *  - Dados refrescados a cada 10 min pelo useWeather (sem polling agressivo)
 *
 * @author  Terê em Foco Dev Team
 * @version 1.0.0
 */

"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sun,
  Sunrise,
  Sunset,
  RefreshCw,
  MapPin,
  CloudOff,
  Umbrella,
  Thermometer,
} from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { WeatherAlertBanner } from "@/components/features/WeatherAlertBanner";
import { RiskLevel } from "@/lib/weather-types";
import type { HourlyWeather, DailyWeather } from "@/lib/weather-types";

// ─────────────────────────────────────────────────────────────────────────────
// Utilitários de formatação
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formata um timestamp Unix para HH:MM no fuso de Teresópolis (America/Sao_Paulo).
 */
function formatTime(dt: number): string {
  return new Date(dt * 1000).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

/**
 * Retorna o nome do dia da semana abreviado (pt-BR) ou "Hoje" para o dia atual.
 * Ex.: 1704067200 → "Seg" | "Hoje"
 */
function formatDayName(dt: number): string {
  const date  = new Date(dt * 1000);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Hoje";
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    timeZone: "America/Sao_Paulo",
  });
}

/**
 * Converte o ID de condição OpenWeather em emoji representativo.
 * Serve como fallback visual quando o ícone externo não está disponível.
 * @see https://openweathermap.org/weather-conditions
 */
function getWeatherEmoji(id: number): string {
  if (id >= 200 && id < 300) return "⛈️"; // Trovoada
  if (id >= 300 && id < 400) return "🌦️"; // Garoa
  if (id >= 500 && id < 510) return "🌧️"; // Chuva
  if (id === 511)             return "🌨️"; // Chuva congelante
  if (id >= 520 && id < 600) return "🌧️"; // Chuva de banho
  if (id >= 600 && id < 700) return "❄️"; // Neve
  if (id >= 700 && id < 800) return "🌫️"; // Névoa/fumaça
  if (id === 800)             return "☀️"; // Limpo
  if (id === 801)             return "🌤️"; // Poucas nuvens
  if (id === 802)             return "⛅"; // Nublado parcial
  if (id >= 803)              return "☁️"; // Nublado
  return "🌡️";
}

/**
 * Traduz as descrições em inglês da OpenWeather API para PT-BR.
 * Cobre os casos mais comuns da serra fluminense.
 */
function translateCondition(desc: string): string {
  const map: Record<string, string> = {
    "clear sky":               "Céu limpo",
    "few clouds":              "Poucas nuvens",
    "scattered clouds":        "Nuvens esparsas",
    "broken clouds":           "Parcialmente nublado",
    "overcast clouds":         "Nublado",
    "light rain":              "Chuva fraca",
    "moderate rain":           "Chuva moderada",
    "heavy intensity rain":    "Chuva intensa",
    "very heavy rain":         "Chuva muito intensa",
    "extreme rain":            "Chuva extrema",
    "thunderstorm":            "Trovoada",
    "thunderstorm with rain":  "Trovoada com chuva",
    "heavy thunderstorm":      "Trovoada forte",
    "light intensity drizzle": "Garoa leve",
    "drizzle":                 "Garoa",
    "mist":                    "Névoa",
    "fog":                     "Nevoeiro",
    "haze":                    "Neblina",
  };
  return map[desc.toLowerCase()] ?? desc;
}

/**
 * Retorna a classe Tailwind de cor para o índice UV.
 * Usa cores semânticas padrão (não tokens do projeto) para preservar significado.
 */
function uviColor(uvi: number): string {
  if (uvi <= 2)  return "text-green-600 dark:text-green-400";
  if (uvi <= 5)  return "text-yellow-600 dark:text-yellow-400";
  if (uvi <= 7)  return "text-accent dark:text-orange-300";
  if (uvi <= 10) return "text-red-600 dark:text-red-400";
  return "text-purple-600 dark:text-purple-400"; // Extremo (>10)
}

/**
 * Rótulo textual para o índice UV.
 */
function uviLabel(uvi: number): string {
  if (uvi <= 2)  return "Baixo";
  if (uvi <= 5)  return "Moderado";
  if (uvi <= 7)  return "Alto";
  if (uvi <= 10) return "Muito Alto";
  return "Extremo";
}

// ─────────────────────────────────────────────────────────────────────────────
// Variantes Framer Motion
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Container pai com entrada escalonada.
 * Cada filho aparece 80ms após o anterior (stagger).
 */
const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/**
 * Animação de entrada dos cards — sobem suavemente do fundo.
 * Usa a curva ease personalizada do projeto (derivada do fadeUp do tailwind.config.ts).
 */
const cardVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } },
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componentes internos
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Skeleton de carregamento.
 * Mantém as dimensões da seção para prevenir CLS enquanto os dados chegam.
 */
function WeatherSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando dados do clima de Teresópolis…"
      className="animate-pulse space-y-4"
    >
      {/* Banner placeholder */}
      <div className="h-14 bg-bruma/60 dark:bg-ceu/40 rounded-xl" />
      {/* Card principal + grade de detalhes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-52 bg-bruma/60 dark:bg-ceu/40 rounded-2xl" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-11 bg-bruma/60 dark:bg-ceu/40 rounded-xl" />
          ))}
        </div>
      </div>
      {/* Previsão horária */}
      <div className="flex gap-2.5 overflow-hidden">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[72px] h-24 bg-bruma/60 dark:bg-ceu/40 rounded-xl" />
        ))}
      </div>
      {/* Previsão 7 dias */}
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-11 bg-bruma/60 dark:bg-ceu/40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ─── DetailItem ───────────────────────────────────────────────────────────────

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}

/**
 * Card de um único indicador meteorológico (umidade, vento, pressão, etc.).
 * Usa fundo cume/ceu para integrar ao design system do projeto.
 */
function DetailItem({ icon, label, value, valueClass = "" }: DetailItemProps) {
  return (
    <div className="
      flex items-center gap-3 p-3 rounded-xl
      bg-cume/70 dark:bg-ceu/30
      border border-bruma/60 dark:border-white/8
    ">
      <div className="flex-shrink-0 text-nevoa dark:text-nevoa/80">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-terra/50 dark:text-bruma/50 leading-none">{label}</p>
        <p className={`mt-0.5 text-sm font-semibold text-terra dark:text-cume ${valueClass}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── HourlyCard ───────────────────────────────────────────────────────────────

interface HourlyCardProps {
  hour: HourlyWeather;
  isNow?: boolean;
}

/**
 * Card de uma hora na previsão horária.
 * Quando `isNow=true`, usa a cor primária `nevoa` do projeto para destacar.
 */
function HourlyCard({ hour, isNow = false }: HourlyCardProps) {
  const emoji = getWeatherEmoji(hour.weather[0]?.id ?? 800);

  return (
    <motion.div
      variants={cardVariants}
      className={`
        flex-shrink-0 flex flex-col items-center gap-1.5 px-3 py-3 w-[72px] rounded-xl border
        transition-colors duration-200
        ${isNow
          ? "bg-nevoa text-white border-nevoa shadow-soft"
          : "bg-cume/80 dark:bg-ceu/30 border-bruma/60 dark:border-white/8 text-terra dark:text-cume"
        }
      `}
    >
      <span className={`text-xs font-medium ${isNow ? "text-white/80" : "text-terra/50 dark:text-bruma/50"}`}>
        {isNow ? "Agora" : formatTime(hour.dt)}
      </span>
      <span className="text-xl leading-none" role="img" aria-label={hour.weather[0]?.description}>
        {emoji}
      </span>
      <span className={`text-sm font-bold ${isNow ? "text-white" : ""}`}>
        {Math.round(hour.temp)}°
      </span>
      {hour.pop > 0.1 && (
        <span className={`text-xs flex items-center gap-0.5 ${isNow ? "text-white/70" : "text-accent dark:text-orange-300"}`}>
          <Umbrella className="w-2.5 h-2.5" aria-hidden="true" />
          {Math.round(hour.pop * 100)}%
        </span>
      )}
    </motion.div>
  );
}

// ─── DailyRow ─────────────────────────────────────────────────────────────────

interface DailyRowProps {
  day: DailyWeather;
  isToday?: boolean;
  maxTempAll: number;
  minTempAll: number;
}

/**
 * Linha de previsão diária com barra de temperatura relativa.
 * A barra mostra graficamente onde a temperatura desse dia cai no range semanal.
 */
function DailyRow({ day, isToday = false, maxTempAll, minTempAll }: DailyRowProps) {
  const emoji = getWeatherEmoji(day.weather[0]?.id ?? 800);
  const range  = maxTempAll - minTempAll || 1;

  // Posição e largura da barra relativa ao range de toda a semana
  const barLeft  = ((day.temp.min - minTempAll) / range) * 100;
  const barWidth = ((day.temp.max - day.temp.min) / range) * 100;

  return (
    <motion.div
      variants={cardVariants}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
        ${isToday
          ? "bg-nevoa/10 dark:bg-nevoa/15 border border-nevoa/30"
          : "hover:bg-cume/60 dark:hover:bg-ceu/20"
        }
      `}
    >
      {/* Nome do dia */}
      <span className={`w-10 text-sm font-medium flex-shrink-0 ${
        isToday ? "text-nevoa dark:text-nevoa/80" : "text-terra/70 dark:text-bruma/70"
      }`}>
        {formatDayName(day.dt)}
      </span>

      {/* Emoji da condição */}
      <span className="text-lg leading-none w-7 text-center flex-shrink-0"
        role="img" aria-label={day.weather[0]?.description}>
        {emoji}
      </span>

      {/* Probabilidade de chuva */}
      <div className="w-10 flex-shrink-0">
        {day.pop > 0.1 && (
          <span className="text-xs text-accent dark:text-orange-300 flex items-center gap-0.5">
            <Droplets className="w-2.5 h-2.5" aria-hidden="true" />
            {Math.round(day.pop * 100)}%
          </span>
        )}
      </div>

      {/* Temperatura mínima */}
      <span className="text-sm text-terra/40 dark:text-bruma/40 w-8 text-right flex-shrink-0">
        {Math.round(day.temp.min)}°
      </span>

      {/* Barra de temperatura relativa */}
      <div className="flex-1 relative h-1.5 bg-bruma/60 dark:bg-ceu/40 rounded-full overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-nevoa/60 to-accent"
          style={{ left: `${barLeft}%`, width: `${Math.max(barWidth, 8)}%` }}
        />
      </div>

      {/* Temperatura máxima */}
      <span className={`text-sm font-bold w-8 flex-shrink-0 ${
        isToday ? "text-nevoa dark:text-nevoa/80" : "text-terra dark:text-cume"
      }`}>
        {Math.round(day.temp.max)}°
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal: WeatherSection
// ─────────────────────────────────────────────────────────────────────────────

interface WeatherSectionProps {
  /**
   * Força um cenário de mock para desenvolvimento e testes.
   *
   * - "storm" → ativa banner CRITICAL (vermelho, fixo)
   * - "normal" → cenário padrão com chuva leve
   * - undefined → usa NEXT_PUBLIC_USE_WEATHER_MOCK e NEXT_PUBLIC_WEATHER_MOCK_SCENARIO
   *
   * @example
   * // Ver o banner de emergência sem precisar de chuva real:
   * <WeatherSection debugScenario="storm" />
   */
  debugScenario?: "normal" | "storm";
}

/**
 * Seção completa de clima de Teresópolis.
 *
 * Componente de nível de página — contém toda a feature de clima,
 * do banner de alerta à previsão de 7 dias.
 *
 * @example
 * // Uso padrão em app/page.tsx ou qualquer layout:
 * import { WeatherSection } from "@/components/features/WeatherSection"
 * <WeatherSection />
 */
export function WeatherSection({ debugScenario }: WeatherSectionProps) {
  // Ref para scroll horizontal da previsão horária
  const hourlyRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error, riskLevel, riskAlert, refetch } = useWeather({
    forceMock: debugScenario,
    refreshInterval: 600_000, // 10 minutos
  });

  // ── Estado: carregando ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section aria-label="Clima em Teresópolis" aria-busy="true" className="w-full space-y-4">
        <WeatherSkeleton />
      </section>
    );
  }

  // ── Estado: sem dados (erro sem fallback — muito raro) ───────────────────
  if (!data) {
    return (
      <section aria-label="Clima em Teresópolis" className="w-full">
        <div className="
          flex flex-col items-center gap-4 py-14 px-6 text-center rounded-2xl
          bg-cume/60 dark:bg-ceu/30 border border-bruma/60 dark:border-white/10
        ">
          <CloudOff className="w-12 h-12 text-nevoa/50" aria-hidden="true" />
          <div>
            <p className="font-display font-bold text-terra dark:text-cume">
              Dados do clima indisponíveis
            </p>
            <p className="text-sm text-terra/60 dark:text-bruma/60 mt-1">
              {error ?? "Não foi possível carregar o clima de Teresópolis."}
            </p>
          </div>
          <button
            onClick={refetch}
            className="
              flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-nevoa text-white text-sm font-semibold
              hover:bg-nevoa/90 transition-colors shadow-soft
              focus:outline-none focus:ring-2 focus:ring-nevoa focus:ring-offset-2
            "
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Tentar novamente
          </button>
        </div>
      </section>
    );
  }

  // ── Dados processados ────────────────────────────────────────────────────
  const { current, hourly, daily } = data;
  const conditionId   = current.weather[0]?.id ?? 800;
  const conditionDesc = translateCondition(current.weather[0]?.description ?? "");

  // Range de temperatura para as barras relativas da previsão 7 dias
  const maxTempAll = Math.max(...daily.map((d) => d.temp.max));
  const minTempAll = Math.min(...daily.map((d) => d.temp.min));

  // Nascer/pôr do sol do dia de hoje
  const sunrise = daily[0]?.sunrise;
  const sunset  = daily[0]?.sunset;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Clima em Teresópolis"
      className="w-full space-y-4"
    >
      {/* ── Cabeçalho ───────────────────────────────────────────────────── */}
      <motion.div variants={cardVariants} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-nevoa" aria-hidden="true" />
          <h2 className="font-display font-bold text-lg text-terra dark:text-cume">
            Clima em Teresópolis
          </h2>
        </div>

        {/* Botão de atualização manual */}
        <button
          onClick={refetch}
          aria-label="Atualizar dados do clima"
          className="
            flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs
            text-terra/50 dark:text-bruma/50
            hover:text-nevoa dark:hover:text-nevoa
            hover:bg-nevoa/10 transition-colors
            focus:outline-none focus:ring-2 focus:ring-nevoa rounded-lg
          "
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          Atualizar
        </button>
      </motion.div>

      {/* ── Banner de alerta (renderizado apenas quando há risco > NONE) ── */}
      {riskAlert && riskLevel !== RiskLevel.NONE && (
        <motion.div variants={cardVariants}>
          <WeatherAlertBanner
            alert={riskAlert}
            // CRITICAL: fica fixo no topo da página para máxima visibilidade
            className={riskLevel === RiskLevel.CRITICAL ? "sticky top-0 z-40" : ""}
          />
        </motion.div>
      )}

      {/* ── Grid: Clima Atual + Grade de Detalhes ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/*
         * Card de clima atual.
         * Usa o gradiente mountain-glow em modo claro e night-fog no escuro
         * para aproveitar a atmosfera visual do projeto.
         */}
        <motion.div
          variants={cardVariants}
          className="
            relative overflow-hidden rounded-2xl p-6 shadow-card
            bg-mountain-glow dark:bg-night-fog
          "
        >
          {/* Círculos decorativos — textura de profundidade */}
          <div aria-hidden="true" className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-nevoa/15" />
          <div aria-hidden="true" className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-accent/10" />

          <div className="relative z-10">
            {/* Emoji da condição atual */}
            <div className="text-6xl mb-2" role="img" aria-label={conditionDesc}>
              {getWeatherEmoji(conditionId)}
            </div>

            {/* Temperatura principal */}
            <div className="flex items-start gap-1">
              <span className="text-6xl font-display font-black text-terra dark:text-cume leading-none">
                {Math.round(current.temp)}
              </span>
              <span className="text-2xl font-light text-terra/60 dark:text-cume/60 mt-2">°C</span>
            </div>

            {/* Descrição da condição */}
            <p className="mt-1 text-terra/70 dark:text-bruma font-medium capitalize font-body">
              {conditionDesc}
            </p>

            {/* Sensação térmica */}
            <p className="text-sm text-terra/50 dark:text-bruma/60 mt-0.5">
              Sensação: {Math.round(current.feels_like)}°C
            </p>

            {/* Máxima e mínima do dia */}
            {daily[0] && (
              <p className="text-sm text-terra/50 dark:text-bruma/60 mt-1">
                ↑ {Math.round(daily[0].temp.max)}°&nbsp;&nbsp;↓ {Math.round(daily[0].temp.min)}°
              </p>
            )}
          </div>
        </motion.div>

        {/* Grade de indicadores detalhados */}
        <motion.div variants={cardVariants} className="grid grid-cols-2 gap-2.5 content-start">
          <DetailItem
            icon={<Droplets className="w-4 h-4" aria-hidden="true" />}
            label="Umidade"
            value={`${current.humidity}%`}
          />
          <DetailItem
            icon={<Wind className="w-4 h-4" aria-hidden="true" />}
            label="Vento"
            value={`${Math.round(current.wind_speed)} km/h`}
          />
          <DetailItem
            icon={<Gauge className="w-4 h-4" aria-hidden="true" />}
            label="Pressão"
            value={`${current.pressure} hPa`}
          />
          <DetailItem
            icon={<Eye className="w-4 h-4" aria-hidden="true" />}
            label="Visibilidade"
            value={`${(current.visibility / 1_000).toFixed(1)} km`}
          />
          <DetailItem
            icon={<Sun className="w-4 h-4" aria-hidden="true" />}
            label="Índice UV"
            value={`${current.uvi.toFixed(1)} — ${uviLabel(current.uvi)}`}
            valueClass={uviColor(current.uvi)}
          />
          <DetailItem
            icon={<Thermometer className="w-4 h-4" aria-hidden="true" />}
            label="Chuva agora"
            value={current.rain?.["1h"] ? `${current.rain["1h"].toFixed(1)} mm/h` : "Nenhuma"}
          />

          {/* Nascer e pôr do sol — ocupa a linha completa */}
          {sunrise && sunset && (
            <div className="col-span-2 grid grid-cols-2 gap-2.5">
              <DetailItem
                icon={<Sunrise className="w-4 h-4" aria-hidden="true" />}
                label="Nascer do sol"
                value={formatTime(sunrise)}
              />
              <DetailItem
                icon={<Sunset className="w-4 h-4" aria-hidden="true" />}
                label="Pôr do sol"
                value={formatTime(sunset)}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Previsão por hora ──────────────────────────────────────────────── */}
      <motion.div variants={cardVariants}>
        <h3 className="
          text-xs font-semibold uppercase tracking-widest mb-3
          text-terra/50 dark:text-bruma/50
        ">
          Próximas horas
        </h3>

        {/*
         * Container com scroll horizontal suave.
         * A classe `scrollbar-thin` requer o plugin tailwind-scrollbar
         * (já incluso no projeto ou substituível por overflow-x-auto puro).
         */}
        <div
          ref={hourlyRef}
          role="list"
          aria-label="Previsão hora a hora"
          className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: "thin" }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-2.5"
          >
            {/* Exibe as próximas 12 horas */}
            {hourly.slice(0, 12).map((hour, i) => (
              <div key={hour.dt} role="listitem">
                <HourlyCard hour={hour} isNow={i === 0} />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Previsão 7 dias ───────────────────────────────────────────────── */}
      <motion.div
        variants={cardVariants}
        className="
          rounded-2xl border border-bruma/60 dark:border-white/8
          bg-cume/50 dark:bg-ceu/20 backdrop-blur-sm p-4
        "
      >
        <h3 className="
          text-xs font-semibold uppercase tracking-widest mb-3
          text-terra/50 dark:text-bruma/50
        ">
          Próximos 7 dias
        </h3>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          role="list"
          aria-label="Previsão para os próximos 7 dias"
          className="space-y-1"
        >
          {daily.map((day, i) => (
            <div key={day.dt} role="listitem">
              <DailyRow
                day={day}
                isToday={i === 0}
                maxTempAll={maxTempAll}
                minTempAll={minTempAll}
              />
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Atribuição de dados ────────────────────────────────────────────── */}
      <motion.p
        variants={cardVariants}
        className="text-xs text-center text-terra/30 dark:text-bruma/30"
      >
        Dados meteorológicos via OpenWeather API · Atualizado a cada 10 min · Teresópolis — RJ
      </motion.p>
    </motion.section>
  );
}
