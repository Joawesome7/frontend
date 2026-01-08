import React from "react";

export default function BookingFormView({
  room,
  bookingFormData,
  setBookingFormData,
  availabilityStatus,
  isLoading,
  onBack,
  onCheckAvailability,
  onSubmit,
}) {
  return (
    <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2"
      >
        ← Back to Room Details
      </button>

      <h2 className="text-3xl font-serif font-semibold mb-2">
        Complete Your Booking
      </h2>
      <p className="text-slate-300 mb-6">Booking: {room.title}</p>

      <form
        onSubmit={onSubmit}
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
              bookingFormData.checkIn || new Date().toISOString().split("T")[0]
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
            onClick={onCheckAvailability}
            disabled={
              isLoading || !bookingFormData.checkIn || !bookingFormData.checkOut
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
              isLoading || (availabilityStatus && !availabilityStatus.available)
            }
            className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}
