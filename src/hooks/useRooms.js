import { useEffect, useState } from "react";
import { fallbackRooms } from "../constants/roomData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function useRooms() {
  const [rooms, setRooms] = useState({});
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  const fetchRooms = async () => {
    setIsLoadingRooms(true);
    try {
      const response = await fetch(`${API_URL}/rooms`);
      const data = await response.json();

      if (response.ok && Array.isArray(data.rooms) && data.rooms.length > 0) {
        // Convert array to object keyed by room.key
        const roomsObj = {};
        data.rooms.forEach((room) => {
          roomsObj[room.id] = {
            id: room.id,
            key: room.id, // Now key === id
            title: room.title || room.name,
            description: room.description,
            price: room.price, // `₱${room.price_per_night.toLocaleString()}/night`,

            // Keep numeric version for calculations
            pricePerNight: parseInt(room.price.replace(/[₱,]/g, "")),

            // Map snake_case to camelCase - use the actual field names from your API
            capacity: room.capacity,
            maxOccupancy: room.max_occupancy || room.maxOccupancy, // Try both conventions
            floor: room.floor_location || room.floor, // API likely uses floor_location
            hasOwnBathroom: room.has_own_bathroom || room.hasOwnBathroom, // API likely uses has_own_bathroom
            hasAircon: room.has_aircon || room.hasAircon, // API likely uses has_aircon
            amenities: Array.isArray(room.amenities) ? room.amenities : [],
            // Safely handle images
            images: Array.isArray(room.images)
              ? room.images
              : typeof room.images === "string"
                ? JSON.parse(room.images || "[]")
                : [],
          };
        });
        setRooms(roomsObj);
        // console.log("Successfully set rooms:", roomsObj);
      } else {
        // console.log("Using fallback - API structure was:", data);
        // Use fallback rooms if API fails
        setRooms(fallbackRooms);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      // Use fallback rooms if API fails
      setRooms(fallbackRooms);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);
  return { rooms, setRooms, fetchRooms, isLoadingRooms };
}
