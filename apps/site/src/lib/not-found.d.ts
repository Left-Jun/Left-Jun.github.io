export type NotFoundLanguage = "zh-cn" | "en";

export interface NotFoundCopy {
  lang: NotFoundLanguage;
  htmlLang: "zh-CN" | "en";
  title: string;
  documentTitle: string;
  description: string;
  homeLabel: string;
  projectsLabel: string;
  backLabel: string;
  homeUrl: string;
  projectsUrl: string;
}

export const NOT_FOUND_COPY: Readonly<Record<NotFoundLanguage, Readonly<NotFoundCopy>>>;
export function notFoundLanguage(pathname?: string): NotFoundLanguage;
export function getNotFoundCopy(pathname?: string): Readonly<NotFoundCopy>;
export function buildNotFoundBootstrap(): string;
