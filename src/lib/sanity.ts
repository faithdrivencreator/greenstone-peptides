/**
 * Sanity removed — this stub keeps urlFor() backward-compatible with all
 * components that call urlFor(image).width(n).height(n).url().
 * All data now comes from src/data/*.ts static files.
 */

type UrlChain = {
  url: () => string;
  width: (w: number) => UrlChain;
  height: (h: number) => UrlChain;
  quality: (q: number) => UrlChain;
  fit: (f: string) => UrlChain;
  auto: (a: string) => UrlChain;
};

function buildChain(resolvedUrl: string): UrlChain {
  const c: UrlChain = {
    url: () => resolvedUrl,
    width: () => c,
    height: () => c,
    quality: () => c,
    fit: () => c,
    auto: () => c,
  };
  return c;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any): UrlChain {
  const url: string =
    source?.asset?.url ||
    source?.url ||
    '';
  return buildChain(url);
}

// Legacy exports kept so existing imports don't break
export const projectId = '';
export const dataset = 'production';
export const apiVersion = '2024-01-01';
