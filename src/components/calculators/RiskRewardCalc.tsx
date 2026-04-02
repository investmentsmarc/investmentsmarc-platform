"use client";

import { useMemo, useState } from "react";

type Inputs = {
  entry: string;
  stop: string;
  target: string;
};

type InvalidResult = {
  isValid: false;
  error: string;
};

type ValidResult = {
  isValid: true;
  risk: number;
  reward: number;
  ratio: number;
  riskPct: number;
  rewardPct: number;
  verdict: string;
  tone: "red" | "amber" | "gold" | "green";
};

const initialInputs: Inputs = {
  entry: "100",
  stop: "95",
  target: "110",
};

export function RiskRewardCalc() {
  const [inputs, setInputs] = useState<Inputs>(initialInputs);

  const result = useMemo(() => {
    const entry = Number(inputs.entry);
    const stop = Number(inputs.stop);
    const target = Number(inputs.target);

    if (!entry || !stop || !target) {
      return {
        isValid: false,
        error: "Completa todos los campos con valores mayores a 0.",
      } satisfies InvalidResult;
    }

    const stopSide = Math.sign(stop - entry);
    const targetSide = Math.sign(target - entry);

    if (stop === entry || target === entry) {
      return {
        isValid: false,
        error: "Stop loss y take profit deben ser distintos al precio de entrada.",
      } satisfies InvalidResult;
    }

    if (stopSide === targetSide) {
      return {
        isValid: false,
        error: "El stop y el take profit deben quedar en lados opuestos de la entrada.",
      } satisfies InvalidResult;
    }

    const risk = Math.abs(entry - stop);
    const reward = Math.abs(target - entry);
    const ratio = reward / risk;
    const totalRange = risk + reward;
    const riskPct = Number(((risk / totalRange) * 100).toFixed(1));
    const rewardPct = Number(((reward / totalRange) * 100).toFixed(1));

    let verdict = "Evitar";
    let tone: ValidResult["tone"] = "red";

    if (ratio >= 3) {
      verdict = "Excelente";
      tone = "green";
    } else if (ratio >= 2) {
      verdict = "Bueno";
      tone = "gold";
    } else if (ratio >= 1) {
      verdict = "Aceptable";
      tone = "amber";
    }

    return {
      isValid: true,
      risk,
      reward,
      ratio,
      riskPct,
      rewardPct,
      verdict,
      tone,
    } satisfies ValidResult;
  }, [inputs]) satisfies InvalidResult | ValidResult;

  const handleChange = (field: keyof Inputs, value: string) => {
    setInputs((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="mi-calculator-shell">
      <div className="mi-calculator-card">
        <div className="mi-calculator-head">
          <span className="mi-badge">Analisis de Operacion</span>
          <h1 className="mi-section-title">
            Risk / Reward <span className="mi-text-gradient">Calculator</span>
          </h1>
          <p className="mi-page-copy">
            Evalua si una operacion vale la pena antes de ejecutarla. Esta version
            replica la logica del WordPress original y añade un veredicto visual.
          </p>
        </div>

        <div className="mi-calculator-grid">
          <label className="mi-calc-field">
            <span>Precio de Entrada ($)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={inputs.entry}
              onChange={(event) => handleChange("entry", event.target.value)}
            />
          </label>

          <label className="mi-calc-field">
            <span>Precio de Stop Loss ($)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={inputs.stop}
              onChange={(event) => handleChange("stop", event.target.value)}
            />
          </label>

          <label className="mi-calc-field mi-calc-field-full">
            <span>Precio de Take Profit ($)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={inputs.target}
              onChange={(event) => handleChange("target", event.target.value)}
            />
          </label>
        </div>

        {result.isValid ? (
          <>
            <div className="mi-rr-visual">
              <div className="mi-rr-bar">
                <div className="mi-rr-risk-zone" style={{ width: `${result.riskPct}%` }} />
                <div className="mi-rr-reward-zone" style={{ width: `${result.rewardPct}%` }} />
              </div>
              <div className="mi-rr-scale">
                <span>Riesgo</span>
                <span>Reward</span>
              </div>
            </div>

            <div className="mi-calc-results">
              <div className="mi-calc-result-item">
                <span className="mi-calc-result-label">Riesgo por unidad</span>
                <strong className="mi-calc-result-value">${result.risk.toFixed(2)}</strong>
              </div>
              <div className="mi-calc-result-item">
                <span className="mi-calc-result-label">Reward por unidad</span>
                <strong className="mi-calc-result-value">${result.reward.toFixed(2)}</strong>
              </div>
              <div className="mi-calc-result-item">
                <span className="mi-calc-result-label">Ratio</span>
                <strong className="mi-calc-result-value">1 : {result.ratio.toFixed(2)}</strong>
              </div>
              <div className={`mi-calc-result-item mi-calc-result-tone-${result.tone}`}>
                <span className="mi-calc-result-label">Veredicto</span>
                <strong className="mi-calc-result-value">{result.verdict}</strong>
              </div>
            </div>
          </>
        ) : (
          <p className="mi-form-error">{result.error}</p>
        )}
      </div>
    </div>
  );
}
