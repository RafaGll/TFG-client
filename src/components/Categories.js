import React, { useState, useEffect } from "react";
import axios from "axios";
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

const Categories = () => {
  // Estados para manejar las categorías y el estado de edición/agregado
  const [categories, setCategories] = useState([]);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("");

  // Función para obtener todas las categorías del backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categories");
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
      await axios.patch(`http://localhost:3000/categories/${id}`, {
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
      const response = await axios.delete(
        `http://localhost:3000/categories/${id}`
      );
      console.log(response.data); // Información de depuración
      fetchCategories(); // Actualizar la lista de categorías
    } catch (error) {
      console.error("Error deleting category:", error);
      if (error.response && error.response.status === 400) {
        window.alert(
          "No se puede eliminar la categoría porque hay tutoriales asociados."
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
      await axios.post("http://localhost:3000/categories", {
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
    <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
      <Box display="flex" justifyContent="space-between">
        {/* Columna de Estructuras de Datos */}
        <Paper
          elevation={3}
          style={{ padding: "1rem", flex: 1, marginRight: "1rem" }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            marginBottom={2}
          >
            <Typography variant="h5">Estructuras de Datos</Typography>
            <IconButton
              color="primary"
              onClick={() => handleAddClick("Estructura de datos")}
            >
              <Add />
            </IconButton>
          </Box>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {dataStructures.map((category) => (
              <li
                key={category._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
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
                  style={{ marginLeft: "10px" }}
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
                  marginBottom: "8px",
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
        <Paper
          elevation={3}
          style={{ padding: "1rem", flex: 1, marginLeft: "1rem" }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            marginBottom={2}
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
                  marginBottom: "8px",
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
                  style={{ marginLeft: "10px" }}
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
                  marginBottom: "8px",
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
