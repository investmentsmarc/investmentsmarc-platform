# SPEC-004 — Calculadoras de Trading

> Fase: 1 | Prioridad: MUST
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-004
> Casos de Uso: [UC-002](../use-cases/UC-002-visitante-usa-calculadora.md)

---

## 1. Alcance

Hub de herramientas (`/herramientas/`) con 3 calculadoras interactivas portadas desde WordPress.

## 2. Rutas

| Ruta | Archivo | Componente Principal |
|------|---------|---------------------|
| `/herramientas/` | `src/app/herramientas/page.tsx` | Hub (Server) |
| `/herramientas/position-size-calculator/` | `src/app/herramientas/position-size-calculator/page.tsx` | `<PositionSizeCalc />` |
| `/herramientas/risk-reward-calculator/` | `src/app/herramientas/risk-reward-calculator/page.tsx` | `<RiskRewardCalc />` |
| `/herramientas/investment-calculator/` | `src/app/herramientas/investment-calculator/page.tsx` | `<InvestmentCalc />` |

## 3. Hub de Herramientas

- **Tipo:** Server Component
- **Layout:**
  - Badge: "Herramientas"
  - Título H1: "Herramientas de Trading Gratuitas"
  - Grid de 3 cards, cada una linkeando a su calculadora
  - Cada card: icono, nombre, descripción breve, botón "Usar →"
- **Estilos:** Cards con `.mi-tool-card`, hover scale + border glow

## 4. Calculadoras

### 4.1 Position Size Calculator

- **Ubicación:** `src/components/calculators/PositionSizeCalc.tsx`
- **Tipo:** Client Component
- **Referencia WP:** `functions.php` `calcPS()` L467-529
- **Inputs:**
  - Account Balance ($) — `number`, default 10000
  - Risk per Trade (%) — `number`, default 1
  - Entry Price ($) — `number`
  - Stop Loss Price ($) — `number`
- **Cálculo:**
  ```
  riskAmount = balance * (riskPercent / 100)
  stopLossDistance = |entryPrice - stopLossPrice|
  positionSize = riskAmount / stopLossDistance
  positionValue = positionSize * entryPrice
  ```
- **Outputs:**
  - Risk Amount ($ en riesgo)
  - Position Size (# acciones/contratos)
  - Position Value (valor total de la posición)
- **Validación:**
  - Todos los campos > 0
  - Entry Price ≠ Stop Loss Price
  - Error inline si validación falla

### 4.2 Risk/Reward Calculator

- **Ubicación:** `src/components/calculators/RiskRewardCalc.tsx`
- **Tipo:** Client Component
- **Referencia WP:** `functions.php` `calcRR()` L530-566
- **Inputs:**
  - Entry Price ($) — `number`
  - Stop Loss Price ($) — `number`
  - Take Profit Price ($) — `number`
- **Cálculo:**
  ```
  risk = |entryPrice - stopLossPrice|
  reward = |takeProfitPrice - entryPrice|
  ratio = reward / risk
  ```
- **Outputs:**
  - Risk ($ por acción)
  - Reward ($ por acción)
  - Risk/Reward Ratio (e.g., "1:2.5")
  - Indicador visual: verde si ratio ≥ 2, amarillo si 1-2, rojo si < 1
- **Validación:**
  - Todos > 0
  - Stop Loss y Take Profit en lados opuestos del Entry
  - Risk ≠ 0

### 4.3 Investment Calculator

- **Ubicación:** `src/components/calculators/InvestmentCalc.tsx`
- **Tipo:** Client Component
- **Referencia WP:** `functions.php` L503-729
- **Inputs:**
  - Initial Investment ($) — `number`, default 10000
  - Monthly Contribution ($) — `number`, default 500
  - Time Horizon (años) — `number`, default 10
  - ETF Selection — `select`: SPY, QQQ, VOO
  - Expected Annual Return (%) — `number`, auto-filled por ETF seleccionado
- **ETF Data (históricos reales):**
  ```typescript
  const ETF_RETURNS: Record<string, number> = {
    SPY: 10.5,  // S&P 500 avg annual return
    QQQ: 14.2,  // NASDAQ 100 avg annual return
    VOO: 10.4,  // Vanguard S&P 500
  };
  ```
- **Cálculo:**
  ```
  Compound interest con contribuciones mensuales:
  FV = P(1+r)^n + PMT * [((1+r)^n - 1) / r]
  donde r = annual_rate / 12, n = years * 12
  ```
- **Outputs:**
  - Final Balance ($)
  - Total Contributions ($)
  - Total Returns ($)
  - Chart: línea de crecimiento año por año (Canvas o SVG)
- **Chart:**
  - Eje X: años (0 a time horizon)
  - Eje Y: valor del portfolio ($)
  - Línea 1: crecimiento con returns (dorada)
  - Línea 2: solo contribuciones (gris)
  - Área entre las dos líneas = returns
  - Tooltip on hover con valor exacto por año

## 5. Estilos Comunes

- Todas las calculadoras usan `.mi-calculator-form` para el formulario
- Inputs usan `.mi-input` (glassmorphic con borde `--mi-border`)
- Labels en `--mi-text-secondary`
- Resultados en cards con fondo `--mi-bg-elevated`
- Números destacados en `--mi-gold-light`
- CSS adicional en `src/styles/calculator.css`

## 6. Criterios de Aceptación

- [ ] **Paridad funcional:** mismos inputs → mismos outputs que WordPress para las 3 calculadoras
- [ ] Position Size: calcula correctamente con balance $10K, 1% risk, entry $150, SL $145 → 20 shares
- [ ] Risk/Reward: indicador visual correcto (verde/amarillo/rojo)
- [ ] Investment: chart renderiza correctamente con datos reales de ETFs
- [ ] Validación inline sin submit (cálculo en tiempo real)
- [ ] Responsive en 768px y 1024px
- [ ] Hub de herramientas con 3 cards funcionales
