import React from "react";
import { useNavigate } from "react-router-dom";
import HouseRulesModal from "../components/HouseRulesModal";

export default function HouseRulesPage() {
  const navigate = useNavigate();

  return (
    // Full-page slate background so the modal overlay looks intentional
    <div className="min-h-screen bg-slate-900">
      <HouseRulesModal isOpen={true} onClose={() => navigate("/")} />
    </div>
  );
}
