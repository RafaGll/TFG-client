import React, { useState, useContext } from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const defaultTheme = createTheme();

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
    navigate("/");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{
          height: "100vh",
          padding: "80px 150px",
          backgroundColor: "#FFFAE5",
        }}
      >
        <CssBaseline />
        <Grid
          component={Paper}
          elevation={24}
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
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={24}
          square
        >
          <Box sx={{ position: "relative", height: "100%" }}>
            <IconButton
              sx={{ color: "black", fontSize: "large" }}
            href="/"
            >
              <ArrowBackIcon style={{ fontSize: "large" }} />
            </IconButton>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src="/icon2.png"
                alt="App Logo"
                style={{ width: 150, height: 150 }}
                onClick={() => navigate("/")}
              />
              <Typography component="h1" variant="h5">
                Log in
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
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Aceptar
                </Button>
                <Grid container justifyContent="center">
                  <Grid item>
                    <Link href="/register" variant="body2">
                      {"¿No tienes cuenta? Registrate"}
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

export default Login;
