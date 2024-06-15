import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Asegúrate de que esto coincida con la URL de tu servidor backend
});

export default api;
