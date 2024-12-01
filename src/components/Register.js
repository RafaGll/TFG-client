import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const defaultTheme = createTheme();

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState(""); // Estado para el error del nombre de usuario
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [formValid, setFormValid] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  // Validar que las contraseñas coincidan
  useEffect(() => {
    setPasswordMatch(password === confirmPassword);
    setFormValid(
      username !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword &&
      usernameError === ""
    );
  }, [username, password, confirmPassword, usernameError]);

  // Verificar si el nombre de usuario está disponible
  const handleCheckUsername = async () => {
    if (!username) {
      setUsernameError("El nombre de usuario no puede estar vacío.");
      return;
    }
    try {
      await axios.post("/api/users/check-username", { username });
      setUsernameError(""); // Si está disponible, limpiar errores
    } catch (err) {
      setUsernameError(
        err.response?.data?.message || "Error al verificar el nombre de usuario."
      );
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formValid) {
      try {
        await register(username, password);
        navigate("/");
      } catch (err) {
        console.error("Error en el registro:", err);
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{
          height: "100vh",
          padding: isMobile ? "20px" : "80px 150px",
          backgroundColor: "#FFFAE5",
        }}
      >
        <CssBaseline />
        {!isMobile && (
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url("/login.jpg")',
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={24}
          square
          sx={{
            order: isMobile ? 0 : -1,
            width: isMobile ? "100%" : "auto",
            height: isMobile ? "100%" : "auto",
          }}
        >
          <Box sx={{ position: "relative", height: "100%" }}>
            <IconButton sx={{ color: "black", fontSize: "large" }} onClick={() => navigate(-1)}>
              <ArrowBackIcon style={{ fontSize: "large" }} />
            </IconButton>
            <Box
              sx={{
                my: isMobile ? 4 : 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src="/icon2.png"
                alt="App Logo"
                style={{ width: isMobile ? 100 : 150, height: isMobile ? 100 : 150, cursor: "pointer" }}
                onClick={() => navigate("/")}
              />
              <Typography component="h1" variant="h5">
                Registro
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  fullWidth
                  id="username"
                  label="Nombre de usuario"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={handleCheckUsername} // Verificar al perder el foco
                  error={!!usernameError}
                  helperText={usernameError}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!passwordMatch}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="confirmPassword"
                  label="Confirmar contraseña"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!passwordMatch}
                  helperText={!passwordMatch && "Las contraseñas no coinciden."}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={!formValid}
                >
                  Aceptar
                </Button>
                <Grid container justifyContent="center">
                  <Grid item>
                    <Link href="/login" variant="body2">
                      {"¿Ya tienes una cuenta? Inicia sesión"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Register;