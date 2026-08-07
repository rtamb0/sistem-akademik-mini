export const basePath = "/sistem-akademik-mini";

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
