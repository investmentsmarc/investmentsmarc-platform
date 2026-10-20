"use client";

import { useMemo, useState } from "react";

// Réplica del sistema de cálculo del video "I Calculated Tesla Robotaxi
// Profits and They're INSANE" (youtu.be/KrMCXTtbzwA, abr-2026): enganche →
// financiamiento → ingreso por milla → comisión de plataforma → costos
// operativos → flujo de caja → retorno sobre el enganche → reinversión en más
// autos. Cada supuesto es editable y trae su fuente y nivel de confianza en
// docs/research/robotaxi-cybercab-2026.md.

const VEHICLE_PRESETS = {
  cybercab: {
    key: "cybercab",
    label: "Cybercab",
    sub: "Objetivo ≤ $30K",
    price: 30000,
    fees: 0,
    kwhPerMile: 0.185,
  },
  modelYStd: {
    key: "modelYStd",
    label: "Model Y",
    sub: "Standard RWD",
    price: 39990,
    fees: 1640,
    kwhPerMile: 0.28,
  },
  modelYLR: {
    key: "modelYLR",
    label: "Model Y",
    sub: "Long Range AWD",
    price: 48990,
    fees: 1640,
    kwhPerMile: 0.28,
  },
  model3Std: {
    key: "model3Std",
    label: "Model 3",
    sub: "Standard RWD",
    price: 36990,
    fees: 1640,
    kwhPerMile: 0.25,
  },
} as const;

type VehicleKey = keyof typeof VEHICLE_PRESETS;
type VehicleSelection = VehicleKey | "custom";
type Platform = "tesla" | "uber-av" | "uber-fleet";
type ScenarioKey = "conservador" | "base" | "video";

const PLATFORM_OPTIONS: { key: Platform; label: string; sub: string; cut: number }[] = [
  { key: "tesla", label: "Red Robotaxi Tesla", sub: "Autónomo · abre 2027+", cut: 25 },
  { key: "uber-av", label: "Uber autónomo", sub: "Hipotético · sin acuerdo", cut: 30 },
  { key: "uber-fleet", label: "Uber Fleet", sub: "Renta a conductor · hoy", cut: 0 },
];

const SCENARIOS: Record<
  ScenarioKey,
  {
    label: string;
    sub: string;
    paidMilesPerDay: string;
    perMileFare: string;
    baseFare: string;
    platformCut: string;
    insurance: string;
    deadheadPct: string;
  }
> = {
  conservador: {
    label: "Conservador",
    sub: "60 mi/día · 30 %",
    paidMilesPerDay: "60",
    perMileFare: "1.00",
    baseFare: "3.00",
    platformCut: "30",
    insurance: "450",
    deadheadPct: "35",
  },
  base: {
    label: "Base",
    sub: "100 mi/día · 25 %",
    paidMilesPerDay: "100",
    perMileFare: "1.40",
    baseFare: "3.00",
    platformCut: "25",
    insurance: "350",
    deadheadPct: "30",
  },
  video: {
    label: "Agresivo",
    sub: "150 mi/día · 25 %",
    paidMilesPerDay: "150",
    perMileFare: "1.40",
    baseFare: "3.00",
    platformCut: "25",
    insurance: "250",
    deadheadPct: "25",
  },
};

type Inputs = {
  vehicle: VehicleSelection;
  scenario: ScenarioKey | null;
  platform: Platform;
  price: string;
  fees: string;
  down: string;
  apr: string;
  termMonths: string;
  fsd: string;
  platformCut: string;
  paidMilesPerDay: string;
  avgTripMiles: string;
  baseFare: string;
  perMileFare: string;
  daysPerMonth: string;
  deadheadPct: string;
  kwhPerMile: string;
  pricePerKwh: string;
  maintPerMile: string;
  insurance: string;
  cleaning: string;
  weeklyRent: string;
  driverMilesPerDay: string;
  fleetSize: string;
  horizonMonths: string;
  depreciationPct: string;
  reinvest: boolean;
};

const initialInputs: Inputs = {
  vehicle: "modelYStd",
  scenario: "base",
  platform: "tesla",
  price: String(VEHICLE_PRESETS.modelYStd.price),
  fees: String(VEHICLE_PRESETS.modelYStd.fees),
  down: "6000",
  apr: "1.49",
  termMonths: "72",
  fsd: "99",
  platformCut: SCENARIOS.base.platformCut,
  paidMilesPerDay: SCENARIOS.base.paidMilesPerDay,
  avgTripMiles: "5",
  baseFare: SCENARIOS.base.baseFare,
  perMileFare: SCENARIOS.base.perMileFare,
  daysPerMonth: "30",
  deadheadPct: SCENARIOS.base.deadheadPct,
  kwhPerMile: String(VEHICLE_PRESETS.modelYStd.kwhPerMile),
  pricePerKwh: "0.35",
  maintPerMile: "0.05",
  insurance: SCENARIOS.base.insurance,
  cleaning: "100",
  weeklyRent: "300",
  driverMilesPerDay: "150",
  fleetSize: "1",
  horizonMonths: "60",
  depreciationPct: "20",
  reinvest: true,
};

type MonthPoint = {
  month: number;
  cash: number;
  cars: number;
};

type UnitEconomics = {
  tripsPerDay: number;
  grossMonth: number;
  platformFee: number;
  netRevenue: number;
  totalMiles: number;
  energyCost: number;
  maintCost: number;
  fixedCosts: number;
  opex: number;
  operatingProfit: number;
  principal: number;
  monthlyPayment: number;
  cashFlow: number;
  cashOnCash: number | null;
  paybackMonths: number | null;
  breakEvenMiles: number | null;
  revenuePerPaidMile: number | null;
  costPerPaidMile: number | null;
  roiOnVehicle: number;
  depreciationMonth: number;
  fleet: MonthPoint[];
  finalCars: number;
  finalCash: number;
};

type CalcResult = { isValid: true; data: UnitEconomics } | { isValid: false; error: string };

const MAX_FLEET = 500;

function toNumber(value: string) {
  return Number(value);
}

function formatCurrency(value: number, digits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
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
    maximumFractionDigits: 1,
  }).format(value);
}

function formatPct(value: number, digits = 0) {
  return `${value >= 0 ? "" : "-"}${Math.abs(value).toFixed(digits)}%`;
}

function monthlyPaymentFor(principal: number, aprPct: number, months: number) {
  if (principal <= 0 || months <= 0) {
    return 0;
  }

  const rate = aprPct / 100 / 12;

  if (rate === 0) {
    return principal / months;
  }

  return (principal * rate) / (1 - Math.pow(1 + rate, -months));
}

function firstYearInterest(principal: number, aprPct: number, months: number, payment: number) {
  const rate = aprPct / 100 / 12;
  let balance = principal;
  let interest = 0;

  for (let month = 0; month < Math.min(12, months); month += 1) {
    const monthInterest = balance * rate;
    interest += monthInterest;
    balance -= payment - monthInterest;
  }

  return interest;
}

function simulateFleet(
  initialCars: number,
  horizon: number,
  operatingProfit: number,
  payment: number,
  termMonths: number,
  down: number,
  reinvest: boolean,
): MonthPoint[] {
  const purchases: number[] = Array.from({ length: initialCars }, () => 0);
  const points: MonthPoint[] = [{ month: 0, cash: 0, cars: initialCars }];
  let cash = 0;

  for (let month = 1; month <= horizon; month += 1) {
    let flow = 0;

    for (const purchaseMonth of purchases) {
      const age = month - purchaseMonth;
      const activeLoan = age <= termMonths ? payment : 0;
      flow += operatingProfit - activeLoan;
    }

    cash += flow;

    if (reinvest && down > 0 && flow > 0) {
      while (cash >= down && purchases.length < MAX_FLEET) {
        cash -= down;
        purchases.push(month);
      }
    }

    points.push({ month, cash, cars: purchases.length });
  }

  return points;
}

function calculate(inputs: Inputs): CalcResult {
  const price = toNumber(inputs.price);
  const fees = toNumber(inputs.fees);
  const down = toNumber(inputs.down);
  const apr = toNumber(inputs.apr);
  const termMonths = Math.round(toNumber(inputs.termMonths));
  const fsd = toNumber(inputs.fsd);
  const platformCut = toNumber(inputs.platformCut);
  const paidMilesPerDay = toNumber(inputs.paidMilesPerDay);
  const avgTripMiles = toNumber(inputs.avgTripMiles);
  const baseFare = toNumber(inputs.baseFare);
  const perMileFare = toNumber(inputs.perMileFare);
  const daysPerMonth = toNumber(inputs.daysPerMonth);
  const deadheadPct = toNumber(inputs.deadheadPct);
  const kwhPerMile = toNumber(inputs.kwhPerMile);
  const pricePerKwh = toNumber(inputs.pricePerKwh);
  const maintPerMile = toNumber(inputs.maintPerMile);
  const insurance = toNumber(inputs.insurance);
  const cleaning = toNumber(inputs.cleaning);
  const weeklyRent = toNumber(inputs.weeklyRent);
  const driverMilesPerDay = toNumber(inputs.driverMilesPerDay);
  const fleetSize = Math.round(toNumber(inputs.fleetSize));
  const horizonMonths = Math.round(toNumber(inputs.horizonMonths));
  const depreciationPct = toNumber(inputs.depreciationPct);

  const values = [
    price,
    fees,
    down,
    apr,
    termMonths,
    fsd,
    platformCut,
    paidMilesPerDay,
    avgTripMiles,
    baseFare,
    perMileFare,
    daysPerMonth,
    deadheadPct,
    kwhPerMile,
    pricePerKwh,
    maintPerMile,
    insurance,
    cleaning,
    weeklyRent,
    driverMilesPerDay,
    fleetSize,
    horizonMonths,
    depreciationPct,
  ];

  if (values.some((value) => !Number.isFinite(value) || value < 0)) {
    return { isValid: false, error: "Completa todos los campos con valores válidos (0 o mayores)." };
  }

  if (price <= 0 || daysPerMonth <= 0 || daysPerMonth > 31) {
    return { isValid: false, error: "El precio debe ser mayor a 0 y los días operativos entre 1 y 31." };
  }

  if (down > price + fees) {
    return { isValid: false, error: "El enganche no puede superar el precio del vehículo más cargos." };
  }

  if (fleetSize < 1 || fleetSize > 50 || horizonMonths < 12 || horizonMonths > 120) {
    return {
      isValid: false,
      error: "Flota inicial entre 1 y 50 vehículos; horizonte entre 12 y 120 meses.",
    };
  }

  if (inputs.platform !== "uber-fleet" && (avgTripMiles <= 0 || platformCut >= 100)) {
    return {
      isValid: false,
      error: "Las millas por viaje deben ser mayores a 0 y la comisión menor a 100 %.",
    };
  }

  const isFleetRental = inputs.platform === "uber-fleet";
  const cut = isFleetRental ? 0 : platformCut / 100;
  const deadhead = deadheadPct / 100;

  const tripsPerDay = isFleetRental ? 0 : paidMilesPerDay / avgTripMiles;
  const grossDay = tripsPerDay * baseFare + paidMilesPerDay * perMileFare;
  const grossMonth = isFleetRental ? (weeklyRent * 52) / 12 : grossDay * daysPerMonth;
  const platformFee = grossMonth * cut;
  const netRevenue = grossMonth - platformFee;

  const totalMiles = isFleetRental
    ? driverMilesPerDay * daysPerMonth
    : paidMilesPerDay * (1 + deadhead) * daysPerMonth;
  const energyCost = isFleetRental ? 0 : totalMiles * kwhPerMile * pricePerKwh;
  const maintCost = totalMiles * maintPerMile;
  const fixedCosts = insurance + cleaning + (isFleetRental ? 0 : fsd);
  const opex = energyCost + maintCost + fixedCosts;
  const operatingProfit = netRevenue - opex;

  const principal = Math.max(price + fees - down, 0);
  const monthlyPayment = monthlyPaymentFor(principal, apr, termMonths);
  const cashFlow = operatingProfit - monthlyPayment;

  const cashOnCash = down > 0 ? ((cashFlow * 12) / down) * 100 : null;
  const paybackMonths = cashFlow > 0 && down > 0 ? down / cashFlow : null;

  const contributionPerPaidMile = isFleetRental
    ? 0
    : (baseFare / avgTripMiles + perMileFare) * (1 - cut) -
      (1 + deadhead) * (kwhPerMile * pricePerKwh + maintPerMile);
  const breakEvenMiles =
    !isFleetRental && contributionPerPaidMile > 0
      ? (fixedCosts + monthlyPayment) / (daysPerMonth * contributionPerPaidMile)
      : null;

  const paidMilesMonth = paidMilesPerDay * daysPerMonth;
  const revenuePerPaidMile = !isFleetRental && paidMilesMonth > 0 ? grossMonth / paidMilesMonth : null;
  const costPerPaidMile =
    !isFleetRental && paidMilesMonth > 0 ? (platformFee + opex + monthlyPayment) / paidMilesMonth : null;

  const vehicleCost = price + fees;
  const depreciationMonth = (vehicleCost * (depreciationPct / 100)) / 12;
  const interestYear = firstYearInterest(principal, apr, termMonths, monthlyPayment);
  const roiOnVehicle =
    vehicleCost > 0
      ? ((operatingProfit * 12 - interestYear - depreciationMonth * 12) / vehicleCost) * 100
      : 0;

  const fleet = simulateFleet(
    fleetSize,
    horizonMonths,
    operatingProfit,
    monthlyPayment,
    termMonths,
    down,
    inputs.reinvest,
  );
  const last = fleet[fleet.length - 1];

  return {
    isValid: true,
    data: {
      tripsPerDay,
      grossMonth,
      platformFee,
      netRevenue,
      totalMiles,
      energyCost,
      maintCost,
      fixedCosts,
      opex,
      operatingProfit,
      principal,
      monthlyPayment,
      cashFlow,
      cashOnCash,
      paybackMonths,
      breakEvenMiles,
      revenuePerPaidMile,
      costPerPaidMile,
      roiOnVehicle,
      depreciationMonth,
      fleet,
      finalCars: last.cars,
      finalCash: last.cash,
    },
  };
}

function buildLinePath(
  points: MonthPoint[],
  key: "cash" | "cars",
  min: number,
  max: number,
  width: number,
  height: number,
) {
  if (points.length < 2 || max <= min) {
    return "";
  }

  const span = max - min;
  const lastIndex = points.length - 1;

  return points
    .map((point, index) => {
      const x = (index / lastIndex) * width;
      const y = height - ((point[key] - min) / span) * height;

      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

type NumberFieldProps = {
  label: string;
  field: keyof Inputs;
  value: string;
  step?: string;
  min?: string;
  max?: string;
  full?: boolean;
  onChange: (field: keyof Inputs, value: string) => void;
};

function NumberField({ label, field, value, step = "1", min = "0", max, full, onChange }: NumberFieldProps) {
  return (
    <label className={`mi-calc-field ${full ? "mi-calc-field-full" : ""}`}>
      <span>{label}</span>
      <input
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
      />
    </label>
  );
}

const ASSUMPTION_SOURCES: { label: string; value: string; tag: "Seguro" | "Probable" | "Suponiendo" }[] = [
  { label: "Precio Cybercab", value: "≤ $30,000 objetivo (Musk, 2024 y 17-feb-2026); sin MSRP ni venta a particulares", tag: "Probable" },
  { label: "Precios Model Y / Model 3", value: "$39,990 / $48,990 / $36,990 + $1,390 destino + $250 orden (sep-2026)", tag: "Seguro" },
  { label: "Financiamiento Tesla", value: "1.49 % APR hasta 72 meses en Model Y (sep-2026)", tag: "Probable" },
  { label: "FSD", value: "$99/mes, solo suscripción desde el 14-feb-2026", tag: "Seguro" },
  { label: "Tarifa Robotaxi Austin", value: "$3.00 base + $1.40/milla (mar-2026); reportes de $3.25 + $1.00 en sep-2026; tarifa dinámica", tag: "Probable" },
  { label: "Comisión de Tesla", value: "25–30 % dicho en 2019; Tesla no ha publicado el porcentaje", tag: "Suponiendo" },
  { label: "Comisión de Uber", value: "Take rate ≈ 24.5 % de reservas brutas (Q2 2026); no existe acuerdo Tesla–Uber", tag: "Seguro" },
  { label: "Renta Uber Fleet", value: "$260–$330/semana por vehículo; el conductor paga la carga", tag: "Probable" },
  { label: "Consumo", value: "Model Y 0.28 kWh/mi (EPA); Cybercab 0.165 kWh/mi + ~11 % pérdida inductiva", tag: "Seguro" },
  { label: "Electricidad", value: "Supercharger $0.30–$0.50/kWh; casa ≈ $0.16/kWh; mezcla $0.35", tag: "Probable" },
  { label: "Seguro comercial", value: "Sin dato publicado; el personal promedia $320/mes en Model Y 2026", tag: "Suponiendo" },
  { label: "Millas vacías y utilización", value: "25–35 % vacías; 60–150 millas pagadas/día. Tesla no publica datos por vehículo", tag: "Suponiendo" },
  { label: "Crédito fiscal", value: "$0: el crédito federal (30D/25E/45W) terminó el 30-sep-2025", tag: "Seguro" },
  { label: "Apertura a dueños", value: "No disponible; requiere AI4/HW4 y FSD sin supervisión (2027+)", tag: "Probable" },
];

export function RobotaxiFleetCalc() {
  const [inputs, setInputs] = useState<Inputs>(initialInputs);

  const result = useMemo(() => calculate(inputs), [inputs]);

  function updateField(field: keyof Inputs, value: string) {
    setInputs((current) => {
      const next = { ...current, [field]: value };

      if (field === "price" || field === "fees" || field === "kwhPerMile") {
        next.vehicle = "custom";
      }

      if (
        field === "paidMilesPerDay" ||
        field === "perMileFare" ||
        field === "baseFare" ||
        field === "platformCut" ||
        field === "insurance" ||
        field === "deadheadPct"
      ) {
        next.scenario = null;
      }

      return next;
    });
  }

  function applyVehicle(key: VehicleKey) {
    const preset = VEHICLE_PRESETS[key];

    setInputs((current) => ({
      ...current,
      vehicle: key,
      price: String(preset.price),
      fees: String(preset.fees),
      kwhPerMile: String(preset.kwhPerMile),
    }));
  }

  function applyScenario(key: ScenarioKey) {
    const scenario = SCENARIOS[key];

    setInputs((current) => ({
      ...current,
      scenario: key,
      paidMilesPerDay: scenario.paidMilesPerDay,
      perMileFare: scenario.perMileFare,
      baseFare: scenario.baseFare,
      platformCut: current.platform === "uber-av" ? "30" : scenario.platformCut,
      insurance: scenario.insurance,
      deadheadPct: scenario.deadheadPct,
    }));
  }

  function applyPlatform(key: Platform) {
    const option = PLATFORM_OPTIONS.find((item) => item.key === key);

    setInputs((current) => ({
      ...current,
      platform: key,
      platformCut: option && option.cut > 0 ? String(option.cut) : current.platformCut,
    }));
  }

  const isFleetRental = inputs.platform === "uber-fleet";
  const chartWidth = 560;
  const chartHeight = 220;
  const chart = result.isValid
    ? (() => {
        const cashValues = result.data.fleet.map((point) => point.cash);
        const minCash = Math.min(0, ...cashValues);
        const maxCash = Math.max(...cashValues, 1);
        const maxCars = Math.max(...result.data.fleet.map((point) => point.cars), 1);
        const zeroY = chartHeight - ((0 - minCash) / (maxCash - minCash)) * chartHeight;

        return {
          minCash,
          maxCash,
          maxCars,
          zeroY,
          cashPath: buildLinePath(result.data.fleet, "cash", minCash, maxCash, chartWidth, chartHeight),
          carsPath: buildLinePath(result.data.fleet, "cars", 0, maxCars, chartWidth, chartHeight),
        };
      })()
    : null;

  const yearTicks = result.isValid
    ? Array.from({ length: Math.floor(result.data.fleet.length / 12) + 1 }, (_, index) => index)
    : [];

  return (
    <div className="mi-invest-shell mi-robotaxi-shell">
      <div className="mi-calculator-head mi-invest-head">
        <span className="mi-badge">Robotaxi &amp; Cybercab</span>
        <h1 className="mi-section-title">
          Robotaxi Fleet <span className="mi-text-gradient">Calculator</span>
        </h1>
        <p className="mi-page-copy">
          El sistema de cálculo de los videos de “profits insane”, con cada supuesto a la vista:
          enganche, crédito, tarifa por milla, comisión de la plataforma, costos reales y la bola
          de nieve de reinvertir en más autos.
        </p>
      </div>

      <div className="mi-invest-layout">
        <form className="mi-invest-panel mi-invest-form-panel" onSubmit={(event) => event.preventDefault()}>
          <div className="mi-robotaxi-section">
            <span>Escenario</span>
          </div>
          <div className="mi-robotaxi-chips">
            {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => {
              const scenario = SCENARIOS[key];
              const isActive = inputs.scenario === key;

              return (
                <button
                  key={key}
                  type="button"
                  className={`mi-robotaxi-chip ${isActive ? "is-active" : ""}`}
                  onClick={() => applyScenario(key)}
                  disabled={isFleetRental}
                >
                  <strong>{scenario.label}</strong>
                  <span>{scenario.sub}</span>
                </button>
              );
            })}
          </div>

          <div className="mi-robotaxi-section">
            <span>Vehículo</span>
          </div>
          <div className="mi-invest-etf-grid mi-robotaxi-vehicles">
            {Object.values(VEHICLE_PRESETS).map((preset) => {
              const isActive = inputs.vehicle === preset.key;

              return (
                <button
                  key={preset.key}
                  type="button"
                  className={`mi-invest-etf-card ${isActive ? "is-active" : ""}`}
                  onClick={() => applyVehicle(preset.key)}
                >
                  <strong>{preset.label}</strong>
                  <span>{preset.sub}</span>
                </button>
              );
            })}
          </div>

          <div className="mi-robotaxi-section">
            <span>Plataforma</span>
          </div>
          <div className="mi-robotaxi-chips mi-robotaxi-platforms">
            {PLATFORM_OPTIONS.map((option) => {
              const isActive = inputs.platform === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  className={`mi-robotaxi-chip ${isActive ? "is-active" : ""}`}
                  onClick={() => applyPlatform(option.key)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.sub}</span>
                </button>
              );
            })}
          </div>

          <div className="mi-robotaxi-section">
            <span>Compra y financiamiento</span>
          </div>
          <div className="mi-invest-form-grid">
            <NumberField label="Precio del vehículo ($)" field="price" value={inputs.price} step="500" onChange={updateField} />
            <NumberField label="Destino + orden ($)" field="fees" value={inputs.fees} step="10" onChange={updateField} />
            <NumberField label="Enganche ($)" field="down" value={inputs.down} step="500" onChange={updateField} />
            <NumberField label="APR (%)" field="apr" value={inputs.apr} step="0.01" onChange={updateField} />
            <NumberField label="Plazo (meses)" field="termMonths" value={inputs.termMonths} min="1" max="96" onChange={updateField} />
            {isFleetRental ? null : (
              <NumberField label="FSD ($/mes)" field="fsd" value={inputs.fsd} step="1" onChange={updateField} />
            )}
          </div>

          <div className="mi-robotaxi-section">
            <span>{isFleetRental ? "Renta al conductor" : "Ingresos por viaje"}</span>
          </div>
          <div className="mi-invest-form-grid">
            {isFleetRental ? (
              <>
                <NumberField label="Renta semanal ($)" field="weeklyRent" value={inputs.weeklyRent} step="10" onChange={updateField} />
                <NumberField label="Millas del conductor / día" field="driverMilesPerDay" value={inputs.driverMilesPerDay} step="10" onChange={updateField} />
                <NumberField label="Días operativos / mes" field="daysPerMonth" value={inputs.daysPerMonth} min="1" max="31" onChange={updateField} />
              </>
            ) : (
              <>
                <NumberField label="Millas pagadas / día" field="paidMilesPerDay" value={inputs.paidMilesPerDay} step="5" onChange={updateField} />
                <NumberField label="Millas por viaje" field="avgTripMiles" value={inputs.avgTripMiles} step="0.5" onChange={updateField} />
                <NumberField label="Tarifa base ($/viaje)" field="baseFare" value={inputs.baseFare} step="0.25" onChange={updateField} />
                <NumberField label="Tarifa por milla ($)" field="perMileFare" value={inputs.perMileFare} step="0.05" onChange={updateField} />
                <NumberField label="Días operativos / mes" field="daysPerMonth" value={inputs.daysPerMonth} min="1" max="31" onChange={updateField} />
                <NumberField label="Comisión plataforma (%)" field="platformCut" value={inputs.platformCut} step="1" max="99" onChange={updateField} />
                <NumberField label="Millas vacías (%)" field="deadheadPct" value={inputs.deadheadPct} step="5" onChange={updateField} />
              </>
            )}
          </div>

          <div className="mi-robotaxi-section">
            <span>Costos operativos</span>
          </div>
          <div className="mi-invest-form-grid">
            {isFleetRental ? null : (
              <>
                <NumberField label="Consumo (kWh / milla)" field="kwhPerMile" value={inputs.kwhPerMile} step="0.005" onChange={updateField} />
                <NumberField label="Electricidad ($ / kWh)" field="pricePerKwh" value={inputs.pricePerKwh} step="0.01" onChange={updateField} />
              </>
            )}
            <NumberField label="Mantenimiento + llantas ($/mi)" field="maintPerMile" value={inputs.maintPerMile} step="0.01" onChange={updateField} />
            <NumberField label="Seguro ($/mes)" field="insurance" value={inputs.insurance} step="10" onChange={updateField} />
            <NumberField label="Limpieza y otros ($/mes)" field="cleaning" value={inputs.cleaning} step="10" onChange={updateField} />
            <NumberField label="Depreciación anual (%)" field="depreciationPct" value={inputs.depreciationPct} step="1" max="100" onChange={updateField} />
          </div>

          <div className="mi-robotaxi-section">
            <span>Flota</span>
          </div>
          <div className="mi-invest-form-grid">
            <NumberField label="Vehículos iniciales" field="fleetSize" value={inputs.fleetSize} min="1" max="50" onChange={updateField} />
            <NumberField label="Horizonte (meses)" field="horizonMonths" value={inputs.horizonMonths} min="12" max="120" step="12" onChange={updateField} />

            <label className="mi-invest-toggle mi-calc-field-full">
              <span>Reinvertir ganancias en más autos</span>
              <span className="mi-invest-toggle-row">
                <span className={`mi-invest-switch ${inputs.reinvest ? "is-on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={inputs.reinvest}
                    onChange={(event) =>
                      setInputs((current) => ({ ...current, reinvest: event.target.checked }))
                    }
                  />
                  <span className="mi-invest-switch-track" />
                </span>
                <strong>{inputs.reinvest ? "Si" : "No"}</strong>
              </span>
            </label>
          </div>
        </form>

        {result.isValid && chart ? (
          <div className="mi-invest-results">
            <section className="mi-invest-result-hero">
              <span className="mi-calc-result-label">Flujo de caja neto mensual por vehículo</span>
              <strong
                className={`mi-invest-result-hero-value ${
                  result.data.cashFlow < 0 ? "mi-robotaxi-value-negative" : ""
                }`}
              >
                {formatCurrency(result.data.cashFlow)}
              </strong>
              <span
                className={`mi-invest-result-hero-note ${
                  result.data.cashFlow < 0 ? "mi-robotaxi-note-negative" : ""
                }`}
              >
                {result.data.cashOnCash === null
                  ? "Sin enganche: no hay retorno sobre efectivo que medir"
                  : `Retorno anual sobre el enganche: ${formatPct(result.data.cashOnCash)}`}
              </span>
            </section>

            <div className="mi-invest-stats-grid">
              <article className="mi-calc-result-item">
                <span className="mi-calc-result-label">Ingreso bruto / mes</span>
                <strong className="mi-calc-result-value mi-invest-value-neutral">
                  {formatCurrency(result.data.grossMonth)}
                </strong>
              </article>

              <article className="mi-calc-result-item">
                <span className="mi-calc-result-label">
                  {isFleetRental ? "Viajes / día" : "Comisión plataforma"}
                </span>
                <strong className="mi-calc-result-value mi-calc-result-tone-red">
                  {isFleetRental ? "—" : `-${formatCurrency(result.data.platformFee)}`}
                </strong>
              </article>

              <article className="mi-calc-result-item">
                <span className="mi-calc-result-label">Costos operativos / mes</span>
                <strong className="mi-calc-result-value mi-calc-result-tone-red">
                  -{formatCurrency(result.data.opex)}
                </strong>
              </article>

              <article className="mi-calc-result-item">
                <span className="mi-calc-result-label">Cuota del crédito / mes</span>
                <strong className="mi-calc-result-value mi-calc-result-tone-red">
                  -{formatCurrency(result.data.monthlyPayment)}
                </strong>
              </article>

              <article className="mi-calc-result-item">
                <span className="mi-calc-result-label">Utilidad operativa (antes de deuda)</span>
                <strong
                  className={`mi-calc-result-value ${
                    result.data.operatingProfit >= 0
                      ? "mi-calc-result-tone-green"
                      : "mi-calc-result-tone-red"
                  }`}
                >
                  {formatCurrency(result.data.operatingProfit)}
                </strong>
              </article>

              <article className="mi-calc-result-item">
                <span className="mi-calc-result-label">Retorno sobre el auto completo</span>
                <strong
                  className={`mi-calc-result-value ${
                    result.data.roiOnVehicle >= 0 ? "mi-invest-value-neutral" : "mi-calc-result-tone-red"
                  }`}
                >
                  {formatPct(result.data.roiOnVehicle, 1)} / año
                </strong>
              </article>

              <article className="mi-calc-result-item">
                <span className="mi-calc-result-label">Punto de equilibrio</span>
                <strong className="mi-calc-result-value mi-invest-value-neutral">
                  {result.data.breakEvenMiles === null
                    ? "—"
                    : `${Math.ceil(result.data.breakEvenMiles)} mi pagadas/día`}
                </strong>
              </article>

              <article className="mi-calc-result-item">
                <span className="mi-calc-result-label">Recuperas el enganche en</span>
                <strong className="mi-calc-result-value mi-invest-value-neutral">
                  {result.data.paybackMonths === null
                    ? "Nunca con estos números"
                    : `${Math.ceil(result.data.paybackMonths)} meses`}
                </strong>
              </article>

              <article className="mi-calc-result-item">
                <span className="mi-calc-result-label">Ingreso vs costo por milla pagada</span>
                <strong className="mi-calc-result-value mi-invest-value-neutral">
                  {result.data.revenuePerPaidMile === null || result.data.costPerPaidMile === null
                    ? "—"
                    : `${formatCurrency(result.data.revenuePerPaidMile, 2)} vs ${formatCurrency(
                        result.data.costPerPaidMile,
                        2,
                      )}`}
                </strong>
              </article>

              <article className="mi-calc-result-item">
                <span className="mi-calc-result-label">Depreciación estimada / mes</span>
                <strong className="mi-calc-result-value mi-invest-value-neutral">
                  {formatCurrency(result.data.depreciationMonth)}
                </strong>
              </article>
            </div>

            <section className="mi-invest-chart-card">
              <div className="mi-invest-chart-head mi-robotaxi-chart-head">
                <span className="mi-calc-result-label">Flota y efectivo acumulado</span>
                <span className="mi-robotaxi-chart-summary">
                  {result.data.finalCars} {result.data.finalCars === 1 ? "vehículo" : "vehículos"}
                  {result.data.finalCars >= MAX_FLEET ? " (tope del simulador)" : ""} ·{" "}
                  {formatCompactCurrency(result.data.finalCash)} en efectivo al mes{" "}
                  {result.data.fleet.length - 1}
                </span>
              </div>

              <div className="mi-invest-chart-svg-shell">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight + 24}`}
                  className="mi-invest-chart-svg"
                  role="img"
                  aria-label="Evolución del efectivo acumulado y del tamaño de la flota"
                >
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

                  <line
                    x1="0"
                    y1={chart.zeroY}
                    x2={chartWidth}
                    y2={chart.zeroY}
                    className="mi-robotaxi-zero-line"
                  />

                  {chart.carsPath ? <path d={chart.carsPath} className="mi-robotaxi-cars-line" /> : null}
                  {chart.cashPath ? <path d={chart.cashPath} className="mi-invest-balance-line" /> : null}
                </svg>

                <div className="mi-invest-chart-y-axis">
                  {[1, 0.75, 0.5, 0.25, 0].map((tick) => (
                    <span key={tick}>
                      {formatCompactCurrency(chart.minCash + (chart.maxCash - chart.minCash) * tick)}
                    </span>
                  ))}
                </div>

                <div className="mi-invest-chart-x-axis mi-robotaxi-x-axis">
                  {yearTicks.map((year) => (
                    <span key={year}>{year === 0 ? "Inicio" : `Año ${year}`}</span>
                  ))}
                </div>
              </div>

              <div className="mi-invest-chart-legend">
                <span className="mi-invest-legend-item mi-invest-legend-balance">Efectivo acumulado</span>
                <span className="mi-invest-legend-item mi-invest-legend-invested">
                  Vehículos en flota (máx. {chart.maxCars})
                </span>
              </div>
            </section>

            <section
              className={`mi-robotaxi-callout ${
                result.data.cashFlow < 0 ? "is-negative" : ""
              }`}
            >
              {isFleetRental ? (
                <p>
                  Este es el único modo que un particular puede operar hoy: rentar el auto a un
                  conductor humano vía Uber Fleet. No requiere FSD ni permiso de Tesla, y el
                  ingreso está limitado a la renta semanal, no a las millas.
                </p>
              ) : result.data.cashFlow < 0 ? (
                <p>
                  Con estos supuestos el vehículo no cubre su cuota. Sube las millas pagadas por
                  encima del punto de equilibrio o baja el precio del auto antes de hablar de
                  flota.
                </p>
              ) : (
                <p>
                  El retorno sobre el enganche es apalancado: lo financia una deuda de{" "}
                  {formatCurrency(result.data.principal)}. Sobre el costo total del auto, con
                  intereses y depreciación, el retorno es {formatPct(result.data.roiOnVehicle, 1)} al
                  año. Tesla no ha publicado ni la comisión ni la fecha en que un dueño podrá
                  sumar su auto a la red.
                </p>
              )}
            </section>

            <details className="mi-robotaxi-sources">
              <summary>Supuestos por defecto, fuente y nivel de confianza</summary>
              <ul>
                {ASSUMPTION_SOURCES.map((item) => (
                  <li key={item.label}>
                    <span className={`mi-robotaxi-tag mi-robotaxi-tag-${item.tag.toLowerCase()}`}>
                      {item.tag}
                    </span>
                    <strong>{item.label}:</strong> {item.value}
                  </li>
                ))}
              </ul>
              <p>
                Detalle completo y enlaces en <code>docs/research/robotaxi-cybercab-2026.md</code>.
              </p>
            </details>

            <p className="mi-calc-footnote">
              * Modelo educativo. Los términos reales de la red Robotaxi (comisión, seguro,
              elegibilidad, fecha de apertura) no han sido publicados por Tesla. Ninguna cifra
              aquí constituye asesoramiento financiero.
            </p>
          </div>
        ) : (
          <p className="mi-form-error">{result.isValid ? "" : result.error}</p>
        )}
      </div>
    </div>
  );
}

export default RobotaxiFleetCalc;
