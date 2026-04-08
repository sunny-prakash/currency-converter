"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { getExchangeRates } from "@/lib/api";
import { cn } from "@/lib/utils";
import { CURRENCIES } from "@/constants/currencies";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownUp, Plus, RefreshCw, Search, Star, X } from "lucide-react";
// Note: Plus is still used in the "Add Currency" button below
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CurrencyRow } from "./CurrencyRow";

function AddCurrencyModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (code: string) => void;
}) {
  const { favorites, toggleFavorite, baseCurrency, targetCurrencies } = useCurrency();
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Currencies not already in use
  const unavailable = new Set([baseCurrency, ...targetCurrencies]);

  const filtered = CURRENCIES.filter(
    (c) =>
      !unavailable.has(c.code) &&
      (c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()))
  );

  const favoriteCurrencies = filtered.filter((c) => favorites.includes(c.code));
  const otherCurrencies = filtered.filter((c) => !favorites.includes(c.code));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative w-full max-w-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--card-border)]">
          <div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">Add Currency</h3>
            <p className="text-xs text-[var(--foreground)]/40 mt-0.5">
              ⭐ Star currencies to save as favourites
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--foreground)]/10 text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-3 bg-[var(--foreground)]/5 px-4 py-2.5 rounded-2xl border border-[var(--card-border)] focus-within:border-purple-500/50 transition-colors">
            <Search size={16} className="text-[var(--foreground)]/40 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search currencies…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-[var(--foreground)] outline-none w-full placeholder-[var(--foreground)]/30"
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-72 p-2">
          {/* Favourites section */}
          {favoriteCurrencies.length > 0 && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--foreground)]/30 px-3 py-2">
                ⭐ Favourites
              </p>
              {favoriteCurrencies.map((c) => (
                <CurrencyOption
                  key={c.code}
                  currency={c}
                  isFavorite={true}
                  onToggleFavorite={() => toggleFavorite(c.code)}
                  onAdd={() => { onAdd(c.code); onClose(); }}
                />
              ))}
            </>
          )}

          {/* All others */}
          {otherCurrencies.length > 0 && (
            <>
              {favoriteCurrencies.length > 0 && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--foreground)]/30 px-3 py-2 mt-1">
                  All Currencies
                </p>
              )}
              {otherCurrencies.map((c) => (
                <CurrencyOption
                  key={c.code}
                  currency={c}
                  isFavorite={false}
                  onToggleFavorite={() => toggleFavorite(c.code)}
                  onAdd={() => { onAdd(c.code); onClose(); }}
                />
              ))}
            </>
          )}

          {filtered.length === 0 && (
            <p className="text-center text-[var(--foreground)]/30 text-sm py-8">
              No currencies found
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function CurrencyOption({
  currency,
  isFavorite,
  onToggleFavorite,
  onAdd,
}: {
  currency: { code: string; name: string; flag: string };
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAdd: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-[var(--foreground)]/5 transition-colors cursor-pointer group"
      onClick={onAdd}
    >
      <span className="text-2xl">{currency.flag}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[var(--foreground)]">{currency.code}</p>
        <p className="text-xs text-[var(--foreground)]/40 truncate">{currency.name}</p>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={`p-2 rounded-xl transition-all shrink-0 hover:bg-yellow-400/10 active:scale-90 ${
          isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        title={isFavorite ? "Remove from favourites" : "Add to favourites"}
      >
        <Star
          size={16}
          className={isFavorite ? "fill-yellow-400 text-yellow-400" : "text-[var(--foreground)]/30"}
        />
      </button>
    </div>
  );
}

export function ConverterCard() {
  const [amount, setAmount] = useState<string>("1");
  const { baseCurrency, setBaseCurrency, targetCurrencies, setTargetCurrencies } = useCurrency();
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchRates();
  }, [baseCurrency]);

  const fetchRates = async () => {
    setLoading(true);
    const data = await getExchangeRates(baseCurrency);
    if (data) {
      setRates(data.rates);
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

  function handleAddCurrency(code: string) {
    setTargetCurrencies([...targetCurrencies, code]);
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
    <>
      <AnimatePresence>
        {showAddModal && (
          <AddCurrencyModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddCurrency}
          />
        )}
      </AnimatePresence>

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
              className={cn(
                "p-3 rounded-2xl bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 border border-[var(--card-border)] transition-all text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:scale-105 active:scale-95",
                loading && "animate-spin"
              )}
              title="Refresh Rates"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 w-full">
              <span className="text-sm text-[var(--text-secondary)] font-medium ml-1 h-6 flex items-end">
                You send
              </span>
              <CurrencyRow
                amount={amount}
                currency={baseCurrency}
                onAmountChange={handleBaseAmountChange}
                onCurrencyChange={setBaseCurrency}
              />
            </div>

            <div className="flex flex-col gap-0 w-full">
              <AnimatePresence mode="popLayout">
                {targetCurrencies.map((target, index) => {
                  const rate = rates[target] || 0;
                  const targetAmount = !isNaN(parseFloat(amount))
                    ? formatAmount(parseFloat(amount) * rate)
                    : "";

                  return (
                    <motion.div
                      key={`${target}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      className="flex flex-col w-full"
                    >
                      {/* Swap button + optional label row */}
                      <div className="relative flex justify-center items-center h-10">
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 180 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSwap(index)}
                          className="z-20 p-2 bg-[var(--foreground)] border-2 border-[var(--background)] rounded-full text-[var(--background)] shadow-lg hover:border-purple-500/50"
                          title="Swap with base"
                        >
                          <ArrowDownUp size={14} />
                        </motion.button>
                        {index === 0 && (
                          <span className="absolute left-0 text-sm text-[var(--text-secondary)] font-medium ml-1">
                            They receive
                          </span>
                        )}
                      </div>

                      <CurrencyRow
                        amount={targetAmount}
                        currency={target}
                        onAmountChange={(val) => handleTargetAmountChange(val, target)}
                        onCurrencyChange={(val) => handleTargetCurrencyChange(index, val)}
                        onRemove={
                          targetCurrencies.length > 1 ? () => handleRemoveCurrency(index) : undefined
                        }
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 border border-[var(--card-border)] text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-all"
            >
              <Plus size={18} />
              <span className="font-medium">Add Currency</span>
            </button>

            {/* Market CTA */}
            <Link
              href="/market"
              className="group flex items-center justify-between gap-3 py-3 px-4 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">📈</span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">View Market Trends</p>
                  <p className="text-xs text-[var(--foreground)]/40">See historical charts for your selected currencies</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-purple-400/50 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
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
    </>
  );
}
