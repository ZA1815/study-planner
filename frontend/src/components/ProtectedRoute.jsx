import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const {token} = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/login" replace />
    }

    return (
        <Outlet />
    );
}

export default ProtectedRoute;