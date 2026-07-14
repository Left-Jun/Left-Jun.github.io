const sectionNames = new Set([
  "home",
  "projects",
  "updates",
  "posts",
  "retrospectives",
  "plans",
  "about",
  "contact"
]);

function safeAlternate(value) {
  const candidate = String(value || "").trim();
  if (!candidate) return "";
  if (candidate.startsWith("/") && !candidate.startsWith("//")) return candidate;

  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function sectionLanding(active, targetLanguage) {
  const section = sectionNames.has(active) ? active : "home";
  const suffix = section === "home" ? "" : `${section}/`;
  return targetLanguage === "en" ? `/en/${suffix}` : `/${suffix}`;
}

/**
 * Resolves the sidebar language target without guessing a detail-page slug.
 * Explicit paired URLs win; otherwise the link returns to the matching section.
 */
export function resolveLanguageSwitchUrl({
  lang = "zh-cn",
  active = "",
  alternateUrl = "",
  alternatePath = ""
} = {}) {
  const explicitUrl = safeAlternate(alternateUrl);
  if (explicitUrl) return explicitUrl;

  const explicitPath = safeAlternate(alternatePath);
  if (explicitPath) return explicitPath;

  return sectionLanding(String(active || "").trim(), lang === "en" ? "zh-cn" : "en");
}
