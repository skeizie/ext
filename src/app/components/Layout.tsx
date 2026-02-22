import React from "react";
import { Chrome, Github, Twitter, Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="https://ext.keizie.com" className="flex items-center space-x-2 group">
              <div className="p-1.5 bg-brand-accent/20 rounded-lg group-hover:bg-brand-accent/30 transition-colors">
                <Chrome className="w-6 h-6 text-brand-accent" />
              </div>
              <span className="text-xl font-bold tracking-tight">Ext. Keizie</span>
            </a>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="/#products" 
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Extensions
            </a>
            <a href="/contact" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Support</a>
            <a 
              href="https://keizie.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative inline-flex items-center justify-center px-8 py-2.5 font-bold text-[#A467FF] transition-all duration-500 bg-[#291D3B] rounded-full hover:shadow-[0_0_35px_10px_rgba(164,103,255,0.4)] active:scale-95 overflow-hidden"
            >
              <span className="absolute inset-0 rounded-full border border-white/10 group-hover:border-white/20 transition-all duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></span>
              <span className="relative z-10 flex items-center gap-2 tracking-wide">
                <span>Portfolio</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
            </a>
          </nav>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-foreground">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-white/10 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <a 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium hover:text-brand-accent text-white/70"
            >
              Products
            </a>
            <a 
              href="/contact" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium hover:text-brand-accent text-white/70"
            >
              Support
            </a>
            <div className="pt-4 px-3">
              <a href="https://keizie.com" target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-2 bg-[#291D3B] text-[#A467FF] rounded-full text-sm font-bold border border-[#A467FF]/20">
                Portfolio
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <Chrome className="w-6 h-6 text-brand-accent" />
              <span className="text-xl font-bold tracking-tight text-white">Ext. Kezie</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Hand-crafted Chrome extensions built to improve your digital life. Simple, powerful, and secure.
            </p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/keizie/" className="text-muted-foreground hover:text-brand-accent transition-colors"><LinkedIn className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-brand-accent transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-brand-accent transition-colors"><Github className="w-5 h-5" /></a>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Merchant ID: ***-***-***</p>
              <a href="/contact" className="hover:text-brand-accent transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-4 md:space-y-0">
            <p>© 2026 Ext. Keizie. All rights reserved.</p>
            <a href="/admin" className="hover:text-brand-accent transition-colors">Management Console</a>
          </div>
          <p className="mt-4 md:mt-0">Connected to Stripe for secure payments.</p>
        </div>
      </div>
    </footer>
  );
}
