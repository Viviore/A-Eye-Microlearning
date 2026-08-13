"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Play } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import { motion, AnimatePresence } from "framer-motion";

interface LandingNavbarProps {
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}

export function LandingNavbar({ ctaLabel = "Start Training", ctaHref = "/how-to-play", onCtaClick }: LandingNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "The Protocol", href: "/#protocol" },
    { label: "Mission", href: "/#mission" },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (window.location.pathname !== "/") {
      return; // Let standard navigation handle it
    }
    
    e.preventDefault();
    const hash = href.replace("/", "");
    const element = document.querySelector(hash);
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

  const renderCtaButton = () => (
    <BrutalButton 
      size="nav" 
      variant="hero"
      className="w-full md:w-auto group"
      onClick={onCtaClick}
    >
      <Play className="mr-2 w-5 h-5" />
      {ctaLabel}
    </BrutalButton>
  );

  const renderNavContent = () => (
    <>
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

      {onCtaClick ? (
        <div className="w-full md:w-auto">
          {renderCtaButton()}
        </div>
      ) : (
        <Link href={ctaHref} passHref className="w-full md:w-auto">
          {renderCtaButton()}
        </Link>
      )}
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b-[4px] border-[#0F172A] bg-white/95 backdrop-blur-sm">
      <div className="max-w-[1400px] w-full mx-auto px-4 md:px-6 py-3 xl:h-20 xl:py-0 flex items-center justify-between relative">
        
        {/* Brand Mark */}
        <Link href="/#hero" onClick={(e) => scrollToSection(e, "/#hero")} className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div 
            className="border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] transition-transform group-hover:-rotate-2 group-hover:scale-105 overflow-hidden flex items-center justify-center bg-[#FFB800]"
          >
            <img src="/logo.png" alt="A-Eye Logo" className="w-10 h-10 object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold tracking-wide text-[#0F172A] uppercase text-xl sm:text-2xl md:text-3xl group-hover:text-[#FFB800] transition-colors leading-none whitespace-nowrap">
              A-EYE <span className="text-[#0F172A]/60 hidden sm:inline">| MIL SIMULATOR</span>
            </span>
          </div>
        </Link>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden p-2 text-[#0F172A] border-[4px] border-[#0F172A] bg-white shadow-[3px_3px_0px_0px_#0F172A] hover:bg-[#FFB800] transition-colors cursor-pointer w-11 h-11 flex items-center justify-center relative z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isMobileMenuOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center gap-8">
          {renderNavContent()}
        </nav>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav 
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-white border-b-[4px] border-[#0F172A] absolute top-full left-0 right-0 z-40 shadow-[0_12px_0px_0px_rgba(0,0,0,0.1)]"
          >
            <div className="flex flex-col items-center gap-6 p-6">
              {renderNavContent()}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
