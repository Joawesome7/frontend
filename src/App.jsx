import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VillaRoseResort from "./VillaRoseResort";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import HouseRulesPage from "./pages/HouseRulesPage";

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
