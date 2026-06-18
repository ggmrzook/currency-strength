import { EconomicData, StrengthScore, ComparisonResult } from "@/types";

const WEIGHTS = {
  gdp: 0.30,
  purchasingPower: 0.25,
  inflation: 0.20,
  salary: 0.15,
  exchangeRate: 0.10,
};

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 50;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

function inflationScore(inflation: number): number {
  const capped = Math.min(inflation, 200);
  return Math.max(0, 100 - (capped / 200) * 100);
}

const RANGES = {
  gdpPerCapita: { min: 500, max: 100000 },
  purchasingPower: { min: 10, max: 130 },
  salary: { min: 50, max: 7000 },
};

function salaryInUSD(data: EconomicData): number | null {
  if (data.avgMonthlySalary === null || data.exchangeRate === null) return null;
  if (data.exchangeRate === 0) return null;
  return data.avgMonthlySalary / data.exchangeRate;
}

export function computeStrengthScore(data: EconomicData): StrengthScore {
  const salUSD = salaryInUSD(data);

  const gdpScore = data.gdpPerCapita !== null
    ? normalize(data.gdpPerCapita, RANGES.gdpPerCapita.min, RANGES.gdpPerCapita.max)
    : 50;

  const ppScore = data.purchasingPower !== null
    ? normalize(data.purchasingPower, RANGES.purchasingPower.min, RANGES.purchasingPower.max)
    : 50;

  const infScore = data.inflation !== null
    ? inflationScore(data.inflation)
    : 50;

  const salScore = salUSD !== null
    ? normalize(salUSD, RANGES.salary.min, RANGES.salary.max)
    : 50;

  const fxScore = data.exchangeRate !== null
    ? normalize(Math.log10(Math.max(0.01, 1 / data.exchangeRate)) + 3, 0, 6)
    : 50;

  const weighted =
    gdpScore * WEIGHTS.gdp +
    ppScore * WEIGHTS.purchasingPower +
    infScore * WEIGHTS.inflation +
    salScore * WEIGHTS.salary +
    fxScore * WEIGHTS.exchangeRate;

  return {
    raw: weighted,
    weighted,
    breakdown: {
      purchasingPower: ppScore,
      salary: salScore,
      exchangeRate: fxScore,
      inflation: infScore,
      gdp: gdpScore,
    },
  };
}

export function buildComparison(
  dataA: EconomicData,
  dataB: EconomicData
): ComparisonResult {
  const scoreA = computeStrengthScore(dataA);
  const scoreB = computeStrengthScore(dataB);

  const stronger = scoreA.weighted >= scoreB.weighted ? "A" : "B";
  const ratio =
    stronger === "A"
      ? scoreA.weighted / Math.max(0.01, scoreB.weighted)
      : scoreB.weighted / Math.max(0.01, scoreA.weighted);

  const ratioRounded = Math.round(ratio * 10) / 10;

  let exchangeRateDirect: number | null = null;
  let exchangeRateLabel = "";

  if (dataA.exchangeRate !== null && dataB.exchangeRate !== null && dataA.exchangeRate > 0) {
    exchangeRateDirect = dataB.exchangeRate / dataA.exchangeRate;
    const cur1 = dataA.country.currency;
    const cur2 = dataB.country.currency;
    exchangeRateLabel = `1 ${cur1} = ${formatRate(exchangeRateDirect)} ${cur2}`;
  }

  const strongerData = stronger === "A" ? dataA : dataB;
  const weakerData = stronger === "A" ? dataB : dataA;
  const strongerCur = strongerData.country.currency;
  const weakerCur = weakerData.country.currency;
  const verdict = `${strongerCur} is ${ratioRounded}× stronger than ${weakerCur}.`;

  return {
    countryA: dataA,
    countryB: dataB,
    scoreA,
    scoreB,
    ratio: ratioRounded,
    strongerCountry: stronger,
    verdict,
    exchangeRateDirect,
    exchangeRateLabel,
  };
}

function formatRate(rate: number): string {
  if (rate >= 1000) return rate.toFixed(0);
  if (rate >= 10) return rate.toFixed(2);
  if (rate >= 1) return rate.toFixed(4);
  return rate.toFixed(6);
}

export function formatLocalCurrency(amount: number | null, symbol: string): string {
  if (amount === null) return "N/A";
  if (amount >= 1_000_000) return `${symbol}${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1000) return `${symbol}${amount.toLocaleString("en-US")}`;
  return `${symbol}${amount}`;
}

export function formatIndex(value: number | null): string {
  if (value === null) return "N/A";
  return value.toFixed(1);
}

export function formatPercent(value: number | null): string {
  if (value === null) return "N/A";
  return `${value.toFixed(1)}%`;
}

export function formatGDP(value: number | null): string {
  if (value === null) return "N/A";
  if (value >= 1000) return `$${Math.round(value).toLocaleString("en-US")}`;
  return `$${value.toFixed(0)}`;
}
