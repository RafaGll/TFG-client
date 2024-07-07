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
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../context/AuthContext";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useNavigate } from "react-router-dom";
import "../styles/Tutorials.css";

// Componente principal
const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [expandedTypes, setExpandedTypes] = useState({});
  const [isDark, setIsDark] = useState(true); // Estado para cambiar entre temas claro y oscuro
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL;

  // Hook para cargar los tutoriales y categorías al inicial el componente
  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await api.get(`${baseURL}/tutorials`);
        setTutorials(response.data);
      } catch (error) {
        console.error("Error fetching tutorials:", error);
      }
    };

    // Función para obtener las categorías
    const fetchCategories = async () => {
      try {
        const response = await api.get(`${baseURL}/categories`);
        setCategories(response.data);
        const types = response.data.reduce((acc, category) => {
          if (!acc[category.type]) {
            acc[category.type] = true;
          }
          return acc;
        }, {});
        // Inicializa los tipos de categorías expandidos
        setExpandedTypes(types);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchTutorials();
    fetchCategories();
  }, [baseURL]);

  // Función para seleccionar una categoría
  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedTutorial(null);
  };

  // Función para seleccionar un tutorial
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

  // Función para eliminar un tutorial
  const handleDeleteTutorial = async () => {
    if (selectedTutorial) {
      const confirmDelete = window.confirm(
        "¿Estás seguro de que quieres eliminar este tutorial?"
      );
      if (confirmDelete) {
        try {
          await api.delete(`${baseURL}/tutorials/${selectedTutorial._id}`);
          setTutorials(tutorials.filter((t) => t._id !== selectedTutorial._id));
          setSelectedTutorial(null);
        } catch (error) {
          console.error("Error deleting tutorial", error);
        }
      }
    }
  };

 // Función para mover un tutorial de posición y cambiar su orden
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

      // Actualiza el orden de los tutoriales
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
        <>
          <Fab
            color="error"
            size="small"
            aria-label="delete"
            style={{ position: "absolute", right: "5px", top: "70px" }}
            onClick={handleDeleteTutorial}
          >
            <DeleteIcon />
          </Fab>
          <Fab
            color="secondary"
            size="small"
            aria-label="edit"
            style={{ position: "absolute", right: "50px", top: "70px" }}
            onClick={handleEditTutorial}
          >
            <EditIcon />
          </Fab>
        </>
      )}
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
                      .sort((a, b) => a.order - b.order)
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

      <Box className="right-column">
        {selectedTutorial ? (
          <Box className="tutorial-content">
            <Typography variant="h4" gutterBottom>
              {selectedTutorial.title}
            </Typography>
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={isDark ? materialDark : materialLight}
                      language={match[1]}
                      PreTag="div"
                      className="syntax-highlighter"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
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