import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditExercise = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [level, setLevel] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercise = async () => {
      const res = await axios.get(`http://localhost:3000/exercises/${id}`);
      setTitle(res.data.title);
      setProblem(res.data.problem);
      setSolution(res.data.solution);
      setLevel(res.data.level);
    };
    fetchExercise();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.patch(`http://localhost:3000/exercises/${id}`, {
      title,
      problem,
      solution,
      level,
    });
    navigate("/exercises");
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Paper elevation={3} style={{ padding: "1rem" }}>
        <Typography variant="h4" gutterBottom>
          Editar Ejercicio
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
            label="Problema"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Solución"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
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

export default EditExercise;
