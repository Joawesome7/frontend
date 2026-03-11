import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute
 * ──────────────
 * Wraps any route that requires admin access.
 * Usage in App.jsx:
 *
 *   <Route path="/admin" element={
 *     <ProtectedRoute>
 *       <AdminPage />
 *     </ProtectedRoute>
 *   } />
 *
 * ── How authentication is checked ────────────────────────────────────────────
 *
 *  Layer 1 — JWT (recommended, use this when your backend is ready)
 *  ----------------------------------------------------------------
 *  Your backend login endpoint should return a signed JWT, e.g.:
 *    { token: "eyJhbGci..." }
 *
 *  Store it on successful login:
 *    localStorage.setItem("adminToken", token);
 *
 *  This component will:
 *    • Decode the payload (no library needed — pure atob)
 *    • Check that  payload.role === "admin"
 *    • Check that  payload.exp  hasn't passed  (auto-removes expired tokens)
 *
 *  Layer 2 — Simple flag (temporary, while you don't have a backend yet)
 *  -----------------------------------------------------------------------
 *  If you just want to test the /admin route right now, run this once
 *  in your browser console:
 *    localStorage.setItem("adminToken", "true");
 *
 *  ⚠️  Remove the simple-flag branch (clearly marked below) once your
 *  backend issues real JWTs.
 *
 * ── On auth failure ──────────────────────────────────────────────────────────
 *  Redirects to "/" and saves the attempted path in router state.
 *  After a successful login you can send the user back with:
 *    const location = useLocation();
 *    navigate(location.state?.from ?? "/admin");
 */

function parseJwtPayload(token) {
  try {
    // JWT = header.payload.signature  (base-64url encoded segments)
    const [, payloadB64] = token.split(".");
    if (!payloadB64) return null;

    // base-64url → standard base-64, then decode to JSON
    const json = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isValidAdminToken(token) {
  if (!token) return false;

  // ── Layer 1: JWT path ─────────────────────────────────────────────────────
  // A valid JWT always has exactly 2 dots (3 segments)
  if ((token.match(/\./g) || []).length === 2) {
    const payload = parseJwtPayload(token);
    if (!payload) return false;

    // Must have admin role
    if (payload.role !== "admin") return false;

    // Must not be expired (exp is seconds-since-epoch per RFC 7519)
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      localStorage.removeItem("adminToken"); // auto-clean
      return false;
    }

    return true;
  }

  // ── Layer 2: Simple flag (REMOVE THIS after JWT is wired up) ─────────────
  return token === "true";
}

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("adminToken");

  if (!isValidAdminToken(token)) {
    // Redirect home, but remember where the user was trying to go
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return children;
}
