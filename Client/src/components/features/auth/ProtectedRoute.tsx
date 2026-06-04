import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!isLoggedIn) {
        return <Navigate to="/auth/login" replace />;
    }

    return children;
}
