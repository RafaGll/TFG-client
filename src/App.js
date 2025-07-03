import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate, // Asegúrate de importar useNavigate
} from "react-router-dom";
import "./styles/index.css";
import { Box } from "@mui/material";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Home from "./components/Home";
import Tutorials from "./components/Tutorials";
import Exercises from "./components/Exercises";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import AddTutorial from "./components/AddTutorial";
import EditTutorial from "./components/EditTutorial";
import AddExercise from "./components/AddExercise";
import EditExercise from "./components/EditExercise";
import Categories from "./components/Categories";
import ExerciseDetails from "./components/ExerciseDetails";
import ExercisesOrder from "./components/ExercisesOrder";
import ChallengeMode from "./components/ChallengeMode";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user && user.role === "admin" ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route
            path="/exercises/:id"
            element={
              <PrivateRoute>
                <ExerciseDetails />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<MainApp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const MainApp = () => {
  return (
    <Box className="app">
      <Navbar />
      <Box>
        {" "}
        {/* Ajuste de margen superior */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route
            path="/exercises"
            element={
              <PrivateRoute>
                <Exercises />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-tutorial"
            element={
              <AdminRoute>
                <AddTutorial />
              </AdminRoute>
            }
          />
          <Route
            path="/edit-tutorial/:id"
            element={
              <AdminRoute>
                <EditTutorial />
              </AdminRoute>
            }
          />
          <Route
            path="/add-exercise"
            element={
              <AdminRoute>
                <AddExercise />
              </AdminRoute>
            }
          />
          <Route
            path="/edit-exercise/:id"
            element={
              <AdminRoute>
                <EditExercise />
              </AdminRoute>
            }
          />
          <Route
            path="/exercises-order"
            element={
              <AdminRoute>
                <ExercisesOrder />
              </AdminRoute>
            }
          />
          <Route
            path="/challenge"
            element={
              <PrivateRoute>
                <ChallengeMode />
              </PrivateRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <AdminRoute>
                <Categories />
              </AdminRoute>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
