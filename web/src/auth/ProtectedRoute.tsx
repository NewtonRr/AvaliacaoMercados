import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from './jwt';

type Role = "user" | "admin";

type ProtectedRouteProps = {
    children: ReactNode;
    allowedRoles?: Array<Role>;
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const location = useLocation();
    const user = getCurrentUser(); // { role: "admin" | "user", ... }

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role as Role)) {
        // Usuário autenticado mas sem permissão — redireciona pelo role dele
        if (user.role === "user") {
            return <Navigate to="/manager" replace />;
        }
        if (user.role === "admin") {
            return <Navigate to="/cadastro" replace />;
        }
    }

    return <>{children}</>;
}