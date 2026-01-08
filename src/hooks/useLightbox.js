import { useState, useEffect } from "react";

export function useLightbox() {
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    index: 0,
    images: [],
  });

  // Lightbox handlers
  const openLightbox = (images, index) => {
    setLightbox({ isOpen: true, index, images });
  };

  const closeLightbox = () => {
    setLightbox({ isOpen: false, index: 0, images: [] });
  };

  const nextLightboxImage = () => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length,
    }));
  };

  const prevLightboxImage = () => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index - 1 + prev.images.length) % prev.images.length,
    }));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.isOpen) return;

      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightboxImage();
      if (e.key === "ArrowLeft") prevLightboxImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox.isOpen]);

  return {
    lightbox,
    openLightbox,
    closeLightbox,
    nextLightboxImage,
    prevLightboxImage,
  };
}
