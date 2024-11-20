import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";
import api from "../api";
import "../styles/ChallengeMode.css";

const ChallengeMode = () => {
  const [exercises, setExercises] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showHints, setShowHints] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const baseURL = process.env.REACT_APP_API_URL;
  const handleShowResults = () => {
    setShowResults(true);
  };
  const [showInitialMessage, setShowInitialMessage] = useState(true);

  const handleCloseInitialMessage = () => {
    setShowInitialMessage(false);
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await api.get(
          `${baseURL}/exercises/random?difficulty=easy&count=10`
        );
        setExercises(res.data);
        setUserAnswers(new Array(res.data.length).fill(null));
        setShowHints(new Array(res.data.length).fill(false));

        // Barajar respuestas para cada ejercicio
        const shuffled = res.data.map((exercise) => {
          const allAnswers = [
            { text: exercise.answers.correct, isCorrect: true },
            ...exercise.answers.incorrect.map((ans) => ({
              text: ans,
              isCorrect: false,
            })),
          ];
          return shuffleArray(allAnswers);
        });
        setShuffledAnswers(shuffled);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };
    fetchExercises();
  }, [baseURL]);

  // Función para barajar un array sin mutar el original
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAnswerClick = (exerciseIndex, answerIndex, isCorrect) => {
    const updatedUserAnswers = [...userAnswers];
    if (updatedUserAnswers[exerciseIndex] === null) {
      updatedUserAnswers[exerciseIndex] = {
        selectedAnswerIndex: answerIndex,
        isCorrect: isCorrect,
      };
      setUserAnswers(updatedUserAnswers);
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }
      // Verificar si todas las preguntas han sido respondidas
      if (updatedUserAnswers.every((answer) => answer !== null)) {
        setShowResults(true);
        // Mostrar pistas después de mostrar los resultados
        setShowHints(new Array(exercises.length).fill(true));
      }
    } else {
      // Si el usuario ya ha respondido, no permitimos cambios adicionales
      return;
    }
  };

  const handleRetry = () => {
    setExercises([]);
    setUserAnswers([]);
    setShowResults(false);
    setScore(0);
    setShowHints([]);
    setShuffledAnswers([]);
    // Volver a cargar los ejercicios
    const fetchExercises = async () => {
      try {
        const res = await api.get(
          `${baseURL}/exercises/random?difficulty=hard&count=10`
        );
        setExercises(res.data);
        setUserAnswers(new Array(res.data.length).fill(null));
        setShowHints(new Array(res.data.length).fill(false));

        // Barajar respuestas para cada ejercicio
        const shuffled = res.data.map((exercise) => {
          const allAnswers = [
            { text: exercise.answers.correct, isCorrect: true },
            ...exercise.answers.incorrect.map((ans) => ({
              text: ans,
              isCorrect: false,
            })),
          ];
          return shuffleArray(allAnswers);
        });
        setShuffledAnswers(shuffled);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };
    fetchExercises();
  };

  const handleCloseResults = () => {
    setShowResults(false);
    // Las pistas ya se muestran después de responder la última pregunta
  };

  return (
    <Container className="challenge-container">
      <Dialog open={showInitialMessage} onClose={handleCloseInitialMessage}>
        <DialogTitle>Instrucciones</DialogTitle>
        <DialogContent>
          <Typography>
            Una vez selecciones una respuesta, no podrás cambiarla. ¡Buena
            suerte!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInitialMessage} color="primary">
            Entendido
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h4" className="challenge-title">
        Challenge
      </Typography>
      {exercises.length > 0 ? (
        exercises.map((exercise, exerciseIndex) => {
          // Usar las respuestas barajadas precomputadas
          const answers = shuffledAnswers[exerciseIndex];

          return (
            <Paper key={exerciseIndex} className="exercise-paper">
              <Typography variant="h6" className="exercise-problem">
                {exercise.problem}
              </Typography>
              {exercise.images && exercise.images.length > 0 && (
                // Mostrar imágenes si las hay
                <div
                  className={
                    exercise.images.length > 1
                      ? "exercise-images-container"
                      : ""
                  }
                >
                  {exercise.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Imagen ${idx}`}
                      className={`exercise-image ${
                        exercise.images.length > 1
                          ? "exercise-image-multiple"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              )}
              <div>
                {answers.map((answer, answerIndex) => {
                  const userAnswer = userAnswers[exerciseIndex];
                  const isSelected =
                    userAnswer &&
                    userAnswer.selectedAnswerIndex === answerIndex;
                  const isDisabled = userAnswer !== null;
                  let buttonStyles = {
                    display: "block",
                    marginBottom: "8px",
                  };

                  if (isDisabled) {
                    if (isSelected && answer.isCorrect) {
                      buttonStyles = {
                        ...buttonStyles,
                        backgroundColor: "green",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "green",
                        },
                      };
                    } else if (isSelected && !answer.isCorrect) {
                      buttonStyles = {
                        ...buttonStyles,
                        backgroundColor: "red",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "red",
                        },
                      };
                    } else if (answer.isCorrect) {
                      buttonStyles = {
                        ...buttonStyles,
                        backgroundColor: "green",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "green",
                        },
                      };
                    }
                  }

                  return (
                    <Button
                      key={answerIndex}
                      variant="outlined"
                      onClick={() =>
                        handleAnswerClick(
                          exerciseIndex,
                          answerIndex,
                          answer.isCorrect
                        )
                      }
                      disabled={isDisabled}
                      sx={buttonStyles}
                      fullWidth
                    >
                      {answer.text}
                    </Button>
                  );
                })}
              </div>
              {showHints[exerciseIndex] && (
                <div>
                  <Typography variant="body1" className="hint-text">
                    {exercise.explanation}
                  </Typography>
                </div>
              )}
            </Paper>
          );
        })
      ) : (
        <Typography>Cargando ejercicios...</Typography>
      )}
      {/* Mostrar el botón "Ver Resultados" solo si todas las preguntas han sido respondidas y la ventana de resultados no está abierta */}
      {userAnswers.every((answer) => answer !== null) && !showResults && (
        <Button
          variant="contained"
          onClick={handleShowResults}
          className="ver-resultados-button"
        >
          Ver Resultados
        </Button>
      )}
      <Dialog open={showResults} onClose={handleCloseResults}>
        <DialogTitle>Resultado</DialogTitle>
        <DialogContent className="result-dialog-content">
          <Typography>
            Has acertado {score} de {exercises.length}.
          </Typography>
        </DialogContent>
        <DialogActions className="result-dialog-actions">
          <Button onClick={handleRetry}>Repetir Reto</Button>
          <Button onClick={handleCloseResults}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ChallengeMode;
