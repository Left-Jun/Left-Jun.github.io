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
      <aside className="left-sidebar sticky">
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

        <ul className="menu-social" aria-label="Social links">
          {text.menus.social.map((item: any) => (
            <li key={item.identifier}>
              <a href={item.url} target={item.params?.newTab ? "_blank" : undefined} rel={item.params?.newTab ? "noopener noreferrer" : undefined} aria-label={item.name}>
                <Icon name={item.params?.icon} size={19} />
              </a>
            </li>
          ))}
        </ul>

        <nav id="main-menu" aria-label="Main menu">
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
        </nav>

        <div className="sidebar-bottom-actions">
          <Link id="i18n-switch" href={text.switchUrl}>
            <Icon name="messages" size={18} />
            <span>{text.switchLabel}</span>
          </Link>
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
