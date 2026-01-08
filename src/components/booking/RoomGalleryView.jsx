import React from "react";

export default function RoomGalleryView({ rooms, onSelectRoom }) {
  return (
    <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl p-4 sm:p-8 backdrop-blur-lg">
      <h2 className="text-2xl sm:text-3xl font-serif font-semibold mb-6 text-center">
        Choose Your Room
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {Object.entries(rooms).map(([key, room]) => (
          <div
            key={key}
            onClick={() => onSelectRoom(key)}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-b from-white/8 to-white/2 border border-white/10 hover:border-cyan-400/50 transition-all hover:-translate-y-2 shadow-xl"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={room.images[0]}
                alt={room.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{room.title}</h3>
              <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                {room.description}
              </p>
              <p className="text-cyan-400 font-bold">From {room.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
