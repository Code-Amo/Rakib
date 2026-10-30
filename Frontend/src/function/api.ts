const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const defaultOptions = {
        ...options,
        credentials: "include" as RequestCredentials,
    };

    let response = await fetch(`${API_URL}${endpoint}`, defaultOptions);

    if (response.status === 401) {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
        });

        if (refreshRes.ok) {
            response = await fetch(`${API_URL}${endpoint}`, defaultOptions);
        } else {
            window.location.href = "/login";
        }
    }

    return response;
}

export async function checkAuth(): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/auth/redirect`, { credentials: "include" });
        if (res.ok) return true;

        if (res.status === 401) {
            const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
                method: "POST",
                credentials: "include",
            });
            if (refreshRes.ok) {
                const retry = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
                return retry.ok;
            }
        }
        return false;
    } catch {
        return false;
    }
}
