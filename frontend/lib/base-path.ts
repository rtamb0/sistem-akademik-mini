const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const basePath = rawBasePath.replace(/\/$/, "");

export function withBasePath(pathname: string) {
  if (!basePath) {
    return pathname;
  }

  if (pathname === "/") {
    return basePath;
  }

  return `${basePath}${pathname}`;
}

export function stripBasePath(pathname: string) {
  if (!basePath || !pathname.startsWith(basePath)) {
    return pathname;
  }

  const stripped = pathname.slice(basePath.length);

  return stripped || "/";
}
