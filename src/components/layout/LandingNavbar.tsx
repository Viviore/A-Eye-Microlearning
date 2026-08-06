"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Menu, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "The Protocol", href: "#protocol" },
    { label: "Mission", href: "#mission" },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // Offset for the fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b-[4px] border-dashed border-[#0F172A] bg-white/95 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 xl:h-20 xl:py-0 flex items-center justify-between relative">
        
        {/* Brand Mark */}
        <Link href="#hero" onClick={(e) => scrollToSection(e, "#hero")} className="flex items-center gap-3 group">
          <div 
            className="p-2 bg-[#FFB800] border-[4px] border-[#0F172A] text-white shadow-[4px_4px_0px_0px_#0F172A] transition-transform group-hover:-rotate-2 group-hover:scale-105"
          >
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold tracking-wide text-[#0F172A] uppercase text-2xl md:text-3xl group-hover:text-[#FFB800] transition-colors leading-none">
              A-EYE
            </span>
          </div>
        </Link>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden p-2 text-[#0F172A] border-[4px] border-[#0F172A] bg-white shadow-[3px_3px_0px_0px_#0F172A] hover:bg-[#FFB800] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Navigation & CTA */}
        <nav className={`${
          isMobileMenuOpen 
            ? "flex absolute top-full left-0 right-0 bg-white border-b-[4px] border-dashed border-[#0F172A] p-6 shadow-xl z-50 flex-col items-center gap-6" 
            : "hidden"
        } md:flex md:static md:flex-row md:bg-transparent md:border-none md:p-0 md:shadow-none md:items-center gap-6 md:gap-8`}>
          
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full md:w-auto">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="text-lg md:text-base font-sans font-bold text-[#0F172A] hover:text-[#FFB800] transition-colors uppercase tracking-wide relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#FFB800] transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <Link href="/how-to-play" passHref className="w-full md:w-auto">
            <Button 
              size="lg" 
              className="w-full md:w-auto h-12 px-6 text-base font-heading font-bold tracking-wide bg-[#FFB800] hover:bg-[#0F172A] hover:text-white text-[#0F172A] border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] hover:shadow-[2px_2px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 group"
            >
              <Play className="mr-2 w-5 h-5" />
              Start Training
            </Button>
          </Link>
        </nav>

      </div>
    </header>
  );
}
