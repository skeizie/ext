import React, { useState } from "react";
import { Star, Download, ArrowRight, CheckCircle2, X, ExternalLink, Globe, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChromeExtension } from "../data";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ScreenshotSlider } from "./ScreenshotSlider";

export function ProductCard({ 
  extension, 
  index, 
  onExpand 
}: { 
  extension: ChromeExtension, 
  index: number,
  onExpand: (ext: ChromeExtension) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col bg-card border border-white/5 rounded-3xl overflow-hidden hover:border-brand-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-accent/10"
    >
      <div className="aspect-[16/9] overflow-hidden bg-muted relative">
        <ScreenshotSlider 
          screenshots={extension.screenshots} 
          alt={extension.name}
        />
        <button 
          onClick={() => onExpand(extension)}
          className="absolute inset-0 z-10 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm transition-all duration-300"
        >
          <div className="bg-brand-accent text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-brand-accent/20 flex items-center space-x-2 transform scale-90 group-hover:scale-100 transition-transform">
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-brand-accent/50 transition-all">
              <ImageWithFallback src={extension.icon} alt={extension.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-brand-accent transition-colors">
                {extension.name}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center"><Star className="w-3 h-3 text-yellow-500 mr-1 fill-yellow-500" /> {extension.rating}</span>
                <span>•</span>
                <span className="flex items-center"><Download className="w-3 h-3 mr-1" /> {extension.installCount} installs</span>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-bold">
            {extension.price}
          </span>
        </div>

        <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
          {extension.description}
        </p>

        <ul className="space-y-3 mb-8 flex-1">
          {extension.features.slice(0, 3).map((feature, i) => (
            <li key={i} className="flex items-center text-xs text-white/70">
              <CheckCircle2 className="w-4 h-4 text-brand-accent mr-2 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          <button 
            onClick={() => onExpand(extension)}
            className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all text-white/70 hover:text-white"
          >
            Details
          </button>
          <a 
            href={extension.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-[2] flex items-center justify-center space-x-2 py-3 px-4 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-accent/20"
          >
            <span>Get Extension</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function ProductOverlay({ extension, onClose }: { extension: ChromeExtension, onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-card border border-white/10 w-full max-w-6xl h-full max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-4 bg-white/5 hover:bg-white/10 hover:text-brand-accent rounded-2xl transition-all backdrop-blur-md border border-white/10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Hero Section of Modal */}
          <div className="relative h-[40vh] min-h-[300px]">
            <div className="absolute inset-0">
              <ScreenshotSlider screenshots={extension.screenshots} alt={extension.name} className="h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            </div>
            
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] overflow-hidden ring-4 ring-white/10 shadow-2xl">
                    <ImageWithFallback src={extension.icon} alt={extension.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">{extension.name}</h2>
                    <p className="text-brand-accent text-lg md:text-xl font-medium">{extension.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                   <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center space-x-2">
                     <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                     <span className="font-bold">{extension.rating}</span>
                   </div>
                   <div className="bg-brand-accent text-white px-4 py-2 rounded-xl font-bold">
                     {extension.price}
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-brand-accent" />
                  </div>
                  <h3 className="text-xl font-bold">Overview</h3>
                </div>
                <p className="text-xl leading-relaxed text-white/70 font-light">
                  {extension.description}
                </p>
              </section>

              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-brand-accent" />
                  </div>
                  <h3 className="text-xl font-bold">What's Inside</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {extension.features.map((feature, i) => (
                    <div key={i} className="flex items-start space-x-4 bg-white/2 p-5 rounded-2xl border border-white/5 hover:border-brand-accent/20 transition-all group">
                      <div className="mt-1 w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0 group-hover:bg-brand-accent transition-colors">
                        <CheckCircle2 className="w-3 h-3 text-brand-accent group-hover:text-white" />
                      </div>
                      <span className="text-white/80 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <div className="bg-white/2 rounded-[2rem] p-8 border border-white/5">
                <h4 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-6">Market Statistics</h4>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Active Users</span>
                    <span className="text-xl font-bold">{extension.installCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Avg. Rating</span>
                    <span className="text-xl font-bold">{extension.rating} Stars</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Status</span>
                    <span className="text-xl font-bold text-green-500">Verified</span>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/5">
                  <a 
                    href={extension.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-3 w-full py-5 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-accent/30 group"
                  >
                    <span>Install Extension</span>
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <p className="text-[10px] text-center text-white/30 mt-4 uppercase tracking-widest">
                    Available on Chrome Web Store
                  </p>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center space-x-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40 leading-none">Developer</p>
                  <p className="text-sm font-bold text-white/80">Stripe Verified Merchant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProductList({ extensions }: { extensions: ChromeExtension[] }) {
  const [selectedExtension, setSelectedExtension] = useState<ChromeExtension | null>(null);

  return (
    <section id="products" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Our Extensions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">High-quality tools designed to enhance your digital experience across the web.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {extensions.map((ext, index) => (
            <ProductCard 
              key={ext.id} 
              extension={ext} 
              index={index} 
              onExpand={setSelectedExtension}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedExtension && (
          <ProductOverlay 
            extension={selectedExtension} 
            onClose={() => setSelectedExtension(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}

