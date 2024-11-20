import React, { useState, useEffect, useContext } from "react";
import { Container, Typography, Grid, Box, ButtonGroup } from "@mui/material";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Exercises.css";

const Exercises = () => {
  const [categories, setCategories] = useState([]);
  const [startedCategories, setStartedCategories] = useState([]);
  const [exercises, setExercises] = useState([]);
  const { user } = useContext(AuthContext);
  const baseURL = process.env.REACT_APP_API_URL;
  const [selectedType, setSelectedType] = useState("Estructura de datos");
  const [isMobile, setIsMobile] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(`${baseURL}/categories`);
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [baseURL]);

  useEffect(() => {
    const fetchStartedCategories = async () => {
      try {
        const res = await api.get(`${baseURL}/users/progress`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setStartedCategories(res.data);
      } catch (error) {
        console.error("Error fetching started categories:", error);
      }
    };
    fetchStartedCategories();
  }, [baseURL]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleProgress = () => {
    setShowProgress(!showProgress);
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await api.get(`${baseURL}/exercises/total`);
        setExercises(res.data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };
    fetchExercises();
  }, [baseURL]);

  const handleCategoryFilter = (type) => {
    setSelectedType(type);
  };

  const handleCategoryClick = async (categoryId) => {
    try {
      const res = await api.get(`${baseURL}/exercises/next/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const nextExercise = res.data;

      if (nextExercise) {
        navigate(`/exercises/${nextExercise._id}`);
      } else {
        alert("No more exercises in this category.");
      }
    } catch (error) {
      console.error("Error fetching next exercise:", error);
    }
  };

  const handleChallengeClick = () => {
    navigate("/challenge");
  };

  return (
    <Box className="exercises-page">
      {isMobile && (
        <div className="bottom-buttons">
          <button className="button-left" onClick={toggleProgress}>
            {showProgress ? "Ver Lista" : "Ver Progreso"}
          </button>
          <button className="button-right" onClick={handleChallengeClick}>
            Challenge
          </button>
        </div>
      )}

      {/* Mostrar siempre la lista de ejercicios en escritorio y tablet, y alternar en móvil */}
      {(!isMobile || !showProgress) && (
        <Container
          className="exercises-container"
          sx={{ gridRow: "1", gridColumn: "span 3" }}
        >
          <Typography variant="h4" gutterBottom>
            Actividades
          </Typography>
          <Box className="category-filters">
            <button
              className={`filter-button ${
                selectedType === "Estructura de datos" ? "selected" : ""
              }`}
              onClick={() => handleCategoryFilter("Estructura de datos")}
            >
              Estructuras de datos
            </button>
            <button
              className={`filter-button ${
                selectedType === "Algoritmo" ? "selected" : ""
              }`}
              onClick={() => handleCategoryFilter("Algoritmo")}
            >
              Algoritmos
            </button>
          </Box>
          <Grid className="category-grid">
            {categories.length > 0 ? (
              categories
                .filter((c) => c.type === selectedType)
                .map((category) => (
                  <button
                    className="select-category"
                    key={category._id}
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    <Typography className="button-text" variant="h6">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      {category.name}
                    </Typography>
                  </button>
                ))
            ) : (
              <Typography>No hay categorías</Typography>
            )}
          </Grid>
        </Container>
      )}

      {/* Mostrar siempre el progreso en escritorio y tablet, y alternar en móvil */}
      {(!isMobile || showProgress) && (
        <Container className="user-box">
          <button className="challenge-button" onClick={handleChallengeClick}>
            Challenge
          </button>
          <Typography variant="h5" gutterBottom>
            Mi Progreso
          </Typography>
          <ButtonGroup orientation="vertical" sx={{ display: "grid" }}>
            {startedCategories.length > 0 ? (
              startedCategories.map((cat) => {
                const completedExercises = cat.completed.length;
                const categoryExercises = exercises.find(
                  (e) => e.categoryId === cat.category
                );
                const totalExercises = categoryExercises
                  ? categoryExercises.count
                  : 0;
                const initialPercentage =
                  (completedExercises / totalExercises) * 100;
                const widthPercentage =
                  initialPercentage > 10 ? initialPercentage : 10;

                return (
                  <Grid
                    sx={{ display: "grid", gridAutoColumns: "1" }}
                    key={cat._id}
                  >
                    <button
                      className="user-select-category"
                      onClick={() => handleCategoryClick(cat.category)}
                      style={{ "--completed-width": `${widthPercentage}%` }}
                    >
                      <Typography className="button-text" variant="body1">
                        {categories.find((c) => c._id === cat.category)?.name ||
                          "Categoría no encontrada"}
                      </Typography>
                    </button>
                  </Grid>
                );
              })
            ) : (
              <Typography>No has empezado a trabajar</Typography>
            )}
          </ButtonGroup>
        </Container>
      )}
    </Box>
  );
};

export default Exercises;
