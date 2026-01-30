import { useState } from "react";
import PaymentInstructionsModal from "./components/booking/PaymentInstructionsModal";

export function useBooking() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentInstructions, setPaymentInstructions] = useState(null);
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

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const checkAvailability = async (selectedRoom) => {
    if (!bookingFormData.checkIn || !bookingFormData.checkOut) {
      showNotification("Please select check-in and check-out dates", "error");
      return;
    }

    setIsLoading(true);
    setAvailabilityStatus(null);

    try {
      const response = await fetch(`${API_URL}/bookings/check-availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomType: selectedRoom,
          checkIn: bookingFormData.checkIn,
          checkOut: bookingFormData.checkOut,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAvailabilityStatus(data);
      } else {
        showNotification(
          data.message || "Failed to check availability",
          "error",
        );
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      showNotification(
        "Failed to connect to server. Please try again.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const submitBooking = async (e, selectedRoom) => {
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

      const response = await fetch(`${API_URL}/bookings`, {
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
          "success",
        );

        // Show payment instructions
        if (data.paymentInstructions) {
          console.log("💰 Payment Instructions:", data.paymentInstructions);
          //           alert(`
          // Booking Reference: ${data.bookingReference}

          // Payment Instructions:
          // Amount to Pay: ₱${data.paymentInstructions.depositAmount}
          // MetroBank Number: ${data.paymentInstructions.metrobankNumber}
          // MetroBank Name: ${data.paymentInstructions.metrobankName}
          // GCash Number: ${data.paymentInstructions.gcashNumber}
          // GCash Name: ${data.paymentInstructions.gcashName}

          // Please send proof of payment to confirm your booking.
          //           `);

          // Store payment data in state
          setPaymentInstructions({
            bookingReference: data.bookingReference,
            depositAmount: data.paymentInstructions.depositAmount,
            gcashNumber: data.paymentInstructions.gcashNumber,
            gcashName: data.paymentInstructions.gcashName,
            metrobankNumber: data.paymentInstructions.metrobankNumber,
            metrobankName: data.paymentInstructions.metrobankName,
          });

          // Open the modal
          setIsPaymentModalOpen(true);
        }

        return true; // Success
      } else {
        console.error("❌ Booking failed:", data);
        showNotification(
          data.error || data.details || "Failed to create booking",
          "error",
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Error creating booking:", error);
      showNotification(
        "Failed to connect to server. Please try again.",
        "error",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetBookingForm = () => {
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

  return {
    bookingFormData,
    setBookingFormData,
    availabilityStatus,
    setAvailabilityStatus,
    isLoading,
    notification,
    checkAvailability,
    submitBooking,
    resetBookingForm,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    paymentInstructions,
  };
}
