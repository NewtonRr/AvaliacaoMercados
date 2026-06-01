import { AppShell } from "../components/layout/AppShell";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { decodeJwtPayload, saveAuthToken } from "../auth/jwt";

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const apiBaseUrl = import.meta.env.VITE_API_URL;

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fromPath =
        (location.state as { from?: { pathname?: string } })?.from?.pathname;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        setError(null);

        if (!email.trim() || !email.includes("@")) {
            setError("Informe um email válido.");
            return;
        }

        if (senha.length < 1) {
            setError("Informe sua senha.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${apiBaseUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    senha,
                }),
            });

            let data: {
                error?: string;
                token?: string;
                usuario?: {
                    role?: "user" | "admin";
                    idLoja?: string;
                    id?: number;
                    email?: string;
                };
            } | null = null;

            try {
                data = (await response.json()) as { error?: string; token?: string; usuario?: { role?: "user" | "admin" } };
                console.log("Resposta do login:", data);
            } catch {
                data = null;
            }

            if (!response.ok) {
                setError(data?.error ?? "Nao foi possivel fazer login.");
                return;
            }

            if (data?.token) {
                saveAuthToken(data.token, true);
                localStorage.setItem("authToken", data.token);
            } else {
                setError("Token nao retornado no login.");
                return;
            }

            if (data?.usuario?.role) {
                localStorage.setItem("userRole", data.usuario.role);
            } else if (data?.token) {
                const payload = decodeJwtPayload(data.token);
                if (payload?.role === "user" || payload?.role === "admin") {
                    localStorage.setItem("userRole", payload.role);
                }
            }

            const payload = decodeJwtPayload(data.token);

            const effectiveRole =
                data?.usuario?.role ?? (payload?.role === "admin" ? "admin" : "user");
                console.log("Role efetiva:", effectiveRole);

            const idLoja = data?.usuario?.idLoja ?? payload?.IdLoja;

            if (effectiveRole === "admin") {
                navigate(fromPath ?? "/cadastro", { replace: true });
            } else {
                if (!idLoja) {
                    setError("Loja não encontrada para este usuário.");
                    return;
                }
                localStorage.setItem("idLoja", idLoja);

                navigate(fromPath ?? `/${idLoja}/manager`, { replace: true });
            }
        } catch {
            setError("Erro de conexao com o servidor.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppShell>
            <div className="login-wrapper">
                <h2>Entrar</h2>
                <form className="login-form" onSubmit={handleSubmit}> 
                    <label className="login-label">
                        Email
                        <input
                            className="login-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </label>

                    <label className="login-label">
                        Senha
                        <input
                            className="login-input"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </label>

                    <button className="login-button" type="submit" disabled={isSubmitting}>
                        Entrar
                    </button>

                    {error && <div className="login-error">{error}</div>}
                </form>   
            </div>
        </AppShell>
    );
}