import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000", // Usa la variable de entorno si está definida, de lo contrario usa localhost
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