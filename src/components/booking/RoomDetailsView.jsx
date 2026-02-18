import React from "react";

export default function RoomDetailsView({
  room,
  roomKey,
  currentImageIndex,
  onBack,
  onNext,
  onPrev,
  onSelectImage,
  onBookRoom,
}) {
  return (
    <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2"
      >
        ← Back to Rooms
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Photo Gallery */}
        <div>
          <div className="relative rounded-2xl overflow-hidden mb-4">
            <img
              src={room.images[currentImageIndex || 0]}
              alt={room.title}
              className="w-full h-96 object-cover"
            />
            {room.images.length > 1 && (
              <>
                <button
                  onClick={onPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  ◀
                </button>
                <button
                  onClick={onNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  ▶
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                  {(currentImageIndex || 0) + 1} / {room.images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {room.images.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {room.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${room.title} view ${idx + 1}`}
                  className={`w-full h-20 object-cover rounded-lg cursor-pointer border-2 ${
                    currentImageIndex === idx
                      ? "border-cyan-400"
                      : "border-white/10"
                  } hover:border-cyan-400/50 transition-colors`}
                  onClick={() => onSelectImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Room Info */}
        <div>
          <h2 className="text-3xl font-serif font-semibold mb-3">
            {room.title}
          </h2>
          <p className="text-2xl text-cyan-400 font-bold mb-4">
            From {room.price}
          </p>
          <p className="text-slate-200 mb-6 leading-relaxed">
            {room.description}
          </p>

          {/* Amenities */}
          <h3 className="text-xl font-semibold mb-3">Amenities</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {room.amenities.map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-300">
                <svg
                  className="w-5 h-5 text-cyan-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{amenity}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onBookRoom}
            className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform"
          >
            Book This Room
          </button>
        </div>
      </div>
    </div>
  );
}
