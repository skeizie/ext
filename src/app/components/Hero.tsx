import React from "react";
import { motion } from "motion/react";

export function Hero() {
  return (
    <div className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-accent/10 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold uppercase tracking-wider mb-6">
            Chrome Extensions by Keizie
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Supercharge Your <br className="hidden md:block" /> Browser Experience
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            A curated list of high-performance Chrome extensions designed to boost productivity, 
            enhance aesthetics, and simplify your workflow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#products" 
              className="w-full sm:w-auto px-8 py-4 bg-brand-accent text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-brand-accent/20"
            >
              Browse Extensions
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
