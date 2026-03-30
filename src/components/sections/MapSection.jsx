import React from "react";

export default function MapSection() {
  // 1. Get your API Key from Vite environment variables
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // 2. Specific address for the pin
  const address =
    "Villa Rose Sea Breeze Resort, Langsihan, Purok 4, San Miguel, Baras, 4803 Catanduanes";
  const encodedAddress = encodeURIComponent(address);

  // 3. API URL for Embed (Place mode)
  // This uses your API key to show a professional, interactive map
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}&zoom=15`;

  // 4. Standard Navigation URL for the button
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

  return (
    <section
      id="map"
      className="w-[90%] max-w-4xl mx-auto my-12 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Context & Details */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h2 className="text-4xl font-serif font-bold text-white mb-2">
              Find Us
            </h2>
            <p className="text-cyan-400 font-medium italic">
              Langsihan, San Miguel, Baras
            </p>
          </div>

          <div className="space-y-4 text-slate-300 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              <p>Purok 4, San Miguel, Baras, 4803 Catanduanes</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🚗</span>
              <p>Approximately 45-60 mins drive from Virac Airport.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🌊</span>
              <p>Right along the scenic coastline of Baras.</p>
            </div>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-cyan-400 text-slate-900 font-bold hover:bg-cyan-300 hover:-translate-y-1 transition-all shadow-lg shadow-cyan-500/20"
          >
            Get Directions ↗
          </a>
        </div>

        {/* Right Column: The Interactive Map */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-white/10 h-[450px] shadow-inner group">
          <iframe
            title="Villa Rose Location"
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale-[0.2] contrast-[1.1] group-hover:grayscale-0 transition-all duration-500"
          />
        </div>
      </div>
    </section>
  );
}
