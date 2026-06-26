/**
 * @file components/features/WeatherAlertBanner.tsx
 * @description Banner animado de alerta meteorológico para condições de risco.
 *
 * ─── Comportamento por nível ────────────────────────────────────────────────
 *  LOW      → Banner sutil (bruma/névoa), colapsável, pode ser fechado
 *  MEDIUM   → Banner accent (laranja), visível, pode ser fechado
 *  HIGH     → Banner accent intenso, pulsação suave, pode ser fechado
 *  CRITICAL → Banner vermelho, pulsação intensa, FIXO (não pode ser fechado)
 *             Exibe números de emergência (199, 193, 192) em destaque
 *
 * ─── Design ────────────────────────────────────────────────────────────────
 * Usa os tokens do projeto (tailwind-tokens.ts):
 *   bruma, nevoa, accent, terra, ceu
 * Faixa lateral colorida indica severidade visualmente (sem depender só de cor).
 *
 * ─── Acessibilidade ────────────────────────────────────────────────────────
 *  - role="alert" + aria-live para anúncio em leitores de tela
 *  - CRITICAL usa aria-live="assertive" (interrompe qualquer anúncio em curso)
 *  - Botões com aria-label descritivos
 *  - Contraste mínimo WCAG AA em todos os níveis
 *
 * ─── Uso ────────────────────────────────────────────────────────────────────
 *  // Dentro do WeatherSection (modo automático):
 *  {riskAlert && <WeatherAlertBanner alert={riskAlert} />}
 *
 *  // Com posicionamento sticky para CRITICAL:
 *  <WeatherAlertBanner alert={riskAlert} className="sticky top-0 z-40" />
 *
 * @author  Terê em Foco Dev Team
 * @version 1.0.0
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudRain,
  CloudLightning,
  TriangleAlert,
  Siren,
  X,
  ChevronDown,
  ChevronUp,
  Phone,
  ShieldCheck,
} from "lucide-react";
import type { RiskAlert } from "@/lib/weather-types";
import { RiskLevel } from "@/lib/weather-types";

// ─────────────────────────────────────────────────────────────────────────────
// Mapeamento de ícones por nome string
// Evita `require` dinâmico e mantém tree-shaking do Lucide React.
// ─────────────────────────────────────────────────────────────────────────────

const ICON_MAP = {
  CloudRain,
  CloudLightning,
  TriangleAlert,
  Siren,
} as const;

type IconName = keyof typeof ICON_MAP;

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface WeatherAlertBannerProps {
  /** Dados do alerta gerados e processados pelo hook useWeather */
  alert: RiskAlert;
  /**
   * Classes CSS extras para posicionamento externo.
   * @example "sticky top-0 z-40" para fixar no topo em CRITICAL
   */
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componente: Botão de número de emergência
// ─────────────────────────────────────────────────────────────────────────────

interface EmergencyButtonProps {
  label: string;
  number: string;
  textColor: string;
}

/**
 * Link clicável para ligar para um número de emergência.
 * Renderizado apenas em alertas HIGH e CRITICAL.
 */
function EmergencyButton({ label, number, textColor }: EmergencyButtonProps) {
  return (
    <a
      href={`tel:${number}`}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold
        border border-current/40 hover:bg-black/10 dark:hover:bg-white/10
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-1
        ${textColor}
      `}
      aria-label={`Ligar para ${label}: ${number}`}
    >
      <Phone className="w-3.5 h-3.5" aria-hidden="true" />
      {label} <span className="tracking-wider">{number}</span>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal: WeatherAlertBanner
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Banner de alerta meteorológico com animação de entrada, pulsação e expansão.
 *
 * Renderizado pelo WeatherSection quando useWeather detecta RiskLevel > NONE.
 */
export function WeatherAlertBanner({ alert, className = "" }: WeatherAlertBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // HIGH e CRITICAL começam expandidos (usuário precisa ver as dicas imediatamente)
  const [isExpanded, setIsExpanded] = useState(
    alert.level === RiskLevel.HIGH || alert.level === RiskLevel.CRITICAL
  );

  const isCritical = alert.level === RiskLevel.CRITICAL;
  const isHigh     = alert.level === RiskLevel.HIGH;

  // Banner CRITICAL é permanente — o usuário não pode descartá-lo
  const canDismiss = !isCritical;

  // Ícone correto para este nível de risco
  const Icon = ICON_MAP[alert.icon as IconName] ?? TriangleAlert;

  // ── Variantes de animação Framer Motion ────────────────────────────────────

  /** Entrada/saída do banner inteiro */
  const bannerVariants = {
    hidden:  { opacity: 0, y: -16, scaleY: 0.96 },
    visible: { opacity: 1, y: 0,   scaleY: 1,
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    },
    exit:    { opacity: 0, y: -8, scaleY: 0.96,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  /** Expansão/colapso do painel de dicas de segurança */
  const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded:  { height: "auto", opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AnimatePresence mode="wait">
      {!isDismissed && (
        <motion.div
          key="weather-alert-banner"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          /**
           * Semântica de acessibilidade:
           * - role="alert" → anuncia o conteúdo automaticamente em leitores de tela
           * - aria-live="assertive" em CRITICAL → interrompe outros anúncios em curso
           * - aria-live="polite" nos demais → aguarda o momento oportuno para anunciar
           */
          role="alert"
          aria-live={isCritical ? "assertive" : "polite"}
          aria-atomic="true"
          className={`
            relative overflow-hidden rounded-xl border-2
            ${alert.bgColor} ${alert.borderColor}
            ${className}
          `}
        >
          {/*
           * Faixa lateral de severidade.
           * Indica visualmente o nível sem depender apenas da cor de fundo
           * (importante para daltonismo e modo de alto contraste).
           */}
          <div
            aria-hidden="true"
            className={`
              absolute left-0 top-0 bottom-0 w-1.5
              ${isCritical
                ? "bg-red-600"
                : isHigh
                ? "bg-accent"
                : alert.level === RiskLevel.MEDIUM
                ? "bg-accent/70"
                : "bg-nevoa"
              }
            `}
          />

          {/* Efeito de pulsação para HIGH e CRITICAL */}
          {(isCritical || isHigh) && (
            <motion.div
              aria-hidden="true"
              className={`
                absolute inset-0 pointer-events-none
                ${isCritical ? "bg-red-500/8" : "bg-accent/8"}
              `}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: isCritical ? 1.4 : 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          <div className="pl-5 pr-4 py-4">
            {/* ── Cabeçalho ───────────────────────────────────────────────── */}
            <div className="flex items-start gap-3">

              {/* Ícone principal com balanço animado em CRITICAL */}
              <motion.div
                aria-hidden="true"
                className="flex-shrink-0 mt-0.5"
                animate={isCritical ? { rotate: [-4, 4, -4], scale: [1, 1.05, 1] } : {}}
                transition={isCritical ? { duration: 1, repeat: Infinity } : {}}
              >
                <Icon className={`w-6 h-6 ${alert.textColor}`} />
              </motion.div>

              {/* Título + descrição + fonte */}
              <div className="flex-1 min-w-0">
                <p className={`font-display font-bold text-base leading-tight ${alert.textColor}`}>
                  {alert.title}
                </p>
                <p className={`mt-1 text-sm leading-relaxed opacity-90 ${alert.textColor}`}>
                  {alert.description}
                </p>
                <p className={`mt-1 text-xs opacity-60 ${alert.textColor}`}>
                  Fonte: {alert.source}
                </p>
              </div>

              {/* Controles: expandir + fechar */}
              <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                {/* Botão expandir/colapsar dicas de segurança */}
                <button
                  onClick={() => setIsExpanded((v) => !v)}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? "Ocultar dicas de segurança" : "Ver dicas de segurança"}
                  className={`
                    p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10
                    transition-colors focus:outline-none focus:ring-2 focus:ring-current
                    ${alert.textColor}
                  `}
                >
                  {isExpanded
                    ? <ChevronUp  className="w-4 h-4" aria-hidden="true" />
                    : <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  }
                </button>

                {/* Botão fechar — oculto em CRITICAL */}
                {canDismiss && (
                  <button
                    onClick={() => setIsDismissed(true)}
                    aria-label="Fechar alerta"
                    className={`
                      p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10
                      transition-colors focus:outline-none focus:ring-2 focus:ring-current
                      ${alert.textColor}
                    `}
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* ── Painel expansível: dicas de segurança ───────────────────── */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  key="safety-tips-panel"
                  variants={expandVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="overflow-hidden"
                >
                  <div className="mt-4 ml-9 space-y-3">
                    {/* Lista de orientações */}
                    <div>
                      <div className={`flex items-center gap-2 mb-2 text-sm font-semibold ${alert.textColor}`}>
                        <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                        Orientações de Segurança
                      </div>
                      <ul className="space-y-1.5">
                        {alert.safetyTips.map((tip, i) => (
                          <li
                            key={i}
                            className={`flex items-start gap-2 text-sm opacity-90 ${alert.textColor}`}
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0"
                            />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Números de emergência — apenas HIGH e CRITICAL */}
                    {(isCritical || isHigh) && (
                      <div className="flex flex-wrap gap-2 pt-1 border-t border-current/20">
                        <EmergencyButton label="Defesa Civil" number="199" textColor={alert.textColor} />
                        <EmergencyButton label="Bombeiros"    number="193" textColor={alert.textColor} />
                        <EmergencyButton label="SAMU"         number="192" textColor={alert.textColor} />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
