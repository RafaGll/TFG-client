import React, { createContext, useState, useEffect } from "react";
import api from "../api";
import jwtDecode from "jwt-decode";
const baseURL = process.env.REACT_APP_API_URL;
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
        api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
      } catch (error) {
        console.error("Invalid token:", error);
        setUser(null);
      }
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [authToken]);

  const login = async (username, password) => {
    try {
      const res = await api.post(`${baseURL}/auth/login`, {
        username,
        password,
      });
      setAuthToken(res.data.token);
      localStorage.setItem("authToken", res.data.token);
      const decoded = jwtDecode(res.data.token);
      setUser(decoded.user);
      console.log("User logged in:", decoded.user);
      console.log("Token:", res.data.token);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const register = async (username, password) => {
    try {
      const res = await api.post(`${baseURL}/auth/register`, {
        username,
        password,
      });
      setAuthToken(res.data.token);
      localStorage.setItem("authToken", res.data.token);
      const decoded = jwtDecode(res.data.token);
      setUser(decoded.user);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

    // -------------------------------------------------
  // Login usando token de Google
  const loginWithGoogle = async (googleToken) => {
    try {
      const res = await api.post(`${baseURL}/auth/google`, { token: googleToken });
      const jwt = res.data.token;
      // guarda el JWT
      setAuthToken(jwt);
      localStorage.setItem("authToken", jwt);
      // decodifica y almacena usuario
      const { user: u } = jwtDecode(jwt);
      setUser(u);
    } catch (err) {
      console.error("Error en loginWithGoogle:", err);
      throw err;
    }
  };
  // -------------------------------------------------


  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
