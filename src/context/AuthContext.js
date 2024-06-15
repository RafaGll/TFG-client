import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Importa jwtDecode correctamente con llaves

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || null
  );
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.user;
      } catch (error) {
        console.error("Invalid token:", error);
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (authToken) {
      try {
        const decoded = jwtDecode(authToken);
        setUser(decoded.user);
        axios.defaults.headers.common["x-auth-token"] = authToken;
      } catch (error) {
        console.error("Invalid token:", error);
        setUser(null);
      }
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
    }
    console.log("authToken:", authToken);
    console.log("user:", user);
  }, [authToken]);

  const login = async (username, password) => {
    const res = await axios.post("http://localhost:3000/auth/login", {
      username,
      password,
    });
    setAuthToken(res.data.token);
    localStorage.setItem("authToken", res.data.token);
    const decoded = jwtDecode(res.data.token);
    setUser(decoded.user);
  };

  const register = async (username, password) => {
    const res = await axios.post("http://localhost:3000/auth/register", {
      username,
      password,
    });
    setAuthToken(res.data.token);
    localStorage.setItem("authToken", res.data.token);
    const decoded = jwtDecode(res.data.token);
    setUser(decoded.user);
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
