import React, { useState, useEffect } from "react";
import api from "../api";
import {
  IconButton,
  TextField,
  Box,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import { Edit, Save, Delete, Add } from "@mui/icons-material";
import "../styles/Categories.css";

// Componente principal 
const Categories = () => {
  // Estados para manejar las categorías y el estado de edición/agregado
  const [categories, setCategories] = useState([]);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("");
  const baseURL = process.env.REACT_APP_API_URL;

  // Función para obtener todas las categorías del backend
  const fetchCategories = async () => {
    try {
      const response = await api.get(`${baseURL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Obtener las categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, []);

  // Función para manejar el clic en el botón de editar
  const handleEditClick = (category) => {
    setEditCategoryId(category._id);
    setEditCategoryName(category.name);
  };

  // Función para manejar el guardado de una categoría editada
  const handleSaveClick = async (id) => {
    try {
      await api.patch(`${baseURL}/categories/${id}`, {
        name: editCategoryName,
      });
      setEditCategoryId(null);
      setEditCategoryName("");
      fetchCategories(); // Actualizar la lista de categorías
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Función para manejar el clic en el botón de eliminar
  const handleDeleteClick = async (id) => {
    try {
      const response = await api.delete(`${baseURL}/categories/${id}`);
      fetchCategories(); // Actualizar la lista de categorías
    } catch (error) {
      console.error("Error deleting category:", error);
      if (error.response && error.response.status === 400) {
        window.alert(
          "No se puede eliminar la categoría porque hay tutoriales o ejercicios asociados."
        );
      } else {
        window.alert("Error eliminando la categoría.");
      }
    }
  };

  // Función para manejar el clic en el botón de agregar
  const handleAddClick = (type) => {
    setNewCategoryType(type);
  };

  // Función para manejar el guardado de una nueva categoría
  const handleAddSaveClick = async () => {
    try {
      await api.post(`${baseURL}/categories`, {
        name: newCategoryName,
        type: newCategoryType,
      });
      setNewCategoryName("");
      setNewCategoryType("");
      fetchCategories(); // Actualizar la lista de categorías
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Filtrar categorías por tipo
  const dataStructures = categories.filter(
    (category) => category.type === "Estructura de datos"
  );
  const algorithms = categories.filter(
    (category) => category.type === "Algoritmo"
  );

  return (
    <Container className="category-container" maxWidth="lg">
      <Box display="flex">
        {/* Columna de Estructuras de Datos */}
        <Paper elevation={3} className="paper-edit-column">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">Estructuras de Datos</Typography>
            <IconButton
              color="primary"
              onClick={() => handleAddClick("Estructura de datos")}
            >
              <Add />
            </IconButton>
          </Box>
          <ul style={{ listStyleType: "none", padding: "5px" }}>
            {dataStructures.map((category) => (
              <li
                key={category._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "3px",
                }}
              >
                {editCategoryId === category._id ? (
                  <TextField
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    onBlur={() => handleSaveClick(category._id)}
                    autoFocus
                  />
                ) : (
                  <Typography variant="body1">{category.name}</Typography>
                )}
                <IconButton
                  color="primary"
                  onClick={() =>
                    editCategoryId === category._id
                      ? handleSaveClick(category._id)
                      : handleEditClick(category)
                  }
                  style={{ marginLeft: "10px" }}
                >
                  {editCategoryId === category._id ? <Save /> : <Edit />}
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteClick(category._id)}
                >
                  <Delete />
                </IconButton>
              </li>
            ))}
            {newCategoryType === "Estructura de datos" && (
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TextField
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nueva categoría"
                  autoFocus
                />
                <IconButton
                  color="primary"
                  onClick={handleAddSaveClick}
                  style={{ marginLeft: "10px" }}
                >
                  <Save />
                </IconButton>
              </li>
            )}
          </ul>
        </Paper>

        {/* Columna de Algoritmos */}
        <Paper elevation={3} className="paper-edit-column">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">Algoritmos</Typography>
            <IconButton
              color="primary"
              onClick={() => handleAddClick("Algoritmo")}
            >
              <Add />
            </IconButton>
          </Box>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {algorithms.map((category) => (
              <li
                key={category._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "3px",
                }}
              >
                {editCategoryId === category._id ? (
                  <TextField
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    onBlur={() => handleSaveClick(category._id)}
                    autoFocus
                  />
                ) : (
                  <Typography variant="body1">{category.name}</Typography>
                )}
                <IconButton
                  color="primary"
                  onClick={() =>
                    editCategoryId === category._id
                      ? handleSaveClick(category._id)
                      : handleEditClick(category)
                  }
                  style={{ marginLeft: "10px" }}
                >
                  {editCategoryId === category._id ? <Save /> : <Edit />}
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteClick(category._id)}
                >
                  <Delete />
                </IconButton>
              </li>
            ))}
            {newCategoryType === "Algoritmo" && (
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TextField
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nueva categoría"
                  autoFocus
                />
                <IconButton
                  color="primary"
                  onClick={handleAddSaveClick}
                  style={{ marginLeft: "10px" }}
                >
                  <Save />
                </IconButton>
              </li>
            )}
          </ul>
        </Paper>
      </Box>
    </Container>
  );
};

export default Categories;
