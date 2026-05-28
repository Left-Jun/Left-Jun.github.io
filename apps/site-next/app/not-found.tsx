import Link from "next/link";
import { AppShell } from "../components/AppShell";
import { siteText } from "../lib/content";

export default function NotFound() {
  const text = siteText("zh-cn");
  return (
    <AppShell text={text}>
      <section className="home-hero">
        <p className="home-hero__eyebrow">404</p>
        <h1 className="home-hero__title">页面不存在</h1>
        <p className="home-hero__summary">这个入口暂时没有内容，先回到首页继续看项目吧。</p>
        <div className="home-hero__actions">
          <Link className="home-action home-action--primary" href="/">返回首页</Link>
        </div>
      </section>
    </AppShell>
  );
}
