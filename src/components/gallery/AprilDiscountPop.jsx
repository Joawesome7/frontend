const AprilDiscountPop = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white border-l-4 border-orange-400 shadow-2xl rounded-lg p-5 max-w-sm flex items-start gap-4">
        <div className="bg-orange-100 p-2 rounded-full">
          <span className="text-2xl">☀️</span>
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">
            April Summer Sale!
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Book any stay in <strong>April</strong> and enjoy an automatic{" "}
            <strong>10% discount</strong> at checkout.
          </p>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-orange-600 uppercase tracking-wider hover:text-orange-700"
          >
            Got it, thanks!
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 ml-auto"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AprilDiscountPop; // ← this was missing
