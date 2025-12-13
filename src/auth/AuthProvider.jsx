import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) loadUserFromToken(token);
  }, []);

  const loadUserFromToken = (token) => {
    try {
      const payload = jwtDecode(token);
      // Expect backend to return { id, email, role: "admin", exp, ... }
      setUser({
        id: payload.id,
        email: payload.email,
        role: payload.role,
      });
    } catch (err) {
      console.log("Invalid token");
      localStorage.removeItem("token");
    }
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    loadUserFromToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
