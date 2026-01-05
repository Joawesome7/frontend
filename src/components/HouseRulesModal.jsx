import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

// 1. Organize the long content into logical slides
const rulesSlides = [
  {
    title: "Welcome to Villa Rose",
    content: [
      {
        subtitle: "Introduction",
        text: "Welcome to Villa Rose Sea Breeze Resort! Please take a moment to read our house rules so that everyone can enjoy a comfortable and safe stay.",
      },
      {
        subtitle: "1. Check-In / Check-Out",
        list: [
          "Check-In: 2:00 PM | Check-Out: 12:00 NN",
          "Early arrivals may wait in the lobby/restaurant.",
          "Late check-out incurs additional charges.",
          "50% down payment required to confirm booking.",
          "Balance must be paid before check-in. No checks accepted.",
        ],
      },
    ],
  },
  {
    title: "Bookings & Guests",
    content: [
      {
        subtitle: "2. Cancellations",
        list: [
          "No refunds for cancelled bookings, no-shows, or early check-out.",
          "Rebooking allowed subject to availability (within 6 months).",
          "Travel insurance is recommended.",
        ],
      },
      {
        subtitle: "3. Guests & Visitors",
        list: [
          "Follow maximum room capacity. Extra guests have charges.",
          "Visitors allowed 9:00 AM – 7:00 PM with front desk approval.",
          "Room service is currently unavailable.",
        ],
      },
    ],
  },
  {
    title: "Property Care",
    content: [
      {
        subtitle: "4. Resort Property",
        list: [
          "Lost key fee: P500.",
          "Do not move/damage furniture. Damage fees apply to broken items and stains (ink, henna, oils).",
          "Do not flush wipes or objects in toilets.",
        ],
      },
      {
        subtitle: "5. Safety & Security",
        list: [
          "Keep valuables safe; resort is not liable for losses.",
          "Unknown visitors are not allowed in rooms.",
          "Gates close at 8:00 PM. Inform staff if exiting after 10:00 PM.",
          "Always lock your room.",
        ],
      },
    ],
  },
  {
    title: "Conduct & Restrictions",
    content: [
      {
        subtitle: "6. Pets",
        text: "Pets are not allowed inside rooms unless properly supervised. Damages caused by pets will be charged.",
      },
      {
        subtitle: "7. Proper Conduct",
        list: [
          "Quiet hours: 10:00 PM - 7:00 AM.",
          "Loud music/karaoke allowed only for pre-arranged events.",
          "Illegal drugs and violence result in immediate eviction.",
        ],
      },
      {
        subtitle: "8. Fixtures",
        text: "Do not tamper with electrical connections. Report issues immediately.",
      },
    ],
  },
  {
    title: "Conservation & Safety",
    content: [
      {
        subtitle: "9. Alcohol & Substances",
        text: "Drink responsibly. No alcohol for minors. Illegal drugs strictly banned.",
      },
      {
        subtitle: "10. Conservation",
        list: [
          "Turn off air-con/lights when leaving.",
          "Keep doors closed when aircon is on.",
          "Do not leave gadgets charging unattended.",
        ],
      },
      {
        subtitle: "11. Fire Safety",
        list: [
          "No large fires/unattended grills.",
          "Smoking only in designated areas. No candles/stoves in rooms.",
        ],
      },
    ],
  },
  {
    title: "Cleanliness & Dining",
    content: [
      {
        subtitle: "12. Wet Clothing",
        text: "Use drying racks. Do not hang clothes on balcony railings.",
      },
      {
        subtitle: "13. Cleanliness",
        text: "Do not litter. Rinse off sand before entering rooms.",
      },
      {
        subtitle: "14. Cooking & Dining",
        list: [
          "Common kitchen available (LPG: P300/day).",
          "No cooking in rooms. Rice cookers allowed with approval.",
          "Outdoor cooking in designated grill areas only.",
        ],
      },
    ],
  },
  {
    title: "Parking & Pool Rules",
    content: [
      {
        subtitle: "15. Parking",
        text: "Park in designated areas with pass visible. Resort not liable for vehicle damage.",
      },
      {
        subtitle: "16. Swimming Pool (7AM - 8PM)",
        list: [
          "Registered guests only. No lifeguard on duty.",
          "Proper swimwear required (swim diapers for kids).",
          "No food, glass, pets, or running.",
          "Shower before entering.",
          "Intoxicated guests may not swim.",
        ],
      },
    ],
  },
  {
    title: "Conclusion",
    content: [
      {
        subtitle: "17. Pool Safety",
        text: "Night swimming discouraged. Parents must watch children at all times.",
      },
      {
        subtitle: "18. Snack Bar",
        text: "Open from 8:00 AM – 8:00 PM",
      },
      {
        subtitle: "Important Reminder",
        text: "Failure to follow rules may result in eviction without refund. By booking, you agree to these rules. Enjoy your stay at Villa Rose!",
      },
    ],
  },
];

const HouseRulesModal = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % rulesSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + rulesSlides.length) % rulesSlides.length
    );
  };

  return (
    // Fixed Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4">
      {/* Modal Container - Using your Glassmorphism Design */}
      <div className="relative w-full max-w-2xl flex flex-col rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-lg shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 pt-12">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-xs font-bold tracking-[0.3em] text-cyan-300 mb-2 uppercase">
              Villa Rose Sea Breeze Resort
            </h3>
            <h2 className="text-3xl font-serif text-white tracking-wide">
              {rulesSlides[currentSlide].title}
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mt-4 rounded-full" />
          </div>

          {/* Dynamic Slide Content */}
          <div className="space-y-6 min-h-[300px]">
            {rulesSlides[currentSlide].content.map((section, idx) => (
              <div
                key={idx}
                className="bg-white/5 p-4 rounded-xl border border-white/5"
              >
                <h4 className="text-lg font-semibold text-cyan-100 mb-2">
                  {section.subtitle}
                </h4>
                {section.list ? (
                  <ul className="space-y-2">
                    {section.list.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-slate-200 text-sm font-light leading-relaxed"
                      >
                        <CheckCircle2
                          size={14}
                          className="mt-1 text-cyan-400 shrink-0"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-200 text-sm font-light leading-relaxed">
                    {section.text}
                  </p>
                )}{" "}
              </div>
            ))}
          </div>
        </div>

        {/* Footer / Navigation */}
        <div className="p-6 border-t border-white/10 bg-black/20 flex items-center justify-between">
          {/* Prev Button */}
          <button
            onClick={prevSlide}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group px-4 py-2 rounded-lg hover:bg-white/5"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="hidden sm:inline text-sm font-medium">
              Previous
            </span>
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {rulesSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? "w-8 bg-cyan-400"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Next/Close Button logic */}
          {currentSlide === rulesSlides.length - 1 ? (
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-cyan-300 hover:text-cyan-100 transition-colors group px-4 py-2 rounded-lg hover:bg-white/5 font-semibold"
            >
              <span className="text-sm">I Agree</span>
              <CheckCircle2 size={20} />
            </button>
          ) : (
            <button
              onClick={nextSlide}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group px-4 py-2 rounded-lg hover:bg-white/5"
            >
              <span className="hidden sm:inline text-sm font-medium">Next</span>
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HouseRulesModal;
