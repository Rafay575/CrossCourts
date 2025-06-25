import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";

const API_BASE_URL = "https://crosscourtspk.com/api";

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        axios
            .get(`${API_BASE_URL}/protected`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => setIsAuthenticated(true))
            .catch(() => {
                localStorage.removeItem("token");
                setIsAuthenticated(false);
            });
    }, [token]);

    if (isAuthenticated === null) return <><Loader/></>;
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/signin" replace />;
};

export default ProtectedRoute;
