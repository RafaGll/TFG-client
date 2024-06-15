import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Paper } from "@mui/material";
import axios from "axios";

const TutorialDetails = () => {
  const { id } = useParams();
  const [tutorial, setTutorial] = useState(null);

  useEffect(() => {
    const fetchTutorial = async () => {
      const res = await axios.get(`http://localhost:3000/tutorials/${id}`);
      setTutorial(res.data);
    };
    fetchTutorial();
  }, [id]);

  if (!tutorial) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Paper elevation={3} style={{ padding: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          {tutorial.title}
        </Typography>
        <Typography variant="h6" paragraph>
          Nivel: {tutorial.level}
        </Typography>
        <Typography variant="body1" paragraph>
          {tutorial.content}
        </Typography>
      </Paper>
    </Container>
  );
};

export default TutorialDetails;
