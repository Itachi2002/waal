/** Moet gelijk blijven aan `basePath` / `assetPrefix` in next.config.ts */
export const BASE_PATH = "/waal";

export function withBasePath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
