import { Navigate, useParams } from "react-router-dom";

export function UserRoute({ children }: { children: React.ReactNode }) {
    const role = localStorage.getItem("userRole");
    const idLojaLocal = localStorage.getItem("idLoja");
    const { idLoja } = useParams<{ idLoja: string }>();

    if (role !== "user") {
        return <Navigate to="/unauthorized" replace />;
    }

    // Impede acesso à rota de outra loja
    if (idLoja && idLoja !== idLojaLocal) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}