import React, { useState } from "react";
import RoomGalleryView from "./RoomGalleryView";
import RoomDetailsView from "./RoomDetailsView";
import BookingFormView from "./BookingFormView";

export default function BookingModal({ isOpen, onClose, rooms, bookingHook }) {
  const [bookingStep, setBookingStep] = useState("gallery");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomCarousels, setRoomCarousels] = useState({
    couple: 0,
    family: 0,
    bungalow: 0,
  });

  if (!isOpen) return null;

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
    bookingHook.setAvailabilityStatus(null);
  };

  const handleClose = () => {
    setBookingStep("gallery");
    setSelectedRoom(null);
    bookingHook.resetBookingForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    const success = await bookingHook.submitBooking(e, selectedRoom);
    if (success) {
      handleClose();
    }
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/95 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl my-4 sm:my-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 sm:top-4 sm:right-4 z-20 w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-2xl border border-white/20"
          aria-label="Close booking"
        >
          ×
        </button>

        {/* Notification */}
        {bookingHook.notification && (
          <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-full shadow-2xl ${
              bookingHook.notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {bookingHook.notification.message}
          </div>
        )}

        {/* Gallery View */}
        {bookingStep === "gallery" && (
          <RoomGalleryView rooms={rooms} onSelectRoom={selectRoom} />
        )}

        {/* Room Details View */}
        {bookingStep === "details" && selectedRoom && (
          <RoomDetailsView
            room={rooms[selectedRoom]}
            roomKey={selectedRoom}
            currentImageIndex={roomCarousels[selectedRoom]}
            onBack={goBackToGallery}
            onNext={() => nextRoomImage(selectedRoom)}
            onPrev={() => prevRoomImage(selectedRoom)}
            onSelectImage={(idx) =>
              setRoomCarousels((prev) => ({ ...prev, [selectedRoom]: idx }))
            }
            onBookRoom={goToBookingForm}
          />
        )}

        {/* Booking Form View */}
        {bookingStep === "form" && selectedRoom && (
          <BookingFormView
            room={rooms[selectedRoom]}
            bookingFormData={bookingHook.bookingFormData}
            setBookingFormData={bookingHook.setBookingFormData}
            availabilityStatus={bookingHook.availabilityStatus}
            isLoading={bookingHook.isLoading}
            onBack={goBackToDetails}
            onCheckAvailability={() =>
              bookingHook.checkAvailability(selectedRoom)
            }
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
