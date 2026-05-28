"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

type SidebarProps = {
  text: any;
};

export function Sidebar({ text }: SidebarProps) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [scheme, setScheme] = useState<"light" | "dark">("light");
  const sidebar = text.sidebar;

  useEffect(() => {
    const stored = window.localStorage.getItem("LeftJunColorScheme") || window.localStorage.getItem("LeftJunAstroColorScheme");
    const next = stored === "dark" || stored === "light" ? stored : "light";
    setScheme(next);
    document.documentElement.dataset.scheme = next;
  }, []);

  useEffect(() => {
    document.body.classList.toggle("show-menu", open);
    const shouldPreopen = window.location.pathname === "/" || window.sessionStorage.getItem("LeftJunMenuNavigation") === "1";
    if (!shouldPreopen) return;
    window.sessionStorage.removeItem("LeftJunMenuNavigation");
    document.documentElement.classList.add("mobile-menu-preopen");
    const timer = window.setTimeout(() => {
      document.documentElement.classList.remove("mobile-menu-preopen");
      setOpen(false);
    }, 650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("show-menu", open);
  }, [open]);

  function toggleScheme() {
    const next = scheme === "dark" ? "light" : "dark";
    setScheme(next);
    document.documentElement.dataset.scheme = next;
    window.localStorage.setItem("LeftJunColorScheme", next);
  }

  function rememberMenuNavigation() {
    if (open) window.sessionStorage.setItem("LeftJunMenuNavigation", "1");
  }

  function translatedPath(lang: "zh-cn" | "en") {
    if (lang === "en") {
      if (pathname === "/") return "/en/";
      if (pathname.startsWith("/en/")) return pathname;
      return `/en${pathname}`.replace(/\/+/g, "/");
    }
    if (pathname === "/en") return "/";
    if (pathname.startsWith("/en/")) return pathname.replace(/^\/en/, "") || "/";
    return pathname;
  }

  function changeLanguage(value: string) {
    window.location.href = value;
  }

  return (
    <>
      <button
        id="toggle-menu"
        className={open ? "is-active" : ""}
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="hamburger-box">
          <span className="hamburger-inner" />
        </span>
      </button>
      <aside className="sidebar left-sidebar sticky">
        <header>
          <div className="site-avatar">
            <Link href={text.homeUrl} aria-label="Left Jun">
              <img className="site-logo" src={`/${sidebar.avatar || "img/avatar.jpg"}`} alt="Left Jun" />
            </Link>
            <span className="status-emoji" tabIndex={0}>
              <span aria-hidden="true">{sidebar.status?.emoji || sidebar.emoji || "✦"}</span>
              <span className="status-tooltip">
                <strong>{sidebar.status?.title}</strong>
                <small>{sidebar.status?.description}</small>
              </span>
            </span>
          </div>
          <div className="site-meta">
            <h1 className="site-name">
              <Link href={text.homeUrl}>Left Jun</Link>
            </h1>
            <span className="site-identity">{sidebar.identity}</span>
            <p className="site-description">{sidebar.subtitle}</p>
          </div>
        </header>

        <ol className="menu-social" aria-label="Social links">
          {text.menus.social.map((item: any) => (
            <li key={item.identifier}>
              <a href={item.url} target={item.params?.newTab ? "_blank" : undefined} rel="me noopener noreferrer" aria-label={item.name} title={item.name}>
                <Icon name={item.params?.icon} size={19} />
              </a>
            </li>
          ))}
        </ol>

        <ol className="menu" id="main-menu" aria-label="Main menu">
          {text.menus.main.map((item: any) => {
            const active = pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url));
            return (
              <li key={item.identifier} className={active ? "current" : ""}>
                <Link href={item.url} onClick={rememberMenuNavigation}>
                  <Icon name={item.params?.icon} size={18} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="sidebar-bottom-actions">
          <div id="i18n-switch">
            <Icon name="messages" size={18} />
            <select
              name="language"
              title="language"
              value={translatedPath(text.lang)}
              onChange={(event) => changeLanguage(event.currentTarget.value)}
              aria-label="Language"
            >
              <option value={translatedPath("zh-cn")}>中文</option>
              <option value={translatedPath("en")}>English</option>
            </select>
          </div>
          <button id="dark-mode-toggle" data-scheme-state={scheme} onClick={toggleScheme}>
            <span className="theme-toggle__icon">
              <Icon name="sun" size={18} />
              <Icon name="moon" size={18} />
            </span>
            <span className="theme-toggle__label">{scheme === "dark" ? text.lightMode : text.darkMode}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
