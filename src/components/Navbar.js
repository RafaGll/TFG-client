import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/styles.css"; // Importar los estilos personalizados

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "#333", margin: 0 }}>
      <Toolbar style={{ padding: "0 1rem", minHeight: "64px" }}>
        <Box display="flex" flexGrow={1} alignItems="center">
          <Typography variant="h6">
            <Link to="/" className="navbar-link">
              <img src="/icon.png" alt="icon" className="navbar-icon" />
              TFG
            </Link>
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/tutorials"
            className="navbar-button"
          >
            Tutoriales
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/exercises"
            className="navbar-button"
          >
            Ejercicios
          </Button>
        </Box>
        <Box display="flex" alignItems="center">
          {user ? (
            <Button
              color="inherit"
              onClick={handleLogout}
              className="navbar-button"
            >
              Cerrar Sesión
            </Button>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                className="navbar-button"
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
                className="navbar-button"
              >
                Registro
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
