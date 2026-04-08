import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const base = (searchParams.get("base") || "USD").toUpperCase();
  const target = (searchParams.get("target") || "EUR").toUpperCase();
  const days = parseInt(searchParams.get("days") || "30", 10);

  // If same currency, return flat 1.0 rate data
  if (base === target) {
    const rates: { date: string; rate: number }[] = Array.from({ length: days }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      return { date: d.toISOString().split("T")[0], rate: 1.0 };
    });
    return NextResponse.json({ rates });
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const startStr = startDate.toISOString().split("T")[0];
  const endStr = endDate.toISOString().split("T")[0];

  const url = `https://api.frankfurter.app/${startStr}..${endStr}?from=${base}&to=${target}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      // next.js server-side fetch, no CORS issues
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.rates) {
      return NextResponse.json({ rates: [] });
    }

    const rates = Object.entries(data.rates).map(([date, rateObj]: [string, any]) => ({
      date,
      rate: rateObj[target],
    }));

    return NextResponse.json({ rates });
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch historical data" }, { status: 500 });
  }
}
