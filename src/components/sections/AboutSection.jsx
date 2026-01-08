import React from "react";
import pool from "../../assets/img/Pool.jpg";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="w-[90%] max-w-4xl mx-auto my-9 p-6 rounded-2xl bg-gradient-to-b from-white/3 to-white/1 border border-white/10 backdrop-blur-lg shadow-xl"
    >
      <h2 className="text-3xl font-serif font-semibold mb-4">About Us</h2>
      <p className="mb-4 leading-relaxed">
        Welcome to <strong>Villa Rose Sea Breeze Resort</strong>, your serene
        getaway just a 5–10 minutes' walk from the beach. Nestled in a paradise
        for surf enthusiasts, our resort offers the perfect blend of relaxation
        and adventure for both families and travelers seeking the ocean breeze.
        As a family-owned business, we take pride in providing a personal touch,
        making every guest feel at home. Whether you're here to catch waves,
        unwind by the shore, or simply enjoy quality time with loved ones, Villa
        Rose Sea Breeze Resort is your cozy haven by the sea. Come for the surf,
        stay for the warmth, and leave with memories that last a lifetime.
      </p>
      <img
        src={pool}
        alt="coastal breakfast"
        className="w-full rounded-2xl"
        loading="lazy"
      />
    </section>
  );
}
