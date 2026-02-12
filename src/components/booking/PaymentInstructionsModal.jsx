// import React from "react";

// export default function PaymentInstructionsModal({
//   isOpen,
//   onClose,
//   paymentData,
// }) {
//   if (!isOpen || !paymentData) return null;

//   const copyToClipboard = (text, label) => {
//     navigator.clipboard.writeText(text);
//     alert(`${label} copied to clipboard!`);
//   };

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//       <div className="w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl p-6">
//         {/* Header */}
//         <div className="text-center mb-6">
//           <div className="text-4xl mb-2">🎉</div>
//           <h2 className="text-2xl font-bold text-white mb-2">
//             Awaiting Booking Payment!
//           </h2>
//           <p className="text-slate-300 text-sm">
//             Reference:{" "}
//             <span className="font-mono font-bold text-cyan-400">
//               {paymentData.bookingReference}
//             </span>
//           </p>
//         </div>

//         {/* Payment Instructions */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-white">
//             Payment Instructions
//           </h3>

//           {/* Deposit Amount */}
//           <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
//             <p className="text-sm text-slate-300 mb-1">Amount to Pay</p>
//             <p className="text-2xl font-bold text-cyan-400">
//               ₱{paymentData.depositAmount}
//             </p>
//           </div>

//           {/* GCash Details */}
//           <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
//             <p className="text-sm font-semibold text-white mb-2">GCash</p>
//             <div className="space-y-2">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-xs text-slate-400">Number</p>
//                   <p className="font-mono text-white">
//                     {paymentData.gcashNumber}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() =>
//                     copyToClipboard(paymentData.gcashNumber, "GCash number")
//                   }
//                   className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-sm rounded-lg transition"
//                 >
//                   Copy
//                 </button>
//               </div>
//               <div>
//                 <p className="text-xs text-slate-400">Account Name</p>
//                 <p className="text-white">{paymentData.gcashName}</p>
//               </div>
//             </div>
//           </div>

//           {/* MetroBank Details */}
//           <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
//             <p className="text-sm font-semibold text-white mb-2">MetroBank</p>
//             <div className="space-y-2">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-xs text-slate-400">Account Number</p>
//                   <p className="font-mono text-white">
//                     {paymentData.metrobankNumber}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() =>
//                     copyToClipboard(
//                       paymentData.metrobankNumber,
//                       "MetroBank number",
//                     )
//                   }
//                   className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-sm rounded-lg transition"
//                 >
//                   Copy
//                 </button>
//               </div>
//               <div>
//                 <p className="text-xs text-slate-400">Account Name</p>
//                 <p className="text-white">{paymentData.metrobankName}</p>
//               </div>
//             </div>
//           </div>

//           {/* Instructions */}
//           <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
//             <p className="text-sm text-yellow-200">
//               ⚠️ Send proof of payment through any of below: Messenger of Villa
//               Rose:{" "}
//               <a href="https://www.facebook.com/profile.php?id=61583957159834">
//                 Villa Rose
//               </a>
//               <p>Viber: 0917 169 5791</p>
//               <a href="mailto:villaroseseabreeze@gmail.com">
//                 villaroseseabreeze@gmail.com
//               </a>
//             </p>
//           </div>
//         </div>

//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="w-full mt-6 px-5 py-3 bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-transform"
//         >
//           Got it!
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";

export default function PaymentInstructionsModal({
  isOpen,
  onClose,
  paymentData,
}) {
  const [selectedPaymentType, setSelectedPaymentType] = useState("deposit");

  if (!isOpen || !paymentData) return null;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  // Calculate amounts
  const depositAmount = paymentData.depositAmount || 0;
  const totalAmount = paymentData.totalAmount || depositAmount * 2;
  const displayAmount =
    selectedPaymentType === "full" ? totalAmount : depositAmount;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Booking Created Successfully!
          </h2>
          <p className="text-slate-300 text-sm">
            Reference:{" "}
            <span className="font-mono font-bold text-cyan-400">
              {paymentData.bookingReference}
            </span>
          </p>
        </div>

        {/* Payment Type Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-3">
            Choose Payment Option
          </h3>
          <div className="space-y-2">
            {/* Deposit Option (50%) */}
            <label
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPaymentType === "deposit"
                  ? "bg-yellow-500/20 border-yellow-500/50"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                value="deposit"
                checked={selectedPaymentType === "deposit"}
                onChange={(e) => setSelectedPaymentType(e.target.value)}
                className="w-4 h-4 text-yellow-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">
                    💰 Deposit (50%)
                  </span>
                  <span className="text-yellow-400 font-bold text-lg">
                    ₱{depositAmount.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Pay balance upon arrival
                </p>
              </div>
            </label>

            {/* Full Payment Option (100%) */}
            <label
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPaymentType === "full"
                  ? "bg-green-500/20 border-green-500/50"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                value="full"
                checked={selectedPaymentType === "full"}
                onChange={(e) => setSelectedPaymentType(e.target.value)}
                className="w-4 h-4 text-green-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">
                    ✅ Full Payment (100%)
                  </span>
                  <span className="text-green-400 font-bold text-lg">
                    ₱{totalAmount.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  No payment needed upon arrival
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Payment Instructions
          </h3>

          {/* Selected Amount to Pay */}
          <div
            className={`p-4 rounded-xl border-2 ${
              selectedPaymentType === "full"
                ? "bg-green-500/10 border-green-500/30"
                : "bg-yellow-500/10 border-yellow-500/30"
            }`}
          >
            <p className="text-sm text-slate-300 mb-1">Amount to Pay</p>
            <p
              className={`text-3xl font-bold ${
                selectedPaymentType === "full"
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              ₱{displayAmount.toLocaleString()}
            </p>
            {selectedPaymentType === "deposit" && (
              <p className="text-xs text-slate-400 mt-2">
                Balance: ₱{(totalAmount - depositAmount).toLocaleString()} (pay
                upon arrival)
              </p>
            )}
          </div>

          {/* GCash Details */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📱</span>
              <p className="text-sm font-semibold text-white">GCash</p>
            </div>
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
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🏦</span>
              <p className="text-sm font-semibold text-white">MetroBank</p>
            </div>
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
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-sm font-semibold text-blue-200 mb-2">
              📸 Send Proof of Payment
            </p>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <div>
                  <span className="font-semibold">Facebook:</span>{" "}
                  <a
                    href="https://www.facebook.com/profile.php?id=61583957159834"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    Villa Rose Messenger
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <div>
                  <span className="font-semibold">Viber:</span>{" "}
                  <a
                    href="viber://chat?number=+639171695791"
                    className="text-cyan-400 hover:underline"
                  >
                    0917 169 5791
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <div>
                  <span className="font-semibold">Email:</span>{" "}
                  <a
                    href="mailto:villaroseseabreeze@gmail.com"
                    className="text-cyan-400 hover:underline"
                  >
                    villaroseseabreeze@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-sm text-yellow-200">
              ⚠️{" "}
              <span className="font-semibold">
                Please include your booking reference
              </span>{" "}
              when sending proof of payment:{" "}
              <span className="font-mono font-bold">
                {paymentData.bookingReference}
              </span>
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 px-5 py-3 bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          Got it! I'll send the payment
        </button>

        {/* Summary Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400">
            {selectedPaymentType === "full"
              ? "🎊 Thank you for paying in full!"
              : "💡 You can also pay the full amount to skip payment on arrival"}
          </p>
        </div>
      </div>
    </div>
  );
}
