const TOKEN_COOKIE_NAME = "token";
const USER_COOKIE_NAME = "user";
const TOKEN_MAX_AGE = 60 * 60 * 24;

function isBrowser() {
  return typeof window !== "undefined";
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const prefix = `${name}=`;

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(prefix));

  if (!cookie) return null;

  return decodeURIComponent(cookie.substring(prefix.length));
}

export function saveAuth(token: string, user: unknown) {
  if (!isBrowser()) return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = [
    `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}`,
    `Max-Age=${TOKEN_MAX_AGE}`,
    "Path=/",
    "SameSite=Lax",
    secure,
  ].join("; ");

  document.cookie = [
    `${USER_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(user))}`,
    `Max-Age=${TOKEN_MAX_AGE}`,
    "Path=/",
    "SameSite=Lax",
    secure,
  ].join("; ");
}

export function getToken(): string | null {
  return getCookie(TOKEN_COOKIE_NAME);
}

export function getUser() {
  const raw = getCookie(USER_COOKIE_NAME);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function logout() {
  if (!isBrowser()) return;

  document.cookie = `${TOKEN_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
  document.cookie = `${USER_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;

  window.location.replace("/login");
}
