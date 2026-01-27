import React from "react";
import logo from "../../assets/img/logo.png";
import hero from "../../assets/img/hero.jpg";

export default function Header({
  isMenuOpen,
  setIsMenuOpen,
  isLogoFloating,
  onNavClick,
  onScrollToSection,
  onOpenBooking,
}) {
  const navItems = [
    "gallery",
    "rooms",
    "about",
    "map",
    "contact",
    "house rules",
  ];

  return (
    <header className="relative min-h-[72vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(3,7,18,0.35), rgba(3,7,18,0.6)), url(${hero})`,
          filter: "contrast(0.98) saturate(1.03)",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/15 to-slate-900/55" />

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center mt-5 justify-between px-5 z-10">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`flex items-center gap-3 transition-all duration-200 ${
            isLogoFloating
              ? "fixed top-5 left-5 z-[99999] bg-white/5 px-3 py-2 rounded-full shadow-2xl backdrop-blur-sm"
              : ""
          }`}
        >
          <img
            src={logo}
            alt="Villa Rose logo"
            className={`object-contain rounded-full ${
              isLogoFloating ? "h-10" : "h-20"
            }`}
            onError={(e) => (e.target.style.display = "none")}
          />
          <span
            className={`font-bold font-serif ${
              isLogoFloating ? "hidden" : "block"
            }`}
          >
            Villa Rose Sea Breeze Resort
          </span>
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-slate-50"
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-3">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => onNavClick(item)}
              className="px-3 py-2 rounded-2xl font-semibold uppercase hover:bg-white/5 text-white transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden absolute top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-lg z-20 p-5">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item}>
                <button
                  onClick={() => onScrollToSection(item)}
                  className="w-full text-left px-4 py-3 rounded-xl font-semibold capitalize hover:bg-white/5 transition-colors"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Hero Content */}
      <div className="relative z-10 w-[calc(100%-40px)] max-w-4xl mx-5 my-5 p-9 rounded-2xl bg-gradient-to-br from-white/6 to-white/2 border border-white/10 backdrop-blur-lg shadow-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-2">
          Villa Rose Sea Breeze Resort
        </h1>
        <p className="text-slate-200 mb-4">
          Mountains • Rolling waves • Calm mornings
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={onOpenBooking}
            className="px-5 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform"
          >
            Book Now
          </button>
          <button
            onClick={() => onScrollToSection("gallery")}
            className="px-5 py-3 rounded-full border border-white/10 font-semibold hover:bg-white/5 transition-colors"
          >
            View Gallery
          </button>
        </div>
      </div>

      {/* Decorative Wave */}
      <svg
        className="absolute left-0 right-0 bottom-0 h-32 opacity-95 pointer-events-none"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGrad" x1="0" x2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.03)" />
          </linearGradient>
        </defs>
        <path
          d="M0,96 C240,180 480,20 720,96 C960,172 1200,40 1440,96 L1440,160 L0,160 Z"
          fill="url(#waveGrad)"
        />
      </svg>
    </header>
  );
}
