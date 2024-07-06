import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";

const EditTutorial = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [level, setLevel] = useState("");
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchTutorial = async () => {
      const res = await api.get(`${baseURL}/tutorials/${id}`);
      setTitle(res.data.title);
      setContent(res.data.content);
      setLevel(res.data.level);
    };
    fetchTutorial();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.patch(`${baseURL}/tutorials/${id}`, {
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
          Editar Tutorial
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
            Guardar
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EditTutorial;
