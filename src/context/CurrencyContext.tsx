"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface CurrencyContextType {
  baseCurrency: string;
  setBaseCurrency: (currency: string) => void;
  targetCurrencies: string[];
  setTargetCurrencies: (currencies: string[]) => void;
  favorites: string[];
  toggleFavorite: (currency: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrencies, setTargetCurrencies] = useState<string[]>(["EUR"]);
  const [favorites, setFavorites] = useState<string[]>(["USD", "EUR", "GBP", "JPY"]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBase = localStorage.getItem("baseCurrency");
    const savedTargets = localStorage.getItem("targetCurrencies");
    const savedFavorites = localStorage.getItem("favorites");

    if (savedBase) {
      setBaseCurrency(savedBase);
    }
    
    if (savedTargets) {
      try {
        const parsed = JSON.parse(savedTargets);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTargetCurrencies(parsed);
        }
      } catch (e) {
        console.error("Failed to parse target currencies from localStorage", e);
      }
    }

    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      } catch (e) {
        console.error("Failed to parse favorites from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when state changes, but only after initial load
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("baseCurrency", baseCurrency);
      localStorage.setItem("targetCurrencies", JSON.stringify(targetCurrencies));
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [baseCurrency, targetCurrencies, favorites, isLoaded]);

  const toggleFavorite = (currency: string) => {
    setFavorites(prev => 
      prev.includes(currency) 
        ? prev.filter(c => c !== currency) 
        : [...prev, currency]
    );
  };

  return (
    <CurrencyContext.Provider
      value={{
        baseCurrency,
        setBaseCurrency,
        targetCurrencies,
        setTargetCurrencies,
        favorites,
        toggleFavorite,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
