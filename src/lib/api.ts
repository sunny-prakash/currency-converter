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
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  // Using frankfurter.app for historical data (open.er-api.com doesn't support history easily without paying sometimes or different endpoint)
  // Frankfurter is free and good for major currencies.
  // Note: Frankfurter might not support ALL currencies that open.er-api does, but it supports most.
  const API_URL = `https://api.frankfurter.app/${startStr}..${endStr}?from=${base}&to=${target}`;
  console.log("Fetching historical rates from:", API_URL);

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      console.warn(`Frankfurter API failed with status ${response.status}: ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    console.log("Historical data received:", data);
    
    if (data.rates) {
      return Object.entries(data.rates).map(([date, rates]: [string, any]) => ({
        date,
        rate: rates[target]
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching historical rates:", error);
    return [];
  }
}
