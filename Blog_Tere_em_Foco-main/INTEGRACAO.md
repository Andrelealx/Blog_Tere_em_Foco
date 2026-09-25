# 🌦️ Feature: Clima de Teresópolis

Guia de integração para o Blog Terê em Foco.

---

## Arquivos entregues

```
lib/
  weather-types.ts          ← Tipos TypeScript (interfaces + enum RiskLevel)
  weather-mock.ts           ← Dados mockados (2 cenários: normal e storm)

hooks/
  useWeather.ts             ← Hook principal: busca dados + calcula risco

components/features/
  WeatherAlertBanner.tsx    ← Banner animado de alerta de risco
  WeatherSection.tsx        ← Seção completa (importar nas páginas)
```

---

## Como adicionar em uma página

```tsx
// app/page.tsx (ou qualquer página/layout)
import { WeatherSection } from "@/components/features/WeatherSection"

export default function HomePage() {
  return (
    <main>
      {/* ...outros conteúdos... */}
      <WeatherSection />
    </main>
  )
}
```

---

## Variáveis de ambiente

Adicione ao seu `.env.local` (copie do `.env.example`):

```bash
# true  → usa dados mockados (sem chamar a OpenWeather API)
# false → usa a API real via /api/weather
NEXT_PUBLIC_USE_WEATHER_MOCK=true

# Cenário do mock: "normal" (padrão) ou "storm" (testa banner de emergência)
NEXT_PUBLIC_WEATHER_MOCK_SCENARIO=normal

# Sua chave OpenWeather One Call API 3.0 (usada pela rota /api/weather)
OPENWEATHER_API_KEY=sua_chave_aqui
```

---

## Testar o banner de emergência

**Via variável de ambiente:**
```bash
NEXT_PUBLIC_WEATHER_MOCK_SCENARIO=storm
```

**Via prop no componente (apenas para debug visual):**
```tsx
<WeatherSection debugScenario="storm" />
```

---

## Lógica de alerta (limiares)

| Condição                              | Nível    | Visual              |
|---------------------------------------|----------|---------------------|
| Alerta oficial ativo (API alerts[])   | CRITICAL | Vermelho fixo       |
| Chuva ≥ 50 mm/h                       | CRITICAL | Vermelho fixo       |
| Chuva ≥ 30 mm/h  OU  vento ≥ 60 km/h | HIGH     | Laranja (accent)    |
| Trovoada (IDs OpenWeather 200–232)    | MEDIUM   | Laranja suave       |
| Chuva ≥ 15 mm/h  OU  vento ≥ 40 km/h | MEDIUM   | Laranja suave       |
| Chuva fraca (> 0 mm/h)               | LOW      | Bruma/névoa         |
| Sem chuva, sem vento forte            | NONE     | Sem banner          |

Para ajustar os limiares, edite o objeto `THRESHOLDS` em `hooks/useWeather.ts`.

---

## Integrar a API OpenWeather (produção)

1. Crie o arquivo `app/api/weather/route.ts`:

```ts
import { NextResponse } from "next/server"

const LAT = -22.4122  // Teresópolis
const LON = -42.9657

export async function GET() {
  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENWEATHER_API_KEY não configurada" },
      { status: 500 }
    )
  }

  const url = `https://api.openweathermap.org/data/3.0/onecall`
    + `?lat=${LAT}&lon=${LON}`
    + `&units=metric`
    + `&lang=pt_br`
    + `&exclude=minutely`
    + `&appid=${apiKey}`

  const res = await fetch(url, { next: { revalidate: 600 } })
  const data = await res.json()

  return NextResponse.json(data)
}
```

2. No `.env.local`, defina:
```bash
NEXT_PUBLIC_USE_WEATHER_MOCK=false
OPENWEATHER_API_KEY=sua_chave_aqui
```

3. A interface `WeatherData` em `lib/weather-types.ts` já espelha exatamente
   o formato da One Call API 3.0 — nenhum componente precisa ser alterado.

---

## Tokens do projeto usados

Os componentes usam exclusivamente os tokens definidos em `tailwind-tokens.ts`:

| Token    | Hex       | Uso nos componentes                    |
|----------|-----------|----------------------------------------|
| `terra`  | `#2D1B0E` | Texto principal (modo claro)           |
| `nevoa`  | `#6B8F71` | Destaque, card "Agora", borda LOW      |
| `bruma`  | `#C8D8C4` | Bordas, fundos sutis                   |
| `cume`   | `#F5EFE6` | Fundo dos detail cards                 |
| `accent` | `#D4621A` | Chuva, alerta MEDIUM/HIGH, barras      |
| `ceu`    | `#1A2F3A` | Fundos dark mode                       |

Gradientes de fundo:
- `bg-mountain-glow` → card de clima atual (modo claro)
- `bg-night-fog`     → card de clima atual (modo escuro)
