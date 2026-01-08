import React from "react";

export default function MapSection() {
  return (
    <section
      id="map"
      className="w-[90%] max-w-4xl mx-auto my-9 p-6 rounded-2xl bg-gradient-to-b from-white/3 to-white/1 border border-white/10 backdrop-blur-lg shadow-xl"
    >
      <h2 className="text-3xl font-serif font-semibold mb-4">Find Us</h2>
      <div className="rounded-2xl overflow-hidden border border-white/5 hover:-translate-y-2 hover:shadow-2xl transition-all">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m22!1m8!1m3!1d4972.395264003847!2d124.3954252238985!3d13.687303698623056!3m2!1i1024!2i768!4f13.1!4m11!3e0!4m5!1s0x33bd808ce09aadf9%3A0xb525a5fab9ca1984!2sCabuco%2C%20Trece%20Martires%20City%2C%20Cavite!3m2!1d14.2749595!2d120.85276549999999!4m3!3m2!1d13.6868292!2d124.4005378!5e1!3m2!1sen!2sph!4v1763611682219!5m2!1sen!2sph"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Villa Rose Location"
        />
      </div>
      <div className="mt-4">
        <a
          href="https://maps.app.goo.gl/az55xVDdkMLda4Yo6"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 py-2 rounded-full bg-cyan-400 text-slate-900 font-bold hover:-translate-y-1 transition-transform"
        >
          Get Directions
        </a>
      </div>
    </section>
  );
}
