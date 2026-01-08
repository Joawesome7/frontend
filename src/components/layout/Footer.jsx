import React, { useState } from "react";

export default function Footer({ onAdminAccess }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleDoubleClick = () => {
    setShowPasswordModal(true);
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token
        sessionStorage.setItem("adminToken", data.token);
        setShowPasswordModal(false);
        onAdminAccess();
      } else {
        setError(data.message || "Invalid password");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <footer className="pb-10 pt-5 text-center">
        <div className="w-[90%] max-w-4xl mx-auto p-3 rounded-2xl bg-gradient-to-b from-white/4 to-white/1 border border-white/5 backdrop-blur-sm">
          <p
            className="text-slate-300 text-sm cursor-pointer select-none"
            onDoubleClick={handleDoubleClick}
            title="Double-click for admin access"
          >
            © {new Date().getFullYear()} Villa Rose Sea Breeze Resort — All
            rights reserved.
          </p>
        </div>
      </footer>

      {/* Admin Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-800 p-8 rounded-2xl border border-white/10 w-[90%] max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-white">Admin Access</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none mb-4"
                autoFocus
                disabled={isLoading}
              />

              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition-colors text-white font-semibold disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Checking..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
