"use client";

import { useState, useEffect, useCallback } from "react";
import { CountryData, ComparisonResult, EconomicData, StrengthScore } from "@/types";

// ── Helpers ────────────────────────────────────────────────────────
function formatLocalCurrency(amount: number | null, symbol: string): string {
  if (amount === null) return "N/A";
  if (amount >= 1_000_000) return `${symbol}${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1000) return `${symbol}${amount.toLocaleString("en-US")}`;
  return `${symbol}${amount}`;
}
function formatIndex(v: number | null) { return v === null ? "N/A" : v.toFixed(1); }
function formatPercent(v: number | null) { return v === null ? "N/A" : `${v.toFixed(1)}%`; }
function formatGDP(v: number | null) {
  if (v === null) return "N/A";
  return `$${Math.round(v).toLocaleString("en-US")}`;
}

// ── StrengthBar ────────────────────────────────────────────────────
function StrengthBar({ scoreA, scoreB, flagA, flagB, strongerSide }: {
  scoreA: number; scoreB: number;
  flagA: string; flagB: string;
  strongerSide: "A" | "B";
}) {
  const total = scoreA + scoreB;
  const pctA = total > 0 ? (scoreA / total) * 100 : 50;
  const pctB = 100 - pctA;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 12, color: "#8888A8" }}>
        <span style={{ color: strongerSide === "A" ? "#00D4FF" : undefined }}>{flagA} {scoreA.toFixed(1)}</span>
        <span style={{ color: "#44445A", letterSpacing: 2 }}>SCORE</span>
        <span style={{ color: strongerSide === "B" ? "#00D4FF" : undefined }}>{scoreB.toFixed(1)} {flagB}</span>
      </div>
      <div style={{ position: "relative", height: 8, width: "100%", borderRadius: 9999, backgroundColor: "#1E1E2E", overflow: "hidden" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%", borderRadius: 9999,
          width: `${pctA}%`,
          background: strongerSide === "A" ? "linear-gradient(90deg,#00A3C4,#00D4FF)" : "linear-gradient(90deg,#2A2A4E,#3A3A6E)",
          transition: "width 1s ease-out"
        }} />
        <div style={{
          position: "absolute", right: 0, top: 0, height: "100%", borderRadius: 9999,
          width: `${pctB}%`,
          background: strongerSide === "B" ? "linear-gradient(90deg,#00D4FF,#00A3C4)" : "linear-gradient(90deg,#3A3A6E,#2A2A4E)",
          transition: "width 1s ease-out"
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 11, color: "#44445A" }}>
        <span>{pctA.toFixed(0)}%</span><span>{pctB.toFixed(0)}%</span>
      </div>
    </div>
  );
}

// ── MetricRow ──────────────────────────────────────────────────────
function MetricRow({ label, valueA, valueB, betterSide }: {
  label: string; valueA: string; valueB: string;
  betterSide: "A" | "B" | null;
}) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center", gap: 12, padding: "14px 0",
      borderBottom: "1px solid #1E1E2E"
    }}>
      <span style={{
        fontFamily: "monospace", fontSize: 14,
        color: betterSide === "A" ? "#00D4FF" : "#E8E8F0",
        fontWeight: betterSide === "A" ? 600 : 400
      }}>
        {valueA}{betterSide === "A" && <span style={{ marginLeft: 6, display: "inline-block", width: 6, height: 6, borderRadius: "50%", backgroundColor: "#00D4FF", verticalAlign: "middle" }} />}
      </span>
      <span style={{ fontFamily: "monospace", fontSize: 10, color: "#44445A", textAlign: "center", textTransform: "uppercase", letterSpacing: 2, minWidth: 110 }}>
        {label}
      </span>
      <div style={{ textAlign: "right" }}>
        <span style={{
          fontFamily: "monospace", fontSize: 14,
          color: betterSide === "B" ? "#00D4FF" : "#E8E8F0",
          fontWeight: betterSide === "B" ? 600 : 400
        }}>
          {betterSide === "B" && <span style={{ marginRight: 6, display: "inline-block", width: 6, height: 6, borderRadius: "50%", backgroundColor: "#00D4FF", verticalAlign: "middle" }} />}
          {valueB}
        </span>
      </div>
    </div>
  );
}

// ── Results ────────────────────────────────────────────────────────
function Results({ result }: { result: ComparisonResult }) {
  const { countryA: dA, countryB: dB, scoreA, scoreB, strongerCountry, verdict, exchangeRateLabel } = result;

  function better(a: number | null, b: number | null, higherBetter = true): "A" | "B" | null {
    if (a === null || b === null) return null;
    if (higherBetter) return a > b ? "A" : "B";
    return a < b ? "A" : "B";
  }

  const card: React.CSSProperties = {
    backgroundColor: "#12121A", border: "1px solid #1E1E2E",
    borderRadius: 16, padding: "20px 24px", marginBottom: 16
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

      {/* Headers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 40 }}>{dA.country.flag}</span>
          <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 600, color: strongerCountry === "A" ? "#00D4FF" : "#E8E8F0" }}>{dA.country.name}</span>
          <span style={{ fontFamily: "monospace", fontSize: 12, color: "#8888A8" }}>{dA.country.currency}</span>
        </div>
        <span style={{ fontFamily: "monospace", color: "#44445A", fontSize: 18 }}>vs</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
          <span style={{ fontSize: 40 }}>{dB.country.flag}</span>
          <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 600, color: strongerCountry === "B" ? "#00D4FF" : "#E8E8F0", textAlign: "right" }}>{dB.country.name}</span>
          <span style={{ fontFamily: "monospace", fontSize: 12, color: "#8888A8" }}>{dB.country.currency}</span>
        </div>
      </div>

      {/* Strength Bar */}
      <div style={card}>
        <StrengthBar scoreA={scoreA.weighted} scoreB={scoreB.weighted} flagA={dA.country.flag} flagB={dB.country.flag} strongerSide={strongerCountry} />
      </div>

      {/* Metrics */}
      <div style={{ ...card, padding: "4px 24px" }}>
        <MetricRow label="Exchange Rate" valueA={dA.country.currency} valueB={dB.country.currency} betterSide={null} />
        {exchangeRateLabel && (
          <div style={{ fontFamily: "monospace", fontSize: 13, color: "#8888A8", textAlign: "center", paddingBottom: 12, marginTop: -8 }}>
            {exchangeRateLabel}
          </div>
        )}
        <MetricRow label="Avg Monthly Salary" valueA={formatLocalCurrency(dA.avgMonthlySalary, dA.country.currencySymbol)} valueB={formatLocalCurrency(dB.avgMonthlySalary, dB.country.currencySymbol)} betterSide={null} />
        <MetricRow label="Cost of Living" valueA={formatIndex(dA.costOfLiving)} valueB={formatIndex(dB.costOfLiving)} betterSide={better(dA.costOfLiving, dB.costOfLiving, false)} />
        <MetricRow label="Purchasing Power" valueA={formatIndex(dA.purchasingPower)} valueB={formatIndex(dB.purchasingPower)} betterSide={better(dA.purchasingPower, dB.purchasingPower)} />
        <MetricRow label="Inflation" valueA={formatPercent(dA.inflation)} valueB={formatPercent(dB.inflation)} betterSide={better(dA.inflation, dB.inflation, false)} />
        <div style={{ borderBottom: "none" }}>
          <MetricRow label="GDP per Capita" valueA={formatGDP(dA.gdpPerCapita)} valueB={formatGDP(dB.gdpPerCapita)} betterSide={better(dA.gdpPerCapita, dB.gdpPerCapita)} />
        </div>
      </div>

      {/* Verdict */}
      <div style={{
        backgroundColor: "#0D1A1F", border: "1px solid rgba(0,212,255,0.3)",
        borderRadius: 16, padding: "32px 24px", textAlign: "center", marginTop: 8
      }}>
        <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#00A3C4", marginBottom: 16 }}>Verdict</div>
        <p style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: "#E8E8F0", lineHeight: 1.4, margin: 0 }}>
          {verdict}
        </p>
        <div style={{ marginTop: 16, fontFamily: "monospace", fontSize: 11, color: "#44445A" }}>
          Based on GDP · Purchasing Power · Inflation · Salary · Exchange Rate
        </div>
      </div>

      <div style={{ textAlign: "center", fontFamily: "monospace", fontSize: 11, color: "#44445A", marginTop: 16, paddingBottom: 8 }}>
        Data: World Bank · Open Exchange Rates · 2023–2024
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
export default function Home() {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [codeA, setCodeA] = useState("MY");
  const [codeB, setCodeB] = useState("PH");
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/countries").then(r => r.json()).then(setCountries).catch(() => setError("Failed to load countries."));
  }, []);

  const compare = useCallback(async (a = codeA, b = codeB) => {
    if (a === b) { setError("Please select two different countries."); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch(`/api/currency-data?a=${a}&b=${b}`);
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Something went wrong.");
      else setResult(data);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  }, [codeA, codeB]);

  useEffect(() => {
    if (countries.length > 0 && !result && !loading) compare();
  }, [countries]);

  const sel: React.CSSProperties = {
    width: "100%", appearance: "none" as const,
    backgroundColor: "#12121A", border: "1px solid #2A2A3E",
    color: "#E8E8F0", fontFamily: "monospace", fontSize: 13,
    borderRadius: 10, padding: "12px 16px", outline: "none", cursor: "pointer"
  };

  const QUICK = [
    { a: "MY", b: "PH", label: "🇲🇾 MYR vs PHP 🇵🇭" },
    { a: "JP", b: "KR", label: "🇯🇵 JPY vs KRW 🇰🇷" },
    { a: "US", b: "CA", label: "🇺🇸 USD vs CAD 🇨🇦" },
    { a: "DE", b: "BR", label: "🇩🇪 EUR vs BRL 🇧🇷" },
    { a: "SG", b: "IN", label: "🇸🇬 SGD vs INR 🇮🇳" },
    { a: "CH", b: "TR", label: "🇨🇭 CHF vs TRY 🇹🇷" },
  ];

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0A0A0F", padding: "32px 16px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#44445A", marginBottom: 8 }}>Real Economic Strength</div>
          <h1 style={{ fontFamily: "monospace", fontSize: 32, fontWeight: 700, color: "#E8E8F0", margin: "0 0 8px" }}>Currency Strength</h1>
          <p style={{ fontSize: 14, color: "#8888A8", margin: 0 }}>Beyond the exchange rate — real purchasing power, salary, GDP & inflation.</p>
        </div>

        {/* Selector */}
        <div style={{ backgroundColor: "#12121A", border: "1px solid #1E1E2E", borderRadius: 20, padding: 20, marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr", gap: 12, alignItems: "end", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#8888A8", marginBottom: 6 }}>Country A</div>
              <select value={codeA} onChange={e => { setCodeA(e.target.value); setResult(null); }} style={sel}>
                {countries.map(c => <option key={c.code + c.currency} value={c.code}>{c.flag} {c.name} ({c.currency})</option>)}
              </select>
            </div>
            <button onClick={() => { const t = codeA; setCodeA(codeB); setCodeB(t); setResult(null); }}
              style={{ height: 40, width: 40, backgroundColor: "#1A1A28", border: "1px solid #2A2A3E", borderRadius: 10, color: "#8888A8", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
              ⇄
            </button>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#8888A8", marginBottom: 6 }}>Country B</div>
              <select value={codeB} onChange={e => { setCodeB(e.target.value); setResult(null); }} style={sel}>
                {countries.map(c => <option key={c.code + c.currency} value={c.code}>{c.flag} {c.name} ({c.currency})</option>)}
              </select>
            </div>
          </div>
          <button onClick={() => compare()} disabled={loading || countries.length === 0}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
              backgroundColor: loading ? "#00A3C4" : "#00D4FF", color: "#0A0A0F",
              fontFamily: "monospace", fontWeight: 700, fontSize: 14, letterSpacing: 2,
              cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s"
            }}>
            {loading ? "FETCHING DATA..." : "COMPARE CURRENCIES →"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ backgroundColor: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 12, padding: "12px 16px", fontFamily: "monospace", fontSize: 13, color: "#F87171", marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[80, 280, 160, 100].map((h, i) => (
              <div key={i} style={{ height: h, backgroundColor: "#12121A", borderRadius: 16, opacity: 0.6 }} />
            ))}
          </div>
        )}

        {/* Results */}
        {result && !loading && <Results result={result} />}

        {/* Quick compare */}
        {!result && !loading && countries.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#44445A", textAlign: "center", marginBottom: 12 }}>Quick Compare</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {QUICK.map(({ a, b, label }) => (
                <button key={`${a}-${b}`}
                  onClick={() => { setCodeA(a); setCodeB(b); compare(a, b); }}
                  style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #1E1E2E", backgroundColor: "#12121A", color: "#8888A8", fontFamily: "monospace", fontSize: 12, cursor: "pointer" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
