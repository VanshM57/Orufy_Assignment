import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check cookie auth on load
  useEffect(() => {
    api.get("/auth/me")
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await api.post("/auth/logout");
    setAuthenticated(false);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        loading,
        setAuthenticated,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
