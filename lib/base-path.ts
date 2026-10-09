/**
 * Leeg op Vercel / localhost (root). Alleen vullen als je achter een subpad host.
 * Houd gelijk aan `basePath` in next.config.ts wanneer die gezet is.
 */
export const BASE_PATH = "";

export function withBasePath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!BASE_PATH) return normalized;
  return `${BASE_PATH}${normalized}`;
}
