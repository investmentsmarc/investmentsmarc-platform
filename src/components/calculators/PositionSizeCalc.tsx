"use client";

import { useMemo, useState } from "react";

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type PositionSizeInputs = {
  capital: string;
  risk: string;
  entry: string;
  stop: string;
};

type InvalidResult = {
  isValid: false;
  error: string;
};

type ValidResult = {
  isValid: true;
  riskUsd: number;
  diff: number;
  shares: number;
  positionValue: number;
  stopDistance: string;
};

const initialInputs: PositionSizeInputs = {
  capital: "10000",
  risk: "1",
  entry: "100",
  stop: "95",
};

export function PositionSizeCalc() {
  const [inputs, setInputs] = useState<PositionSizeInputs>(initialInputs);

  const result = useMemo(() => {
    const capital = Number(inputs.capital);
    const risk = Number(inputs.risk);
    const entry = Number(inputs.entry);
    const stop = Number(inputs.stop);

    if (!capital || !risk || !entry || !stop) {
      return {
        isValid: false,
        error: "Completa todos los campos con valores mayores a 0.",
      } satisfies InvalidResult;
    }

    if (entry === stop) {
      return {
        isValid: false,
        error: "El precio de entrada y el stop loss no pueden ser iguales.",
      } satisfies InvalidResult;
    }

    const riskUsd = capital * (risk / 100);
    const diff = Math.abs(entry - stop);
    const shares = Math.floor(riskUsd / diff);
    const positionValue = shares * entry;
    const stopDistance = ((diff / entry) * 100).toFixed(2);

    return {
      isValid: true,
      riskUsd,
      diff,
      shares,
      positionValue,
      stopDistance,
    } satisfies ValidResult;
  }, [inputs]) satisfies InvalidResult | ValidResult;

  const handleChange = (field: keyof PositionSizeInputs, value: string) => {
    setInputs((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="mi-calculator-shell">
      <div className="mi-calculator-card">
        <div className="mi-calculator-head">
          <span className="mi-badge">Gestion de Riesgo</span>
          <h1 className="mi-section-title">
            Position Size <span className="mi-text-gradient">Calculator</span>
          </h1>
          <p className="mi-page-copy">
            Calcula el tamano exacto de tu posicion en funcion de tu capital, riesgo
            y distancia al stop. Portado desde la logica original de WordPress.
          </p>
        </div>

        <div className="mi-calculator-grid">
          <label className="mi-calc-field">
            <span>Capital de la Cuenta ($)</span>
            <input
              type="number"
              min="0"
              step="100"
              value={inputs.capital}
              onChange={(event) => handleChange("capital", event.target.value)}
            />
          </label>

          <label className="mi-calc-field">
            <span>Riesgo por Operacion (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={inputs.risk}
              onChange={(event) => handleChange("risk", event.target.value)}
            />
          </label>

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
        </div>

        {result.isValid ? (
          <>
            <div className="mi-calc-results">
              <div className="mi-calc-result-item">
                <span className="mi-calc-result-label">Tamano de Posicion</span>
                <strong className="mi-calc-result-value">{result.shares} acciones</strong>
              </div>
              <div className="mi-calc-result-item">
                <span className="mi-calc-result-label">Valor de la Posicion</span>
                <strong className="mi-calc-result-value">
                  ${numberFormatter.format(result.positionValue)}
                </strong>
              </div>
              <div className="mi-calc-result-item">
                <span className="mi-calc-result-label">Riesgo en $</span>
                <strong className="mi-calc-result-value">
                  ${numberFormatter.format(result.riskUsd)}
                </strong>
              </div>
              <div className="mi-calc-result-item">
                <span className="mi-calc-result-label">Distancia al Stop</span>
                <strong className="mi-calc-result-value">{result.stopDistance}%</strong>
              </div>
            </div>

            <p className="mi-calc-footnote">
              Ejemplo de validacion de la spec: con capital de $10,000, riesgo 1%,
              entrada $150 y stop $145, el resultado esperado es 20 acciones.
            </p>
          </>
        ) : (
          <p className="mi-form-error">{result.error}</p>
        )}
      </div>
    </div>
  );
}
