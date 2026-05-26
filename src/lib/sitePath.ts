export const SITE_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function sitePath(path: string): string {
    if (!path.startsWith("/")) return path;
    if (!SITE_BASE_PATH) return path;
    return `${SITE_BASE_PATH}${path}`;
}
