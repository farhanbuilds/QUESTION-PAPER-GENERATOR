import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import LoadingPage from "./pages/LoadingPage";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingPage />
    }
    return user ? children : <Navigate to="/login" />;

};

export default PrivateRoute;