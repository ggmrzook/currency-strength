import { EconomicData, CountryData } from "@/types";
import { STATIC_DATA } from "./staticData";

const CACHE: Map<string, { data: unknown; ts: number }> = new Map();
const CACHE_TTL = 60 * 60 * 1000;

async function cachedFetch(url: string, cacheKey: string): Promise<unknown> {
  const cached = CACHE.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    CACHE.set(cacheKey, { data, ts: Date.now() });
    return data;
  } catch {
    return null;
  }
}

export async function fetchExchangeRates(): Promise<Record<string, number>> {
  const primary = await cachedFetch(
    "https://open.er-api.com/v6/latest/USD",
    "fx_rates"
  ) as { rates?: Record<string, number> } | null;
  if (primary?.rates) return primary.rates;

  const fallback = await cachedFetch(
    "https://api.exchangerate.host/latest?base=USD",
    "fx_rates_fallback"
  ) as { rates?: Record<string, number> } | null;
  if (fallback?.rates) return fallback.rates;

  return {};
}

async function fetchWorldBankIndicator(
  countryCode: string,
  indicator: string
): Promise<number | null> {
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&mrv=3&per_page=5`;
  const key = `wb_${countryCode}_${indicator}`;
  const data = await cachedFetch(url, key) as [unknown, { value: number | null }[]] | null;
  if (!data || !Array.isArray(data) || !data[1]) return null;
  const entries = data[1].filter((e) => e.value !== null);
  return entries.length > 0 ? entries[0].value : null;
}

export async function fetchEconomicData(
  country: CountryData,
  fxRates: Record<string, number>
): Promise<EconomicData> {
  const code = country.code;
  const staticEntry = STATIC_DATA[code];

  const usdRate = fxRates[country.currency] ?? null;

  let gdpPerCapita = await fetchWorldBankIndicator(code, "NY.GDP.PCAP.CD");
  if (gdpPerCapita === null && staticEntry) gdpPerCapita = staticEntry.gdpPerCapita;

  let inflation = await fetchWorldBankIndicator(code, "FP.CPI.TOTL.ZG");
  if (inflation === null && staticEntry) inflation = staticEntry.inflation;

  let avgSalaryUSD: number | null = staticEntry?.avgMonthlySalaryUSD ?? null;

  let avgMonthlySalary: number | null = null;
  if (avgSalaryUSD !== null && usdRate !== null) {
    avgMonthlySalary = Math.round(avgSalaryUSD * usdRate);
  }

  const costOfLiving = staticEntry?.costOfLiving ?? null;
  const purchasingPower = staticEntry?.purchasingPower ?? null;

  return {
    country,
    exchangeRate: usdRate,
    avgMonthlySalary,
    costOfLiving,
    purchasingPower,
    inflation,
    gdpPerCapita,
  };
}
