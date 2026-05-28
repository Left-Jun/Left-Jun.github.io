import Link from "next/link";
import { Icon } from "./Icon";
import { PostCard } from "./PostCard";
import { relatedEntries, siteText, type SiteEntry } from "../lib/content";

function FactValue({ value }: { value: any }) {
  if (Array.isArray(value)) return <>{value.join(" / ")}</>;
  if (value && typeof value === "object") return <>{Object.values(value).join(" / ")}</>;
  return <>{String(value || "")}</>;
}

export async function ArticleLayout({ entry }: { entry: SiteEntry }) {
  const text = siteText(entry.lang);
  const related = await relatedEntries(entry);
  const records = related.filter((item) => item.section === "retrospectives" || item.section === "plans");
  const reading = related.filter((item) => item.section !== "retrospectives" && item.section !== "plans");
  const image = entry.asset(entry.data.image);
  const video = entry.asset(entry.data.coverVideo);
  const facts = entry.data.projectFacts && typeof entry.data.projectFacts === "object" ? Object.entries(entry.data.projectFacts) : [];
  const links = Array.isArray(entry.data.projectLinks) ? entry.data.projectLinks : [];

  return (
    <div className={`article-page article-page--${entry.section}`}>
      <div className="article-layout">
        <article className="main-article">
          <header className="article-header">
            <div className="article-details">
              <div className="article-meta article-time">
                {entry.formattedDate && <time>{entry.formattedDate}</time>}
                <span>{entry.readingMinutes} {text.readMinutes}</span>
              </div>
              <h1 className="article-title">{entry.data.title}</h1>
              {entry.data.description && <p className="article-subtitle">{entry.data.description}</p>}
            </div>
            {(image || video) && (
              <div className="article-image project-hero">
                {video ? (
                  <video autoPlay muted loop playsInline poster={image || undefined}>
                    <source src={video} />
                  </video>
                ) : (
                  <img src={image} alt="" />
                )}
              </div>
            )}
          </header>

        {facts.length > 0 && (
          <section className="project-facts">
            <h2 className="project-facts__title">{text.projectProfile}</h2>
            <dl className="project-facts__grid">
              {facts.map(([key, value]) => (
                <div className={Array.isArray(value) ? "project-facts__item project-facts__item--wide" : "project-facts__item"} key={key}>
                  <dt>{key}</dt>
                  <dd><FactValue value={value} /></dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {links.length > 0 && (
          <section className="project-links">
            <h2 className="project-links__title">{text.projectLinks}</h2>
            <div className="project-links__list">
              {links.map((item: any) => (
                <a className="project-links__button" href={item.url || item.href} key={item.url || item.href} target="_blank" rel="noopener noreferrer">
                  <Icon name="link" size={18} />
                  <span>{item.label || item.name || item.url}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {records.length > 0 && (
          <section className="project-records">
            <h2 className="project-records__title">{text.relatedRecords}</h2>
            <div className="project-records__list">
              {records.map((item) => (
                <Link className={`project-records__button project-records__button--${item.section}`} href={item.url} key={item.ref}>
                  <Icon name={item.section === "plans" ? "clock" : "infinity"} size={18} />
                  <span className="project-records__label">{item.section === "plans" ? text.viewPlan : text.viewRetrospective}</span>
                  <strong>{item.data.title}</strong>
                </Link>
              ))}
            </div>
          </section>
        )}

          <div className="article-content" dangerouslySetInnerHTML={{ __html: entry.html }} />
        </article>

        {(entry.toc.length > 0 || reading.length > 0) && (
          <aside className="right-sidebar">
            {entry.toc.length > 0 && (
              <section className="widget widget--toc">
                <h2 className="widget-title">{text.toc}</h2>
                <nav className="toc-nav">
                  <ol>
                    {entry.toc.map((item) => (
                      <li key={`${item.depth}-${item.text}`} className={`toc-depth-${item.depth}`}>
                        <a href={`#${item.id}`}>{item.text}</a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </section>
            )}
            {reading.length > 0 && (
              <section className="widget related-content">
                <h2 className="widget-title">{text.relatedReading}</h2>
                <div className="article-list article-list--compact">
                  {reading.map((item) => <PostCard entry={item} key={item.ref} />)}
                </div>
              </section>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
