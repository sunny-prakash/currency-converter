"use client";

import { CurrencyChart } from "@/components/CurrencyChart";
import { Header } from "@/components/Header";
import { useCurrency } from "@/context/CurrencyContext";
import { getHistoricalRates, HistoricalRate } from "@/lib/api";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function MarketPage() {
  const { baseCurrency, targetCurrencies } = useCurrency();
  const [allChartData, setAllChartData] = useState<Record<string, HistoricalRate[]>>({});
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const promises = targetCurrencies.map(async (target) => {
          const data = await getHistoricalRates(baseCurrency, target, days);
          return { target, data };
        });

        const results = await Promise.all(promises);
        const newData: Record<string, HistoricalRate[]> = {};
        results.forEach(({ target, data }) => {
          newData[target] = data;
        });
        
        setAllChartData(newData);
      } catch (error) {
        console.error("Failed to fetch market data", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (targetCurrencies.length > 0) {
      fetchData();
    } else {
      setAllChartData({});
      setLoading(false);
    }
  }, [baseCurrency, targetCurrencies, days]);

  const highlights = useMemo(() => {
    if (Object.keys(allChartData).length === 0) return null;

    const performances = Object.entries(allChartData).map(([target, data]) => {
      if (data.length < 2) return { target, change: 0 };
      const start = data[0].rate;
      const end = data[data.length - 1].rate;
      const change = ((end - start) / start) * 100;
      return { target, change };
    });

    const gainer = [...performances].sort((a, b) => b.change - a.change)[0];
    const loser = [...performances].sort((a, b) => a.change - b.change)[0];

    return { gainer, loser };
  }, [allChartData]);

  return (
    <main className="min-h-screen w-full bg-[var(--background)] relative flex flex-col p-4 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <Header />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-5xl w-full mx-auto mt-24 pb-20">
        <div className="w-full flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <Link href="/convert" className="flex items-center gap-2 text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-colors mb-2">
              <ArrowLeft size={16} />
              <span>Back to Converter</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] tracking-tight">
              Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Trends</span>
            </h1>
            <p className="text-[var(--text-secondary)]">
              Historical performance over the last {days === 365 ? 'year' : `${days} days`}
            </p>
          </div>

          <div className="flex bg-[var(--foreground)]/5 p-1 rounded-2xl border border-[var(--card-border)] backdrop-blur-sm self-start md:self-end">
            {[
              { label: '7D', value: 7 },
              { label: '30D', value: 30 },
              { label: '1Y', value: 365 },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setDays(range.value)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                  days === range.value 
                    ? "bg-[var(--foreground)] text-[var(--background)] shadow-lg" 
                    : "text-[var(--foreground)]/50 hover:text-[var(--foreground)]"
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Market Highlights */}
        {!loading && highlights && targetCurrencies.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full animate-in fade-in slide-in-from-top-4 duration-700">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-green-500 font-bold">Biggest Gainer</h3>
                  <p className="text-sm text-green-500/60">Last 30 days vs {baseCurrency}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-green-500">+{highlights.gainer.change.toFixed(2)}%</span>
                <p className="text-sm font-bold text-green-500/60">{highlights.gainer.target}</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500">
                  <TrendingDown size={24} />
                </div>
                <div>
                  <h3 className="text-red-500 font-bold">Biggest Loser</h3>
                  <p className="text-sm text-red-500/60">Last 30 days vs {baseCurrency}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-red-500">{highlights.loser.change.toFixed(2)}%</span>
                <p className="text-sm font-bold text-red-500/60">{highlights.loser.target}</p>
              </div>
            </motion.div>
          </div>
        )}

        {loading ? (
          <div className="w-full h-[400px] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : targetCurrencies.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center justify-center text-[var(--foreground)]/50 gap-4 bg-[var(--foreground)]/5 rounded-3xl border border-[var(--card-border)]">
            <p className="text-lg">No currencies selected.</p>
            <Link href="/convert" className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors">
              Add Currencies
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-16 w-full">
            {targetCurrencies.map((target) => {
              const chartData = allChartData[target] || [];
              const currentRate = chartData.length > 0 ? chartData[chartData.length - 1].rate : 0;
              const high = chartData.length > 0 ? Math.max(...chartData.map(d => d.rate)) : 0;
              const low = chartData.length > 0 ? Math.min(...chartData.map(d => d.rate)) : 0;

              return (
                <div key={target} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <CurrencyChart data={chartData} base={baseCurrency} target={target} />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <div className="p-6 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-[var(--foreground)]/5 transition-colors shadow-sm">
                       <h3 className="text-[var(--text-secondary)] text-sm font-medium">Current Rate ({target})</h3>
                       <p className="text-2xl font-bold text-[var(--foreground)] mt-2">
                         {chartData.length > 0 ? currentRate.toFixed(4) : "---"}
                       </p>
                    </div>
                    <div className="p-6 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-[var(--foreground)]/5 transition-colors shadow-sm">
                       <h3 className="text-[var(--text-secondary)] text-sm font-medium">{days} Day High</h3>
                       <p className="text-2xl font-bold text-green-500 mt-2">
                         {chartData.length > 0 ? high.toFixed(4) : "---"}
                       </p>
                    </div>
                    <div className="p-6 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-[var(--foreground)]/5 transition-colors shadow-sm">
                       <h3 className="text-[var(--text-secondary)] text-sm font-medium">{days} Day Low</h3>
                       <p className="text-2xl font-bold text-red-500 mt-2">
                         {chartData.length > 0 ? low.toFixed(4) : "---"}
                       </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
