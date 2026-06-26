/**
 * @file lib/weather-types.ts
 * @description Definição de todos os tipos e interfaces relacionados ao clima.
 *
 * Este arquivo é o "contrato" central da feature de clima.
 * Todos os tipos espelham a estrutura da OpenWeather One Call API 3.0,
 * garantindo que a troca dos dados mock pela API real seja 100% transparente
 * — sem qualquer alteração nos componentes de UI.
 *
 * Dependências: nenhuma (apenas tipos TypeScript puros).
 *
 * @author  Terê em Foco Dev Team
 * @version 1.0.0
 */

// ─────────────────────────────────────────────────────────────────────────────
// Enum — Nível de risco climático
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Nível de severidade de um alerta meteorológico.
 *
 * Usado pelo hook `useWeather` para calcular o risco automaticamente
 * e pelo `WeatherAlertBanner` para determinar cor, ícone e comportamento.
 *
 * Ordem crescente de gravidade: NONE → LOW → MEDIUM → HIGH → CRITICAL
 */
export enum RiskLevel {
  /** Sem riscos identificados — exibição normal, sem banner. */
  NONE = "none",

  /** Atenção leve: garoa ou chuva fraca. Banner informativo azul. */
  LOW = "low",

  /** Alerta moderado: chuva moderada ou trovoadas isoladas. Banner âmbar. */
  MEDIUM = "medium",

  /** Alerta alto: chuva intensa, risco de alagamentos pontuais. Banner laranja. */
  HIGH = "high",

  /**
   * Emergência: chuva extrema (>50mm/h) ou alerta oficial da Defesa Civil.
   * Banner vermelho fixo no topo, não pode ser fechado pelo usuário.
   */
  CRITICAL = "critical",
}

// ─────────────────────────────────────────────────────────────────────────────
// Interfaces base — espelham a resposta bruta da OpenWeather API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Condição meteorológica retornada pela OpenWeather.
 * Um período pode ter múltiplas condições simultâneas (ex.: chuva + nublado).
 *
 * @see https://openweathermap.org/weather-conditions
 */
export interface WeatherCondition {
  /** ID numérico da condição. Ex.: 502 = "Heavy intensity rain" */
  id: number;
  /** Grupo principal. Ex.: "Rain", "Thunderstorm", "Clear" */
  main: string;
  /** Descrição detalhada em inglês. Ex.: "heavy intensity rain" */
  description: string;
  /** Código do ícone. Ex.: "10d" (dia) ou "10n" (noite) */
  icon: string;
}

/**
 * Dados meteorológicos de um momento específico (hora atual ou hora prevista).
 * Usado tanto para `current` quanto para cada item do array `hourly`.
 */
export interface HourlyWeather {
  /** Timestamp Unix em segundos */
  dt: number;
  /** Temperatura em °C */
  temp: number;
  /** Sensação térmica em °C */
  feels_like: number;
  /** Umidade relativa do ar em % (0–100) */
  humidity: number;
  /** Velocidade do vento em km/h */
  wind_speed: number;
  /** Direção do vento em graus (0–360, norte = 0) */
  wind_deg: number;
  /** Probabilidade de precipitação (0.0–1.0) */
  pop: number;
  /** Volume de chuva na última hora em mm (presente apenas quando está chovendo) */
  rain?: { "1h": number };
  /** Lista de condições ativas */
  weather: WeatherCondition[];
  /** Índice UV (0–11+) */
  uvi: number;
  /** Visibilidade em metros (máximo 10.000) */
  visibility: number;
  /** Pressão atmosférica em hPa */
  pressure: number;
}

/**
 * Dados meteorológicos de um dia completo.
 * Usado no array `daily` para a previsão de 7 dias.
 */
export interface DailyWeather {
  /** Timestamp Unix — meia-noite do dia representado */
  dt: number;
  /** Temperaturas ao longo do dia em °C */
  temp: {
    min: number;
    max: number;
    day: number;   // tarde
    night: number;
    eve: number;   // noite
    morn: number;  // manhã
  };
  /** Sensação térmica por período do dia */
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  /** Umidade relativa média do dia em % */
  humidity: number;
  /** Velocidade média do vento em km/h */
  wind_speed: number;
  /** Direção predominante do vento em graus */
  wind_deg: number;
  /** Probabilidade de precipitação (0.0–1.0) */
  pop: number;
  /** Volume total de chuva acumulado no dia em mm (opcional) */
  rain?: number;
  /** Condição predominante do dia */
  weather: WeatherCondition[];
  /** Índice UV máximo do dia */
  uvi: number;
  /** Horário do nascer do sol (timestamp Unix) */
  sunrise: number;
  /** Horário do pôr do sol (timestamp Unix) */
  sunset: number;
}

/**
 * Alerta meteorológico oficial emitido por órgãos como
 * Inmet, Defesa Civil de Teresópolis, ou gerado pela própria OpenWeather.
 */
export interface WeatherAlert {
  /** Órgão emissor. Ex.: "Defesa Civil de Teresópolis" */
  sender_name: string;
  /** Tipo do alerta. Ex.: "Risco de Deslizamento — Nível Vermelho" */
  event: string;
  /** Início do período de risco (timestamp Unix) */
  start: number;
  /** Fim do período de risco (timestamp Unix) */
  end: number;
  /** Descrição completa com orientações à população */
  description: string;
  /** Tags de classificação. Ex.: ["Chuva Intensa", "Deslizamento"] */
  tags: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Interface principal — resposta completa da One Call API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resposta completa da OpenWeather One Call API para Teresópolis.
 *
 * Esta é a interface central consumida por todos os componentes.
 * Coordenadas de Teresópolis: lat -22.4122, lon -42.9657
 */
export interface WeatherData {
  lat: number;
  lon: number;
  /** Ex.: "America/Sao_Paulo" */
  timezone: string;
  /** Offset UTC em segundos. Ex.: -10800 para UTC-3 */
  timezone_offset: number;
  /** Condições meteorológicas no momento atual */
  current: HourlyWeather;
  /** Previsão hora a hora para as próximas 48 horas */
  hourly: HourlyWeather[];
  /** Previsão diária para os próximos 8 dias */
  daily: DailyWeather[];
  /** Alertas ativos (undefined quando não há alertas) */
  alerts?: WeatherAlert[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Tipos derivados — consumidos pelos componentes de UI
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retorno do hook `useWeather` — estado completo pronto para a UI.
 */
export interface UseWeatherResult {
  /** Dados meteorológicos. null enquanto carrega ou em caso de erro sem fallback. */
  data: WeatherData | null;
  /** true enquanto aguarda a resposta (API ou mock) */
  isLoading: boolean;
  /** Mensagem de erro, se houver */
  error: string | null;
  /** Nível de risco calculado automaticamente a partir dos dados */
  riskLevel: RiskLevel;
  /** Alerta processado e pronto para renderização. null se RiskLevel === NONE */
  riskAlert: RiskAlert | null;
  /** Força uma nova busca de dados manualmente */
  refetch: () => void;
}

/**
 * Alerta de risco processado — gerado pelo hook e consumido pelo WeatherAlertBanner.
 *
 * Contém tanto o conteúdo textual (título, descrição, dicas)
 * quanto as classes Tailwind de estilo, mantendo o banner desacoplado
 * da lógica de cálculo de risco.
 */
export interface RiskAlert {
  level: RiskLevel;
  /** Título curto exibido em destaque no banner */
  title: string;
  /** Descrição detalhada com orientações */
  description: string;
  /** Nome do ícone Lucide React a renderizar */
  icon: string;
  /** Classe Tailwind do fundo (usa tokens do projeto) */
  bgColor: string;
  /** Classe Tailwind do texto (usa tokens do projeto) */
  textColor: string;
  /** Classe Tailwind da borda (usa tokens do projeto) */
  borderColor: string;
  /** Lista de ações recomendadas à população */
  safetyTips: string[];
  /** Órgão ou fonte do alerta */
  source: string;
}
