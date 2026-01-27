import React, { useState, useEffect } from "react";

const AdminDashboard = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [activeTab, setActiveTab] = useState("rooms");
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    key: "",
    title: "",
    description: "",
    price: "",
    images: [""],
    amenities: [""],
  });
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      setAdminToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/rooms`);
      const data = await response.json();
      if (response.ok) {
        setRooms(data.rooms);
      } else {
        showNotification("Failed to fetch rooms", "error");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      showNotification("Failed to connect to server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBookings(data.bookings);
      } else {
        showNotification("Failed to fetch bookings", "error");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showNotification("Failed to connect to server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === "rooms") {
        fetchRooms();
      } else if (activeTab === "payments") {
        fetchBookings();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, activeTab, adminToken]);

  const handleConfirmPayment = async (bookingId) => {
    if (
      !window.confirm(
        "Are you sure you want to confirm this payment? This will send a confirmation email to the guest."
      )
    ) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/bookings/${bookingId}/confirm-payment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        showNotification(
          "✅ Payment confirmed! Confirmation email sent to guest.",
          "success"
        );
        fetchBookings();
      } else {
        showNotification(data.error || "Failed to confirm payment", "error");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      showNotification("Failed to connect to server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({
      key: "",
      title: "",
      description: "",
      price: "",
      images: [""],
      amenities: [""],
    });
    setEditingRoom(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const cleanedData = {
      ...formData,
      images: formData.images.filter((img) => img.trim() !== ""),
      amenities: formData.amenities.filter((am) => am.trim() !== ""),
    };
    try {
      const url = editingRoom
        ? `${API_URL}/rooms/${editingRoom.id}`
        : `${API_URL}/rooms`;
      const method = editingRoom ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(cleanedData),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification(
          editingRoom
            ? "Room updated successfully!"
            : "Room created successfully!",
          "success"
        );
        resetForm();
        fetchRooms();
      } else {
        showNotification(
          data.error || data.errors?.[0]?.msg || "Failed to save room",
          "error"
        );
      }
    } catch (error) {
      console.error("Error saving room:", error);
      showNotification("Failed to connect to server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      key: room.key,
      title: room.title,
      description: room.description,
      price: room.price,
      images: Array.isArray(room.images)
        ? room.images
        : JSON.parse(room.images || "[]"),
      amenities: Array.isArray(room.amenities)
        ? room.amenities
        : JSON.parse(room.amenities || "[]"),
    });
    setShowForm(true);
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/rooms/${roomId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        showNotification("Room deleted successfully!", "success");
        fetchRooms();
      } else {
        showNotification(data.error || "Failed to delete room", "error");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      showNotification("Failed to connect to server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setAdminToken("");
    onClose();
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
        <div className="w-full max-w-md p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-lg shadow-2xl">
          <h2 className="text-3xl font-serif font-semibold mb-6 text-center text-white">
            Not Authenticated
          </h2>
          <p className="text-center text-slate-300 mb-6">
            Please log in via the footer to access the admin dashboard.
          </p>
          <button
            onClick={onClose}
            className="w-full px-5 py-3 rounded-full border border-white/10 font-semibold hover:bg-white/5 transition-colors text-white"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const pendingBookings = bookings.filter(
    (b) => b.payment_status === "pending"
  );
  const confirmedBookings = bookings.filter(
    (b) => b.payment_status === "confirmed"
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/95 backdrop-blur-sm">
      <div className="min-h-screen p-5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-serif font-semibold text-white">
                Admin Dashboard
              </h1>
              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="px-5 py-3 rounded-full border border-red-500/50 bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-100"
                >
                  Logout
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-full border border-white/10 font-semibold hover:bg-white/5 transition-colors text-white"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab("rooms");
                  setShowForm(false);
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "rooms"
                    ? "bg-gradient-to-r from-cyan-400 to-teal-600 text-white shadow-lg"
                    : "bg-white/5 hover:bg-white/10 text-white"
                }`}
              >
                🏠 Rooms Management
              </button>
              <button
                onClick={() => {
                  setActiveTab("payments");
                  setShowForm(false);
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "payments"
                    ? "bg-gradient-to-r from-cyan-400 to-teal-600 text-white shadow-lg"
                    : "bg-white/5 hover:bg-white/10 text-white"
                }`}
              >
                💰 Payment Confirmations
                {pendingBookings.length > 0 && (
                  <span className="ml-2 px-2 py-1 rounded-full bg-red-500 text-white text-xs">
                    {pendingBookings.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          {notification && (
            <div
              className={`mb-6 p-4 rounded-xl ${
                notification.type === "success"
                  ? "bg-green-500/20 border border-green-500/50 text-green-100"
                  : "bg-red-500/20 border border-red-500/50 text-red-100"
              }`}
            >
              {notification.message}
            </div>
          )}
          {activeTab === "rooms" && (
            <>
              {!showForm && (
                <div className="mb-6">
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-5 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform"
                  >
                    + Add New Room
                  </button>
                </div>
              )}
              {showForm && (
                <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-lg shadow-2xl">
                  <h2 className="text-2xl font-serif font-semibold mb-6 text-white">
                    {editingRoom ? "Edit Room" : "Add New Room"}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-white">
                          Room Key
                        </label>
                        <input
                          type="text"
                          name="key"
                          value={formData.key}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
                          placeholder="e.g., couple"
                          required
                          disabled={editingRoom !== null}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-white">
                          Room Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
                          placeholder="e.g., Couple Room"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-white">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
                        rows="3"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-white">
                        Price
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
                        placeholder="e.g., ₱2,500/night"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-white">
                        Image URLs
                      </label>
                      {formData.images.map((image, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="url"
                            value={image}
                            onChange={(e) =>
                              handleArrayChange("images", index, e.target.value)
                            }
                            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
                            placeholder="https://example.com/image.jpg"
                          />
                          {formData.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem("images", index)}
                              className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 hover:bg-red-500/30 transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem("images")}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white"
                      >
                        + Add Image
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-white">
                        Amenities
                      </label>
                      {formData.amenities.map((amenity, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={amenity}
                            onChange={(e) =>
                              handleArrayChange(
                                "amenities",
                                index,
                                e.target.value
                              )
                            }
                            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
                            placeholder="e.g., WiFi"
                          />
                          {formData.amenities.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeArrayItem("amenities", index)
                              }
                              className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 hover:bg-red-500/30 transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem("amenities")}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white"
                      >
                        + Add Amenity
                      </button>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-5 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform disabled:opacity-50"
                      >
                        {isLoading
                          ? "Saving..."
                          : editingRoom
                          ? "Update Room"
                          : "Create Room"}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-5 py-3 rounded-full border border-white/10 font-semibold hover:bg-white/5 transition-colors text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
              <div className="space-y-4">
                {isLoading && rooms.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-400">Loading rooms...</p>
                  </div>
                ) : rooms.length === 0 ? (
                  <div className="text-center py-12 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                    <p className="text-slate-400">
                      No rooms found. Add your first room!
                    </p>
                  </div>
                ) : (
                  rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-lg shadow-xl hover:-translate-y-1 transition-transform"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold mb-2 text-white">
                            {room.title}
                          </h3>
                          <p className="text-slate-300 mb-3">
                            {room.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(Array.isArray(room.amenities)
                              ? room.amenities
                              : JSON.parse(room.amenities || "[]")
                            ).map((amenity, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-100 text-sm"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                          <p className="text-lg font-semibold text-cyan-400">
                            {room.price}
                          </p>
                          <p className="text-sm text-slate-400 mt-2">
                            Key:{" "}
                            <code className="bg-white/5 px-2 py-1 rounded">
                              {room.key}
                            </code>
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(room)}
                            className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-100 hover:bg-blue-500/30 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(room.id)}
                            className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 hover:bg-red-500/30 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-semibold mb-4 text-white">
                  ⏳ Pending Payments ({pendingBookings.length})
                </h2>
                {pendingBookings.length === 0 ? (
                  <div className="text-center py-12 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                    <p className="text-slate-400">No pending payments</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/30 backdrop-blur-lg shadow-xl"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-xl font-semibold text-white">
                                {booking.guest_name}
                              </h3>
                              <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-100 text-sm font-semibold">
                                PENDING
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-slate-400">
                                  Guest Email
                                </p>
                                <p className="text-slate-200">
                                  {booking.guest_email}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">
                                  Guest Phone
                                </p>
                                <p className="text-slate-200">
                                  {booking.guest_phone}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">
                                  Room Type
                                </p>
                                <p className="text-slate-200 capitalize">
                                  {booking.room_type}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">Guests</p>
                                <p className="text-slate-200">
                                  {booking.guests_count} guest(s)
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">
                                  Check-in
                                </p>
                                <p className="text-slate-200">
                                  {new Date(
                                    booking.check_in
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">
                                  Check-out
                                </p>
                                <p className="text-slate-200">
                                  {new Date(
                                    booking.check_out
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-6 p-4 rounded-xl bg-white/5 border border-white/10">
                              <div>
                                <p className="text-sm text-slate-400">
                                  Total Amount
                                </p>
                                <p className="text-lg font-semibold text-cyan-400">
                                  ₱{booking.total_amount?.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">
                                  Deposit Required (50%)
                                </p>
                                <p className="text-lg font-semibold text-yellow-400">
                                  ₱{booking.deposit_amount?.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4">
                              <p className="text-sm text-slate-400">
                                Booking Reference
                              </p>
                              <code className="text-lg font-mono bg-white/5 px-3 py-1 rounded text-white">
                                {booking.booking_reference}
                              </code>
                            </div>
                            {booking.special_requests && (
                              <div className="mt-4">
                                <p className="text-sm text-slate-400">
                                  Special Requests
                                </p>
                                <p className="text-slate-200">
                                  {booking.special_requests}
                                </p>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleConfirmPayment(booking.id)}
                            disabled={isLoading}
                            className="ml-4 px-6 py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ✓ Confirm Payment
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-serif font-semibold mb-4 text-white">
                  ✅ Confirmed Bookings ({confirmedBookings.length})
                </h2>
                {confirmedBookings.length === 0 ? (
                  <div className="text-center py-12 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                    <p className="text-slate-400">No confirmed bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {confirmedBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 backdrop-blur-lg shadow-xl"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-xl font-semibold text-white">
                                {booking.guest_name}
                              </h3>
                              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-100 text-sm font-semibold">
                                CONFIRMED
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-slate-400">
                                  Room Type
                                </p>
                                <p className="text-slate-200 capitalize">
                                  {booking.room_type}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">
                                  Check-in → Check-out
                                </p>
                                <p className="text-slate-200">
                                  {new Date(
                                    booking.check_in
                                  ).toLocaleDateString()}{" "}
                                  →{" "}
                                  {new Date(
                                    booking.check_out
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">
                                  Total Amount
                                </p>
                                <p className="text-lg font-semibold text-cyan-400">
                                  ₱{booking.total_amount?.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">
                                  Booking Reference
                                </p>
                                <code className="text-sm font-mono bg-white/5 px-2 py-1 rounded text-white">
                                  {booking.booking_reference}
                                </code>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
