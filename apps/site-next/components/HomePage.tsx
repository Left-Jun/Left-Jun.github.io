import Link from "next/link";
import { Icon } from "./Icon";
import { PostCard } from "./PostCard";
import { ProjectCard } from "./ProjectCard";
import { WorkflowGlow } from "./WorkflowGlow";
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
        <p className="home-hero__eyebrow">{isEn ? "Sichuan University · Electronic Information · Class of 2029" : "四川大学 · 电子信息类 · 2029届"}</p>
        <h1 className="home-hero__title">{isEn ? "Game Prototypes, Interaction Systems, and Software-Hardware Projects" : "游戏原型、交互系统与软硬件项目"}</h1>
        <p className="home-hero__summary">
          {isEn
            ? "I publish work as Left Jun and lead Limenauts as my long-term project team name. This site collects jam projects, Unity and Godot prototypes, embedded experiments, process notes, and public builds."
            : "我以 Left Jun 发布作品，也以阈限开拓者作为长期项目队名和个人参赛队名。这里整理我的 Game Jam 项目、Unity / Godot 原型、嵌入式实践、制作过程和可体验版本。"}
        </p>
        <div className="home-hero__actions">
          <Link className="home-action home-action--primary" href={isEn ? "/en/projects/" : "/projects/"}><Icon name="link" />{text.viewProject}</Link>
          <a className="home-action" href="/files/left-jun-portfolio.pdf"><Icon name="file" />{text.portfolioPdf}</a>
          <Link className="home-action" href={isEn ? "/en/about/" : "/about/"}><Icon name="user" />{text.aboutMe}</Link>
          <Link className="home-action" href={isEn ? "/en/contact/" : "/contact/"}><Icon name="messages" />{text.contact}</Link>
          <Link className="home-action home-action--hub" href={isEn ? "/en/hub/" : "/hub/"}><Icon name="play" />{isEn ? "Enter Game Hub" : "进入项目大厅"}</Link>
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
        <WorkflowGlow />
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
            <article className="home-plan-card" key={entry.ref}>
              <Link className="home-plan-card__main" href={entry.url}>
                <span className="home-plan-card__meta">{entry.formattedDate}</span>
                <span className="home-plan-card__title">{entry.data.title}</span>
                <span className="home-plan-card__description">{entry.data.description}</span>
                {(entry.data.tags || []).length > 0 && (
                  <span className="home-plan-card__tags" aria-label={isEn ? "Plan tags" : "计划标签"}>
                    {(entry.data.tags || []).slice(0, 3).map((tag: string) => <span className="home-plan-card__tag" key={tag}>{tag}</span>)}
                  </span>
                )}
              </Link>
              <span className="home-plan-card__actions">
                {retrospective && <Link className="home-plan-card__pill home-plan-card__pill--retrospective" href={retrospective.url}>{text.viewRetrospective}</Link>}
                <Link className="home-plan-card__pill home-plan-card__pill--plan" href={entry.url}>{text.viewPlan}</Link>
              </span>
            </article>
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
