// ─── Auth helpers ─────────────────────────────────────────────────────────────

export type AuthUser = {
  username: string;
  email: string;
  joinedAt: string; // ISO string
};

const AUTH_KEY = 'skinmate_auth_user';

export function getUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setUser(user: AuthUser) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(AUTH_KEY);
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}
