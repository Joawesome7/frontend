import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

// 1. Organize the long content into logical slides
const rulesSlides = [
  {
    title: "Welcome to Villa Rose",
    content: [
      {
        subtitle: "House Rules",
        text: "Welcome to Villa Rose Sea Breeze Resort! To ensure a safe, relaxing, and enjoyable stay for all guests, please follow the guidelines below.",
      },
      {
        subtitle: "1. Check-In, Check-Out & Payments",
        list: [
          "Check-In: 2:00 PM | Check-Out: 11:30 AM",
          "Early arrivals may wait in the lobby/restaurant.",
          "Late check-out beyond 12:00 NN will incur a P500 charge.",
          // "A 50% down payment is required to confirm booking.",
          // "Full Balance must be settled before check-in.",
          // "No checks accepted. Cancellations",
          // "No refunds for cancellations, no-shows, or early check-out.",
          // "Rebooking may be allowed within 6 months, subject to availability.",
          // "Travel insurance is recommended for emergencies.",
        ],
      },
    ],
  },
  {
    title: "Bookings & Guests",
    content: [
      // {
      //   subtitle: "2. Cancellations",
      //   list: [
      //     "No refunds for cancelled bookings, no-shows, or early check-out.",
      //     "Rebooking allowed subject to availability (within 6 months).",
      //     "Travel insurance is recommended.",
      //   ],
      // },
      {
        subtitle: "2. Guests & Visitors",
        list: [
          "Maximum room capacity must be strictly observed. Additional guests beyond the allowed capacity will incur corresponding charges.",
          "Visitors are allowed from 9:00 AM to 7:00 PM only and may stay in the lobby and outdoor pool area. Swimming is strictly not allowed for non-registered guests unless with paid access.",
          "Only registered guests are permitted to stay overnight. Visitor & Extra Guest Charges: ",
          "• 1–2 extra persons: ₱200 per head (with pool access)",
          "• 3–4 extra persons: ₱300 per head (with pool access)",
          "• Visitors without pool access: ₱100 per head",
          "• Guests may add overnight companions with an extra bed (with charge), provided the room was originally booked for 4 guests and total occupancy does not exceed 6 persons per room.",
          "• Extra bed charge: ₱300 per head for visitors with pool access (₱200/₱300 rate), and ₱500 per head for visitors without pool access.",
          "All charges apply only to visitors of confirmed in-house guests.",
        ],
      },
    ],
  },
  {
    title: "Property Care",
    content: [
      {
        subtitle: "3. Resort Property & Damages",
        list: [
          "Lost key fee: P500.",
          "Do not move, remove, or damage furniture and room items.",
          "Charges apply for damages, stains (ink, henna, oils, wet swimsuits), or vandalism.",
          "Do not flush wipes, cotton, or foreign objects in toilets.",
        ],
      },
      {
        subtitle: "4. Safety & Security",
        list: [
          "Always lock your room and secure your belongings.",
          "The resort is not liable for lost or stolen items.",
          "Unauthorized or unknown visitors are not allowed inside the premises.",
          "Gates close at 8:00 PM. Inform staff if going out beyond this time.",
        ],
      },
    ],
  },
  {
    title: "Conduct & Restrictions",
    content: [
      {
        subtitle: "5. Proper Conduct",
        list: [
          "Quiet hours: 10:00 PM - 7:00 AM.",
          "Karaoke is not allowed within the resort premises.",
          "Loud music and parties are not allowed:",
          "Violation Penalty:",
          "P2000 - first offense",
          "P5000 - second offense",
          "Third offense - immediate eviction without refund",
        ],
      },
      {
        subtitle: "6. Smoking & Prohibited Substances",
        list: [
          "No smoking inside rooms or resort areas. Use designated smoking areas only.",
          "Violation penalty: ₱500",
          "Illegal drugs are strictly prohibited.",
          "Alcohol consumption is allowed in moderation.",
          "Guests under the influence or minors drinking alcohol are not permitted.",
        ],
      },
      {
        subtitle: "7. Pets",
        list: [
          "Pets are allowed only if properly supervised.",
          "Any damage caused by pets will be charged to the owner.",
        ],
      },
    ],
  },
  {
    title: "Conservation & Safety",
    content: [
      {
        subtitle: "8. Facilities & Electrical Use",
        list: [
          "Do not tamper with electrical fixtures or connections.",
          "Report any issues immediately to staff.",
          "Turn off air-conditioning, lights, and appliances when not in use.",
          "Keep doors/windows closed when air-conditioning is on.",
        ],
      },
      {
        subtitle: "9. Cleanliness & Care",
        list: [
          "Dispose of trash properly; use designated bins.",
          "Rinse off sand before entering rooms.",
          "Do not hang clothes or towels on balcony railings-use drying racks.",
        ],
      },
      {
        subtitle: "10. Cooking & Dining",
        list: [
          "Cooking is not allowed anywhere on the premises.",
          "Outside food and drinks are not permitted.",
          "Sky view Kitchen is open until 8:00 PM.",
        ],
      },
    ],
  },
  {
    title: "Other Rules",
    content: [
      {
        subtitle: "11. Swimming Pool Rules",
        list: [
          "Pool hours: 7:00 AM - 8:00 PM",
          "For registered guests only.",
          "No lifeguard on duty - swim at your own risk.",
          "Proper swimwear is required; children must wear swim diapers.",
          "Shower before entering the pool.",
          "No food, drinks, glass items, smoking, pets, running, diving, or horseplay.",
          "Do not swim while intoxicated or during bad weather.",
          "Parents/guardians must supervise children at all times.",
        ],
      },
      // {
      //   subtitle: "13. Cleanliness",
      //   text: "Do not litter. Rinse off sand before entering rooms.",
      // },
      // {
      //   subtitle: "14. Cooking & Dining",
      //   list: [
      //     "Our kitchen staff is available to cook meals from our menu.",
      //     "Cooking is not allowed inside rooms, balconies, or hallways.",
      //     "Only rice cookers may be allowed with prior approval.",
      //     "Outdoor cooking allowed only in designated grill areas.",
      //   ],
      // },
    ],
  },
  {
    title: "Parking Rules & Safety Reminders",
    content: [
      {
        subtitle: "12. Parking",
        list: [
          "Park only in designated areas.",
          "Display your parking pass visibly.",
          "The resort is not liable for vehicle damage or loss.",
        ],
      },
      {
        subtitle: "13. General Safety Reminders",
        list: [
          "Open flames, candles, and cooking stoves are not allowed in rooms.",
          "Avoid climbing railings or engaging in unsafe behavior.",
          "Keep hallways and walkways clear at all times.",
        ],
      },
    ],
  },
  {
    title: "Conclusion",
    content: [
      // {
      //   subtitle: "13. Pool Safety",
      //   text: "Night swimming discouraged. Parents must watch children at all times.",
      // },
      {
        subtitle: "14. Snack Bar",
        text: "Open daily from 8:00 AM – 8:00 PM",
      },
      {
        subtitle: "Important Reminder",
        text: "Failure to comply with these rules may result in eviction without refund. By confirming your booking, you agree to follow all house rules. Thank you, and enjoy your stay at Villa Rose Sea Breeze Resort!",
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
      (prev) => (prev - 1 + rulesSlides.length) % rulesSlides.length,
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
