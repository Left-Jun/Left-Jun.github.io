export type SiteLanguage = "zh-cn" | "en";

export type OpenGraphType = "website" | "article" | "profile";

export type CreativeWorkType =
  | "CreativeWork"
  | "Article"
  | "BlogPosting"
  | "VideoGame"
  | "SoftwareApplication"
  | "SoftwareSourceCode";

export interface CreativeWorkInput {
  type?: CreativeWorkType;
  name?: string;
  description?: string;
  url?: string;
  image?: string;
  datePublished?: Date | string;
  dateModified?: Date | string;
  keywords?: string[];
}

export interface BreadcrumbInput {
  name: string;
  url?: string;
}

export interface StructuredDataOptions {
  siteName: string;
  siteUrl: string;
  canonicalUrl: string;
  pageTitle: string;
  pageDescription: string;
  pageImageUrl: string;
  personImageUrl?: string;
  lang: SiteLanguage;
  sameAs?: string[];
  creativeWork?: CreativeWorkInput;
  breadcrumbs?: BreadcrumbInput[];
}

export interface AlternateLinkOptions {
  siteUrl: string;
  canonicalUrl: string;
  lang: SiteLanguage;
  alternateUrl?: string;
  alternatePath?: string;
  alternateLang?: SiteLanguage;
}

const creativeWorkTypes = new Set<CreativeWorkType>([
  "CreativeWork",
  "Article",
  "BlogPosting",
  "VideoGame",
  "SoftwareApplication",
  "SoftwareSourceCode"
]);

export function languageCode(lang: SiteLanguage): "zh-CN" | "en" {
  return lang === "en" ? "en" : "zh-CN";
}

export function resolveOptionalHttpUrl(value: string | undefined, siteUrl: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value, siteUrl);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function resolveSiteUrl(value: string, siteUrl: string): string {
  return resolveOptionalHttpUrl(value, siteUrl) || new URL(siteUrl).toString();
}

export function buildAlternateLinks(options: AlternateLinkOptions): Array<{ hreflang: string; href: string }> {
  const alternateValue = options.alternateUrl || options.alternatePath;
  if (!alternateValue) return [];

  const alternateLang = options.alternateLang || (options.lang === "en" ? "zh-cn" : "en");
  if (alternateLang === options.lang) return [];

  const currentHref = resolveSiteUrl(options.canonicalUrl, options.siteUrl);
  const alternateHref = resolveOptionalHttpUrl(alternateValue, options.siteUrl);
  if (!alternateHref || alternateHref === currentHref) return [];
  const current = { hreflang: languageCode(options.lang), href: currentHref };
  const alternate = { hreflang: languageCode(alternateLang), href: alternateHref };
  const defaultHref = options.lang === "zh-cn" ? currentHref : alternateHref;

  return [current, alternate, { hreflang: "x-default", href: defaultHref }];
}

function isoDate(value?: Date | string): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function cleanStrings(values: string[] = []): string[] {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

export function buildStructuredData(options: StructuredDataOptions): Record<string, unknown> {
  const rootUrl = resolveSiteUrl("/", options.siteUrl);
  const canonicalUrl = resolveSiteUrl(options.canonicalUrl, options.siteUrl);
  const personId = `${rootUrl}#person`;
  const websiteId = `${rootUrl}#website`;
  const sameAs = cleanStrings(options.sameAs)
    .map((url) => resolveOptionalHttpUrl(url, options.siteUrl))
    .filter((url): url is string => Boolean(url));
  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "Person",
      "@id": personId,
      name: options.siteName,
      url: rootUrl,
      image: resolveOptionalHttpUrl(options.personImageUrl || options.pageImageUrl, options.siteUrl),
      sameAs: [...new Set(sameAs)]
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: options.siteName,
      url: rootUrl,
      inLanguage: ["zh-CN", "en"],
      publisher: { "@id": personId }
    }
  ];

  if (options.creativeWork) {
    const work = options.creativeWork;
    const workUrl = resolveSiteUrl(work.url || canonicalUrl, options.siteUrl);
    const workType = work.type && creativeWorkTypes.has(work.type) ? work.type : "CreativeWork";
    const keywords = cleanStrings(work.keywords);
    graph.push({
      "@type": workType,
      "@id": `${workUrl}#creative-work`,
      name: String(work.name || options.pageTitle).trim(),
      description: String(work.description || options.pageDescription).trim() || undefined,
      url: workUrl,
      image: resolveOptionalHttpUrl(work.image || options.pageImageUrl, options.siteUrl),
      inLanguage: languageCode(options.lang),
      author: { "@id": personId },
      isPartOf: { "@id": websiteId },
      datePublished: isoDate(work.datePublished),
      dateModified: isoDate(work.dateModified),
      keywords: keywords.length > 0 ? keywords : undefined
    });
  }

  const breadcrumbs = (options.breadcrumbs || []).filter((item) => String(item?.name || "").trim());
  if (breadcrumbs.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb-list`,
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: String(item.name).trim(),
        item: resolveSiteUrl(item.url || canonicalUrl, options.siteUrl)
      }))
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
