import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <Button color="inherit" component={Link} to="/">
              Plataforma de Aprendizaje
            </Button>
          </Typography>
          <Button color="inherit" component={Link} to="/tutorials">
            Tutoriales
          </Button>
          <Button color="inherit" component={Link} to="/exercises">
            Ejercicios
          </Button>
          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Iniciar Sesión
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Registrarse
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
