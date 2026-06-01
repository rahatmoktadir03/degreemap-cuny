import { supabase } from "./supabase";
const API_BASE = import.meta.env.VITE_API_URL || "";
const hasApi = !!API_BASE;
async function getAuthHeaders() {
    try {
        if (!supabase)
            return {};
        const s = await supabase.auth.getSession();
        const token = s?.data?.session?.access_token;
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
    catch {
        return {};
    }
}
export async function apiFetch(path, opts = {}) {
    if (!hasApi)
        throw new Error("API not configured");
    const headers = { "Content-Type": "application/json", ...(opts.headers ?? {}) };
    const auth = await getAuthHeaders();
    Object.assign(headers, auth);
    const res = await fetch(`${API_BASE}${path}`, {
        ...opts,
        headers,
        credentials: "include",
    });
    const text = await res.text();
    try {
        const json = text ? JSON.parse(text) : null;
        if (!res.ok)
            throw new Error((json?.message ?? text) || res.statusText);
        return json;
    }
    catch (err) {
        if (!res.ok)
            throw err;
        return null;
    }
}
export const apiEnabled = hasApi;
export default { apiFetch, apiEnabled };
