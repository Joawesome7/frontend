import React, { useState, useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Hooks
import { useRooms } from "./hooks/useRooms";
import { useLightbox } from "./hooks/useLightbox";
import { useBooking } from "./hooks/useBooking";

// Layout Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Section Components
import GallerySection from "./components/sections/GallerySection";
import RoomsSection from "./components/sections/RoomsSection";
import AboutSection from "./components/sections/AboutSection";
import MapSection from "./components/sections/MapSection";
import ContactSection from "./components/sections/ContactSection";

// Modal Components
import Lightbox from "./components/gallery/Lightbox";
import BookingModal from "./components/booking/BookingModal";
import HouseRulesModal from "./components/HouseRulesModal";
import AdminDashboard from "./components/AdminDashboard";
import PaymentInstructionsModal from "./components/booking/PaymentInstructionsModal";

// Assets
import hero from "./assets/img/hero.jpg";

const VillaRoseResort = () => {
  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoFloating, setIsLogoFloating] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  // Custom Hooks
  const { rooms, fetchRooms, isLoadingRooms } = useRooms();
  const {
    lightbox,
    openLightbox,
    closeLightbox,
    nextLightboxImage,
    prevLightboxImage,
  } = useLightbox();
  const bookingHook = useBooking();

  // Handle scroll for floating logo
  useEffect(() => {
    const handleScroll = () => {
      setIsLogoFloating(window.scrollY > 120);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  // Handle navigation clicks
  const handleNavClick = (item) => {
    if (item === "house rules") {
      setIsRulesOpen(true);
    } else {
      scrollToSection(item);
    }
    setIsMenuOpen(false);
  };

  // Handle admin dashboard close
  const handleAdminClose = () => {
    setIsAdminOpen(false);
    fetchRooms(); // Refresh rooms after admin changes
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(3,7,18,0.35), rgba(3,7,18,0.6)), url(${hero})`,
          filter: "contrast(0.98) saturate(1.03)",
        }}
      />
      {/* Metadata */}
      <title>Villa Rose Sea Breeze Resort | Surf, Relax & Mountains</title>
      <link rel="preload" as="image" href={hero} />
      <meta
        name="description"
        content="Welcome to Villa Rose Sea Breeze Resort. A serene family-owned getaway for surf enthusiasts and beach lovers. Mountains, rolling waves, and calm mornings await."
      />
      <meta
        name="keywords"
        content="resort, sea breeze, surfing, vacation, villa rose, beach resort, family getaway"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.villarose-resort.com/" />
      <meta property="og:title" content="Villa Rose Sea Breeze Resort" />
      <meta
        property="og:description"
        content="Mountains • Rolling waves • Calm mornings. Book your stay at our cozy haven by the sea."
      />
      <meta property="og:image" content={hero} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta
        property="twitter:url"
        content="https://www.villarose-resort.com/"
      />
      <meta property="twitter:title" content="Villa Rose Sea Breeze Resort" />
      <meta
        property="twitter:description"
        content="Experience the perfect blend of relaxation and adventure just minutes from the beach."
      />
      <meta property="twitter:image" content={hero} />

      {/* Skip Link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-slate-800 focus:rounded-lg"
      >
        Skip to content
      </a>

      <SpeedInsights />

      {/* Header/Hero */}
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isLogoFloating={isLogoFloating}
        isRulesOpen={isRulesOpen}
        setIsRulesOpen={setIsRulesOpen}
        onNavClick={handleNavClick}
        onScrollToSection={scrollToSection}
        onOpenBooking={() => setIsBookingModalOpen(true)}
      />

      {/* Main Content */}
      <main id="main" className="py-9">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/35 to-slate-900/55" />
        <GallerySection onImageClick={openLightbox} />
        <RoomsSection rooms={rooms} onImageClick={openLightbox} />
        <AboutSection />
        <MapSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onAdminAccess={() => setIsAdminOpen(true)} />

      {/* Modals */}
      <Lightbox
        isOpen={lightbox.isOpen}
        images={lightbox.images}
        currentIndex={lightbox.index}
        onClose={closeLightbox}
        onNext={nextLightboxImage}
        onPrev={prevLightboxImage}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        rooms={rooms}
        bookingHook={bookingHook}
      />

      <HouseRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <PaymentInstructionsModal
        isOpen={bookingHook.isPaymentModalOpen}
        onClose={() => bookingHook.setIsPaymentModalOpen(false)}
        paymentData={bookingHook.paymentInstructions}
      />

      {isAdminOpen && <AdminDashboard onClose={handleAdminClose} />}
    </div>
  );
};

export default VillaRoseResort;
