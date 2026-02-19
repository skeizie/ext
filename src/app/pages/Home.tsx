import React, { useEffect, useState } from "react";
import { Header, Footer } from "../components/Layout";
import { Hero } from "../components/Hero";
import { ProductList } from "../components/Products";
import { MiniGame } from "../components/MiniGame";
import { extensions as localExtensions, ChromeExtension } from "../data";
import { fetchExtensions } from "../api";

export function Home() {
  const [extensions, setExtensions] = useState<ChromeExtension[]>(localExtensions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchExtensions();
        if (data && data.length > 0) {
          setExtensions(data);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic extensions, using local fallback", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground dark selection:bg-brand-accent/30">
      <Header />
      <main>
        <Hero />
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
          </div>
        ) : (
          <ProductList extensions={extensions} />
        )}
        
        {/* Stripe Trust Section */}
        <section className="py-20 border-t border-white/5 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-transparent">
            <div className="mb-12">
            </div>
            
            <MiniGame />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
