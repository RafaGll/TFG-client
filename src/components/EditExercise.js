import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Paper,
  Box,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import imageCompression from "browser-image-compression";
import "../styles/ExerciseDetails.css";

// Componente principal
const EditExercise = () => {
  const [problem, setProblem] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [level, setLevel] = useState("");
  const [images, setImages] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [incorrectAnswers, setIncorrectAnswers] = useState([
    "",
    "",
    "",
    "",
    "",
  ]);
  const [explanation, setExplanation] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener el ID del ejercicio de la URL
  const baseURL = process.env.REACT_APP_API_URL;

  // Función para convertir un índice a una letra
  const indexToLetter = (index) => {
    const letters = "abcd";
    return letters[index];
  };

  // Hook para cargar las categorías disponibles
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(`${baseURL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [baseURL]);

  // Hook para cargar el ejercicio al inicializar el componente
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await api.get(`${baseURL}/exercises/${id}`);
        const exercise = response.data;
        setProblem(exercise.problem);
        setCategory(exercise.category._id);
        setType(exercise.category.type);
        setLevel(exercise.level === 1 ? "Fácil" : "Difícil");
        setImages(exercise.images);
        setCorrectAnswer(exercise.answers.correct);
        setIncorrectAnswers([
          ...exercise.answers.incorrect,
          ...Array(5 - exercise.answers.incorrect.length).fill(""),
        ]);
        setExplanation(exercise.explanation);
      } catch (error) {
        console.error("Error fetching exercise:", error);
      }
    };

    fetchExercise();
  }, [baseURL, id]);

  // Función para enviar el formulario al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    const mappedLevel = level === "Fácil" ? 1 : 2;
    try {
      await api.patch(`${baseURL}/exercises/${id}`, {
        problem,
        level: mappedLevel,
        category,
        images,
        correctAnswer,
        incorrectAnswers: incorrectAnswers.filter((ans) => ans),
        explanation,
      });
      navigate("/exercises");
    } catch (error) {
      console.error("Error updating exercise:", error);
    }
  };

  // Función para comprimir y subir las imágenes al servidor
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && images.length < 4) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages([...images, reader.result]);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    } else {
      alert("No puedes añadir más de 4 imágenes.");
    }
  };

  // Función para eliminar una imagen
  const handleImageRemove = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Función para validar el formulario
  const isFormValid = () => {
    return (
      problem &&
      level &&
      category &&
      correctAnswer &&
      explanation &&
      incorrectAnswers.some((ans) => ans)
    );
  };

  return (
    <Container maxWidth="lg" className="add-exercise-container">
      <Paper elevation={3} className="add-exercise-paper">
        <Typography variant="h4" gutterBottom>
          Editar Ejercicio
        </Typography>
        <form onSubmit={handleSubmit} className="add-exercise-form">
          <TextField
            label="Problema"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            required
          />
          <TextField
            select
            label="Tipo"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setCategory("");
            }}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="Algoritmo">Algoritmo</MenuItem>
            <MenuItem value="Estructura de datos">Estructura de datos</MenuItem>
          </TextField>
          <TextField
            select
            label="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={!type}
          >
            {categories
              .filter((cat) => cat.type === type)
              .map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            select
            label="Dificultad"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="Fácil">Fácil</MenuItem>
            <MenuItem value="Difícil">Difícil</MenuItem>
          </TextField>
          <Box className="image-upload-section">
            <Typography variant="h6">Imágenes</Typography>
            <Grid container spacing={2}>
              {images.map((img, index) => (
                <Grid item xs={3} key={index} position="relative">
                  <img
                    src={img}
                    alt={`uploaded-${index}`}
                    style={{ width: "100%" }}
                  />
                  <Typography
                    style={{
                      position: "absolute",
                      top: 5,
                      left: 5,
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      padding: "0 5px",
                      borderRadius: "5px",
                    }}
                  >
                    {indexToLetter(index)}
                  </Typography>
                  <IconButton
                    onClick={() => handleImageRemove(index)}
                    className="delete-image-button"
                    style={{ position: "absolute", top: 0, right: 0 }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Grid>
              ))}
            </Grid>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="image-upload"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">
              <IconButton color="primary" component="span">
                <AddPhotoAlternateIcon />
              </IconButton>
            </label>
          </Box>
          <TextField
            label="Respuesta Correcta"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          {incorrectAnswers.map((answer, index) => (
            <TextField
              key={index}
              label={`Respuesta Incorrecta ${index + 1}`}
              value={answer}
              onChange={(e) => {
                const newIncorrectAnswers = [...incorrectAnswers];
                newIncorrectAnswers[index] = e.target.value;
                setIncorrectAnswers(newIncorrectAnswers);
              }}
              fullWidth
              margin="normal"
              required={index === 0 ? true : false}
            />
          ))}
          <TextField
            label="Explicación"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            required
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: "1rem" }}
            disabled={!isFormValid()}
          >
            Editar
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EditExercise;
