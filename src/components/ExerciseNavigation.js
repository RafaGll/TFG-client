import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, ButtonGroup, Container } from "@mui/material";
import api from "../api";
import "../styles/ExerciseDetails.css";
import { AuthContext } from "../context/AuthContext";

// Componente principal
const ExerciseNavigation = ({
  categoryId,
  currentExerciseId,
  userProgress,
}) => {
  const [exercises, setExercises] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL;

  // Hook para cargar los ejercicios al inicial el componente
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        console.log(
          `Fetching exercises for category: ${categoryId} from ${baseURL}/exercises`
        );
        const response = await api.get(
          `${baseURL}/exercises?categoryId=${categoryId}`
        );
        setExercises(response.data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    // Llamar a la función para cargar los ejercicios
    if (categoryId) {
      fetchExercises();
    } else {
      console.error("Category ID is missing");
    }
  }, [categoryId, baseURL]);

  // Función para manejar el click en un ejercicio
  const handleExerciseClick = (exerciseId) => {
    navigate(`/exercises/${exerciseId}`);
  };

  // Contar el número de ejercicios de nivel 1
  const levelOneExercises = exercises.filter(
    (exercise) => exercise.level === 1
  ).length;

  // Función para obtener el ID del siguiente ejercicio
  const getNextExerciseId = () => {
    const completedIds = new Set(userProgress);
    let lastCompletedIndex = -1;

    for (let i = 0; i < exercises.length; i++) {
      if (completedIds.has(exercises[i]._id.toString())) {
        lastCompletedIndex = i;
      } else {
        break;
      }
    }

    // Si no se ha completado el último ejercicio
    if (lastCompletedIndex + 1 < exercises.length) {
      return exercises[lastCompletedIndex + 1]._id;
    }

    return null;
  };

  const nextExerciseId = getNextExerciseId();

  return (
    <Box marginTop={5}>
      <Container className="group-exercises">
        <ButtonGroup
          variant="outlined"
          aria-label="Basic button group"
          fullWidth="false"
        >
          {exercises.map((exercise) => {
            const isCompleted = userProgress.includes(exercise._id.toString());
            const buttonVariant =
              exercise._id === currentExerciseId ? "contained" : "outlined";
            const buttonColor = isCompleted ? "primary" : "secondary";
            const buttonStyle = isCompleted
              ? { backgroundColor: "green", color: "white" }
              : {};

            return (
              <Button
                key={exercise._id}
                style={{ maxWidth: "70px", ...buttonStyle }}
                variant={buttonVariant}
                color={buttonColor}
                onClick={() => handleExerciseClick(exercise._id)}
                disabled={
                  !user ||
                  (user.role !== "admin" &&
                    !isCompleted &&
                    exercise._id !== nextExerciseId)
                }
              >
                {exercise.level === 1
                  ? exercise.order
                  : exercise.order + levelOneExercises}
              </Button>
            );
          })}
        </ButtonGroup>
      </Container>
    </Box>
  );
};

export default ExerciseNavigation;
