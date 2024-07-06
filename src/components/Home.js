import React from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" style={{ height: "calc(100vh - 65px" }}>
      <Paper elevation={3} style={{ marginTop: "75px", padding:"10px 15px" }}>
        <Typography variant="h3" gutterBottom>
          Bienvenido
        </Typography>
        <Typography variant="h6" paragraph>
          Aprende estructuras de datos y algoritmos con tutoriales interactivos
          y ejercicios prácticos.
        </Typography>
        <Grid container spacing={2} style={{ marginTop: "1rem" }}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/tutorials")}
            >
              Ver Tutoriales
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/exercises")}
            >
              Ver Ejercicios
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Home;
