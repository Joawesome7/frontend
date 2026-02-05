import React from "react";

export default function PaymentInstructionsModal({
  isOpen,
  onClose,
  paymentData,
}) {
  if (!isOpen || !paymentData) return null;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-slate-300 text-sm">
            Reference:{" "}
            <span className="font-mono font-bold text-cyan-400">
              {paymentData.bookingReference}
            </span>
          </p>
        </div>

        {/* Payment Instructions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Payment Instructions
          </h3>

          {/* Deposit Amount */}
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <p className="text-sm text-slate-300 mb-1">Amount to Pay</p>
            <p className="text-2xl font-bold text-cyan-400">
              ₱{paymentData.depositAmount}
            </p>
          </div>

          {/* GCash Details */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-sm font-semibold text-white mb-2">GCash</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400">Number</p>
                  <p className="font-mono text-white">
                    {paymentData.gcashNumber}
                  </p>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(paymentData.gcashNumber, "GCash number")
                  }
                  className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-sm rounded-lg transition"
                >
                  Copy
                </button>
              </div>
              <div>
                <p className="text-xs text-slate-400">Account Name</p>
                <p className="text-white">{paymentData.gcashName}</p>
              </div>
            </div>
          </div>

          {/* MetroBank Details */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-sm font-semibold text-white mb-2">MetroBank</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400">Account Number</p>
                  <p className="font-mono text-white">
                    {paymentData.metrobankNumber}
                  </p>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      paymentData.metrobankNumber,
                      "MetroBank number",
                    )
                  }
                  className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-sm rounded-lg transition"
                >
                  Copy
                </button>
              </div>
              <div>
                <p className="text-xs text-slate-400">Account Name</p>
                <p className="text-white">{paymentData.metrobankName}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-sm text-yellow-200">
              ⚠️ Send proof of payment through any of below: Messenger of Villa
              Rose:{" "}
              <a href="https://www.facebook.com/profile.php?id=61583957159834">
                Villa Rose
              </a>
              <p>Viber: 0917 169 5791</p>
              <a href="mailto:villaroseseabreeze@gmail.com">
                villaroseseabreeze@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 px-5 py-3 bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
