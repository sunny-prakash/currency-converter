"use client";

import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full flex justify-between items-center py-6 px-4 md:px-8 max-w-7xl mx-auto relative z-50">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
          CF
        </div>
        <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">CurrencyFlow</span>
      </Link>

      <nav className="flex items-center gap-6">
        <Link 
          href="/" 
          className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity text-[var(--foreground)]"
        >
          Home
        </Link>
        <Link 
          href="/convert" 
          className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity text-[var(--foreground)]"
        >
          Convert
        </Link>
        <Link 
          href="/market" 
          className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity text-[var(--foreground)]"
        >
          Market
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] hover:scale-110 active:scale-95 transition-all shadow-sm"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:block px-4 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] text-sm font-medium transition-all hover:scale-105"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
}
