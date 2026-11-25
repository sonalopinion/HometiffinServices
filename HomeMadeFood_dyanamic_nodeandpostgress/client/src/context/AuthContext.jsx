"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getMe,
  getToken,
  loginUser,
  logoutUser,
  registerUser,
  setToken,
} from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the session from the saved token.
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    getMe()
      .then(setUser)
      .catch((err) => {
        if (err.status === 401) setToken(null); // expired / invalid token
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const u = await loginUser(email, password);
    setUser(u);
    return u;
  }

  async function register(form) {
    const u = await registerUser(form);
    setUser(u);
    return u;
  }

  function logout() {
    logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
