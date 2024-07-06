import React, { useState, useEffect } from "react";
import { Container, Typography, Grid, Paper, Box } from "@mui/material";
import api from "../api";

const ExercisesOrder = () => {
  const [exercises, setExercises] = useState([]);
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await api.get(`${baseURL}/exercises`);
        setExercises(res.data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchExercises();
  }, [baseURL]);

  return (
    <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Lista de Ejercicios
      </Typography>
      <Grid container spacing={3}>
        {exercises.length > 0 ? (
          exercises.map((exercise) => (
            <Grid item xs={12} sm={6} md={4} key={exercise._id}>
              <Paper elevation={3} style={{ padding: "1rem" }}>
                <Typography variant="h6">
                  Categoría: {exercise.category.name}
                </Typography>
                <Typography variant="body1">
                  Dificultad: {exercise.level}
                </Typography>
                <Typography variant="body1">
                  Número de orden: {exercise.order}
                </Typography>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography>No hay ejercicios disponibles</Typography>
        )}
      </Grid>
    </Container>
  );
};

export default ExercisesOrder;