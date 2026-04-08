export interface ExchangeRates {
  result: string;
  provider: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  rates: Record<string, number>;
}

const API_URL = "https://open.er-api.com/v6/latest";

export async function getExchangeRates(base: string = "USD"): Promise<ExchangeRates | null> {
  try {
    const response = await fetch(`${API_URL}/${base}`);
    if (!response.ok) {
      throw new Error("Failed to fetch rates");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return null;
  }
}

export interface HistoricalRate {
  date: string;
  rate: number;
}

export async function getHistoricalRates(base: string, target: string, days: number = 30): Promise<HistoricalRate[]> {
  const upperBase = base.toUpperCase();
  const upperTarget = target.toUpperCase();

  try {
    // Call our own Next.js API proxy to avoid browser CORS issues with external APIs
    const response = await fetch(
      `/api/historical?base=${upperBase}&target=${upperTarget}&days=${days}`
    );

    if (!response.ok) {
      console.warn(`Historical API proxy failed: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (data.rates && Array.isArray(data.rates)) {
      return data.rates;
    }
    return [];
  } catch (error) {
    console.error("Error fetching historical rates:", error);
    return [];
  }
}
