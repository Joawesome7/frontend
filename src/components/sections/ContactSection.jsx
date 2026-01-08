import React from "react";
import ContactLinks from "../ContactLinks";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="w-[90%] max-w-4xl mx-auto my-9 p-6 rounded-2xl bg-gradient-to-b from-white/3 to-white/1 border border-white/10 backdrop-blur-lg shadow-xl"
    >
      <h2 className="text-3xl font-serif font-semibold mb-4">Contact Us</h2>
      <ContactLinks />
    </section>
  );
}
