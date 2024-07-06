import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import { Typography, Box, Fab } from "@mui/material";
import {
  ArrowDropUp,
  ArrowDropDown,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { AuthContext } from "../context/AuthContext";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "../styles/Tutorials.css";
import { useNavigate } from "react-router-dom";

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [expandedTypes, setExpandedTypes] = useState({});
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await api.get(`${baseURL}/tutorials`);
        setTutorials(response.data);
      } catch (error) {
        console.error("Error fetching tutorials:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get(`${baseURL}/categories`);
        setCategories(response.data);
        // Inicializar el estado expandido de los tipos de categorías
        const types = response.data.reduce((acc, category) => {
          if (!acc[category.type]) {
            acc[category.type] = true; // Puedes establecerlo en false si quieres que empiece contraído
          }
          return acc;
        }, {});
        setExpandedTypes(types);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchTutorials();
    fetchCategories();
  }, [baseURL]);

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedTutorial(null);
  };

  const handleSelectTutorial = (tutorial) => {
    setSelectedTutorial(tutorial);
  };

  const handleToggleType = (type) => {
    setExpandedTypes((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };

  const handleEditTutorial = () => {
    if (selectedTutorial) {
      navigate(`/edit-tutorial/${selectedTutorial._id}`);
    }
  };

  const handleMoveTutorial = async (tutorial, direction) => {
    const currentOrder = tutorial.order;
    const currentCategory = tutorial.category;
    const tutorialsInCategory = tutorials.filter(
      (t) => t.category === currentCategory
    );

    let swapTutorial;
    if (direction === "up") {
      swapTutorial = tutorialsInCategory.find(
        (t) => t.order === currentOrder - 1
      );
    } else {
      swapTutorial = tutorialsInCategory.find(
        (t) => t.order === currentOrder + 1
      );
    }

    if (!swapTutorial) return;

    try {
      await api.patch(`${baseURL}/tutorials/${tutorial._id}`, {
        order: swapTutorial.order,
      });
      await api.patch(`${baseURL}/tutorials/${swapTutorial._id}`, {
        order: currentOrder,
      });

      const updatedTutorials = tutorials.map((t) => {
        if (t._id === tutorial._id) {
          return { ...t, order: swapTutorial.order };
        } else if (t._id === swapTutorial._id) {
          return { ...t, order: currentOrder };
        } else {
          return t;
        }
      });

      setTutorials(updatedTutorials.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error("Error updating tutorial order", err);
    }
  };

  return (
    <Box className="container-tutorial">
      {user && user.role === "admin" && selectedTutorial && (
        <Fab
          color="secondary"
          size="small"
          aria-label="edit"
          style={{ position: "absolute", right: "5px", top: "70px" }}
          onClick={handleEditTutorial}
        >
          <EditIcon />
        </Fab>
      )}
      {/* Columna izquierda */}
      <Box className="left-column">
        {Object.entries(
          categories.reduce((acc, category) => {
            if (!acc[category.type]) {
              acc[category.type] = [];
            }
            acc[category.type].push(category);
            return acc;
          }, {})
        ).map(([type, categoriesOfType]) => (
          <Box key={type}>
            <Box
              className="category-type"
              onClick={() => handleToggleType(type)}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "7px",
              }}
            >
              <Typography variant="h6">
                {type === "Algoritmo" ? "Algoritmos" : "Estructuras de datos"}
              </Typography>
              {expandedTypes[type] ? <ArrowDropUp /> : <ArrowDropDown />}
            </Box>
            {expandedTypes[type] &&
              categoriesOfType.map((category) => (
                <Box key={category._id} className="category-item">
                  <div
                    className={`tutorial-button category-tutorial-button ${
                      selectedCategory === category._id ? "active" : ""
                    }`}
                    onClick={() => handleSelectCategory(category._id)}
                  >
                    {category.name}
                  </div>
                  {selectedCategory === category._id &&
                    tutorials
                      .filter((tutorial) => tutorial.category === category._id)
                      .sort((a, b) => a.order - b.order) // Ordenar tutoriales por el campo de orden
                      .map((tutorial) => (
                        <Box key={tutorial._id} className="tutorial-item">
                          {user &&
                            user.role === "admin" &&
                            selectedTutorial &&
                            selectedTutorial._id === tutorial._id && (
                              <Box className="arrow-buttons">
                                <button
                                  className="arrow-button"
                                  onClick={() =>
                                    handleMoveTutorial(tutorial, "up")
                                  }
                                >
                                  <ArrowUpward />
                                </button>
                                <button
                                  className="arrow-button"
                                  onClick={() =>
                                    handleMoveTutorial(tutorial, "down")
                                  }
                                >
                                  <ArrowDownward />
                                </button>
                              </Box>
                            )}
                          <div
                            className={`tutorial-button ${
                              selectedTutorial &&
                              selectedTutorial._id === tutorial._id
                                ? "active"
                                : ""
                            }`}
                            onClick={() => handleSelectTutorial(tutorial)}
                          >
                            {tutorial.title}
                          </div>
                        </Box>
                      ))}
                </Box>
              ))}
          </Box>
        ))}
      </Box>

      {/* Columna derecha */}
      <Box className="right-column">
        {selectedTutorial ? (
          <Box className="tutorial-content">
            <Typography variant="h4" gutterBottom>
              {selectedTutorial.title}
            </Typography>
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
            >
              {selectedTutorial.content}
            </ReactMarkdown>
          </Box>
        ) : (
          <Typography variant="h5" style={{ color: "#888888" }}>
            Select a tutorial to view its content
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Tutorials;
