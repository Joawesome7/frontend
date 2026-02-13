import React, { useState } from "react";

export default function RoomsSection({ rooms, onImageClick }) {
  const [roomCarousels, setRoomCarousels] = useState({});

  // Initialize carousel positions for each room
  React.useEffect(() => {
    const initialPositions = {};
    Object.keys(rooms).forEach((key) => {
      initialPositions[key] = 0;
    });
    setRoomCarousels(initialPositions);
  }, [rooms]);

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
    <section
      id="rooms"
      className="w-[90%] max-w-4xl mx-auto my-9 p-6 rounded-2xl bg-gradient-to-b from-white/3 to-white/1 border border-white/10 backdrop-blur-lg shadow-xl"
    >
      <h2 className="text-3xl font-serif font-semibold mb-6">Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(rooms).map(([key, room]) => {
          // Check if there are images available
          const hasImages = room.images && room.images.length > 0;
          const currentImageIndex = roomCarousels[key] || 0;
          const currentImage = hasImages
            ? room.images[currentImageIndex]
            : "/placeholder-room.jpg"; // Provide a placeholder image

          return (
            <article
              key={key}
              className="p-4 rounded-2xl bg-gradient-to-b from-white/4 to-white/1 border border-white/5 shadow-lg hover:-translate-y-2 transition-transform"
            >
              <h3 className="text-xl font-semibold mb-2">{room.title}</h3>
              <p className="text-slate-300 text-sm mb-3">{room.description}</p>

              {/* Room Carousel */}
              <div className="relative rounded-2xl overflow-hidden mb-3 group">
                <img
                  src={currentImage}
                  alt={`${room.title} - view ${currentImageIndex + 1}`}
                  className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => {
                    if (hasImages) {
                      const roomImages = room.images.map((src, idx) => ({
                        src,
                        alt: `${room.title} - view ${idx + 1}`,
                        caption: `${room.title} - view ${idx + 1}`,
                      }));
                      onImageClick(roomImages, currentImageIndex);
                    }
                  }}
                  loading="lazy"
                  width="800"
                  height="600"
                />

                {hasImages && room.images.length > 1 && (
                  <>
                    <button
                      onClick={() => prevRoomImage(key)}
                      className="absolute left-2 bottom-2 p-2 rounded-2xl bg-black/50 text-white hover:bg-black/70 transition-colors"
                      aria-label="Previous image"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                    <button
                      onClick={() => nextRoomImage(key)}
                      className="absolute right-2 bottom-2 p-2 rounded-2xl bg-cyan-400 text-slate-900 font-bold hover:bg-cyan-300 transition-colors"
                      aria-label="Next image"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-3 px-2 py-1 rounded-2xl bg-black/40 text-white text-sm">
                      {currentImageIndex + 1} / {room.images.length}
                    </div>
                  </>
                )}

                {/* Show message if no images available */}
                {!hasImages && (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image Available
                  </div>
                )}
              </div>

              <div className="text-slate-300">
                From <strong className="text-slate-50">{room.price}</strong>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
