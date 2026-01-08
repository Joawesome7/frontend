import room1 from "../assets/img/room1.jpg";
import room1_2 from "../assets/img/room1.jpg";
import room1_3 from "../assets/img/room1.jpg";

import room2 from "../assets/img/room2.jpg";
import room2_2 from "../assets/img/room2.jpg";

import room3 from "../assets/img/room3.jpg";
import room3_1 from "../assets/img/room3-1.jpg";
import room3_2 from "../assets/img/room3-2.jpg";

// Fallback room data (used if API fails)
export const fallbackRooms = {
  couple: {
    key: "couple",
    title: "Couple Room",
    description:
      "Perfect for couples seeking a romantic getaway. Enjoy stunning ocean views from your private balcony, complete with modern amenities and a comfortable king-sized bed.",
    price: "2000 Php/night",
    images: [room1, room1_2, room1_3],
    amenities: [
      "Ocean View",
      "King Bed",
      "Air Conditioning",
      "Private Balcony",
      "WiFi",
      "Mini Fridge",
    ],
  },
  family: {
    key: "family",
    title: "Family Room",
    description:
      "Spacious rooms perfect for family vacations, with extra beds available and plenty of space for everyone to relax and enjoy quality time together.",
    price: "3000 Php/night",
    images: [room2, room2_2],
    amenities: [
      "Extra Beds",
      "Air Conditioning",
      "WiFi",
      "Kitchenette",
      "Living Area",
      "TV",
    ],
  },
  bungalow: {
    key: "bungalow",
    title: "Bungalow House",
    description:
      "Spacious bungalow perfect for groups and families. Features secure surfboard storage, direct beach access, and outdoor amenities for the ultimate beach vacation.",
    price: "8000 Php/night",
    images: [room3, room3_1, room3_2],
    amenities: [
      "Surfboard Storage",
      "Beach Access",
      "Outdoor Shower",
      "BBQ Area",
      "Parking",
      "WiFi",
    ],
  },
};
