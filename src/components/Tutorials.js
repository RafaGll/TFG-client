import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import { Typography, Box } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "../styles/Tutorials.css";
import { useNavigate } from "react-router-dom";

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
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

    fetchTutorials();
  }, []);

  const handleSelectTutorial = (tutorial) => {
    setSelectedTutorial(tutorial);
  };

  const handleMoveTutorial = async (tutorial, direction) => {
    const index = tutorials.findIndex((t) => t._id === tutorial._id);
    if (
      index < 0 ||
      (direction === "up" && index === 0) ||
      (direction === "down" && index === tutorials.length - 1)
    ) {
      return;
    }

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const swapTutorial = tutorials[swapIndex];

    const updatedTutorials = [...tutorials];
    updatedTutorials[index] = swapTutorial;
    updatedTutorials[swapIndex] = tutorial;

    const orderUpdates = updatedTutorials.map((t, i) => ({ ...t, order: i }));

    try {
      await Promise.all(
        orderUpdates.map((t) =>
          api.patch(`${baseURL}/tutorials/${t._id}`, {
            order: t.order,
          })
        )
      );
      setTutorials(orderUpdates);
    } catch (err) {
      console.error("Error updating tutorial order", err);
    }
  };

  return (
    <Box className="container-tutorial">
      {/* Columna izquierda */}
      <Box className="left-column">
        {tutorials.map((tutorial) => (
          <Box key={tutorial._id} className="tutorial-item">
            {user &&
              user.role === "admin" &&
              selectedTutorial &&
              selectedTutorial._id === tutorial._id && (
                <Box className="arrow-buttons">
                  <button
                    className="arrow-button"
                    onClick={() => handleMoveTutorial(tutorial, "up")}
                  >
                    <ArrowUpward />
                  </button>
                  <button
                    className="arrow-button"
                    onClick={() => handleMoveTutorial(tutorial, "down")}
                  >
                    <ArrowDownward />
                  </button>
                </Box>
              )}
            <div
              className={`tutorial-button ${
                selectedTutorial && selectedTutorial._id === tutorial._id
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