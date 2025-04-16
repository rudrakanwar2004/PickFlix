// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize token from localStorage
  const [token, setToken] = useState(localStorage.getItem("access_token"));

  // Define login function: store token and update state
  const login = (newToken) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
  };

  // Define logout function: clear token and update state
  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
  };

  // Optional: You can listen to storage events if needed (for multi-tab sync)

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
