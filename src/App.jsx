import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import { Toaster } from "react-hot-toast";

const App = () => {
  const token = localStorage.getItem("token");
  console.log("App rendered")

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/users" /> : <LoginPage />}
        />
        <Route
          path="/users"
          element={token ? <UsersPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
