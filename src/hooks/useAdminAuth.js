import { useState } from "react";

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const login = async (password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in sessionStorage (NOT localStorage for better security)
        sessionStorage.setItem("adminToken", data.token);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Invalid password" };
      }
    } catch (error) {
      console.error("Admin login error:", error);
      return { success: false, message: "Failed to connect to server" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  const checkAuth = () => {
    const token = sessionStorage.getItem("adminToken");
    return !!token;
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };
}
