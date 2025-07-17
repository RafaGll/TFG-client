import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {
  CssBaseline,
  Paper,
  Box,
  Grid,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../context/AuthContext";

const defaultTheme = createTheme();

function Login() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const { loginWithGoogle } = useContext(AuthContext);

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

        {/* Imagen lateral sólo en escritorio */}
        {!isMobile && (
          <Grid
            component={Paper}
            elevation={24}
            item
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url("/login.jpg")',
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
            width: isMobile ? "100%" : "auto",
            height: isMobile ? "100%" : "auto",
          }}
        >
          <Box sx={{ position: "relative", height: "100%" }}>
            <IconButton
              sx={{ color: "black", fontSize: "large" }}
              href="/"
            >
              <ArrowBackIcon fontSize="large" />
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
                style={{
                  width: isMobile ? 100 : 150,
                  height: isMobile ? 100 : 150,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              />
              <Typography component="h1" variant="h5">
                Log in
              </Typography>

              <Box component="div" sx={{ mt: 3 }}>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    console.log(
                      "Google ID Token:",
                      credentialResponse.credential
                    );
                    loginWithGoogle(credentialResponse.credential);

                    navigate("/");
                  }}
                  onError={() =>
                    console.error("Error al autenticar con Google")
                  }
                />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Login;
