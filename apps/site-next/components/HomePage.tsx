import Link from "next/link";
import { Icon } from "./Icon";
import { PostCard } from "./PostCard";
import { ProjectCard } from "./ProjectCard";
import { workflowItems, type Lang, type SiteEntry } from "../lib/content";

export function HomePage({
  lang,
  text,
  projects,
  posts,
  plans,
  records
}: {
  lang: Lang;
  text: any;
  projects: SiteEntry[];
  posts: SiteEntry[];
  plans: Array<{ entry: SiteEntry; retrospective?: SiteEntry }>;
  records: Record<string, SiteEntry | undefined>;
}) {
  const isEn = lang === "en";
  return (
    <>
      <section className="home-hero">
        <p className="home-hero__eyebrow">{isEn ? "Game systems, interaction, and software-hardware projects" : "游戏原型、交互系统与软硬件项目"}</p>
        <h1 className="home-hero__title">{isEn ? "Game prototypes, interaction systems, and software-hardware projects" : "游戏原型、交互系统与软硬件项目"}</h1>
        <p className="home-hero__summary">
          {isEn
            ? "I am Left Jun, the lead creator of Limenauts, documenting Unity prototypes, gameplay systems, Game Jam works, and embedded practice."
            : "我是 Left Jun，也是阈限开拓者主创。这里整理 Unity / C# 游戏原型、Gameplay 系统、Game Jam 项目与软硬件实践。"}
        </p>
        <div className="home-hero__actions">
          <Link className="home-action home-action--primary" href={isEn ? "/en/projects/" : "/projects/"}><Icon name="link" />{text.viewProject}</Link>
          <a className="home-action" href="/files/left-jun-portfolio.pdf"><Icon name="file" />{text.portfolioPdf}</a>
          <Link className="home-action" href={isEn ? "/en/about/" : "/about/"}><Icon name="user" />{text.aboutMe}</Link>
          <Link className="home-action" href={isEn ? "/en/contact/" : "/contact/"}><Icon name="messages" />{text.contact}</Link>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section__header">
          <div>
            <p className="home-section__eyebrow">{text.selectedWork}</p>
            <h2>{text.representativeProjects}</h2>
          </div>
          <Link className="home-section__link" href={isEn ? "/en/projects/" : "/projects/"}>{text.allProjects}</Link>
        </div>
        <div className="home-project-grid">
          {projects.slice(0, 4).map((entry) => <ProjectCard entry={entry} compact key={entry.ref} />)}
        </div>
      </section>

      <section className="home-section home-workflow">
        <div className="home-section__header">
          <div>
            <p className="home-section__eyebrow">{text.howIWork}</p>
            <h2>{text.fromIdea}</h2>
          </div>
        </div>
        <div className="home-workflow__grid">
          {workflowItems.map((item) => (
            <article className="home-workflow__item" key={item.title.en}>
              <span className="home-workflow__icon"><Icon name={item.icon} /></span>
              <div className="home-workflow__body">
                <h3>{isEn ? item.title.en : item.title.zh}</h3>
                <p>{isEn ? item.body.en : item.body.zh}</p>
                <div className="home-workflow__projects">
                  {item.slugs.map((slug) => {
                    const entry = records[slug];
                    if (!entry) return null;
                    const image = entry.asset(entry.data.image);
                    return (
                      <Link className="home-workflow__project" href={entry.url} key={slug}>
                        <span className="home-workflow__project-label">{entry.data.title}</span>
                        <span className="home-workflow__preview">
                          <span className="home-workflow__preview-media">{image && <img src={image} alt="" loading="lazy" />}</span>
                          <span className="home-workflow__preview-caption">{entry.data.description}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section__header">
          <div>
            <p className="home-section__eyebrow">{text.inProgress}</p>
            <h2>{text.developmentPlans}</h2>
          </div>
          <Link className="home-section__link" href="/plans/">{text.allPlans}</Link>
        </div>
        <div className="home-plan-grid">
          {plans.map(({ entry, retrospective }) => (
            <Link className="home-plan-card" href={entry.url} key={entry.ref}>
              <span className="home-plan-card__meta">{entry.formattedDate}</span>
              <strong>{entry.data.title}</strong>
              <p>{entry.data.description}</p>
              <span className="home-plan-card__footer">
                {retrospective && <span className="home-plan-card__pill home-plan-card__pill--retrospective">{text.viewRetrospective}</span>}
                <span className="home-plan-card__pill home-plan-card__pill--plan">{text.viewPlan}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section__header">
          <div>
            <p className="home-section__eyebrow">{text.latestNotes}</p>
            <h2>{text.postsAndRecords}</h2>
          </div>
          <Link className="home-section__link" href={isEn ? "/en/posts/" : "/posts/"}>{text.allPosts}</Link>
        </div>
        <div className="article-list article-list--compact">
          {posts.map((entry) => <PostCard entry={entry} key={entry.ref} />)}
        </div>
      </section>
    </>
  );
}
