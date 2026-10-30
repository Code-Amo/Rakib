import { checkAuth } from "@/function/api";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        let cancelled = false;

        checkAuth().then(isAuth => {
            if (!cancelled) {
                setIsAuthenticated(isAuth);
            }
        });

        return () => {
            cancelled = true;
        };
    }, []);

    if (isAuthenticated === null) {
        return <div className="loading-screen">Chargement...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
