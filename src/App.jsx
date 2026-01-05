import React, { useState, useEffect } from "react";
import AdminDashboard from "./components/AdminDashboard";
import logo from "./assets/img/logo.png";
import hero from "./assets/img/hero.jpg";
import pool from "./assets/img/Pool.jpg";
// Gallery Images
import gallery2 from "./assets/img/gallery2.jpg";
import gallery3 from "./assets/img/gallery3.jpg";
import gallery5 from "./assets/img/gallery5.jpg";
import gallery7 from "./assets/img/gallery7.jpg";
import gallery11 from "./assets/img/gallery11.jpg";

// Room 1 Images (Couple) - Fallback images
import room1 from "./assets/img/room1.jpg";
import room1_2 from "./assets/img/room1.jpg";
import room1_3 from "./assets/img/room1.jpg";

// Room 2 Images (Family) - Fallback images
import room2 from "./assets/img/room2.jpg";
import room2_2 from "./assets/img/room2.jpg";

// Room 3 Images (Bungalow) - Fallback images
import room3 from "./assets/img/room3.jpg";
import room3_1 from "./assets/img/room3-1.jpg";
import room3_2 from "./assets/img/room3-2.jpg";

// Contact links
import ContactLinks from "./components/ContactLinks";

// House rules modal
import HouseRulesModal from "./components/HouseRulesModal";

const VillaRoseResort = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoFloating, setIsLogoFloating] = useState(false);
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    index: 0,
    images: [],
  });
  const [roomCarousels, setRoomCarousels] = useState({
    couple: 0,
    family: 0,
    bungalow: 0,
  });

  // Booking modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState("gallery"); // 'gallery' | 'details' | 'form'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingFormData, setBookingFormData] = useState({
    checkIn: "",
    checkOut: "",
    guestsCount: 1,
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    specialRequests: "",
  });
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [rooms, setRooms] = useState({});
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const galleryImages = [
    {
      src: hero,
      alt: "Ocean view at sunset",
      caption: "Ocean view at sunset",
    },
    {
      src: gallery3,
      alt: "Beautiful Scenery",
      caption: "Beautiful Scenery",
    },
    {
      src: gallery5,
      alt: "Surf-ready beach",
      caption: "Surf-ready beach",
    },
    {
      src: gallery11,
      alt: "Pool inside Villa",
      caption: "Pool inside Villa",
    },
    { src: gallery2, alt: "Kiddie pool", caption: "Kiddie pool" },
    {
      src: gallery7,
      alt: "Spacious living room",
      caption: "Spacious living room",
    },
  ];

  // Fallback room data (used if API fails)
  const fallbackRooms = {
    couple: {
      key: "couple",
      title: "Couple Room",
      description:
        "Perfect for couples seeking a romantic getaway. Enjoy stunning ocean views from your private balcony, complete with modern amenities and a comfortable king-sized bed.",
      price: "2000 Php/night",
      images: [room1, room1_2, room1_3],
      amenities: [
        "Ocean View",
        "King Bed",
        "Air Conditioning",
        "Private Balcony",
        "WiFi",
        "Mini Fridge",
      ],
    },
    family: {
      key: "family",
      title: "Family Room",
      description:
        "Spacious rooms perfect for family vacations, with extra beds available and plenty of space for everyone to relax and enjoy quality time together.",
      price: "3000 Php/night",
      images: [room2, room2_2],
      amenities: [
        "Extra Beds",
        "Air Conditioning",
        "WiFi",
        "Kitchenette",
        "Living Area",
        "TV",
      ],
    },
    bungalow: {
      key: "bungalow",
      title: "Bungalow House",
      description:
        "Spacious bungalow perfect for groups and families. Features secure surfboard storage, direct beach access, and outdoor amenities for the ultimate beach vacation.",
      price: "8000 Php/night",
      images: [room3, room3_1, room3_2],
      amenities: [
        "Surfboard Storage",
        "Beach Access",
        "Outdoor Shower",
        "BBQ Area",
        "Parking",
        "WiFi",
      ],
    },
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoadingRooms(true);
      try {
        const response = await fetch(`${API_URL}/api/rooms`);
        const data = await response.json();

        if (response.ok && data.rooms && data.rooms.length > 0) {
          // Convert array to object keyed by room.key
          const roomsObj = {};
          data.rooms.forEach((room) => {
            roomsObj[room.key] = {
              ...room,
              images: Array.isArray(room.images)
                ? room.images
                : JSON.parse(room.images || "[]"),
              amenities: Array.isArray(room.amenities)
                ? room.amenities
                : JSON.parse(room.amenities || "[]"),
            };
          });
          setRooms(roomsObj);
        } else {
          // Use fallback rooms if API fails
          setRooms(fallbackRooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        // Use fallback rooms if API fails
        setRooms(fallbackRooms);
      } finally {
        setIsLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

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

  // Lightbox handlers
  const openLightbox = (images, index) => {
    setLightbox({ isOpen: true, index, images });
  };

  const closeLightbox = () => {
    setLightbox({ isOpen: false, index: 0, images: [] });
  };

  const nextLightboxImage = () => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length,
    }));
  };

  const prevLightboxImage = () => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index - 1 + prev.images.length) % prev.images.length,
    }));
  };

  // Room carousel handlers
  const nextRoomImage = (roomKey) => {
    setRoomCarousels((prev) => ({
      ...prev,
      [roomKey]: (prev[roomKey] + 1) % rooms[roomKey].images.length,
    }));
  };

  const prevRoomImage = (roomKey) => {
    setRoomCarousels((prev) => ({
      ...prev,
      [roomKey]:
        (prev[roomKey] - 1 + rooms[roomKey].images.length) %
        rooms[roomKey].images.length,
    }));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.isOpen) return;

      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightboxImage();
      if (e.key === "ArrowLeft") prevLightboxImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox.isOpen]);

  // Booking modal handlers
  const openBookingModal = () => {
    setIsBookingModalOpen(true);
    setBookingStep("gallery");
    setSelectedRoom(null);
    setAvailabilityStatus(null);
  };

  const handleNavClick = (item) => {
    if (item === "house rules") {
      setIsRulesOpen(true);
    } else {
      // Standard scrolling for other links
      scrollToSection(item);
    }
    // Always close mobile menu after clicking a link
    setIsMenuOpen(false);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setBookingStep("gallery");
    setSelectedRoom(null);
    setBookingFormData({
      checkIn: "",
      checkOut: "",
      guestsCount: 1,
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      specialRequests: "",
    });
    setAvailabilityStatus(null);
  };

  const selectRoom = (roomKey) => {
    setSelectedRoom(roomKey);
    setBookingStep("details");
  };

  const goToBookingForm = () => {
    setBookingStep("form");
  };

  const goBackToGallery = () => {
    setBookingStep("gallery");
    setSelectedRoom(null);
  };

  const goBackToDetails = () => {
    setBookingStep("details");
    setAvailabilityStatus(null);
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const checkAvailability = async () => {
    if (!bookingFormData.checkIn || !bookingFormData.checkOut) {
      showNotification("Please select check-in and check-out dates", "error");
      return;
    }

    setIsLoading(true);
    setAvailabilityStatus(null);

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/check-availability`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomType: selectedRoom,
            checkIn: bookingFormData.checkIn,
            checkOut: bookingFormData.checkOut,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setAvailabilityStatus(data);
      } else {
        showNotification(
          data.message || "Failed to check availability",
          "error"
        );
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      showNotification(
        "Failed to connect to server. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const submitBooking = async (e) => {
    e.preventDefault();

    // Validation
    if (!bookingFormData.checkIn || !bookingFormData.checkOut) {
      showNotification("Please select check-in and check-out dates", "error");
      return;
    }

    if (
      !bookingFormData.guestName ||
      !bookingFormData.guestEmail ||
      !bookingFormData.guestPhone
    ) {
      showNotification("Please fill in all guest information", "error");
      return;
    }

    setIsLoading(true);

    try {
      console.log("📤 Sending booking request:", {
        roomType: selectedRoom,
        checkIn: bookingFormData.checkIn,
        checkOut: bookingFormData.checkOut,
        guestsCount: bookingFormData.guestsCount,
      });

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomType: selectedRoom,
          guestName: bookingFormData.guestName,
          guestEmail: bookingFormData.guestEmail,
          guestPhone: bookingFormData.guestPhone,
          checkIn: bookingFormData.checkIn,
          checkOut: bookingFormData.checkOut,
          guestsCount: bookingFormData.guestsCount,
          specialRequests: bookingFormData.specialRequests,
        }),
      });

      const data = await response.json();
      console.log("📥 Server response:", data);

      if (response.ok) {
        showNotification(
          data.message ||
            "Booking confirmed! Check your email for payment instructions.",
          "success"
        );

        // Show payment instructions
        if (data.paymentInstructions) {
          console.log("💰 Payment Instructions:", data.paymentInstructions);
          // You can display this in a modal or alert
          alert(`
Booking Reference: ${data.bookingReference}

Payment Instructions:
Amount to Pay: ₱${data.paymentInstructions.depositAmount}
GCash Number: ${data.paymentInstructions.gcashNumber}
GCash Name: ${data.paymentInstructions.gcashName}

Please send proof of payment to confirm your booking.
        `);
        }

        closeBookingModal();
      } else {
        console.error("❌ Booking failed:", data);
        showNotification(
          data.error || data.details || "Failed to create booking",
          "error"
        );
      }
    } catch (error) {
      console.error("❌ Error creating booking:", error);
      showNotification(
        "Failed to connect to server. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      {/* Skip Link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-slate-800 focus:rounded-lg"
      >
        Skip to content
      </a>

      {/* Header/Hero */}
      <header className="relative min-h-[72vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            // 🖼️ STEP 3: UPDATE INLINE REFERENCES (Hero Background)
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
              // 🖼️ STEP 3: UPDATE INLINE REFERENCES (Logo Image)
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

          {/* Desktop Navigation
          <nav className="hidden md:flex items-center gap-3">
            {["gallery", "rooms", "about", "map", "contact", "house rules"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="px-3 py-2 rounded-2xl font-semibold uppercase hover:bg-white/5 transition-colors"
                >
                  {item}
                </button>
              )
            )}
          </nav> */}
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-3">
            {["gallery", "rooms", "about", "map", "contact", "house rules"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)} // Calling our logic
                  className="px-3 py-2 rounded-2xl font-semibold uppercase hover:bg-white/5 text-white transition-colors"
                >
                  {item}
                </button>
              )
            )}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden absolute top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-lg z-20 p-5">
            <ul className="space-y-2">
              {[
                "gallery",
                "rooms",
                "about",
                "map",
                "contact",
                "house rules",
              ].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item)}
                    className="w-full text-left px-4 py-3 rounded-xl font-semibold capitalize hover:bg-white/5 transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <HouseRulesModal
          isOpen={isRulesOpen}
          onClose={() => setIsRulesOpen(false)}
        />

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
              onClick={openBookingModal}
              className="px-5 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform"
            >
              Book Now
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
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

      {/* Main Content */}
      <main id="main" className="py-9">
        {/* Gallery Section */}
        <section
          id="gallery"
          className="w-[90%] max-w-4xl mx-auto my-9 p-6 rounded-2xl bg-gradient-to-b from-white/3 to-white/1 border border-white/10 backdrop-blur-lg shadow-xl"
        >
          <h2 className="text-3xl font-serif font-semibold mb-6">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(galleryImages, idx)}
                className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 cursor-pointer group"
              >
                <img
                  src={img.src} // Uses the imported variable via the galleryImages array
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/65 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rooms Section */}
        <section
          id="rooms"
          className="w-[90%] max-w-4xl mx-auto my-9 p-6 rounded-2xl bg-gradient-to-b from-white/3 to-white/1 border border-white/10 backdrop-blur-lg shadow-xl"
        >
          <h2 className="text-3xl font-serif font-semibold mb-6">Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(rooms).map(([key, room]) => (
              <article
                key={key}
                className="p-4 rounded-2xl bg-gradient-to-b from-white/4 to-white/1 border border-white/5 shadow-lg hover:-translate-y-2 transition-transform"
              >
                <h3 className="text-xl font-semibold mb-2">{room.title}</h3>
                <p className="text-slate-300 text-sm mb-3">
                  {room.description}
                </p>

                {/* Room Carousel */}
                <div className="relative rounded-2xl overflow-hidden mb-3 group">
                  <img
                    src={room.images[roomCarousels[key]]} // Uses the imported variable via the rooms data structure
                    alt={`${room.title} - view ${roomCarousels[key] + 1}`}
                    className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      const roomImages = room.images.map((src, idx) => ({
                        src,
                        alt: `${room.title} - view ${idx + 1}`,
                        caption: `${room.title} - view ${idx + 1}`,
                      }));
                      openLightbox(roomImages, roomCarousels[key]);
                    }}
                    loading="lazy"
                  />

                  {room.images.length > 1 && (
                    <>
                      <button
                        onClick={() => prevRoomImage(key)}
                        className="absolute left-2 bottom-2 p-2 rounded-2xl bg-black/50 text-white hover:bg-black/70 transition-colors"
                        aria-label="Previous image"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                      </button>
                      <button
                        onClick={() => nextRoomImage(key)}
                        className="absolute right-2 bottom-2 p-2 rounded-2xl bg-cyan-400 text-slate-900 font-bold hover:bg-cyan-300 transition-colors"
                        aria-label="Next image"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-3 px-2 py-1 rounded-2xl bg-black/40 text-white text-sm">
                        {roomCarousels[key] + 1} / {room.images.length}
                      </div>
                    </>
                  )}
                </div>

                <div className="text-slate-300">
                  From <strong className="text-slate-50">{room.price}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="w-[90%] max-w-4xl mx-auto my-9 p-6 rounded-2xl bg-gradient-to-b from-white/3 to-white/1 border border-white/10 backdrop-blur-lg shadow-xl"
        >
          <h2 className="text-3xl font-serif font-semibold mb-4">About Us</h2>
          <p className="mb-4 leading-relaxed">
            Welcome to <strong>Villa Rose Sea Breeze Resort</strong>, your
            serene getaway just a 5–10 minutes' walk from the beach. Nestled in
            a paradise for surf enthusiasts, our resort offers the perfect blend
            of relaxation and adventure for both families and travelers seeking
            the ocean breeze. As a family-owned business, we take pride in
            providing a personal touch, making every guest feel at home. Whether
            you're here to catch waves, unwind by the shore, or simply enjoy
            quality time with loved ones, Villa Rose Sea Breeze Resort is your
            cozy haven by the sea. Come for the surf, stay for the warmth, and
            leave with memories that last a lifetime.
          </p>
          <img
            // 🖼️ STEP 3: UPDATE INLINE REFERENCES (Pool Image)
            src={pool}
            alt="coastal breakfast"
            className="w-full rounded-2xl"
            loading="lazy"
          />
        </section>

        {/* Map Section */}
        <section
          id="map"
          className="w-[90%] max-w-4xl mx-auto my-9 p-6 rounded-2xl bg-gradient-to-b from-white/3 to-white/1 border border-white/10 backdrop-blur-lg shadow-xl"
        >
          <h2 className="text-3xl font-serif font-semibold mb-4">Find Us</h2>
          <div className="rounded-2xl overflow-hidden border border-white/5 hover:-translate-y-2 hover:shadow-2xl transition-all">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m22!1m8!1m3!1d4972.395264003847!2d124.3954252238985!3d13.687303698623056!3m2!1i1024!2i768!4f13.1!4m11!3e0!4m5!1s0x33bd808ce09aadf9%3A0xb525a5fab9ca1984!2sCabuco%2C%20Trece%20Martires%20City%2C%20Cavite!3m2!1d14.2749595!2d120.85276549999999!4m3!3m2!1d13.6868292!2d124.4005378!5e1!3m2!1sen!2sph!4v1763611682219!5m2!1sen!2sph"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-4">
            <a
              href="https://maps.app.goo.gl/az55xVDdkMLda4Yo6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 rounded-full bg-cyan-400 text-slate-900 font-bold hover:-translate-y-1 transition-transform"
            >
              Get Directions
            </a>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="w-[90%] max-w-4xl mx-auto my-9 p-6 rounded-2xl bg-gradient-to-b from-white/3 to-white/1 border border-white/10 backdrop-blur-lg shadow-xl"
        >
          <h2 className="text-3xl font-serif font-semibold mb-4">Contact Us</h2>
          <ContactLinks />
        </section>
      </main>

      {/* Footer */}
      <footer className="pb-10 pt-5 text-center">
        <div className="w-[90%] max-w-4xl mx-auto p-3 rounded-2xl bg-gradient-to-b from-white/4 to-white/1 border border-white/5 backdrop-blur-sm">
          <p
            className="text-slate-300 text-sm cursor-pointer select-none"
            onDoubleClick={() => setIsAdminOpen(true)}
            title="Double-click for admin access"
          >
            © {new Date().getFullYear()} Villa Rose Sea Breeze Resort — All
            rights reserved.
          </p>
        </div>
      </footer>

      {/* HouseRulesModal
      <HouseRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      /> */}

      {/* Lightbox Modal */}
      {lightbox.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 text-white text-4xl hover:scale-110 transition-transform"
            aria-label="Close preview"
          >
            ×
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevLightboxImage();
            }}
            className="absolute left-5 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl hover:bg-white/20 transition-colors shadow-2xl"
            aria-label="Previous image"
          >
            ◀
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextLightboxImage();
            }}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl hover:bg-white/20 transition-colors shadow-2xl"
            aria-label="Next image"
          >
            ▶
          </button>

          <div
            className="max-w-5xl w-[calc(100%-40px)] p-3 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.images[lightbox.index]?.src} // Uses the imported variable via the lightbox state
              alt={lightbox.images[lightbox.index]?.alt}
              className="max-w-full h-auto rounded-2xl shadow-2xl"
            />
            {lightbox.images[lightbox.index]?.caption && (
              <p className="mt-3 text-slate-300">
                {lightbox.images[lightbox.index].caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/95 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-6xl my-4 sm:my-8">
            {/* Close Button */}
            <button
              onClick={closeBookingModal}
              className="absolute -top-2 -right-2 sm:top-4 sm:right-4 z-20 w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-2xl border border-white/20"
              aria-label="Close booking"
            >
              ×
            </button>

            {/* Notification */}
            {notification && (
              <div
                className={`fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-full shadow-2xl ${
                  notification.type === "success"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {notification.message}
              </div>
            )}

            {/* Gallery View */}
            {bookingStep === "gallery" && (
              <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl p-4 sm:p-8 backdrop-blur-lg">
                <h2 className="text-2xl sm:text-3xl font-serif font-semibold mb-6 text-center">
                  Choose Your Room
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {Object.entries(rooms).map(([key, room]) => (
                    <div
                      key={key}
                      onClick={() => selectRoom(key)}
                      className="group cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-b from-white/8 to-white/2 border border-white/10 hover:border-cyan-400/50 transition-all hover:-translate-y-2 shadow-xl"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={room.images[0]}
                          alt={room.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">
                          {room.title}
                        </h3>
                        <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                          {room.description}
                        </p>
                        <p className="text-cyan-400 font-bold">
                          From {room.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Room Details View */}
            {bookingStep === "details" && selectedRoom && (
              <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg">
                <button
                  onClick={goBackToGallery}
                  className="mb-4 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2"
                >
                  ← Back to Rooms
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Photo Gallery */}
                  <div>
                    <div className="relative rounded-2xl overflow-hidden mb-4">
                      <img
                        src={
                          rooms[selectedRoom].images[
                            roomCarousels[selectedRoom]
                          ]
                        }
                        alt={rooms[selectedRoom].title}
                        className="w-full h-96 object-cover"
                      />
                      {rooms[selectedRoom].images.length > 1 && (
                        <>
                          <button
                            onClick={() => prevRoomImage(selectedRoom)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                          >
                            ◀
                          </button>
                          <button
                            onClick={() => nextRoomImage(selectedRoom)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                          >
                            ▶
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                            {roomCarousels[selectedRoom] + 1} /{" "}
                            {rooms[selectedRoom].images.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Gallery */}
                    {rooms[selectedRoom].images.length > 1 && (
                      <div className="grid grid-cols-3 gap-2">
                        {rooms[selectedRoom].images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${rooms[selectedRoom].title} view ${idx + 1}`}
                            className={`w-full h-20 object-cover rounded-lg cursor-pointer border-2 ${
                              roomCarousels[selectedRoom] === idx
                                ? "border-cyan-400"
                                : "border-white/10"
                            } hover:border-cyan-400/50 transition-colors`}
                            onClick={() =>
                              setRoomCarousels((prev) => ({
                                ...prev,
                                [selectedRoom]: idx,
                              }))
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Room Info */}
                  <div>
                    <h2 className="text-3xl font-serif font-semibold mb-3">
                      {rooms[selectedRoom].title}
                    </h2>
                    <p className="text-2xl text-cyan-400 font-bold mb-4">
                      From {rooms[selectedRoom].price}
                    </p>
                    <p className="text-slate-200 mb-6 leading-relaxed">
                      {rooms[selectedRoom].description}
                    </p>

                    {/* Amenities */}
                    <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {rooms[selectedRoom].amenities.map((amenity, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-slate-300"
                        >
                          <svg
                            className="w-5 h-5 text-cyan-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={goToBookingForm}
                      className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform"
                    >
                      Book This Room
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Form View */}
            {bookingStep === "form" && selectedRoom && (
              <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg">
                <button
                  onClick={goBackToDetails}
                  className="mb-4 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2"
                >
                  ← Back to Room Details
                </button>

                <h2 className="text-3xl font-serif font-semibold mb-2">
                  Complete Your Booking
                </h2>
                <p className="text-slate-300 mb-6">
                  Booking: {rooms[selectedRoom].title}
                </p>

                <form
                  onSubmit={submitBooking}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Check-in Date */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Check-in Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={bookingFormData.checkIn}
                      onChange={(e) =>
                        setBookingFormData({
                          ...bookingFormData,
                          checkIn: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Check-out Date */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Check-out Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={
                        bookingFormData.checkIn ||
                        new Date().toISOString().split("T")[0]
                      }
                      value={bookingFormData.checkOut}
                      onChange={(e) =>
                        setBookingFormData({
                          ...bookingFormData,
                          checkOut: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Number of Guests */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Number of Guests *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="10"
                      value={bookingFormData.guestsCount}
                      onChange={(e) =>
                        setBookingFormData({
                          ...bookingFormData,
                          guestsCount: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Availability Check Button */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={checkAvailability}
                      disabled={
                        isLoading ||
                        !bookingFormData.checkIn ||
                        !bookingFormData.checkOut
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-cyan-400/50 text-cyan-400 font-semibold hover:bg-cyan-400/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Checking..." : "Check Availability"}
                    </button>
                  </div>

                  {/* Availability Status */}
                  {availabilityStatus && (
                    <div
                      className={`md:col-span-2 p-4 rounded-xl ${
                        availabilityStatus.available
                          ? "bg-green-500/20 border border-green-500/50 text-green-300"
                          : "bg-red-500/20 border border-red-500/50 text-red-300"
                      }`}
                    >
                      {availabilityStatus.message}
                    </div>
                  )}

                  {/* Guest Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingFormData.guestName}
                      onChange={(e) =>
                        setBookingFormData({
                          ...bookingFormData,
                          guestName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-cyan-400 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Guest Email */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={bookingFormData.guestEmail}
                      onChange={(e) =>
                        setBookingFormData({
                          ...bookingFormData,
                          guestEmail: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-cyan-400 focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Guest Phone */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingFormData.guestPhone}
                      onChange={(e) =>
                        setBookingFormData({
                          ...bookingFormData,
                          guestPhone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-cyan-400 focus:outline-none"
                      placeholder="+63 912 345 6789"
                    />
                  </div>

                  {/* Special Requests */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      rows="3"
                      value={bookingFormData.specialRequests}
                      onChange={(e) =>
                        setBookingFormData({
                          ...bookingFormData,
                          specialRequests: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-cyan-400 focus:outline-none resize-none"
                      placeholder="Any special requests or requirements..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={
                        isLoading ||
                        (availabilityStatus && !availabilityStatus.available)
                      }
                      className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {isLoading ? "Processing..." : "Confirm Booking"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => {
            setIsAdminOpen(false);
            // Refresh rooms after admin changes
            const fetchRooms = async () => {
              try {
                const response = await fetch(`${API_URL}/api/rooms`);
                const data = await response.json();

                if (response.ok && data.rooms && data.rooms.length > 0) {
                  const roomsObj = {};
                  data.rooms.forEach((room) => {
                    roomsObj[room.key] = {
                      ...room,
                      images: Array.isArray(room.images)
                        ? room.images
                        : JSON.parse(room.images || "[]"),
                      amenities: Array.isArray(room.amenities)
                        ? room.amenities
                        : JSON.parse(room.amenities || "[]"),
                    };
                  });
                  setRooms(roomsObj);
                }
              } catch (error) {
                console.error("Error refreshing rooms:", error);
              }
            };
            fetchRooms();
          }}
        />
      )}
    </div>
  );
};

export default VillaRoseResort;
