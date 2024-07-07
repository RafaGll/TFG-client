import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
  CircularProgress,
  Tooltip,
  Fab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import api from "../api";
import ExerciseNavigation from "./ExerciseNavigation";
import { AuthContext } from "../context/AuthContext";
import "../styles/ExerciseDetails.css";

const ExerciseDetails = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [totalExercises, setTotalExercises] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [nextExerciseId, setNextExerciseId] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL;
  const { user } = useContext(AuthContext);

  const indexToLetter = (index) => {
    const letters = "abcd"; // Asume un máximo de 4 imágenes
    return letters[index] || "?"; // Retorna '?' para índices fuera del rango
  };

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await api.get(`${baseURL}/exercises/${id}`);
        setExercise(response.data);

        const categoryId = response.data.category._id;
        const totalResponse = await api.get(`${baseURL}/exercises`, {
          params: { category: categoryId },
        });

        const exercisesInCategory = totalResponse.data.filter(
          (exercise) => exercise.category._id === categoryId
        );

        setTotalExercises(exercisesInCategory);

        const userProgressResponse = await api.get(
          `${baseURL}/users/progress`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        const userProgress = userProgressResponse.data.find(
          (progress) => progress.category === categoryId
        );

        if (userProgress) {
          setCompletedExercises(userProgress.completed);
        }

        const answers = [
          { text: response.data.answers.correct, isCorrect: true },
          ...response.data.answers.incorrect.map((ans) => ({
            text: ans,
            isCorrect: false,
          })),
        ];
        setShuffledAnswers(shuffleArray(answers));
        setDisabledButtons(
          new Array(answers.length).fill({ disabled: false, incorrect: false })
        );

        // Determinar el siguiente ejercicio no completado
        const nextExercise = exercisesInCategory.find(
          (ex) => !userProgress.completed.includes(ex._id)
        );
        if (nextExercise) {
          setNextExerciseId(nextExercise._id);
        }
      } catch (error) {
        console.error("Error fetching exercise details:", error);
      }
    };

    fetchExercise();
  }, [id, baseURL]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleAnswerClick = async (index, isCorrect) => {
    if (isCorrect) {
      setShowExplanation(true);
      for (let u = 0; u < disabledButtons.length; u++) {
        setDisabledButtons((prevState) =>
          prevState.map((btnState, u) => ({ disabled: true, incorrect: true }))
        );
      }
      setDisabledButtons((prevState) =>
        prevState.map((btnState, i) =>
          i === index ? { disabled: true, incorrect: false } : btnState
        )
      );

      // Actualizar el progreso del usuario en el backend
      try {
        const response = await api.patch(
          `${baseURL}/users/complete-exercise`,
          {
            categoryId: exercise.category._id,
            exerciseId: exercise._id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        // Actualizar el estado local con el progreso actualizado
        const updatedProgress = response.data.completedExercises.find(
          (progress) => progress.category.toString() === exercise.category._id
        ).completed;
        setCompletedExercises(updatedProgress);

        // Determinar el siguiente ejercicio no completado
        const nextExercise = totalExercises.find(
          (ex) => !updatedProgress.includes(ex._id)
        );
        if (nextExercise) {
          setNextExerciseId(nextExercise._id);
        }

        console.log("Progreso actualizado:", response.data);
      } catch (error) {
        console.error("Error updating user progress:", error);
      }
    } else {
      setDisabledButtons((prevState) =>
        prevState.map((btnState, i) =>
          i === index ? { disabled: true, incorrect: true } : btnState
        )
      );
    }
  };

  const handleNextClick = () => {
    if (nextExerciseId) {
      navigate(`/exercises/${nextExerciseId}`);
    }
  };

  const handleShowExplanationClick = () => {
    setShowExplanation(!showExplanation);
  };

  const handleEditExercise = () => {
    navigate(`/edit-exercise/${id}`);
  };

  const handleDeleteExercise = async () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este ejercicio?"
    );
    if (confirmDelete) {
      try {
        await api.delete(`${baseURL}/exercises/${id}`);
        navigate("/exercises");
      } catch (error) {
        console.error("Error deleting exercise", error);
      }
    }
  };

  if (!exercise) {
    return (
      <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
        <Typography variant="h6">Cargando...</Typography>
      </Container>
    );
  }

  const progressPercentage =
    (completedExercises.length / totalExercises.length) * 100;

  return (
    <Container maxWidth="lg" className="container-exercise">
      {user && user.role === "admin" && (
        <>
          <Fab
            color="error"
            size="small"
            aria-label="delete"
            style={{ position: "absolute", right: "170px", top: "20px" }}
            onClick={handleDeleteExercise}
          >
            <DeleteIcon />
          </Fab>
          <Fab
            color="secondary"
            size="small"
            aria-label="edit"
            style={{ position: "absolute", right: "220px", top: "20px" }}
            onClick={handleEditExercise}
          >
            <EditIcon />
          </Fab>
        </>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Button
          variant="outlined"
          style={{
            border: "0",
            marginRight: "20px",
            // height: "50px",
          }}
          onClick={() => navigate("/exercises")}
        >
          <ArrowBackIcon sx={{ fontSize: 40, color: "blue" }} />
        </Button>
        <Typography
          variant="h4"
          gutterBottom
          style={{ fontWeight: "bold", textTransform: "uppercase" }}
        >
          {exercise.category.name}
        </Typography>
      </Box>

      <Paper
        elevation={2}
        className="paper-exercise"
        style={{ borderRadius: "30px" }}
      >
        <div style={{ width: "100%", marginBottom: "10px" }}>
          <Box
            sx={{
              display: "flex",
              p: 1,
              borderRadius: 1,
            }}
          >
            {/* Mostrar el Enunciado del ejercicio */}
            <Typography variant="h6" gutterBottom sx={{ flexGrow: 1 }}>
              {exercise.problem}
            </Typography>

            {/* Mostrar el círculo de progreso */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="flex-start"
              style={{ marginLeft: "10px" }}
            >
              <Box position="relative" display="inline-flex">
                <CircularProgress
                  variant="determinate"
                  value={progressPercentage}
                  size={100}
                  color="success"
                />
                <Box
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  position="absolute"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography
                    variant="h6"
                    fontWeight={"bold"}
                    component="div"
                    color="textSecondary"
                  >{`${completedExercises.length}/${totalExercises.length}`}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </div>

        {/* Mostrar las imágenes asociadas al ejercicio, si las hay */}
        {exercise.images && exercise.images.length > 0 && (
          <Box marginY={2}>
            <Grid container spacing={2}>
              {exercise.images.map((img, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Typography
                    sx={{
                      top: 0,
                      left: 0,
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      padding: "0px 5px",
                      borderRadius: "5px",
                      fontSize: "1rem",
                      width: "fit-content",
                      marginBottom: "-25px",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {indexToLetter(index)}
                  </Typography>
                  <img
                    src={img}
                    alt={`exercise-${index}`}
                    style={{ width: "100%", position: "relative", zIndex: 0 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        {/* Mostrar las respuestas en botones */}
        <Box
          sx={{
            display: "grid",
            gap: 1,
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          {shuffledAnswers.map((answer, index) => (
            <Button
              key={index}
              className={`answer-button ${
                disabledButtons[index].incorrect ? "wrong-answer-button" : ""
              } ${
                disabledButtons[index].disabled &&
                !disabledButtons[index].incorrect
                  ? "correct-answer-button"
                  : ""
              }`}
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => handleAnswerClick(index, answer.isCorrect)}
              disabled={disabledButtons[index].disabled}
            >
              {answer.text}
            </Button>
          ))}
        </Box>
        <ExerciseNavigation
          categoryId={exercise.category._id}
          currentExerciseId={id}
          userProgress={completedExercises}
        />
        <Button
          variant="contained"
          color="success"
          disabled={
            !disabledButtons.every((btn) => btn.disabled === true) ||
            completedExercises.length === totalExercises.length
          }
          style={{ maxHeight: "40px", marginTop: "20px", boxShadow: "none" }}
          onClick={handleNextClick}
        >
          SIGUIENTE
        </Button>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
          }}
        >
          <Tooltip title="USAR SOLO SI ESTÁS ATASCADO">
            <Button
              variant="outlined"
              color="error"
              onClick={handleShowExplanationClick}
              style={{
                padding: "0px",
                paddingRight: "0px",
                paddingLeft: "5px",
                marginTop: "-50px",
                marginBottom: "-70px",
                height: "30px",
              }}
            >
              Pista{" "}
              {showExplanation ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </Button>
          </Tooltip>
        </Box>

        {/* Mostrar la explicación del ejercicio si showExplanation es true */}
        {showExplanation && (
          <Box mt={2}>
            <Typography variant="body1" paragraph>
              {exercise.explanation}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ExerciseDetails;
