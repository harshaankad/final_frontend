// Session helpers shared by the auth pages and navbar.
//
// The session token lives in localStorage for now (existing pages read it
// from there). The short-lived MFA token only lives in sessionStorage so it
// disappears when the tab closes.

import { API_BASE } from "@/lib/config";

const TOKEN_KEY = "authToken";
const DOCTOR_KEY = "doctorData";
const MFA_KEY = "mfaToken";

const safe = (fn, fallback = null) => {
  try { return fn(); } catch { return fallback; }
};

export const getToken = () => safe(() => localStorage.getItem(TOKEN_KEY));

export const getDoctor = () => safe(() => JSON.parse(localStorage.getItem(DOCTOR_KEY) || "null"));

export const setSession = (token, doctor) => {
  safe(() => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(DOCTOR_KEY, JSON.stringify(doctor));
    if (doctor?._id) localStorage.setItem("doctorId", doctor._id);
    sessionStorage.removeItem(MFA_KEY);
  });
};

export const clearSession = () => {
  safe(() => {
    for (const k of [TOKEN_KEY, DOCTOR_KEY, "doctorId", "token", "user", "userRole"]) localStorage.removeItem(k);
    sessionStorage.removeItem(MFA_KEY);
  });
};

export const getMfaToken = () => safe(() => sessionStorage.getItem(MFA_KEY));
export const setMfaToken = (t) => safe(() => sessionStorage.setItem(MFA_KEY, t));

// Tell the server to revoke the token, then forget it locally either way.
export const logout = async () => {
  const token = getToken();
  if (token) {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  clearSession();
};
