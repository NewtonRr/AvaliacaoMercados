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
    const user = getCurrentUser();

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    const idLoja = localStorage.getItem("idLoja");

    const direcionamento = {
        user: idLoja ? `/${idLoja}/manager` : "/login",
        admin: "/cadastro"
    }

    if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
        const redirectPath = direcionamento[user.role] ?? "/login";
        return <Navigate to={redirectPath} replace />;
}
 
    return <>{children}</>;
}