/** Resolve public files under both / and GitHub Pages' /repository/ URL. */
export function publicAsset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
