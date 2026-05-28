import Link from "next/link";
import type { SiteEntry } from "../lib/content";

export function PostCard({ entry }: { entry: SiteEntry }) {
  const image = entry.asset(entry.data.image);
  return (
    <article>
      <Link href={entry.url}>
        {image && (
          <div className="article-image">
            <img src={image} alt="" loading="lazy" />
          </div>
        )}
        <div className="article-details">
          <div className="compact-title-row">
            <h2 className="article-title">{entry.data.title}</h2>
            <div className="compact-pill-list">
              {(entry.data.categories || []).slice(0, 2).map((item: string) => <span className="compact-pill" key={item}>{item}</span>)}
            </div>
          </div>
          <p className="compact-subtitle">{entry.data.description}</p>
          <time className="article-time">{entry.formattedDate}</time>
        </div>
      </Link>
    </article>
  );
}
