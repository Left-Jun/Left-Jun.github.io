export const NOT_FOUND_COPY = Object.freeze({
  "zh-cn": Object.freeze({
    lang: "zh-cn",
    htmlLang: "zh-CN",
    title: "页面没有找到",
    documentTitle: "页面没有找到 - Left Jun",
    description: "这个地址可能已经移动或不再存在。你可以从首页或项目作品集继续浏览。",
    homeLabel: "返回首页",
    projectsLabel: "查看项目",
    backLabel: "返回上一页",
    homeUrl: "/",
    projectsUrl: "/projects/"
  }),
  en: Object.freeze({
    lang: "en",
    htmlLang: "en",
    title: "Page not found",
    documentTitle: "Page not found - Left Jun",
    description: "This address may have moved or no longer exists. Continue from the home page or project portfolio.",
    homeLabel: "Back home",
    projectsLabel: "View projects",
    backLabel: "Go back",
    homeUrl: "/en/",
    projectsUrl: "/en/projects/"
  })
});

export function notFoundLanguage(pathname = "/") {
  return /^\/en(?:\/|$)/i.test(String(pathname || "/")) ? "en" : "zh-cn";
}

export function getNotFoundCopy(pathname = "/") {
  return NOT_FOUND_COPY[notFoundLanguage(pathname)];
}

export function buildNotFoundBootstrap() {
  const copyJson = JSON.stringify(NOT_FOUND_COPY).replaceAll("<", "\\u003c");
  return `(() => {
    const copies = ${copyJson};
    const language = /^\\/en(?:\\/|$)/i.test(window.location.pathname || "/") ? "en" : "zh-cn";
    const copy = copies[language];
    const root = document.documentElement;
    root.lang = copy.htmlLang;
    root.dataset.notFoundLanguage = language;
    document.title = copy.documentTitle;
  })();`;
}
