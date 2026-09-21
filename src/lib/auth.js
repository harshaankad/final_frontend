// Session helpers shared by pages and the navbar.
//
// The session itself is an httpOnly cookie set by the API — page scripts
// never see it, so nothing here stores a token. What we keep locally is the
// non-sensitive profile (name, email, role) purely for UI decisions; the
// server is the source of truth and answers 401 when the cookie is gone.

import { API_BASE } from "@/lib/config";

const DOCTOR_KEY = "doctorData";
const MFA_PENDING_KEY = "mfaPending";

const safe = (fn, fallback = null) => {
  try { return fn(); } catch { return fallback; }
};

export const getDoctor = () => safe(() => JSON.parse(localStorage.getItem(DOCTOR_KEY) || "null"));
export const isLoggedIn = () => !!getDoctor();
export const isAdmin = () => getDoctor()?.role === "admin";

export const setSession = (doctor) => {
  safe(() => {
    localStorage.setItem(DOCTOR_KEY, JSON.stringify(doctor));
    if (doctor?._id) localStorage.setItem("doctorId", doctor._id);
    sessionStorage.removeItem(MFA_PENDING_KEY);
  });
};

export const clearSession = () => {
  safe(() => {
    // Old keys from the pre-cookie era are cleared too.
    for (const k of [DOCTOR_KEY, "doctorId", "authToken", "token", "user", "userRole"]) localStorage.removeItem(k);
    sessionStorage.removeItem(MFA_PENDING_KEY);
  });
};

// Between /login and /mfa the MFA token lives in a cookie scoped to the MFA
// routes; this flag only tells the /mfa page it has something to verify.
export const setMfaPending = () => safe(() => sessionStorage.setItem(MFA_PENDING_KEY, "1"));
export const hasMfaPending = () => safe(() => sessionStorage.getItem(MFA_PENDING_KEY) === "1", false);

/**
 * fetch() against the API with the session cookie attached. Plain-object
 * bodies are sent as JSON; FormData is passed through. A 401 clears the
 * local profile so route guards send the user back to /login.
 */
export const apiFetch = async (path, { method = "GET", body, headers = {}, ...rest } = {}) => {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: { ...(body && !isForm ? { "Content-Type": "application/json" } : {}), ...headers },
    body: isForm ? body : body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  });
  if (res.status === 401) clearSession();
  return res;
};

// Tell the server to revoke the session (all devices), then forget the profile.
export const logout = async () => {
  await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
  clearSession();
};
