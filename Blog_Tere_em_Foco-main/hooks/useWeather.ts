/**
 * @file hooks/useWeather.ts
 * @description Hook React para buscar e processar dados meteorológicos de Teresópolis.
 *
 * ─── Responsabilidades ────────────────────────────────────────────────────
 *  1. Decidir entre mock (desenvolvimento) e API real (produção)
 *  2. Calcular o nível de risco (RiskLevel) a partir dos dados brutos
 *  3. Construir o objeto RiskAlert com conteúdo PT-BR pronto para renderização
 *  4. Gerenciar estados: isLoading, error, refetch e refresh periódico
 *
 * ─── Lógica de risco ──────────────────────────────────────────────────────
 *  Baseada nas diretrizes da Defesa Civil de Teresópolis e do INMET:
 *
 *  | Condição                              | Nível    |
 *  |---------------------------------------|----------|
 *  | Alerta oficial ativo (API alerts[])   | CRITICAL |
 *  | Chuva ≥ 50 mm/h                       | CRITICAL |
 *  | Chuva ≥ 30 mm/h  OU  vento ≥ 60 km/h | HIGH     |
 *  | Trovoada ativa (IDs 200–232)          | MEDIUM   |
 *  | Chuva ≥ 15 mm/h  OU  vento ≥ 40 km/h | MEDIUM   |
 *  | Qualquer chuva > 0                    | LOW      |
 *  | Sem chuva, sem vento forte            | NONE     |
 *
 * ─── Fonte de dados ───────────────────────────────────────────────────────
 *  Produção  → GET /api/weather   (Next.js Route Handler com OpenWeather)
 *  Dev/mock  → getMockWeatherData() com fallback gracioso em caso de erro
 *
 * ─── Uso ──────────────────────────────────────────────────────────────────
 *  // Básico:
 *  const { data, isLoading, riskLevel, riskAlert } = useWeather()
 *
 *  // Testando banner de emergência:
 *  const { riskAlert } = useWeather({ forceMock: "storm" })
 *
 * @author  Terê em Foco Dev Team
 * @version 1.0.0
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import type { WeatherData, UseWeatherResult, RiskAlert } from "@/lib/weather-types";
import { RiskLevel } from "@/lib/weather-types";
import { getMockWeatherData } from "@/lib/weather-mock";

// ─────────────────────────────────────────────────────────────────────────────
// Limiares de risco
// Baseados nas tabelas do INMET e da Defesa Civil de Teresópolis.
// Altere aqui para ajustar a sensibilidade dos alertas sem tocar na UI.
// ─────────────────────────────────────────────────────────────────────────────

const THRESHOLDS = {
  RAIN_CRITICAL: 50,  // mm/h → deslizamento iminente
  RAIN_HIGH: 30,      // mm/h → risco de alagamentos
  RAIN_MEDIUM: 15,    // mm/h → atenção
  WIND_HIGH: 60,      // km/h → risco de queda de árvores
  WIND_MEDIUM: 40,    // km/h → atenção ao trânsito
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Cálculo de risco
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calcula o RiskLevel a partir dos dados meteorológicos atuais.
 *
 * Avalia na ordem: alertas oficiais → chuva → vento → trovoada.
 * A primeira condição satisfeita define o nível (prioridade decrescente).
 *
 * @param data - Dados completos da OpenWeather API
 * @returns    Nível de risco calculado
 */
function calculateRiskLevel(data: WeatherData): RiskLevel {
  const rainNow     = data.current.rain?.["1h"] ?? 0;
  const windNow     = data.current.wind_speed;
  const conditionId = data.current.weather[0]?.id ?? 800;
  const hasAlerts   = (data.alerts?.length ?? 0) > 0;

  // 1. Alertas oficiais têm prioridade absoluta
  if (hasAlerts) return RiskLevel.CRITICAL;

  // 2. Chuva extremamente intensa → deslizamento iminente
  if (rainNow >= THRESHOLDS.RAIN_CRITICAL) return RiskLevel.CRITICAL;

  // 3. Chuva muito forte ou vento forte
  if (rainNow >= THRESHOLDS.RAIN_HIGH || windNow >= THRESHOLDS.WIND_HIGH) {
    return RiskLevel.HIGH;
  }

  // 4. Trovoadas ativas (IDs OpenWeather 200–232)
  if (conditionId >= 200 && conditionId < 300) return RiskLevel.MEDIUM;

  // 5. Chuva moderada ou vento médio
  if (rainNow >= THRESHOLDS.RAIN_MEDIUM || windNow >= THRESHOLDS.WIND_MEDIUM) {
    return RiskLevel.MEDIUM;
  }

  // 6. Qualquer precipitação
  if (rainNow > 0) return RiskLevel.LOW;

  return RiskLevel.NONE;
}

// ─────────────────────────────────────────────────────────────────────────────
// Construção do RiskAlert
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Constrói o objeto RiskAlert com conteúdo PT-BR a partir do nível calculado.
 *
 * ─── Classes Tailwind usadas ─────────────────────────────────────────────
 * Usa as cores customizadas do projeto (tailwind-tokens.ts):
 *   - LOW:      tons de `ceu` (azul-petróleo escuro) — informativo
 *   - MEDIUM:   tons de `accent` (laranja) — atenção
 *   - HIGH:     `accent` mais escuro + borda forte — alerta
 *   - CRITICAL: vermelho Tailwind padrão — emergência (não tem token, mas é correto
 *               usar vermelho semântico para segurança/acessibilidade)
 *
 * @param level - Nível de risco calculado por `calculateRiskLevel`
 * @param data  - Dados completos para enriquecer as mensagens
 * @returns     Objeto RiskAlert pronto para o WeatherAlertBanner, ou null se NONE
 */
function buildRiskAlert(level: RiskLevel, data: WeatherData): RiskAlert | null {
  if (level === RiskLevel.NONE) return null;

  const rainNow      = data.current.rain?.["1h"] ?? 0;
  const officialAlert = data.alerts?.[0];

  // ── Configuração visual por nível ────────────────────────────────────────
  // Usa tokens do tailwind-tokens.ts onde possível.
  // CRITICAL usa red padrão do Tailwind por razões semânticas de acessibilidade.
  type VisualConfig = Pick<RiskAlert, "bgColor" | "textColor" | "borderColor" | "icon">;

  const visualConfig: Record<Exclude<RiskLevel, RiskLevel.NONE>, VisualConfig> = {
    // LOW — informativo, tons de bruma/névoa do projeto
    [RiskLevel.LOW]: {
      bgColor:     "bg-bruma/40 dark:bg-ceu/30",
      textColor:   "text-ceu dark:text-bruma",
      borderColor: "border-nevoa",
      icon:        "CloudRain",
    },
    // MEDIUM — atenção, tom accent (laranja) suave
    [RiskLevel.MEDIUM]: {
      bgColor:     "bg-accent/10 dark:bg-accent/15",
      textColor:   "text-accent dark:text-orange-200",
      borderColor: "border-accent",
      icon:        "CloudLightning",
    },
    // HIGH — alerta, accent mais escuro
    [RiskLevel.HIGH]: {
      bgColor:     "bg-accent/20 dark:bg-accent/25",
      textColor:   "text-terra dark:text-orange-100",
      borderColor: "border-accent",
      icon:        "TriangleAlert",
    },
    // CRITICAL — emergência, vermelho semântico (sem token, proposital)
    [RiskLevel.CRITICAL]: {
      bgColor:     "bg-red-50 dark:bg-red-900/30",
      textColor:   "text-red-900 dark:text-red-100",
      borderColor: "border-red-600",
      icon:        "Siren",
    },
  };

  const visual = visualConfig[level as Exclude<RiskLevel, RiskLevel.NONE>];

  // ── Conteúdo por nível ────────────────────────────────────────────────────
  type ContentConfig = Pick<RiskAlert, "title" | "description" | "safetyTips" | "source">;

  const contentMap: Record<Exclude<RiskLevel, RiskLevel.NONE>, ContentConfig> = {
    [RiskLevel.LOW]: {
      title: "Garoa em Teresópolis",
      description: `Chuva leve (${rainNow.toFixed(1)} mm/h) nas áreas da Serra. Condições seguras — fique atento ao longo do dia.`,
      safetyTips: [
        "Reduza a velocidade nas vias serranas — pistas molhadas.",
        "Fique atento a mudanças rápidas de tempo na serra.",
      ],
      source: "Terê em Foco — Monitoramento Climático",
    },

    [RiskLevel.MEDIUM]: {
      title: "Atenção: Chuva Moderada ou Trovoadas",
      description:
        officialAlert?.description ??
        `Chuva moderada ${rainNow > 0 ? `(${rainNow.toFixed(1)} mm/h)` : ""} com possibilidade de trovoadas isoladas. ` +
        "Evite áreas de risco e acompanhe os alertas da Defesa Civil.",
      safetyTips: [
        "Evite circular em encostas e vias com histórico de alagamento.",
        "Guarde veículos em local coberto.",
        "Mantenha calhas e ralos desobstruídos.",
        "Acompanhe o canal da Defesa Civil de Teresópolis.",
      ],
      source: officialAlert?.sender_name ?? "Terê em Foco — Monitoramento Climático",
    },

    [RiskLevel.HIGH]: {
      title: "⚠️ Alerta: Chuva Intensa na Serra",
      description:
        officialAlert?.description ??
        `Chuva intensa (${rainNow.toFixed(1)} mm/h) com risco de alagamentos localizados e quedas de barreiras. ` +
        "Evite trânsito desnecessário nas vias da Serra.",
      safetyTips: [
        "Evite vias de encosta, especialmente no período noturno.",
        "Não atravesse ruas alagadas — mesmo aparentando ser rasas.",
        "Afaste-se de barrancos e encostas com sinais de instabilidade.",
        "Defesa Civil de Teresópolis: 199 (gratuito, 24h).",
        "Tenha uma mochila de emergência (documentos, remédios, lanternas).",
      ],
      source: officialAlert?.sender_name ?? "Defesa Civil de Teresópolis",
    },

    [RiskLevel.CRITICAL]: {
      title: "🚨 EMERGÊNCIA: Risco de Deslizamento",
      description:
        officialAlert?.description ??
        `Chuva extremamente intensa (${rainNow.toFixed(1)} mm/h) com RISCO IMINENTE de deslizamentos e inundações. ` +
        "Siga IMEDIATAMENTE para abrigo seguro.",
      safetyTips: [
        "SAIA AGORA de encostas, morros e fundos de vale.",
        "Não retorne ao imóvel até liberação oficial.",
        "Defesa Civil: 199 · Bombeiros: 193 · SAMU: 192",
        "Siga todas as orientações das autoridades locais.",
        "Não tente recuperar objetos — sua vida é a prioridade.",
        "Ajude vizinhos a evacuarem, especialmente idosos e crianças.",
      ],
      source: officialAlert?.sender_name ?? "Defesa Civil de Teresópolis",
    },
  };

  const content = contentMap[level as Exclude<RiskLevel, RiskLevel.NONE>];

  return { level, ...visual, ...content };
}

// ─────────────────────────────────────────────────────────────────────────────
// Opções do hook
// ─────────────────────────────────────────────────────────────────────────────

export interface UseWeatherOptions {
  /**
   * Força um cenário de mock específico.
   * Útil para testar o banner de alerta sem precisar de condições reais.
   * Aceita "normal" ou "storm". Undefined → usa a lógica automática.
   */
  forceMock?: "normal" | "storm";

  /**
   * Intervalo em ms para refetch automático em background.
   * Default: 600.000ms (10 minutos).
   * Use 0 para desativar o refetch automático.
   */
  refreshInterval?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook principal
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook que gerencia o ciclo de vida completo dos dados de clima de Teresópolis.
 *
 * @param options - Configurações opcionais (veja UseWeatherOptions)
 * @returns       UseWeatherResult com todos os estados e o RiskAlert processado
 *
 * @example
 * // Uso básico em qualquer Client Component:
 * const { data, isLoading, riskAlert } = useWeather()
 *
 * // Testando o banner CRITICAL em desenvolvimento:
 * const { riskAlert } = useWeather({ forceMock: "storm" })
 */
export function useWeather(options: UseWeatherOptions = {}): UseWeatherResult {
  const { forceMock, refreshInterval = 600_000 } = options;

  const [data,      setData]      = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(RiskLevel.NONE);
  const [riskAlert, setRiskAlert] = useState<RiskAlert | null>(null);

  /**
   * Deve usar dados mockados?
   *  - Sim: se forceMock foi definido explicitamente
   *  - Sim: se a variável de ambiente NEXT_PUBLIC_USE_WEATHER_MOCK=true
   *  - Não: usa a API Route /api/weather em produção
   */
  const shouldUseMock =
    forceMock !== undefined ||
    process.env.NEXT_PUBLIC_USE_WEATHER_MOCK === "true";

  const fetchWeather = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let weatherData: WeatherData;

      if (shouldUseMock) {
        // Simula latência de rede realista (150–350ms) durante o desenvolvimento.
        // Isso garante que o estado de loading seja visível e testável.
        await new Promise((r) => setTimeout(r, 150 + Math.random() * 200));
        weatherData = getMockWeatherData(forceMock);
      } else {
        // Produção: a rota /api/weather consulta o OpenWeather no servidor
        // e retorna o mesmo formato WeatherData, sem expor a API key ao cliente.
        const response = await fetch("/api/weather", {
          // Cache de 10 minutos no Next.js (alinhado ao refreshInterval)
          next: { revalidate: 600 },
        });

        if (!response.ok) {
          throw new Error(`Erro ${response.status} ao buscar dados do clima.`);
        }

        weatherData = (await response.json()) as WeatherData;
      }

      // Processa risco e atualiza todos os estados de uma vez
      const level = calculateRiskLevel(weatherData);
      const alert = buildRiskAlert(level, weatherData);

      setData(weatherData);
      setRiskLevel(level);
      setRiskAlert(alert);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Falha ao carregar dados do clima.";
      setError(message);

      // Fallback gracioso: exibe dados mock para não quebrar a UI em caso de erro de rede
      const fallback = getMockWeatherData("normal");
      const level    = calculateRiskLevel(fallback);
      setData(fallback);
      setRiskLevel(level);
      setRiskAlert(buildRiskAlert(level, fallback));
    } finally {
      setIsLoading(false);
    }
  }, [shouldUseMock, forceMock]);

  // Fetch na montagem do componente
  useEffect(() => { fetchWeather(); }, [fetchWeather]);

  // Refresh periódico automático em background
  useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0) return;
    const timer = setInterval(fetchWeather, refreshInterval);
    return () => clearInterval(timer);
  }, [fetchWeather, refreshInterval]);

  return { data, isLoading, error, riskLevel, riskAlert, refetch: fetchWeather };
}
