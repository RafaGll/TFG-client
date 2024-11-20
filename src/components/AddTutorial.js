
import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ContentTutorial from "./ContentTutorial";
import "../styles/AddTutorial.css";

const AddTutorial = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState(""); // Nuevo estado para el tipo
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL;
  const contentTutorialRef = useRef();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(`${baseURL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [baseURL]);

  // Restablecer la categoría cuando cambia el tipo
  useEffect(() => {
    setCategory("");
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contentFromEditor = contentTutorialRef.current.getContent();
    await api.post(`${baseURL}/tutorials`, {
      title,
      content: contentFromEditor,
      category,
    });
    navigate("/tutorials");
  };

  useEffect(() => {
    const contentFromEditor = contentTutorialRef.current?.getContent();
    if (title && type && category && contentFromEditor) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [title, type, category, contentTutorialRef.current]);

  return (
    <Container maxWidth="lg" className="add-tutorial-container">
      <Paper elevation={3} className="add-tutorial-paper">
        <hr></hr>
        <Box className="add-tutorial-editor" marginBottom={"-20px"} marginTop={"-20px"}>
          <ContentTutorial ref={contentTutorialRef} />
        </Box>
        <hr></hr>
        <Box className="info-tutorial">
          <TextField
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          {/* Nuevo campo para seleccionar el tipo */}
          <TextField
            select
            label="Tipo"
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Estructura de datos">Estructura de datos</MenuItem>
            <MenuItem value="Algoritmo">Algoritmo</MenuItem>
          </TextField>
          <TextField
            select
            label="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            margin="normal"
            disabled={!type} // Deshabilita el campo si no se ha seleccionado un tipo
          >
            {type ? (
              categories
                .filter((cat) => cat.type === type)
                .map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))
            ) : (
              <MenuItem disabled value="">
                Primero seleccione un tipo
              </MenuItem>
            )}
          </TextField>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          className="add-tutorial-button"
          disabled={isButtonDisabled}
        >
          Añadir
        </Button>
      </Paper>
    </Container>
  );
};

export default AddTutorial;
