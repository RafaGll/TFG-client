import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "/api"
      : process.env.REACT_APP_API_URL || "http://localhost:3000",
});
// Interceptor de petición: adjunta el JWT si existe
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
  

// Agregar un interceptor de respuesta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('authToken'); // Eliminar el token almacenado
      window.location.href = '/login'; // Redirigir al usuario a la página de inicio de sesión
    }
    return Promise.reject(error);
  }
);

export default api;