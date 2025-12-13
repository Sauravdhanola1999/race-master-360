import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ ADD THIS

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = jwtDecode(token);
        setUser({
          id: payload.id,
          email: payload.email,
          role: payload.role,
        });
      } catch (err) {
        console.log("Invalid token");
        localStorage.removeItem("token");
        setUser(null);
      }
    }

    setLoading(false); // ✅ IMPORTANT
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const payload = jwtDecode(token);
    setUser({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
