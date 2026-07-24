const TOKEN_COOKIE_NAME = "token";
const TOKEN_MAX_AGE = 60 * 60 * 24;

const isBrowser = typeof window !== "undefined";

export function saveAuth(token: string, user: any) {
  if (!isBrowser) return null;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = [
    `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}`,
    `Max-Age=${TOKEN_MAX_AGE}`,
    "Path=/",
    "SameSite=Lax",
    secure,
  ].join("; ");

  localStorage.setItem("user", JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof document === "undefined") return null;

  const tokenCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${TOKEN_COOKIE_NAME}=`));

  if (!tokenCookie) return null;

  const token = tokenCookie.substring(TOKEN_COOKIE_NAME.length + 1);

  return decodeURIComponent(token);
}

export function getUser() {
  if (!isBrowser) return null;

  const raw = localStorage.getItem("user");

  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logout() {
  if (typeof window === "undefined") return;

  document.cookie = [
    `${TOKEN_COOKIE_NAME}=`,
    "Max-Age=0",
    "Path=/",
    "SameSite=Lax",
  ].join("; ");

  localStorage.removeItem("user");

  window.location.replace("/login");
}
