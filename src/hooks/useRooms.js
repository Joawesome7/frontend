import { useEffect, useState } from "react";
import { fallbackRooms } from "../constants/roomData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function useRooms() {
  const [rooms, setRooms] = useState({});
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  const fetchRooms = async () => {
    setIsLoadingRooms(true);
    try {
      const response = await fetch(`${API_URL}/api/rooms`);
      const data = await response.json();

      if (response.ok && data.rooms && data.rooms.length > 0) {
        // Convert array to object keyed by room.key
        const roomsObj = {};
        data.rooms.forEach((room) => {
          roomsObj[room.key] = {
            ...room,
            images: Array.isArray(room.images)
              ? room.images
              : JSON.parse(room.images || "[]"),
            amenities: Array.isArray(room.amenities)
              ? room.amenities
              : JSON.parse(room.amenities || "[]"),
          };
        });
        setRooms(roomsObj);
      } else {
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
