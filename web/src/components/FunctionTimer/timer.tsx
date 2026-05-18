const apiBaseUrl = import.meta.env.VITE_API_URL;

export async function fetchTimer(idLoja: string): Promise<number | null> {
  const res = await fetch(`${apiBaseUrl}/${idLoja}/timer`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth.jwt")}`,
    },
  });

  if (!res.ok) throw new Error("Erro ao buscar timer");

  const data = await res.json();
  return data.timer; // number or null
}

export async function updateTimer(idLoja: string, timer: number): Promise<void> {
  if (timer < 2) {
    throw new Error("Timer deve ser no mínimo 2 segundos");
  }
  const res = await fetch(`${apiBaseUrl}/${idLoja}/timer`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("auth.jwt")}`,
    },
    body: JSON.stringify({ timer }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: "Sem resposta JSON" }));
    console.error("Status:", res.status, "Body:", errorBody); // <-- check this in DevTools
    throw new Error(errorBody.message ?? "Erro ao atualizar timer");
  }
}