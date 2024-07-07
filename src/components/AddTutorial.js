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
    if (title && category && contentFromEditor) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [title, category, contentTutorialRef.current?.getContent()]);

  return (
    <Container maxWidth="lg" className="add-tutorial-container">
      <Paper elevation={3} className="add-tutorial-paper">
        <Box className="add-tutorial-editor" marginBottom={"-20px"}>
          <ContentTutorial ref={contentTutorialRef} />
        </Box>
        <hr></hr>
        <Box display="flex" justifyContent="space-between" marginBottom={2}>
          <TextField
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            style={{ marginRight: "1rem" }}
          />
          <TextField
            select
            label="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            margin="normal"
            style={{ marginLeft: "1rem" }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
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
