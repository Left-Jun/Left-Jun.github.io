import mediaManifest from "../data/media-manifest.json";

type MediaVariant = {
  src: string;
  width: number;
};

type MediaManifestItem = {
  width: number;
  height: number;
  avif: MediaVariant[];
  webp: MediaVariant[];
  poster: string;
};

const manifest = mediaManifest as Record<string, MediaManifestItem>;

export function getResponsiveMedia(src: string) {
  return manifest[src] || null;
}

export function mediaSrcset(variants: MediaVariant[] = []) {
  return variants.map((variant) => `${variant.src} ${variant.width}w`).join(", ");
}

export function optimizedPoster(src: string) {
  return getResponsiveMedia(src)?.poster || src;
}
