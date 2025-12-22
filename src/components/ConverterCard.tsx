"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { getExchangeRates } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownUp, Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { CurrencyRow } from "./CurrencyRow";

export function ConverterCard() {
  const [amount, setAmount] = useState<string>("1");
  const { baseCurrency, setBaseCurrency, targetCurrencies, setTargetCurrencies } = useCurrency();
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchRates();
  }, [baseCurrency]);

  const fetchRates = async () => {
    setLoading(true);
    const data = await getExchangeRates(baseCurrency);
    if (data) {
      setRates(data.rates);
      // Only set time on client side to avoid hydration mismatch
      if (mounted) {
        setLastUpdated(new Date(data.time_last_update_unix * 1000).toLocaleTimeString());
      }
    }
    setLoading(false);
  };

  function formatAmount(amt: number) {
    return amt.toFixed(2);
  }

  function handleBaseAmountChange(amt: string) {
    setAmount(amt);
  }

  function handleTargetAmountChange(amt: string, targetCurrency: string) {
    const rate = rates[targetCurrency];
    if (rate && !isNaN(parseFloat(amt)) && rate !== 0) {
      setAmount(formatAmount(parseFloat(amt) / rate));
    }
  }

  function handleAddCurrency() {
    // Find a currency not already in targets or base
    const available = ["GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR"].find(
      c => c !== baseCurrency && !targetCurrencies.includes(c)
    );
    if (available) {
      setTargetCurrencies([...targetCurrencies, available]);
    } else {
      // Fallback if common ones taken
      setTargetCurrencies([...targetCurrencies, "GBP"]);
    }
  }

  function handleRemoveCurrency(index: number) {
    const newTargets = [...targetCurrencies];
    newTargets.splice(index, 1);
    setTargetCurrencies(newTargets);
  }

  function handleTargetCurrencyChange(index: number, newCurrency: string) {
    const newTargets = [...targetCurrencies];
    newTargets[index] = newCurrency;
    setTargetCurrencies(newTargets);
  }

  function handleSwap(targetIndex: number) {
    const newBase = targetCurrencies[targetIndex];
    const newTargets = [...targetCurrencies];
    newTargets[targetIndex] = baseCurrency;
    
    setBaseCurrency(newBase);
    setTargetCurrencies(newTargets);
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="w-full max-w-lg p-8 rounded-[2.5rem] bg-[var(--card-bg)] backdrop-blur-2xl border border-[var(--card-border)] shadow-2xl relative overflow-hidden ring-1 ring-white/5"
    >
      {/* Background decoration */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-500/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">Converter</h2>
            <p className="text-[var(--foreground)]/40 text-sm font-medium mt-1">Real-time rates</p>
          </div>
          <button 
            onClick={fetchRates} 
            className={cn("p-3 rounded-2xl bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 border border-[var(--card-border)] transition-all text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:scale-105 active:scale-95", loading && "animate-spin")}
            title="Refresh Rates"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <CurrencyRow
            label="You send"
            amount={amount}
            currency={baseCurrency}
            onAmountChange={handleBaseAmountChange}
            onCurrencyChange={setBaseCurrency}
          />

          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {targetCurrencies.map((target, index) => {
                const rate = rates[target] || 0;
                const targetAmount = !isNaN(parseFloat(amount)) ? formatAmount(parseFloat(amount) * rate) : "";
                
                return (
                  <motion.div 
                    key={`${target}-${index}`} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="relative"
                  >
                     {/* Swap Button between Base and this Target */}
                     <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 180 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSwap(index)}
                          className="p-2 bg-[var(--foreground)] border-2 border-[var(--background)] rounded-full text-[var(--background)] shadow-lg hover:border-purple-500/50 group"
                          title="Swap with base"
                        >
                          <ArrowDownUp size={14} />
                        </motion.button>
                     </div>

                    <CurrencyRow
                      label={index === 0 ? "They receive" : undefined}
                      amount={targetAmount}
                      currency={target}
                      onAmountChange={(val) => handleTargetAmountChange(val, target)}
                      onCurrencyChange={(val) => handleTargetCurrencyChange(index, val)}
                      onRemove={targetCurrencies.length > 1 ? () => handleRemoveCurrency(index) : undefined}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button
            onClick={handleAddCurrency}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 border border-[var(--card-border)] text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-all"
          >
            <Plus size={18} />
            <span className="font-medium">Add Currency</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 bg-[var(--foreground)]/5 p-4 rounded-2xl border border-[var(--card-border)]">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--foreground)]/50 font-medium">Exchange Rates</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[var(--foreground)] font-mono font-medium">Live Updates</span>
            </div>
          </div>
          {lastUpdated && (
            <div className="flex justify-between text-xs text-[var(--foreground)]/30 border-t border-[var(--card-border)] pt-3">
              <span>Last updated</span>
              <span>{lastUpdated}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
