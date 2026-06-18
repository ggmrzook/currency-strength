export interface CountryData {
  name: string;
  code: string;
  currency: string;
  currencySymbol: string;
  flag: string;
}

export interface EconomicData {
  country: CountryData;
  exchangeRate: number | null;
  avgMonthlySalary: number | null;
  costOfLiving: number | null;
  purchasingPower: number | null;
  inflation: number | null;
  gdpPerCapita: number | null;
}

export interface StrengthScore {
  raw: number;
  weighted: number;
  breakdown: {
    purchasingPower: number;
    salary: number;
    exchangeRate: number;
    inflation: number;
    gdp: number;
  };
}

export interface ComparisonResult {
  countryA: EconomicData;
  countryB: EconomicData;
  scoreA: StrengthScore;
  scoreB: StrengthScore;
  ratio: number;
  strongerCountry: "A" | "B";
  verdict: string;
  exchangeRateDirect: number | null;
  exchangeRateLabel: string;
}
