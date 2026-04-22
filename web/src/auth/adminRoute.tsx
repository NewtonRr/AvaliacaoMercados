import { Navigate } from "react-router-dom";

export function AdminRoute({ children }: { children: React.ReactNode }) {
    const role = localStorage.getItem("userRole");

    if (role !== "admin") {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}