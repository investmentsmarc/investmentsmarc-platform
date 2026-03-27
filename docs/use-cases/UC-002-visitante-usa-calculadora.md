# UC-002 — Visitante Usa Calculadora de Trading

> Actor Principal: Visitante (anónimo)
> Prioridad: MUST | Fase: 1
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-004
> Specs: [SPEC-004](../specs/SPEC-004-calculadoras.md)

---

## Descripción

Un visitante usa una de las 3 calculadoras de trading gratuitas para calcular tamaño de posición, ratio riesgo/recompensa, o proyección de inversión.

## Precondiciones

- El visitante está en `/herramientas/` o accede directamente a una calculadora
- No requiere autenticación

## Flujo Principal — Position Size Calculator

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/herramientas/position-size-calculator/` | Carga formulario con campos vacíos (defaults: balance=$10K, risk=1%) |
| 2 | Ingresa Account Balance: $10,000 | — |
| 3 | Ingresa Risk per Trade: 1% | — |
| 4 | Ingresa Entry Price: $150 | — |
| 5 | Ingresa Stop Loss Price: $145 | — |
| 6 | — | Calcula en tiempo real: Risk Amount=$100, Position Size=20, Position Value=$3,000 |
| 7 | Ve los resultados actualizados | — |
| 8 | Modifica Entry Price a $200 | — |
| 9 | — | Recalcula automáticamente con nuevos valores |

## Flujo Alternativo — Risk/Reward Calculator

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/herramientas/risk-reward-calculator/` | Carga formulario |
| 2 | Ingresa Entry: $150, SL: $145, TP: $162.50 | — |
| 3 | — | Calcula: Risk=$5, Reward=$12.50, Ratio=1:2.5, indicador VERDE |
| 4 | Cambia TP a $152 | — |
| 5 | — | Recalcula: Ratio=1:0.4, indicador ROJO |

## Flujo Alternativo — Investment Calculator

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/herramientas/investment-calculator/` | Carga formulario con defaults |
| 2 | Selecciona ETF: SPY | Sistema auto-llena return: 10.5% |
| 3 | Ingresa: $10K inicial, $500/mes, 10 años | — |
| 4 | — | Calcula: muestra balance final, contribuciones, returns |
| 5 | — | Renderiza chart con curva de crecimiento (dorada) vs contribuciones (gris) |
| 6 | Hover sobre punto del chart | Tooltip muestra valor exacto de ese año |
| 7 | Cambia ETF a QQQ | Return auto-cambia a 14.2%, chart se actualiza |

## Flujo de Error — Validación

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Deja Entry Price vacío | — |
| 2 | — | Muestra error inline: "Campo requerido" |
| 3 | Ingresa Entry Price = Stop Loss | — |
| 4 | — | Muestra error: "Entry y Stop Loss no pueden ser iguales" |
| 5 | Corrige los valores | — |
| 6 | — | Error desaparece, cálculo se ejecuta |

## Postcondiciones

- El visitante obtuvo resultados de su cálculo
- No se almacenaron datos (calculadora es stateless)
- Posible conversión: visitante click en CTA "Aprende más" → `/curso-gratis/`

## Reglas de Negocio

- Cálculos se ejecutan en tiempo real (no hay botón "Calcular")
- Todos los campos deben ser > 0
- Investment Calculator: retornos basados en datos históricos reales de ETFs
- Paridad funcional con WordPress: mismos inputs → mismos outputs
- No requiere autenticación ni almacenamiento
