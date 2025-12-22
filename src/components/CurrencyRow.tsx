import { CURRENCIES } from "@/constants/currencies";
import { useCurrency } from "@/context/CurrencyContext";
import { motion } from "framer-motion";
import { ChevronDown, Star, X } from "lucide-react";

interface CurrencyRowProps {
  amount: number | string;
  currency: string;
  onAmountChange: (amount: string) => void;
  onCurrencyChange: (currency: string) => void;
  label?: string;
  readOnly?: boolean;
  onRemove?: () => void;
}

export function CurrencyRow({
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  label,
  readOnly = false,
  onRemove,
}: CurrencyRowProps) {
  const { favorites, toggleFavorite } = useCurrency();
  const isFavorite = favorites.includes(currency);

  const sortedCurrencies = [...CURRENCIES].sort((a, b) => {
    const aFav = favorites.includes(a.code);
    const bFav = favorites.includes(b.code);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  return (
    <motion.div 
      layout
      className="flex flex-col gap-2 w-full relative group/row"
    >
      <div className="flex justify-between items-center">
        {label && <label className="text-sm text-[var(--text-secondary)] font-medium ml-1">{label}</label>}
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-[var(--foreground)]/20 hover:text-red-400 transition-colors opacity-0 group-hover/row:opacity-100 p-1"
            title="Remove currency"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <motion.div 
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex items-center gap-3 bg-[var(--foreground)]/5 p-4 rounded-2xl border border-[var(--card-border)] focus-within:border-purple-500/50 focus-within:bg-[var(--foreground)]/10 transition-all duration-300 hover:border-[var(--card-border)]/50"
      >
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="bg-transparent text-3xl font-bold text-[var(--foreground)] outline-none flex-1 w-0 min-w-0 placeholder-[var(--foreground)]/20"
          placeholder="0.00"
          readOnly={readOnly}
        />
        <div className="relative shrink-0">
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          >
            {sortedCurrencies.map((c) => (
              <option key={c.code} value={c.code} className="text-black">
                {favorites.includes(c.code) ? "⭐ " : ""}{c.code} - {c.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 bg-[var(--foreground)]/10 px-3 py-2 rounded-xl hover:bg-[var(--foreground)]/20 transition-colors cursor-pointer border border-[var(--card-border)] backdrop-blur-sm">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(currency);
              }}
              className="hover:scale-125 active:scale-90 transition-all"
            >
              <Star 
                size={16} 
                className={isFavorite ? "fill-yellow-400 text-yellow-400" : "text-[var(--foreground)]/30"} 
              />
            </button>
            <span className="text-2xl">{CURRENCIES.find((c) => c.code === currency)?.flag}</span>
            <span className="font-bold text-[var(--foreground)] text-lg">{currency}</span>
            <ChevronDown className="w-4 h-4 text-[var(--foreground)]/50" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
