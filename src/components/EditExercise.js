import React, { useState, useEffect } from "react";
import { Container, TextField, Button, MenuItem, Paper, Box, Typography, Grid, IconButton } from "@mui/material";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

const EditExercise = () => {
  const { id } = useParams(); // Obtener el ID del ejercicio de los parámetros de la URL
  const [problem, setProblem] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [level, setLevel] = useState("");
  const [images, setImages] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [incorrectAnswers, setIncorrectAnswers] = useState(["", "", "", "", ""]);
  const [explanation, setExplanation] = useState("");
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await api.get(`${baseURL}/exercises/${id}`);
        const exercise = response.data;
        setProblem(exercise.problem);
        setCategory(exercise.category._id); // Cambiar a category._id para mantener consistencia
        setLevel(exercise.level === 1 ? "Fácil" : "Difícil"); // Convertir el nivel numérico a texto
        setImages(exercise.images);
        setCorrectAnswer(exercise.answers.correct);
        setIncorrectAnswers([...exercise.answers.incorrect, "", "", "", "", ""].slice(0, 5));
        setExplanation(exercise.explanation);
      } catch (error) {
        console.error("Error fetching exercise:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get(`${baseURL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchExercise();
    fetchCategories();
  }, [id, baseURL]);

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
        incorrectAnswers: incorrectAnswers.filter(ans => ans),
        explanation,
      });
      navigate("/exercises");
    } catch (error) {
      console.error("Error editing exercise:", error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && images.length < 4) { // Limitar a 4 imágenes
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([...images, reader.result]);
      };
      reader.readAsDataURL(file);
    } else {
      alert("No puedes añadir más de 4 imágenes.");
    }
  };

  const handleImageRemove = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const isFormValid = () => {
    return problem && level && category && correctAnswer && explanation && incorrectAnswers.some(ans => ans);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
      <Paper elevation={3} style={{ padding: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          Editar Ejercicio
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Problema *"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            required
          />
          <TextField
            select
            label="Categoría *"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Dificultad *"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="Fácil">Fácil</MenuItem>
            <MenuItem value="Difícil">Difícil</MenuItem>
          </TextField>
          <Box display="flex" flexDirection="column" marginBottom="1rem">
            <Typography variant="h6">Imágenes</Typography>
            <Grid container spacing={2}>
              {images.map((img, index) => (
                <Grid item xs={3} key={index} position="relative">
                  <img src={img} alt={`uploaded-${index}`} style={{ width: "100%" }} />
                  <IconButton 
                    onClick={() => handleImageRemove(index)}
                    style={{ position: "absolute", top: 0, right: 0, backgroundColor: 'white' }}
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
            label="Respuesta Correcta *"
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
            />
          ))}
          <TextField
            label="Explicación *"
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