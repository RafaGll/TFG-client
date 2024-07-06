import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, ButtonGroup, Container } from "@mui/material";
import api from "../api";
import "../styles/ExerciseDetails.css";

const ExerciseNavigation = ({ categoryId, currentExerciseId, userProgress }) => {
  const [exercises, setExercises] = useState([]);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL;

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

    if (categoryId) {
      fetchExercises();
    } else {
      console.error("Category ID is missing");
    }
  }, [categoryId, baseURL]);

  const handleExerciseClick = (exerciseId) => {
    navigate(`/exercises/${exerciseId}`);
  };

  const levelOneExercises = exercises.filter(
    (exercise) => exercise.level === 1
  ).length;

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

    // Return the next exercise ID if it exists
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
          {exercises.map((exercise) => (
            <Button
              key={exercise._id}
              style={{ maxWidth: "70px" }}
              variant={
                exercise._id === currentExerciseId ? "contained" : "outlined"
              }
              color="secondary"
              onClick={() => handleExerciseClick(exercise._id)}
              disabled={
                !userProgress.includes(exercise._id) &&
                exercise._id !== nextExerciseId
              }
            >
              {exercise.level === 1
                ? exercise.order
                : exercise.order + levelOneExercises}
            </Button>
          ))}
        </ButtonGroup>
      </Container>
    </Box>
  );
};

export default ExerciseNavigation;