import React, { useContext, useState, useEffect } from "react";
import "../styles/navbar.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Divider } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";

// Componente de la barra de navegación
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);

  const { loginWithGoogle } = useContext(AuthContext);
  const googleLogin = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      if (credentialResponse.credential) {
        loginWithGoogle(credentialResponse.credential);
      }
    },
    onError: () => console.error("Error al autenticar con Google"),
  });

  const handleOpenNavMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorEl(null);
  };

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
      <Container maxWidth="xl">
        <Toolbar disableGutters className="navbar-toolbar">
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorEl)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuItem
                component={Link}
                to="/tutorials"
                onClick={handleCloseNavMenu}
              >
                Tutoriales
              </MenuItem>
              <MenuItem
                component={Link}
                to="/exercises"
                onClick={handleCloseNavMenu}
              >
                Ejercicios
              </MenuItem>
              {user &&
                user.role === "admin" && [
                  <MenuItem
                    key="add-exercise"
                    component={Link}
                    to="/add-exercise"
                    onClick={handleCloseNavMenu}
                  >
                    Añadir ejercicio
                  </MenuItem>,
                  <MenuItem
                    key="add-tutorial"
                    component={Link}
                    to="/add-tutorial"
                    onClick={handleCloseNavMenu}
                  >
                    Añadir tutorial
                  </MenuItem>,
                  <MenuItem
                    key="categories"
                    component={Link}
                    to="/categories"
                    onClick={handleCloseNavMenu}
                  >
                    Categorías
                  </MenuItem>,
                ]}
              <Divider
                flexItem
                sx={{ borderColor: "black", borderStyle: "dotted", mx: 2 }}
              />
              {user ? (
                <MenuItem
                  onClick={() => {
                    handleLogout();
                    handleCloseNavMenu();
                  }}
                >
                  Cerrar Sesión
                </MenuItem>
              ) : (
                <>
                  <MenuItem
                    component={Link}
                    to="/login"
                    onClick={handleCloseNavMenu}
                  >
                    Login
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/register"
                    onClick={handleCloseNavMenu}
                  >
                    Registro
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
          <Link to="/" className="navbar-link navbar-logo">
            <img src="/icon2.png" alt="icon" className="navbar-icon" />
            <Typography variant="h6" noWrap component="a">
              TFG
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              color="inherit"
              component={Link}
              to="/tutorials"
              className="navbar-button"
              sx={{ fontWeight: "bold" }}
            >
              Tutoriales
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/exercises"
              className="navbar-button"
              sx={{ fontWeight: "bold" }}
            >
              Ejercicios
            </Button>
            <Box sx={{ marginLeft: "auto", display: "flex" }}>
              {user && user.role === "admin" && (
                <>
                  <Button
                    className="navbar-button"
                    component={Link}
                    to="/add-exercise"
                    color="inherit"
                  >
                    Añadir ejercicio
                  </Button>
                  <Button
                    className="navbar-button"
                    component={Link}
                    to="/add-tutorial"
                    color="inherit"
                  >
                    Añadir tutorial
                  </Button>
                  <Button
                    className="navbar-button"
                    component={Link}
                    to="/categories"
                    color="inherit"
                  >
                    Categorías
                  </Button>
                </>
              )}
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  borderColor: "black",
                  borderStyle: "dotted",
                  mx: 2,
                  marginRight: "2px",
                  marginLeft: "2px",
                }}
              />
              {user ? (
                <Button
                  className="navbar-button"
                  onClick={handleLogout}
                  color="inherit"
                >
                  Cerrar Sesión
                </Button>
              ) : (
                <button
                  // className="navbar-button"
                  onClick={() => googleLogin()}
                >
                  Iniciar Sesión con Google
                </button>
                // <>
                //   <Button
                //     className="navbar-button"
                //     component={Link}
                //     to="/login"
                //     color="inherit"
                //   >
                //     Login
                //   </Button>
                //   <Button
                //     className="navbar-button"
                //     component={Link}
                //     to="/register"
                //     color="inherit"
                //   >
                //     Registro
                //   </Button>
                // </>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>

  );
};

export default Navbar;
