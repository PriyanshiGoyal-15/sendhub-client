import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setloading(false);
        return;
      }
      try {
        const res = await api.get("/users/profile");
        setUser(res.data.data);
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      }
      setloading(false);
    };
    loadUser();
  }, []);

  //login
  const login = async (email, password) => {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.data.accessToken);

    const profile = await api.get("/users/profile");

    setUser(profile.data.data);
  };

  //register
  const register = async (name, email, password) => {
    await api.post("/auth/register", {
      name,
      email,
      password,
    });
  };

  // logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
