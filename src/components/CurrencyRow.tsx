import { CURRENCIES } from "@/constants/currencies";
import { useCurrency } from "@/context/CurrencyContext";
import { motion } from "framer-motion";
import { ChevronDown, Star, X } from "lucide-react";

interface CurrencyRowProps {
  amount: number | string;
  currency: string;
  onAmountChange: (amount: string) => void;
  onCurrencyChange: (currency: string) => void;
  readOnly?: boolean;
  onRemove?: () => void;
}

export function CurrencyRow({
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
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
    <motion.div layout className="flex flex-col gap-2 w-full relative group/row">
      {/* Input + currency selector row */}
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

        {/* Currency selector pill */}
        <div className="relative shrink-0 flex items-center gap-1">
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
            {isFavorite && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(currency);
                }}
                className="hover:scale-125 active:scale-90 transition-all"
                title="Remove from favourites"
              >
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
              </button>
            )}
            <span className="text-xl leading-none">{CURRENCIES.find((c) => c.code === currency)?.flag}</span>
            <span className="font-bold text-[var(--foreground)] text-base">{currency}</span>
            <ChevronDown className="w-4 h-4 text-[var(--foreground)]/50" />
          </div>

          {/* X (remove) button — inside the row, to the right of the pill */}
          {onRemove && (
            <button
              onClick={onRemove}
              className="ml-1 p-1.5 rounded-lg text-[var(--foreground)]/20 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover/row:opacity-100"
              title="Remove currency"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
