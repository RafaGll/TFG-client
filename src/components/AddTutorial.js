import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTutorial = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [level, setLevel] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:3000/tutorials", {
      title,
      content,
      level,
    });
    navigate("/tutorials");
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Paper elevation={3} style={{ padding: "1rem" }}>
        <Typography variant="h4" gutterBottom>
          Añadir Nuevo Tutorial
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contenido"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nivel"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: "1rem" }}
          >
            Añadir
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddTutorial;
