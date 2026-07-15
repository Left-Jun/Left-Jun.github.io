export const visualThemes = {
  "emotion-mask": {
    id: "emotion-mask",
    background: "/theme-assets/emotion-mask/page-background.png",
    backgroundPosition: "center center"
  }
} as const;

export type VisualThemeId = keyof typeof visualThemes;

export function resolveVisualTheme(value: unknown) {
  const id = String(value || "") as VisualThemeId;
  return visualThemes[id] || null;
}
