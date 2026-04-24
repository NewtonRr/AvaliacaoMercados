import { AppShell } from "../components/layout/AppShell";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CadastroPage() {
    const navigate = useNavigate();
    const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

    const [idLoja, setIdLoja] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [role, setRole] = useState("");

    const fromPath = "/cadastro";

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

        if (senha.length < 6) {
            setError("A senha deve conter pelo menos 6 caracteres.");
            return;
        }

        if (!idLoja.trim()) {
            setError("Informe o ID da loja.");
            return;
        }

        if (!role.trim()) {
            setError("Informe o role do usuario.");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${apiBaseUrl}/usuarios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    senha,
                    idLoja: idLoja.trim(),
                    role: role.trim(),
                }),
            });

            let data: { error?: string } | null = null;
            try {
                data = (await response.json()) as { error?: string };
            } catch {
                data = null;
            }
            
            if (response.ok) {
                setSuccess("Cadastro realizado com sucesso.");
                return;
            }
            
            if (!response.ok) {
                setError(data?.error ?? "Nao foi possivel concluir o cadastro.");
                return;
            }

            navigate(fromPath, { replace: true });
        } catch {
            setError("Erro de conexao com o servidor.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppShell>
            <div className="login-wrapper">
                <h2>Cadastro</h2>
                <form className="login-form" onSubmit={handleSubmit}> 

                    <label className="login-label">
                        ID da Loja
                        <input
                            className="login-input"
                            type="text"
                            value={idLoja}
                            onChange={(e) => setIdLoja(e.target.value)}
                            required
                        />
                    </label>

                    <label className="login-label">
                        Role do usuario
                        <input
                            className="login-input"
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            placeholder="user/admin"
                        />
                    </label>
                    
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
                        criar conta
                    </button>

                    {error && <div className="login-error">{error}</div>}
                    {success && <div className="login-success">{success}</div>}
                </form>
            </div>
        </AppShell>
    );
}