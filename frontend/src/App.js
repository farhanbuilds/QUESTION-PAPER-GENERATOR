import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import "./App.css";
import UploadForm from "./components/UploadForm.tsx";
import ViewData from "./components/ViewData.jsx";
import Home from "./Home.tsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ViewAllPdf from "./pages/ViewAllPdfs.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/viewallpdfs" element={<PrivateRoute><ViewAllPdf /></PrivateRoute>} />
            <Route path="/upload" element={<PrivateRoute><UploadForm /></PrivateRoute>} />
            <Route path="/view/:dataId" element={<PrivateRoute><ViewData /></PrivateRoute>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
