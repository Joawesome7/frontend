import React from "react";

export default function Lightbox({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-4xl hover:scale-110 transition-transform"
        aria-label="Close preview"
      >
        ×
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-5 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl hover:bg-white/20 transition-colors shadow-2xl"
        aria-label="Previous image"
      >
        ◀
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-5 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl hover:bg-white/20 transition-colors shadow-2xl"
        aria-label="Next image"
      >
        ▶
      </button>

      <div
        className="max-w-5xl w-[calc(100%-40px)] p-3 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]?.src}
          alt={images[currentIndex]?.alt}
          className="max-w-full h-auto rounded-2xl shadow-2xl"
        />
        {images[currentIndex]?.caption && (
          <p className="mt-3 text-slate-300">{images[currentIndex].caption}</p>
        )}
      </div>
    </div>
  );
}
