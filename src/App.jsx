import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VillaRoseResort from "./VillaRoseResort";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import HouseRulesPage from "./pages/HouseRulesPage";

/**
 * App.jsx — Router Hallway
 * ────────────────────────
 * This file only handles routing. No state, no UI.
 *
 * Current routes:
 *   /   → VillaRoseResort (landing page — unchanged for now)
 *
 * Coming soon (we'll add these in later steps):
 *   /rules  → HouseRulesPage
 *   /admin  → AdminPage (wrapped in ProtectedRoute)
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VillaRoseResort />} />

        <Route path="/rules" element={<HouseRulesPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard onClose={() => window.history.back()} />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: unknown paths fall back to home */}
        <Route path="*" element={<VillaRoseResort />} />
      </Routes>
    </BrowserRouter>
  );
}
