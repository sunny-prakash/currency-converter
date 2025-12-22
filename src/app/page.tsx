"use client";

import { Header } from "@/components/Header";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Globe, Shield, Zap } from "lucide-react";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full bg-[var(--background)] relative flex flex-col overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000" 
        />
      </div>

      <Header />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 py-24"
      >
        
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--foreground)]/5 border border-[var(--card-border)] text-[var(--text-secondary)] text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span>Redefining Currency Exchange</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-[var(--foreground)] tracking-tight mb-6">
            Global Finance, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              Simplified.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Experience the future of currency conversion with real-time data, 
            premium aesthetics, and seamless user experience.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-20"
        >
          {[
            {
              icon: <Zap className="w-8 h-8 text-yellow-500" />,
              title: "Lightning Fast",
              desc: "Real-time exchange rates updated every second for maximum accuracy."
            },
            {
              icon: <Globe className="w-8 h-8 text-blue-500" />,
              title: "Global Coverage",
              desc: "Support for major world currencies with historical market data analysis."
            },
            {
              icon: <Shield className="w-8 h-8 text-green-500" />,
              title: "Secure & Reliable",
              desc: "Built with modern tech stack ensuring stability and precision in every calculation."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.05, translateY: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group p-8 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-[var(--foreground)]/5 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--foreground)]/5 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">{feature.title}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          variants={itemVariants}
          className="w-full rounded-[3rem] bg-gradient-to-r from-purple-900/10 to-blue-900/10 border border-[var(--card-border)] p-12 text-center relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">Ready to start converting?</h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/convert" 
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--foreground)] text-[var(--background)] font-bold transition-all duration-300 shadow-lg"
              >
                <span>Launch Converter</span>
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </motion.div>

      </motion.div>
    </main>
  );
}
