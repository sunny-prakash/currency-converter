"use client";

import { ConverterCard } from "@/components/ConverterCard";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[var(--background)] relative flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-pink-600/10 rounded-full blur-[100px]" />
      </div>

      <Header />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-4xl w-full text-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            Global Currency <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Exchange Made Simple
            </span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Real-time exchange rates for over 150 currencies. Fast, secure, and designed for the modern world.
          </p>
        </div>

        <ConverterCard />
      </div>
    </main>
  );
}
