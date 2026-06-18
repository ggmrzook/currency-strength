import { NextResponse } from "next/server";
import { COUNTRIES } from "@/lib/countries";

export async function GET() {
  return NextResponse.json(COUNTRIES, {
    headers: {
      "Cache-Control": "public, s-maxage=86400",
    },
  });
}
