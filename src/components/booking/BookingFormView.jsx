/**
 * FIXED BOOKING FORM VIEW
 * ========================
 *
 * Fixes:
 * 1. Date off-by-one bug (timezone issue)
 * 2. Booked dates not showing as unavailable
 * 3. Implemented Turnover Day logic (Check-out can fall on a check-in day)
 */

import React, { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAvailability } from "../../hooks/useAvailability.js";
import "../../components/AvailabilityDatePicker.css";
import { useDiscount } from "../../hooks/useDiscount.js";

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
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Calculate date range for API
  const { fetchStart, fetchEnd } = useMemo(() => {
    const start = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    );
    const end = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 2,
      0,
    );
    return { fetchStart: start, fetchEnd: end };
  }, [currentMonth]);

  // Fetch availability
  const {
    unavailableDates,
    isLoading: availabilityLoading,
    error: availabilityError,
    isCheckInDisabled,
    isCheckOutDisabled,
    getMaxCheckOutDate,
  } = useAvailability(room?.key, fetchStart, fetchEnd);

  const nights =
    bookingFormData.checkIn && bookingFormData.checkOut
      ? Math.ceil(
          (new Date(bookingFormData.checkOut + "T12:00:00") -
            new Date(bookingFormData.checkIn + "T12:00:00")) /
            (1000 * 60 * 60 * 24),
        )
      : 0;
  const { summary, isLoading: discountLoading } = useDiscount(
    room?.key,
    bookingFormData.checkIn,
    nights,
  );

  // Convert bookingFormData dates to Date objects (FIX #1: Timezone handling)
  const checkInDate = bookingFormData.checkIn
    ? new Date(bookingFormData.checkIn + "T12:00:00") // Use noon to avoid timezone issues
    : null;

  const checkOutDate = bookingFormData.checkOut
    ? new Date(bookingFormData.checkOut + "T12:00:00")
    : null;

  // Check if a date is unavailable
  const isDateUnavailable = (date) => {
    // Convert date to YYYY-MM-DD format in LOCAL timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const isUnavailable = unavailableDates.includes(dateStr);

    // // DEBUG: Log for clicked dates
    // if (date.getDate() === 10 || date.getDate() === 14) {
    //   console.log(`Date ${dateStr}: unavailable = ${isUnavailable}`);
    // }

    return isUnavailable;
  };

  // Filter dates for check-in
  const filterCheckInDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return false;
    }

    // Check against the hook's check-in logic
    return !isCheckInDisabled(date);
  };

  // Filter dates for check-out
  const filterCheckOutDate = (date) => {
    if (!checkInDate) {
      return false;
    }

    // Standardize both dates to midnight so we are ONLY comparing the calendar day
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    const compareCheckIn = new Date(checkInDate);
    compareCheckIn.setHours(0, 0, 0, 0);

    // You cannot check out on or before the day you arrive
    if (compareDate <= compareCheckIn) {
      return false;
    }

    // Check against the hook's check-out logic
    return !isCheckOutDisabled(date);
  };

  // Handle check-in change (FIX #1: Proper date conversion)
  const handleCheckInChange = (date) => {
    // console.log("📅 Check-in selected:", date);

    if (date) {
      // Convert to YYYY-MM-DD in LOCAL timezone
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      // console.log("✅ Converted to:", dateStr);

      setBookingFormData({
        ...bookingFormData,
        checkIn: dateStr,
        checkOut: "", // Reset checkout
      });
      // Sync the calendar view to the month just picked
      setCurrentMonth(date);
    } else {
      setBookingFormData({
        ...bookingFormData,
        checkIn: "",
      });
    }
  };

  // Handle check-out change (FIX #1: Proper date conversion)
  const handleCheckOutChange = (date) => {
    // console.log("📅 Check-out selected:", date);

    if (date) {
      // Convert to YYYY-MM-DD in LOCAL timezone
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      // console.log("✅ Converted to:", dateStr);

      setBookingFormData({
        ...bookingFormData,
        checkOut: dateStr,
      });
    } else {
      setBookingFormData({
        ...bookingFormData,
        checkOut: "",
      });
    }
  };

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

      {/* Error display */}
      {availabilityError && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300">
          <p className="font-semibold">⚠️ Unable to load availability</p>
          <p className="text-sm mt-1">{availabilityError}</p>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Check-in Date */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Check-in Date *
            {availabilityLoading && (
              <span className="ml-2 text-xs text-cyan-400">(Loading...)</span>
            )}
          </label>
          <DatePicker
            selected={checkInDate}
            onChange={handleCheckInChange}
            onMonthChange={setCurrentMonth}
            // This prevents the calendar from jumping back to the 'selected' month
            // When the component re-renders due to a state change.
            focusSelectedMonth={false}
            // use currentMonth to tell the picker where to stay
            openToDate={currentMonth}
            filterDate={filterCheckInDate}
            minDate={new Date()}
            placeholderText="Select check-in date"
            dateFormat="MMMM d, yyyy"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-cyan-400 focus:outline-none"
            calendarClassName="villa-rose-calendar"
            disabled={availabilityLoading}
            dayClassName={(date) => {
              if (isCheckInDisabled(date)) {
                return "unavailable-date";
              }
              return undefined;
            }}
          />
          <p className="text-xs text-slate-400 mt-1">
            Red/strikethrough dates are fully booked
          </p>
        </div>
        {/* Check-out Date */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Check-out Date *
            {availabilityLoading && (
              <span className="ml-2 text-xs text-cyan-400">(Loading...)</span>
            )}
          </label>
          <DatePicker
            selected={checkOutDate}
            onChange={handleCheckOutChange}
            onMonthChange={setCurrentMonth}
            filterDate={filterCheckOutDate}
            minDate={
              checkInDate
                ? new Date(checkInDate.getTime() + 86400000)
                : new Date()
            }
            maxDate={getMaxCheckOutDate(checkInDate)} // Prevents selecting past the next booked guest
            placeholderText="Select check-out date"
            dateFormat="MMMM d, yyyy"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-cyan-400 focus:outline-none"
            calendarClassName="villa-rose-calendar"
            disabled={availabilityLoading || !bookingFormData.checkIn}
            dayClassName={(date) => {
              if (isCheckOutDisabled(date)) {
                return "unavailable-date";
              }
              return undefined;
            }}
          />
          <p className="text-xs text-slate-400 mt-1">
            {!bookingFormData.checkIn
              ? "Select check-in date first"
              : "Red/strikethrough dates are fully booked"}
          </p>
        </div>
        {/* Legend */}
        <div className="md:col-span-2 flex gap-4 text-xs text-slate-300 bg-white/5 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
            <span>Available dates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Fully booked</span>
          </div>
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
            max="4"
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

        {/* Price Summary — shows automatically when dates are selected */}
        {summary && (
          <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">
              Price Summary
            </h3>

            {/* Base price row */}
            <div className="flex justify-between text-sm text-slate-300 mb-2">
              <span>
                ₱{summary.pricePerNight.toLocaleString()} × {nights} night
                {nights > 1 ? "s" : ""}
              </span>
              <span
                className={
                  summary.hasDiscount ? "line-through text-slate-500" : ""
                }
              >
                ₱{summary.originalTotal.toLocaleString()}
              </span>
            </div>

            {/* Discount row — only shows if discount exists */}
            {summary.hasDiscount && (
              <>
                <div className="flex justify-between text-sm text-green-400 mb-2">
                  <span>🏷️ {summary.discount.name}</span>
                  <span>− ₱{summary.discountTotal.toLocaleString()}</span>
                </div>

                <div className="border-t border-white/10 my-3" />

                <div className="flex justify-between font-bold text-white mb-1">
                  <span>Total</span>
                  <span className="text-cyan-400">
                    ₱{summary.finalTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-slate-300">
                  <span>Deposit (50%)</span>
                  <span>₱{summary.depositAmount.toLocaleString()}</span>
                </div>

                <div className="mt-3 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 text-center text-green-400 text-sm font-semibold">
                  🎉 You save ₱{summary.discountTotal.toLocaleString()}!
                </div>
              </>
            )}

            {/* No discount — just show total cleanly */}
            {!summary.hasDiscount && (
              <>
                <div className="border-t border-white/10 my-3" />
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>Total</span>
                  <span className="text-cyan-400">
                    ₱{summary.originalTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Deposit (50%)</span>
                  <span>
                    ₱{Math.ceil(summary.originalTotal * 0.5).toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

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
