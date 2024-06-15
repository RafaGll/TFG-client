import React, { useState, useEffect, useContext } from "react";
import { Container, Typography, Grid, Paper, Button } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      const res = await axios.get("http://localhost:3000/exercises");
      setExercises(res.data);
    };
    fetchExercises();
  }, []);

  return (
    <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Ejercicios
      </Typography>
      {user && user.role === "admin" && (
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: "1rem" }}
          onClick={() => navigate("/add-exercise")}
        >
          Añadir Ejercicio
        </Button>
      )}
      <Grid container spacing={3}>
        {exercises.map((exercise) => (
          <Grid item xs={12} sm={6} md={4} key={exercise._id}>
            <Paper elevation={3} style={{ padding: "1rem" }}>
              <Typography variant="h6">{exercise.title}</Typography>
              <Typography variant="body2">{exercise.level}</Typography>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "1rem" }}
                onClick={() => navigate(`/exercises/${exercise._id}`)}
              >
                Ver más
              </Button>
              {user && user.role === "admin" && (
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginTop: "1rem", marginLeft: "1rem" }}
                  onClick={() => navigate(`/edit-exercise/${exercise._id}`)}
                >
                  Editar
                </Button>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Exercises;
