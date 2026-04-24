import type { ReviewResponse, ReviewTabConfig } from "../models/review";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
});

// Tabs
export async function fetchTabs(idLoja: string) {
    const res = await fetch(`${apiBaseUrl}/${idLoja}/tabs`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

export async function upsertTabApi(idLoja: string, tab: ReviewTabConfig) {
    const res = await fetch(`${apiBaseUrl}/${idLoja}/tabs`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(tab),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

export async function removeTabApi(idLoja: string, id: string) {
    const res = await fetch(`${apiBaseUrl}/${idLoja}/tabs/${id}`, {
        method: "DELETE",
        headers: authHeader(),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
}

// Responses
export async function fetchResponses(idLoja: string) {
    const res = await fetch(`${apiBaseUrl}/${idLoja}/responses`, {
        headers: authHeader(),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

export async function addResponseApi(idLoja: string, response: ReviewResponse) {
    console.log("enviando response:", { idLoja, response });
    const res = await fetch(`${apiBaseUrl}/${idLoja}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
    });
    if (!res.ok) {
        const erro = await res.json();
        console.error("erro do servidor:", erro);
        throw new Error(`API error: ${res.status}`);
        }
    return res.json();
}