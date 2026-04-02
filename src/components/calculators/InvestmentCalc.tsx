"use client";

import { useMemo, useState } from "react";

const ETF_PRESETS = {
  SPY: {
    symbol: "SPY",
    label: "S&P 500",
    annualReturn: 10,
    dividendYield: 1.3,
    dividendGrowth: 5,
    expenseRatio: 0.09,
  },
  VOO: {
    symbol: "VOO",
    label: "Vanguard S&P",
    annualReturn: 10,
    dividendYield: 1.35,
    dividendGrowth: 5,
    expenseRatio: 0.03,
  },
  QQQ: {
    symbol: "QQQ",
    label: "Nasdaq 100",
    annualReturn: 12,
    dividendYield: 0.7,
    dividendGrowth: 8,
    expenseRatio: 0.2,
  },
  QQQM: {
    symbol: "QQQM",
    label: "Nasdaq Mini",
    annualReturn: 12,
    dividendYield: 0.75,
    dividendGrowth: 8,
    expenseRatio: 0.15,
  },
  SMH: {
    symbol: "SMH",
    label: "Semiconductors",
    annualReturn: 13,
    dividendYield: 0.9,
    dividendGrowth: 9,
    expenseRatio: 0.35,
  },
  VGT: {
    symbol: "VGT",
    label: "Tech Sector",
    annualReturn: 11,
    dividendYield: 0.65,
    dividendGrowth: 7,
    expenseRatio: 0.1,
  },
  GLD: {
    symbol: "GLD",
    label: "Gold",
    annualReturn: 6.5,
    dividendYield: 0,
    dividendGrowth: 0,
    expenseRatio: 0.4,
  },
} as const;

type EtfKey = keyof typeof ETF_PRESETS;

type Inputs = {
  initial: string;
  monthly: string;
  years: string;
  annualReturn: string;
  dividendYield: string;
  dividendGrowth: string;
  expenseRatio: string;
  etf: EtfKey;
  drip: boolean;
};

type YearPoint = {
  year: number;
  invested: number;
  totalValue: number;
};

type CalculationResult = {
  etf: (typeof ETF_PRESETS)[EtfKey];
  finalBalance: number;
  totalInvested: number;
  capitalGain: number;
  totalDividends: number;
  annualDividendIncome: number;
  annualizedReturn: number;
  yieldOnCost: number;
  totalReturnPct: number;
  yearlyData: YearPoint[];
};

function createInputsFromPreset(etf: EtfKey, base?: Partial<Inputs>): Inputs {
  const preset = ETF_PRESETS[etf];

  return {
    initial: base?.initial ?? "10000",
    monthly: base?.monthly ?? "500",
    years: base?.years ?? "10",
    annualReturn: base?.annualReturn ?? String(preset.annualReturn),
    dividendYield: base?.dividendYield ?? String(preset.dividendYield),
    dividendGrowth: base?.dividendGrowth ?? String(preset.dividendGrowth),
    expenseRatio: base?.expenseRatio ?? String(preset.expenseRatio),
    etf,
    drip: base?.drip ?? true,
  };
}

const initialInputs = createInputsFromPreset("SPY");

function toNumber(value: string) {
  return Number(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value: number) {
  if (value === 0) {
    return "$0";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildChartPath(
  data: YearPoint[],
  key: "totalValue" | "invested",
  maxValue: number,
  width: number,
  height: number,
) {
  if (data.length === 0 || maxValue <= 0) {
    return "";
  }

  return data
    .map((point, index) => {
      const x = data.length === 1 ? 0 : (index / (data.length - 1)) * width;
      const y = height - (point[key] / maxValue) * height;

      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function buildAreaPath(data: YearPoint[], maxValue: number, width: number, height: number) {
  if (data.length === 0 || maxValue <= 0) {
    return "";
  }

  const linePath = buildChartPath(data, "totalValue", maxValue, width, height);
  return `${linePath} L ${width} ${height} L 0 ${height} Z`;
}

function calculateProjection(inputs: Inputs): CalculationResult | null {
  const initial = toNumber(inputs.initial);
  const monthly = toNumber(inputs.monthly);
  const years = toNumber(inputs.years);
  const annualReturn = toNumber(inputs.annualReturn);
  const dividendYield = toNumber(inputs.dividendYield);
  const dividendGrowth = toNumber(inputs.dividendGrowth);
  const expenseRatio = toNumber(inputs.expenseRatio);

  if (
    !Number.isFinite(initial) ||
    !Number.isFinite(monthly) ||
    !Number.isFinite(years) ||
    !Number.isFinite(annualReturn) ||
    !Number.isFinite(dividendYield) ||
    !Number.isFinite(dividendGrowth) ||
    !Number.isFinite(expenseRatio) ||
    initial < 0 ||
    monthly < 0 ||
    years <= 0
  ) {
    return null;
  }

  let portfolioValue = initial;
  let dividendCash = 0;
  let totalInvested = initial;
  let currentDividendYield = dividendYield / 100;
  let totalDividends = 0;
  let annualDividendIncome = 0;
  const monthlyRate = (annualReturn - expenseRatio) / 100 / 12;
  const yearlyData: YearPoint[] = [{ year: 0, invested: totalInvested, totalValue: initial }];

  for (let year = 1; year <= years; year += 1) {
    for (let month = 0; month < 12; month += 1) {
      portfolioValue *= 1 + monthlyRate;
      portfolioValue += monthly;
      totalInvested += monthly;
    }

    annualDividendIncome = portfolioValue * currentDividendYield;
    totalDividends += annualDividendIncome;

    if (inputs.drip) {
      portfolioValue += annualDividendIncome;
    } else {
      dividendCash += annualDividendIncome;
    }

    currentDividendYield *= 1 + dividendGrowth / 100;

    yearlyData.push({
      year,
      invested: totalInvested,
      totalValue: portfolioValue + dividendCash,
    });
  }

  const finalBalance = portfolioValue + dividendCash;
  const capitalGain = finalBalance - totalInvested - totalDividends;
  const annualizedReturn = (Math.pow(finalBalance / totalInvested, 1 / years) - 1) * 100;
  const yieldOnCost = totalInvested > 0 ? (annualDividendIncome / totalInvested) * 100 : 0;
  const totalReturnPct = totalInvested > 0 ? ((finalBalance - totalInvested) / totalInvested) * 100 : 0;

  return {
    etf: ETF_PRESETS[inputs.etf],
    finalBalance,
    totalInvested,
    capitalGain,
    totalDividends,
    annualDividendIncome,
    annualizedReturn,
    yieldOnCost,
    totalReturnPct,
    yearlyData,
  };
}

export function InvestmentCalc() {
  const [draftInputs, setDraftInputs] = useState<Inputs>(initialInputs);
  const [inputs, setInputs] = useState<Inputs>(initialInputs);

  const result = useMemo(() => calculateProjection(inputs), [inputs]);
  const maxBalance = result
    ? Math.max(...result.yearlyData.map((item) => Math.max(item.totalValue, item.invested)))
    : 0;
  const chartWidth = 560;
  const chartHeight = 220;
  const balanceLinePath = result
    ? buildChartPath(result.yearlyData, "totalValue", maxBalance, chartWidth, chartHeight)
    : "";
  const investedLinePath = result
    ? buildChartPath(result.yearlyData, "invested", maxBalance, chartWidth, chartHeight)
    : "";
  const balanceAreaPath = result
    ? buildAreaPath(result.yearlyData, maxBalance, chartWidth, chartHeight)
    : "";

  function updateDraftField<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    setDraftInputs((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(etf: EtfKey) {
    setDraftInputs((current) =>
      createInputsFromPreset(etf, {
        ...current,
        initial: current.initial,
        monthly: current.monthly,
        years: current.years,
        drip: current.drip,
      }),
    );
  }

  return (
    <div className="mi-invest-shell">
      <div className="mi-calculator-head mi-invest-head">
        <span className="mi-badge">Analisis de Inversiones</span>
        <h1 className="mi-section-title">
          Investment <span className="mi-text-gradient">Calculator</span>
        </h1>
        <p className="mi-page-copy">
          Simula el crecimiento de tu inversion con datos reales de los principales ETFs
          del mercado.
        </p>
      </div>

      <div className="mi-invest-layout">
        <form
          className="mi-invest-panel mi-invest-form-panel"
          onSubmit={(event) => {
            event.preventDefault();
            setInputs(draftInputs);
          }}
        >
          <div className="mi-invest-form-copy">
            <span>Selecciona un activo</span>
          </div>

          <div className="mi-invest-etf-grid">
            {Object.values(ETF_PRESETS).map((preset) => {
              const isActive = draftInputs.etf === preset.symbol;

              return (
                <button
                  key={preset.symbol}
                  type="button"
                  className={`mi-invest-etf-card ${isActive ? "is-active" : ""}`}
                  onClick={() => applyPreset(preset.symbol)}
                >
                  <strong>{preset.symbol}</strong>
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mi-invest-form-grid">
            <label className="mi-calc-field mi-calc-field-full">
              <span>Inversion inicial ($)</span>
              <input
                type="number"
                min="0"
                step="100"
                value={draftInputs.initial}
                onChange={(event) => updateDraftField("initial", event.target.value)}
              />
            </label>

            <label className="mi-calc-field mi-calc-field-full">
              <span>Aportacion mensual ($)</span>
              <input
                type="number"
                min="0"
                step="50"
                value={draftInputs.monthly}
                onChange={(event) => updateDraftField("monthly", event.target.value)}
              />
            </label>

            <label className="mi-calc-field">
              <span>Periodo (anos)</span>
              <input
                type="number"
                min="1"
                max="50"
                step="1"
                value={draftInputs.years}
                onChange={(event) => updateDraftField("years", event.target.value)}
              />
            </label>

            <label className="mi-calc-field">
              <span>Retorno anual (%)</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={draftInputs.annualReturn}
                onChange={(event) => updateDraftField("annualReturn", event.target.value)}
              />
            </label>

            <label className="mi-calc-field">
              <span>Dividend yield (%)</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={draftInputs.dividendYield}
                onChange={(event) => updateDraftField("dividendYield", event.target.value)}
              />
            </label>

            <label className="mi-calc-field">
              <span>Div. increase anual (%)</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={draftInputs.dividendGrowth}
                onChange={(event) => updateDraftField("dividendGrowth", event.target.value)}
              />
            </label>

            <label className="mi-calc-field">
              <span>Expense ratio (%)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={draftInputs.expenseRatio}
                onChange={(event) => updateDraftField("expenseRatio", event.target.value)}
              />
            </label>

            <label className="mi-invest-toggle">
              <span>Reinvertir dividendos (DRIP)</span>
              <span className="mi-invest-toggle-row">
                <span className={`mi-invest-switch ${draftInputs.drip ? "is-on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={draftInputs.drip}
                    onChange={(event) => updateDraftField("drip", event.target.checked)}
                  />
                  <span className="mi-invest-switch-track" />
                </span>
                <strong>{draftInputs.drip ? "Si" : "No"}</strong>
              </span>
            </label>
          </div>

          <button type="submit" className="mi-btn-gold mi-invest-submit">
            Calcular Proyeccion
          </button>
        </form>

        {result ? (
          <div className="mi-invest-results">
            <section className="mi-invest-result-hero">
              <span className="mi-calc-result-label">Balance final proyectado</span>
              <strong className="mi-invest-result-hero-value">
                {formatCurrency(result.finalBalance)}
              </strong>
              <span className="mi-invest-result-hero-note">
                Retorno Total: +{result.totalReturnPct.toFixed(1)}%
              </span>
            </section>

            <div className="mi-invest-stats-grid">
              <article className="mi-calc-result-item">
                <span className="mi-calc-result-label">Total invertido</span>
                <strong className="mi-calc-result-value mi-invest-value-neutral">
                  {formatCurrency(result.totalInvested)}
                </strong>
              </article>

              <article className="mi-calc-result-item">
                <span className="mi-calc-result-label">Ganancia por precio</span>
                <strong className="mi-calc-result-value mi-calc-result-tone-green">
                  +{formatCurrency(result.capitalGain)}
                </strong>
              </article>

              <article className="mi-calc-result-item">
                <span className="mi-calc-result-label">Total dividendos</span>
                <strong className="mi-calc-result-value mi-calc-result-tone-green">
                  +{formatCurrency(result.totalDividends)}
                </strong>
              </article>

              <article className="mi-calc-result-item">
                <span className="mi-calc-result-label">Ingreso anual dividendos</span>
                <strong className="mi-calc-result-value mi-invest-value-neutral">
                  {formatCurrency(result.annualDividendIncome)}/yr
                </strong>
              </article>

              <article className="mi-calc-result-item">
                <span className="mi-calc-result-label">Retorno anual promedio</span>
                <strong className="mi-calc-result-value mi-invest-value-neutral">
                  {result.annualizedReturn.toFixed(1)}%
                </strong>
              </article>

              <article className="mi-calc-result-item">
                <span className="mi-calc-result-label">Yield on cost</span>
                <strong className="mi-calc-result-value mi-invest-value-neutral">
                  {result.yieldOnCost.toFixed(2)}%
                </strong>
              </article>
            </div>

            <section className="mi-invest-chart-card">
              <div className="mi-invest-chart-head">
                <span className="mi-calc-result-label">Proyeccion de crecimiento</span>
              </div>

              <div className="mi-invest-chart-svg-shell">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight + 24}`}
                  className="mi-invest-chart-svg"
                  role="img"
                  aria-label={`Proyeccion de crecimiento para ${result.etf.symbol}`}
                >
                  <defs>
                    <linearGradient id="mi-invest-balance-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(214, 179, 83, 0.42)" />
                      <stop offset="100%" stopColor="rgba(214, 179, 83, 0.02)" />
                    </linearGradient>
                  </defs>

                  {[0.25, 0.5, 0.75, 1].map((tick) => {
                    const y = chartHeight - chartHeight * tick;

                    return (
                      <line
                        key={tick}
                        x1="0"
                        y1={y}
                        x2={chartWidth}
                        y2={y}
                        className="mi-invest-grid-line"
                      />
                    );
                  })}

                  {balanceAreaPath ? (
                    <path d={balanceAreaPath} className="mi-invest-balance-area" />
                  ) : null}
                  {investedLinePath ? (
                    <path d={investedLinePath} className="mi-invest-invested-line" />
                  ) : null}
                  {balanceLinePath ? (
                    <path d={balanceLinePath} className="mi-invest-balance-line" />
                  ) : null}
                </svg>

                <div className="mi-invest-chart-y-axis">
                  {[1, 0.75, 0.5, 0.25, 0].map((tick) => (
                    <span key={tick}>{formatCompactCurrency(maxBalance * tick)}</span>
                  ))}
                </div>

                <div className="mi-invest-chart-x-axis">
                  {result.yearlyData.map((point) => (
                    <span key={point.year}>Ano {point.year}</span>
                  ))}
                </div>
              </div>

              <div className="mi-invest-chart-legend">
                <span className="mi-invest-legend-item mi-invest-legend-balance">Balance</span>
                <span className="mi-invest-legend-item mi-invest-legend-invested">Invertido</span>
              </div>
            </section>

            <p className="mi-calc-footnote">
              * Los retornos pasados no garantizan resultados futuros. Esta calculadora es
              solo con fines educativos y no constituye asesoramiento financiero.
            </p>
          </div>
        ) : (
          <p className="mi-form-error">Completa todos los campos para generar la proyeccion.</p>
        )}
      </div>
    </div>
  );
}
