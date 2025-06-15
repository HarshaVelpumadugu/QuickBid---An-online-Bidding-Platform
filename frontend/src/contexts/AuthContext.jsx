// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await axios.get("https://quickbid-backend.onrender.com/api/users/check-auth", {
          withCredentials: true,
        });
        setIsAuthenticated(res.status === 200);
      } catch {
        setIsAuthenticated(false);
      }
    };
    check();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
