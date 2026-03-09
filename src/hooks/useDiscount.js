import { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const useDiscount = (roomKey, checkIn, nights) => {
  const [discountData, setDiscountData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDiscount = useCallback(async () => {
    // Need all there to calculate a meaningful preview
    if (!roomKey || !checkIn || !nights || nights <= 0) {
      setDiscountData(null);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/discounts/check-discount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_type: roomKey,
          check_in: checkIn,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setDiscountData(data);
      } else {
        setDiscountData(null);
      }
    } catch {
      setDiscountData(null);
    } finally {
      setIsLoading(false);
    }
  }, [roomKey, checkIn, nights]);

  useEffect(() => {
    fetchDiscount();
  }, [fetchDiscount]);

  // Calculate totals for display
  const summary =
    discountData && nights > 0
      ? {
          discount: discountData.discount,
          pricePerNight: discountData.price_per_night,
          originalTotal: discountData.price_per_night * nights,
          discountTotal: discountData.discount_amount * nights,
          finalTotal: discountData.final_price_per_night * nights,
          depositAmount: Math.ceil(
            discountData.final_price_per_night * nights * 0.5,
          ),
          hasDiscount: !!discountData.discount,
        }
      : null;

  return { summary, isLoading };
};
