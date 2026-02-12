/**
 * useAvailability Hook
 * ====================
 *
 * Fetches calendar availability data for the date picker.
 * Works alongside your existing useBooking hook.
 */

import { useState, useEffect, useCallback } from "react";

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

      const params = new URLSearchParams({
        roomType,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      });

      const url = `${API_URL}/availability/unavailable-dates?${params}`;

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

  const isDateUnavailable = useCallback(
    (date) => {
      const dateStr = date.toISOString().split("T")[0];
      return unavailableDates.includes(dateStr);
    },
    [unavailableDates],
  );

  return {
    unavailableDates,
    isLoading,
    error,
    refetch: fetchAvailability,
    isDateUnavailable,
  };
};
