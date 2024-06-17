import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Button, Typography, Box, IconButton } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import '../styles/Tutorials.css'; // Importar el archivo CSS

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await axios.get('http://localhost:3000/tutorials');
        setTutorials(response.data);
      } catch (error) {
        console.error('Error fetching tutorials:', error);
      }
    };

    fetchTutorials();
  }, []);

  const handleSelectTutorial = (tutorial) => {
    setSelectedTutorial(tutorial);
  };

  const handleMoveTutorial = async (tutorial, direction) => {
    const index = tutorials.findIndex(t => t._id === tutorial._id);
    if (index < 0 || (direction === 'up' && index === 0) || (direction === 'down' && index === tutorials.length - 1)) {
      return;
    }

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const swapTutorial = tutorials[swapIndex];

    const updatedTutorials = [...tutorials];
    updatedTutorials[index] = swapTutorial;
    updatedTutorials[swapIndex] = tutorial;

    const orderUpdates = updatedTutorials.map((t, i) => ({ ...t, order: i }));

    try {
      await Promise.all(orderUpdates.map(t => axios.patch(`http://localhost:3000/tutorials/${t._id}`, { order: t.order })));
      setTutorials(orderUpdates);
    } catch (err) {
      console.error('Error updating tutorial order', err);
    }
  };

  return (
    <Box className="container">
      {/* Columna izquierda */}
      <Box className="left-column">
        <Typography variant="h4" gutterBottom>
          Tutorials
        </Typography>
        {tutorials.map(tutorial => (
          <Box key={tutorial._id} position="relative" width="100%">
            {user && user.role === 'admin' && selectedTutorial && selectedTutorial._id === tutorial._id && (
              <Box className="arrow-buttons">
                <IconButton 
                  size="small" 
                  className="arrow-button" 
                  onClick={() => handleMoveTutorial(tutorial, 'up')}
                >
                  <ArrowUpward />
                </IconButton>
                <IconButton 
                  size="small" 
                  className="arrow-button" 
                  onClick={() => handleMoveTutorial(tutorial, 'down')}
                >
                  <ArrowDownward />
                </IconButton>
              </Box>
            )}
            <Button
              variant="contained"
              className={`tutorial-button ${selectedTutorial && selectedTutorial._id === tutorial._id ? 'active' : ''}`}
              onClick={() => handleSelectTutorial(tutorial)}
            >
              {tutorial.title}
            </Button>
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
            <Typography variant="body1">
              {selectedTutorial.content}
            </Typography>
          </Box>
        ) : (
          <Typography variant="h5" className="no-tutorial-selected">
            Select a tutorial to view its content
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Tutorials;