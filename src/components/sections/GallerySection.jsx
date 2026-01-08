import React from "react";
import { galleryImages } from "../../constants/galleryData";

export default function GallerySection({ onImageClick }) {
  return (
    <section
      id="gallery"
      className="w-[90%] max-w-4xl mx-auto my-9 p-6 rounded-2xl bg-gradient-to-b from-white/3 to-white/1 border border-white/10 backdrop-blur-lg shadow-xl"
    >
      <h2 className="text-3xl font-serif font-semibold mb-6">Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryImages.map((img, idx) => (
          <div
            key={idx}
            onClick={() => onImageClick(galleryImages, idx)}
            className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 cursor-pointer group"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/65 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm">{img.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
