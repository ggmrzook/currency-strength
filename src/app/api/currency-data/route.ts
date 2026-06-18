import { NextRequest, NextResponse } from "next/server";
import { COUNTRIES } from "@/lib/countries";
import { fetchExchangeRates, fetchEconomicData } from "@/lib/dataFetcher";
import { buildComparison } from "@/lib/scoring";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const codeA = searchParams.get("a")?.toUpperCase();
  const codeB = searchParams.get("b")?.toUpperCase();

  if (!codeA || !codeB) {
    return NextResponse.json(
      { error: "Missing country codes. Use ?a=MY&b=PH" },
      { status: 400 }
    );
  }

  if (codeA === codeB) {
    return NextResponse.json(
      { error: "Countries must be different." },
      { status: 400 }
    );
  }

  const countryA = COUNTRIES.find((c) => c.code === codeA);
  const countryB = COUNTRIES.find((c) => c.code === codeB);

  if (!countryA) {
    return NextResponse.json(
      { error: `Unknown country code: ${codeA}` },
      { status: 404 }
    );
  }
  if (!countryB) {
    return NextResponse.json(
      { error: `Unknown country code: ${codeB}` },
      { status: 404 }
    );
  }

  try {
    const fxRates = await fetchExchangeRates();

    const [dataA, dataB] = await Promise.all([
      fetchEconomicData(countryA, fxRates),
      fetchEconomicData(countryB, fxRates),
    ]);

    const result = buildComparison(dataA, dataB);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Comparison error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data. Please try again." },
      { status: 500 }
    );
  }
}
