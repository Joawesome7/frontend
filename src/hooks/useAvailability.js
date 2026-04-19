/**
 * useAvailability Hook
 * ====================
 *
 * Fetches calendar availability data for the date picker.
 * Works alongside your existing useBooking hook.
 */

import { useState, useEffect, useCallback } from "react";

const ROOM_KEY_MAPPING = {
  couple: "deluxe_ground",
  family: "family_basement", // ← Converts "family" to "family_basement"
  bungalow: "executive_2nd",
};

export const useAvailability = (roomType, startDate, endDate, options = {}) => {
  const {
    enabled = true,
    refetchInterval = null,
    onSuccess = null,
    onError = null,
  } = options;

  const [unavailableDates, setUnavailableDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use your existing API_URL from environment
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // --- HELPER: SAFE DATE FORMATTING ---
  // Prevents UTC timezone shifts that happen with standard .toISOString()
  const formatLocalDate = (date) => {
    if (!date) return null;
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split("T")[0];
  };

  const fetchAvailability = useCallback(async () => {
    if (!roomType || !startDate || !endDate || !enabled) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formatDate = (date) => {
        return date.toISOString().split("T")[0];
      };

      const mappedRoomType = ROOM_KEY_MAPPING[roomType] || roomType;

      const params = new URLSearchParams({
        roomType: mappedRoomType,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      });

      const url = `${API_URL}/availability/unavailable-dates?${params}`;

      // console.log(
      //   "🔍 Fetching availability for:",
      //   roomType,
      //   "→",
      //   mappedRoomType,
      // );
      // console.log("📡 URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !Array.isArray(data.unavailableDates)) {
        throw new Error("Invalid response format from server");
      }

      setUnavailableDates(data.unavailableDates);

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      console.error("Error fetching availability:", err);
      setError(err.message);

      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [roomType, startDate, endDate, enabled, API_URL, onSuccess, onError]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  useEffect(() => {
    if (!refetchInterval || !enabled) {
      return;
    }

    const intervalId = setInterval(() => {
      fetchAvailability();
    }, refetchInterval);

    return () => clearInterval(intervalId);
  }, [fetchAvailability, refetchInterval, enabled]);

  // --- DATE PICKER LOGIC ---

  // 1. Check-In: Disabled if the exact night is in the unavailable array
  const isCheckInDisabled = useCallback(
    (date) => {
      const dateStr = formatLocalDate(date);
      return unavailableDates.includes(dateStr);
    },
    [unavailableDates],
  );

  // 2. Check-Out: Disabled ONLY if the night BEFORE is unavailable
  const isCheckOutDisabled = useCallback(
    (date) => {
      const nightBefore = new Date(date);
      nightBefore.setDate(nightBefore.getDate() - 1);
      const dateStr = formatLocalDate(nightBefore);
      return unavailableDates.includes(dateStr);
    },
    [unavailableDates],
  );

  // 3. Max Check-Out Date: Prevents booking "through" someone else's reservation
  const getMaxCheckOutDate = useCallback(
    (selectedStartDate) => {
      if (!selectedStartDate) return null;

      const startStr = formatLocalDate(selectedStartDate);
      const sortedDates = [...unavailableDates].sort();

      for (const dateStr of sortedDates) {
        // Find the first fully booked night that happens ON or AFTER the check-in date
        if (dateStr >= startStr) {
          // Convert "YYYY-MM-DD" back into a local Date object securely
          const [year, month, day] = dateStr.split("-");
          return new Date(year, month - 1, day, 23, 59, 59);
        }
      }
      return null; // No upcoming bookings, free to book indefinitely
    },
    [unavailableDates],
  );

  // const isDateUnavailable = useCallback(
  //   (date) => {
  //     const dateStr = date.toISOString().split("T")[0];
  //     return unavailableDates.includes(dateStr);
  //   },
  //   [unavailableDates],
  // );

  return {
    unavailableDates,
    isLoading,
    error,
    refetch: fetchAvailability,
    // isDateUnavailable,
    isCheckInDisabled,
    isCheckOutDisabled,
    getMaxCheckOutDate,
  };
};
