import React, { useState, useEffect, useContext } from "react";
import { Container, Typography, Grid, Paper, Button } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutorials = async () => {
      const res = await axios.get("http://localhost:3000/tutorials");
      setTutorials(res.data);
    };
    fetchTutorials();
  }, []);

  return (
    <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Tutoriales
      </Typography>
      {user && user.role === "admin" && (
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: "1rem" }}
          onClick={() => navigate("/add-tutorial")}
        >
          Añadir Tutorial
        </Button>
      )}
      <Grid container spacing={3}>
        {tutorials.map((tutorial) => (
          <Grid item xs={12} sm={6} md={4} key={tutorial._id}>
            <Paper elevation={3} style={{ padding: "1rem" }}>
              <Typography variant="h6">{tutorial.title}</Typography>
              <Typography variant="body2">{tutorial.level}</Typography>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "1rem" }}
                onClick={() => navigate(`/tutorials/${tutorial._id}`)}
              >
                Ver más
              </Button>
              {user && user.role === "admin" && (
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginTop: "1rem", marginLeft: "1rem" }}
                  onClick={() => navigate(`/edit-tutorial/${tutorial._id}`)}
                >
                  Editar
                </Button>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Tutorials;
