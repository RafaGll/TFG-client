import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Paper } from "@mui/material";
import axios from "axios";

const ExerciseDetails = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);

  useEffect(() => {
    const fetchExercise = async () => {
      const res = await axios.get(`http://localhost:3000/exercises/${id}`);
      setExercise(res.data);
    };
    fetchExercise();
  }, [id]);

  if (!exercise) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Paper elevation={3} style={{ padding: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          {exercise.title}
        </Typography>
        <Typography variant="h6" paragraph>
          Nivel: {exercise.level}
        </Typography>
        <Typography variant="body1" paragraph>
          Problema: {exercise.problem}
        </Typography>
        <Typography variant="body1" paragraph>
          Solución: {exercise.solution}
        </Typography>
      </Paper>
    </Container>
  );
};

export default ExerciseDetails;
