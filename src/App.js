import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
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
import TutorialDetails from "./components/TutorialDetails";
import ExerciseDetails from "./components/ExerciseDetails";

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
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tutorials/:id" element={<TutorialDetails />} />
          <Route path="/exercises/:id" element={<ExerciseDetails />} />
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
            path="/categories"
            element={
              <AdminRoute>
                <Categories />
              </AdminRoute>
            }
            />
          <Route
            path="/exercises"
            element={
              <PrivateRoute>
                <Exercises />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
