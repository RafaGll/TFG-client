import React, { useContext, useState, useEffect } from "react";
import "../styles/navbar.css";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(true);
    };

    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const shouldHideNavbar = location.pathname.startsWith("/exercises/");

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <AppBar position="fixed" className={`navbar-appbar`}>
      <Toolbar className="navbar-toolbar">
        <Box display="flex" flexGrow={1} alignItems="center">
          <Typography variant="h6">
            <Link to="/" className="navbar-link">
              <img src="/icon2.png" alt="icon" className="navbar-icon" />
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
            <>
              {user.role === "admin" && (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/add-exercise"
                    className="navbar-button"
                  >
                    Añadir ejercicio
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/add-tutorial"
                    className="navbar-button"
                  >
                    Añadir tutorial
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/categories"
                    className="navbar-button"
                  >
                    Categorías
                  </Button>
                </>
              )}
              <Button
                color="inherit"
                onClick={handleLogout}
                className="navbar-button"
              >
                Cerrar Sesión
              </Button>
            </>
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
