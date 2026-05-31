# Left Jun 作品集工作区交接记忆（2026-05-31）

> 本文是本轮 Codex 协作的详细交接记录。目标是让下一位接手者不用翻完整对话，也能理解仓库现状、设计意图、关键改动、部署方式、用户偏好、已知风险与后续维护重点。
>
> 注意：本文不包含任何账号、Token、Cookie、控制台敏感信息；只记录公开仓库路径、命令、配置项、设计决策与维护建议。

---

## 1. 工作区与项目总览

### 1.1 本地路径

- 工作区根目录：`C:\Users\MR\Desktop\Hugo`
- 当前主要仓库：`C:\Users\MR\Desktop\Hugo\Left_Jun`
- 当前 Git 分支：`main`
- 远端：`origin/main`
- 当前状态（写本文前确认）：`main...origin/main`，工作树干净。

### 1.2 项目性质

这是 Left Jun 的个人游戏开发作品集网站。它现在已经不是旧的 Hugo 站点方向，而是一个 Astro monorepo 静态站点。

站点定位：

- Left Jun 的个人作品集首页。
- 阈限开拓者 / Limenauts 相关项目档案。
- 游戏项目、复盘、开发计划、文章记录的长期展示站。
- 视觉目标接近 Apple 产品页：大图、低信息密度、卡片层级清楚、玻璃感、清晰 CTA、中文优先。

核心访问入口：

- 首页：`/`
- 项目列表：`/projects/`
- 重点项目详情：《亚舍拉挽歌》：`/projects/ashe-lament/`
- 文章：`/posts/`
- 项目复盘：`/retrospectives/`
- 开发计划：`/plans/`
- 关于：`/about/`
- 联系：`/contact/`
- 标签聚合：`/tags/[slug]/`
- 分类聚合：`/categories/[slug]/`
- 英文站点：`/en/` 开头的对应路径。

### 1.3 技术栈

根仓库 `package.json` 目前是 npm workspaces：

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:site": "npm --workspace @left-jun/site run dev",
    "build:site": "npm --workspace @left-jun/site run build",
    "check:site": "npm --workspace @left-jun/site run check",
    "preview:site": "npm --workspace @left-jun/site run preview",
    "editor": "npm --workspace @left-jun/editor run start",
    "validate:content": "npm --workspace @left-jun/content-model run validate"
  }
}
```

主要包：

- `apps/site`：Astro 静态站点。
- `apps/editor`：本地内容编辑器。
- `packages/content-model`：内容模型/URL/Markdown/Toc 等共享逻辑。

`apps/site/package.json`：

- Astro 版本线：`astro@^5.16.4`
- Sitemap：`@astrojs/sitemap`
- Type check：`astro check`
- 构建输出：`apps/site/dist`

`apps/site/astro.config.mjs`：

```js
export default defineConfig({
  site: "https://leftjun.com",
  output: "static",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404/")
    })
  ],
  markdown: {
    shikiConfig: {
      theme: "github-dark"
    }
  }
});
```

---

## 2. 当前 Git 状态与近期提交脉络

写本文前确认：

```txt
## main...origin/main
```

说明：本地 `main` 与 `origin/main` 同步，工作树干净。

最近关键提交：

```txt
0d33982 Keep project sidebar fixed on collapse
7842c92 Fix Asherah copy and collapsed project spacing
bf5fe4b Refine sidebar links and collapsed project layout
2d9eccf Polish hero links and tag navigation
913f0f7 Refine home lower sections and sidebar collapse
4279bd3 Fix sidebar icons and add responsive navigation
2d44a84 Fix collapsed sidebar icons and animation
21cf9f2 Refine roadmap and sidebar collapse
db11c5b Refine home hero split layout
7b92c6d Fix article width and sidebar position
946462e Refine roadmap and article alignment
d31e9b1 Refine home hero and roadmap
73b4f88 Refine home landing layout
299719f Revert "Tune project sidebar viewport fit"
ef50ae9 Tune project sidebar viewport fit
041be65 Refine portfolio sidebar behavior
81f2aa2 改版apple类
b2acbc5 backup/hugo-before-astro-cutover-2026-05-28 / Refine Apple-style portfolio homepage
```

### 2.1 近期提交含义

- `0d33982 Keep project sidebar fixed on collapse`
  - 修正项目详情页在左侧栏收起时的布局逻辑。
  - 用户明确要求：右侧目录栏位置和大小不要动；只是项目主体向左扩展变大。
  - 当前 CSS 逻辑：右侧栏固定使用收起前的 `left: calc(50% + 492px)`；项目主体用收起后的左侧栏宽度和右侧栏左边界反推宽度。

- `7842c92 Fix Asherah copy and collapsed project spacing`
  - 修正文案：玩家扮演对象应为“根语者”，不是“阈限开拓者”。
  - 调整项目页收起态间距，但后续被 `0d33982` 继续修正。

- `bf5fe4b Refine sidebar links and collapsed project layout`
  - 右侧栏分类/标签胶囊从不可点击 `span` 改为链接 `a`。
  - Hero 左下项目名卡片 hover/click 逻辑修复。
  - 项目页收起态加过渡动画。

- `2d9eccf Polish hero links and tag navigation`
  - 技术栈胶囊改成可点击标签聚合页。
  - 标签页结果改为项目靠上、文章/记录靠下。
  - 移除首页技术栈中的 Git、Blender，保留 Photoshop。
  - 删除中文底部“自定义静态作品集”。

- `913f0f7 Refine home lower sections and sidebar collapse`
  - 精修首页下半部分：文章前置、工作方式降级、技术栈轻量胶囊。
  - 继续修侧栏收起态图标和对齐。

- `4279bd3 Fix sidebar icons and add responsive navigation`
  - 修复左侧栏收起态图标显示。
  - Roadmap 不再 sticky。
  - 新增全站顶部玻璃导航与手机底部玻璃导航。

- `2d44a84 Fix collapsed sidebar icons and animation`
  - 修复收起态小图标空白问题的一轮补丁。
  - 增加收起/展开动画。

- `21cf9f2 Refine roadmap and sidebar collapse`
  - 首页 Roadmap 对齐和左侧栏收起功能初版。

- `db11c5b Refine home hero split layout`
  - 首页 Hero 改为图三方向的稳定双卡：左侧身份信息卡，右侧清晰代表项目图卡。
  - Roadmap 改自然高度、更紧凑。

- `7b92c6d Fix article width and sidebar position`
  - 项目内页文章宽度和右侧栏位置的一轮调整。

- `946462e Refine roadmap and article alignment`
  - Roadmap 缩小、项目内页文章居中修正。

- `d31e9b1 Refine home hero and roadmap`
  - Hero 和 Roadmap 视觉精修。

- `73b4f88 Refine home landing layout`
  - 首页图二版精修：取消大统计卡、开发计划上移、代表项目更突出。

- `299719f Revert "Tune project sidebar viewport fit"`
  - 撤销一轮发错需求导致的项目右侧栏 viewport fit 改动。
  - 后续要避免误恢复这类逻辑。

- `041be65 Refine portfolio sidebar behavior`
  - 早期右侧栏滚动行为、左侧身份胶囊等修改。

- `81f2aa2 改版apple类`
  - Apple-like 改版主提交之一。

---

## 3. 核心设计目标与用户偏好

### 3.1 用户明确偏好

用户的审美和交互偏好非常明确：

- 喜欢 Apple-like 产品页观感。
- 喜欢大图、玻璃感、浅蓝高亮、低信息密度。
- 喜欢卡片边缘对齐、底部齐平、视觉留白均匀。
- 喜欢图片清晰完整，不要整体变灰、模糊、遮挡标题。
- 喜欢中文优先，文案要自然、准确、有作品集专业感。
- 喜欢项目详情页像 Case Study，而不是普通博客文章。
- 喜欢全站导航统一存在；手机端要有底部玻璃导航。
- 喜欢侧栏收起后仍有清晰图标，并且收起/展开要平滑。

### 3.2 用户反感的点

后续接手时要特别避雷：

- 不要让文字被暗色模式吞掉。
- 不要 hover 后背景变太浅导致字看不清。
- 不要卡片贴边，尤其 Roadmap 贴右边缘。
- 不要信息密度太高、摘要太满、标签太多。
- 不要项目卡片和 Roadmap 底部明显不齐。
- 不要项目详情页正文被右侧栏挤得视觉偏右。
- 不要项目页右侧目录栏在左侧栏收起时漂移。
- 不要手机端保留太占地方的 Hero 左下角项目名浮层。
- 不要恢复已经撤销的错误 sidebar viewport fit 方案。
- 不要再把 EdgeOne Pages 当 Hugo 项目部署。

---

## 4. 首页改版记忆

首页经历了多轮从“内容平铺”到“产品页入口”的改造。当前目标不是博客首页，而是作品集吸引入口。

### 4.1 当前首页结构

当前中文首页大致顺序：

1. Hero 双卡
   - 左侧身份信息卡。
   - 右侧代表项目大图卡。
2. 代表项目 + 开发计划 Roadmap
   - 左侧固定展示 3 个代表项目。
   - 右侧开发计划作为辅助信息卡。
3. 文章与记录
   - 前置到工作方式之前。
   - 两张等高文章卡，避免一大一小和右侧空白。
4. 工作方式
   - 降级为轻量说明卡，不再抢主视觉。
5. 技术栈
   - 底部轻量胶囊条，且胶囊可点击到标签聚合页。
6. Footer

### 4.2 Hero 当前规则

关键文件：

- `apps/site/src/pages/index.astro`
- `apps/site/src/pages/en/index.astro`
- `apps/site/src/styles/global.css`

当前 Hero 方向：

- 稳定双卡，不再做复杂融合/雾化过渡。
- 左卡包含：学校年级、Left Jun、游戏客户端 / Gameplay 开发、说明文案、三个 CTA、统计。
- 中文 CTA：查看项目、作品集 PDF、关于我。
- 右卡展示代表项目大图，图像应完整清晰。
- 右图整张可点击进入当前代表项目页。
- 右图左下角有“代表项目 / 项目名 / 箭头”浮层。
- 浮层在桌面显示，移动端隐藏。

用户后续特别指出：

- Hero 左下角项目名卡片的悬浮动画只能在鼠标移动到那块卡片区域时发生。
- 鼠标移动到右图其他区域时不应改变浮层状态。
- 浮层 hover 不要变浅到字看不清。
- 点击浮层或图片要能跳转对应项目页。

当前相关实现：

- `.home-hero__media-link` 包裹图片，指向 `entry.url`。
- `.home-hero__project-link` 是浮层。
- CSS 尾部有覆盖规则，确保整张图 hover 不触发浮层变亮，只有卡片自身 hover/聚焦时触发。
- 移动端 `max-width: 767px` 下隐藏 `.home-hero__project-link`。
- JS 里处理轮播/拖动，轻点图片会跳转当前项目页，拖动切换不跳转。

### 4.3 代表项目区

当前代表项目固定倾向：

- `ashe-lament`
- `emotion-mask`
- `smart-boat`

卡片规则：

- 首页卡片只显示大图、标题、两行简介、最多 3 个标签、一行元信息。
- 卡片比早期略大，间距更紧。
- 不要让 Roadmap 强行拉伸项目卡片导致底部大空白。
- 项目卡片底部要尽量与 Roadmap 底部贴近，但不能靠强行撑高导致内容失衡。

### 4.4 Roadmap / 开发计划

Roadmap 多轮调整后当前规则：

- 右侧与上方 Hero 右图卡右边缘对齐。
- 不 sticky，不随页面滚动保持相对位置。
- 桌面端与代表项目并排。
- 移动端放在代表项目专栏下面，不与项目并排。
- 卡片要紧凑，不抢主视觉。
- 保留“项目 / 项目复盘 / 开发计划”等胶囊入口。
- Roadmap 右侧留白要舒适，不能贴边。

### 4.5 文章区

用户明确要求：下半部分不要回到“内容平铺”的普通博客感。

当前文章区规则：

- 放在工作方式上面。
- 两张等高卡片。
- 如果文章没有图片，不应该给图片保留空白位。
- 避免一张大卡 + 一张横条小块造成右侧大片空白。

### 4.6 工作方式区

当前工作方式区应降级：

- 标题不要像代表项目一样大。
- 四张轻量卡说明：快速原型、游戏系统、叙事策划、软硬件实践。
- 卡片更薄、更像补充说明。
- hover 预览大浮层被弱化/隐藏。

### 4.7 技术栈胶囊

当前技术栈：

- `C# / .NET`
- `Unity`
- `STM32`
- `C / C++`
- `Photoshop`

重要历史：

- 用户要求去除 `Git` 和 `Blender`。
- 技术栈胶囊是可点击链接，跳转对应标签聚合页。
- 标签页展示效果：项目类靠上，文章/记录类在下。

---

## 5. 项目详情页改版记忆

### 5.1 项目详情页目标

项目详情页不是普通博客文章，而是专业 Case Study。当前重点样板是《亚舍拉挽歌》。其他项目先套用新版布局和样式，正文不一定深改。

关键文件：

- `apps/site/src/components/ArticleLayout.astro`
- `apps/site/src/styles/global.css`
- `apps/site/src/content/projects/ashe-lament/index.md`

### 5.2 当前项目详情页结构

项目页大致顺序：

1. 顶部大图。
2. 标题摘要。
3. 标签 / 语言入口。
4. 项目信息卡 / 项目资料下载 / 相关入口。
5. Case Study 正文。
6. 右侧目录栏 / 下载 / 项目信息模块。

用户曾要求：

- 顶部大图不能遮挡标题。
- 项目信息、项目资料不要滚轮，固定完整展示。
- 右侧只有目录列表内部需要滚轮。
- 目录高亮随正文滚动变化。
- 右侧目录有溢出风险时，目录列表自己滚动，显示当前区域。
- 项目页文章宽度要和上面卡片等宽，不能太窄。
- 正文区域不要因为右侧目录视觉右偏。

### 5.3 《亚舍拉挽歌》内容规则

当前文件：`apps/site/src/content/projects/ashe-lament/index.md`

它是重点 Case Study 样板。结构包含：

- 项目简介。
- 世界观与叙事。
- 核心玩法。
- 截图与系统展示。
- 我的职责与贡献。
- 技术实现。
- 挑战与解决。
- 学习收获。
- 相关链接。

最新重要文案修正：

- 项目简介中，玩家扮演的是“根语者”，不是“阈限开拓者”。
- “阈限开拓者”是队名 / 创作旗帜 / 主创身份，不是《亚舍拉挽歌》的玩家角色名。

当前项目简介核心句：

```md
《亚舍拉挽歌》是一款把 2D 平台跳跃与资源管理结合起来的游戏。玩家扮演“根语者”，进入一片被遗忘的地下世界，在有限的地下安全时间内探索、收集灵能、建造捷径，并把资源带回地上，用一次次路线选择推动最终结局。
```

### 5.4 项目页右侧栏最重要规则

这是最近反复调整、用户非常敏感的点。

用户最终明确要求：

- 图一是收起前，图二是收起后。
- 右侧目录栏位置、大小不要动。
- 左侧栏收起后，只是项目主体向左变大。
- 最终效果应当是：项目主体距离右侧栏和左侧栏的宽度，都等于左侧栏收起前它距离右侧栏的宽度。
- 不能让右侧栏变换位置。
- 不能让左侧留白太宽。

当前实现位于 `apps/site/src/styles/global.css` 尾部：

```css
@media (min-width: 1536px) {
  body.sidebar-collapsed.project-detail-page .container.extended {
    --project-collapsed-gap: 32px;
    --project-collapsed-right-sidebar-left: calc(50% + 492px);
    --project-collapsed-right-sidebar-x: calc(50vw + 492px);
    --project-collapsed-article-left: calc(var(--leftjun-sidebar-width) + var(--project-collapsed-gap));
    --project-collapsed-article-right: calc(var(--project-collapsed-right-sidebar-x) - var(--project-collapsed-gap));
    --project-collapsed-article-width: calc(var(--project-collapsed-article-right) - var(--project-collapsed-article-left));
    padding-left: var(--project-collapsed-article-left);
  }

  body.sidebar-collapsed.project-detail-page .site-content-layout.has-right-sidebar {
    grid-template-columns: minmax(0, var(--project-collapsed-article-width));
    justify-content: start;
  }

  body.sidebar-collapsed.project-detail-page main.main,
  body.sidebar-collapsed.project-detail-page .main-article {
    width: 100%;
    max-width: none;
    margin-right: 0;
    margin-left: 0;
  }

  body.sidebar-collapsed.project-detail-page .site-content-layout > .right-sidebar {
    left: var(--project-collapsed-right-sidebar-left);
  }
}
```

解释：

- `--project-collapsed-right-sidebar-left: calc(50% + 492px)`：保持右侧栏沿用收起前定位。
- `--project-collapsed-right-sidebar-x: calc(50vw + 492px)`：用于和 viewport 坐标系统一，计算主体右边界。
- `--project-collapsed-gap: 32px`：主体与左侧栏 / 右侧栏的目标间距。
- 主体左边 = 收起后左侧栏宽度 + 32px。
- 主体右边 = 右侧栏左边 - 32px。
- 主体宽度 = 右边 - 左边。
- 右侧目录栏 `left` 不跟着改变。

维护提醒：

- 不要再改成 `justify-content: center` 居中屏幕，这会导致左侧空白过宽。
- 不要把右侧栏 `left` 改成 `calc(50% + 500px)` 之类跟着主体漂移。
- 不要把项目主体向右扩展；用户要的是向左扩展。

---

## 6. 左侧栏与全站导航

### 6.1 左侧栏身份胶囊

文件：`apps/site/src/components/Sidebar.astro`

当前在 `Left Jun` 下面添加固定中文身份胶囊：

```html
<div class="site-role-pill">阈限开拓者主创</div>
```

样式在：`apps/site/src/styles/global.css`

相关选择器：

- `.site-role-pill`
- `:root[data-scheme="dark"] .site-role-pill`

注意：当前未抽成配置项，也未做多语言版本。后续如需英文站点独立文案，再抽到 `site-config` 或 `siteText`。

### 6.2 左侧栏收起态

当前要求：

- 只在桌面端启用。
- 点击底部“收起”后，左侧栏变窄。
- 收起后保留头像、主菜单图标、语言/主题/展开按钮图标。
- 菜单文字、简介、社交文字等隐藏。
- 图标要居中，不要偏左。
- 收起/展开要有平滑动画，不能硬切。
- 状态写入 `localStorage`，刷新后保持。
- 移动端不启用收起模式，避免和汉堡/移动导航冲突。

关键文件：

- `apps/site/src/components/Sidebar.astro`
- `apps/site/src/styles/global.css`

曾经 bug：

- 收起后图标空白，因为 CSS 泛化隐藏了 `span`，而 `.inline-icon` 也是 `span`。
- 修复方向：只隐藏 `.menu-label`、`.theme-toggle__label`、`.sidebar-collapse-toggle__label` 等文字标签，不隐藏 `.inline-icon`。
- 图标用 `.menu-icon` / `.theme-toggle__icon` 稳定容器，并在收起态 `display:grid; place-items:center`。

### 6.3 全站顶部玻璃导航

文件：

- `apps/site/src/components/SiteTopChrome.astro`
- `apps/site/src/layouts/BaseLayout.astro`
- `apps/site/src/styles/global.css`

当前状态：

- 原首页顶部玻璃导航已升级为全站桌面导航。
- 在 `BaseLayout.astro` 里渲染：

```astro
<SiteTopChrome lang={lang} active={active} />
```

- 顶部导航包含主导航、搜索、主题、GitHub 等入口。
- 当前栏目需要高亮。
- 移动端隐藏顶部导航，避免拥挤。

### 6.4 手机底部导航

文件：`apps/site/src/components/SiteTopChrome.astro`

当前有：

```astro
<nav class="mobile-bottom-nav" aria-label={copy.navLabel}>
```

规则：

- 只在 `max-width: 767px` 显示。
- 固定在底部。
- 玻璃卡片效果。
- 包含：首页、项目、开发计划、文章、关于。
- 页面底部要有安全区 padding，避免内容被底部导航遮挡。

---

## 7. 右侧栏、标签与分类

### 7.1 右侧栏分类/标签胶囊

文件：`apps/site/src/components/RightSidebar.astro`

当前已改为可点击链接：

```astro
{categories.map((term) => <a href={taxonomyTermUrl("categories", term.name, lang)}>{term.name}</a>)}
{tags.map((term) => <a href={taxonomyTermUrl("tags", term.name, lang)}>{term.name}</a>)}
```

依赖：

```js
import { siteText, taxonomyTermUrl } from "../lib/content.js";
```

`taxonomyTermUrl` 在：`apps/site/src/lib/content.js`

规则：

- 中文分类：`/categories/[slug]/`
- 中文标签：`/tags/[slug]/`
- 英文分类：`/en/categories/[slug]/`
- 英文标签：`/en/tags/[slug]/`

样式：

- `.right-sidebar .tagCloud-tags a`
- hover / focus-visible 要保持胶囊视觉。
- 暗色模式文字必须可读。

### 7.2 项目详情页右侧目录

项目页右侧栏包含：

- 目录。
- 项目资料下载。
- 项目信息。

规则：

- 右侧栏外层不要整体滚动挤压项目信息。
- 只有目录 nav 内部需要滚轮：`.widget--toc .toc-nav`。
- 项目信息和项目资料要自然高度完整展示。
- 目录 sticky 顶部与上方大图卡片/页面标准顶部对齐。
- 当前目录高亮随正文变化。
- 溢出时目录列表会自动跟随滚动。

---

## 8. 内容模型与关键内容

### 8.1 内容目录

主要内容位于：`apps/site/src/content`

集合包括：

- `projects`
- `posts`
- `retrospectives`
- `plans`
- `pages`

共享模型：`packages/content-model`

### 8.2 重点项目内容

重点项目：`apps/site/src/content/projects/ashe-lament/index.md`

重点规则：

- 它是第一个深度 Case Study 样板。
- 中文内容已深改。
- 现有素材路径、`projectFacts`、`projectLinks`、`relatedPages` 要保留兼容。
- 不要轻易改内容模型类型。
- 后续其他项目可以逐步照此模板深改。

### 8.3 英文内容

用户当前明确：

- 本轮以中文站点观感为优先。
- 英文内容不深改，只继承共享布局样式。

因此接手者不要为了对齐中文改版而大量重写英文正文，除非用户明确要求。

---

## 9. EdgeOne Pages 部署记忆

### 9.1 重要背景

用户准备部署到 Tencent Cloud EdgeOne Pages，并替换现有 Hugo 配置的 Page。

当前 EdgeOne 控制台截图显示旧配置仍是：

```txt
Framework: Hugo
Root Directory: ./
Output Directory: public
Build Command: hugo
Install Command: 未设置
```

这是错的。当前项目已经是 Astro monorepo，不能继续用 Hugo。

### 9.2 正确 EdgeOne Pages 配置

应改为：

```txt
Framework: Astro
```

如果控制台没有 Astro 选项：

```txt
Framework: Other / 自定义
```

具体参数：

```txt
Root Directory: ./
Install Command: npm ci
Build Command: npm run build:site
Output Directory: apps/site/dist
Node.js Version: 20.x 或 22.x
Production Branch: main
```

用户截图里 Node.js 版本是 `22.11.0`，可以保留。如果部署异常，再换 Node 20。

### 9.3 旧 Hugo 环境变量

EdgeOne 当前可能残留：

- `HUGO_VERSION`
- `HUGO_ENV`
- `HUGO_ENVIRONMENT`

这些对 Astro 不需要。通常不影响，但建议删除，避免以后混淆。

### 9.4 站点域名和 canonical

当前 canonical / sitemap 相关配置固定为 `https://leftjun.com`：

- `apps/site/astro.config.mjs`
- `apps/site/src/data/site-config.json`
- `apps/site/src/pages/robots.txt.js`

如果 EdgeOne 最终绑定主域不是 `leftjun.com`，要同步改这三处。

### 9.5 已有 Vercel 配置

仓库根部有 `vercel.json`：

```json
{
  "framework": "astro",
  "installCommand": "npm ci",
  "buildCommand": "npm run build:site",
  "outputDirectory": "apps/site/dist"
}
```

说明：Vercel 备用部署已经是 Astro 参数。EdgeOne 可照抄同样逻辑。

### 9.6 部署后检查路径

EdgeOne 部署完成后至少打开：

- `/`
- `/projects/ashe-lament/`
- `/projects/emotion-mask/`
- `/tags/unity/`
- `/categories/项目复盘/`
- `/sitemap.xml`
- `/robots.txt`
- 手机预览 `/`
- 手机预览 `/projects/ashe-lament/`

重点检查：

- 首页 Hero 图片清晰完整。
- 首页 Roadmap 不贴边、不 sticky。
- 手机端底部玻璃导航存在且不挡内容。
- 项目页右侧目录位置正常。
- 左侧栏收起后右侧目录栏不动，主体向左扩展。
- 《亚舍拉挽歌》文案显示“根语者”。
- 技术栈胶囊可点击标签页。

---

## 10. 验证命令与当前已知输出

### 10.1 常用命令

在仓库根目录：`C:\Users\MR\Desktop\Hugo\Left_Jun`

开发：

```bash
npm run dev:site
```

检查：

```bash
npm run check:site
```

构建：

```bash
npm run build:site
```

预览：

```bash
npm run preview:site
```

内容模型验证：

```bash
npm run validate:content
```

本地编辑器：

```bash
npm run editor
```

### 10.2 最近验证状态

最近多轮改动后运行过：

```bash
npm run check:site
npm run build:site
```

结果：

- 0 errors。
- Astro check 有既有 implicit any hints，不是本轮新问题。
- 构建成功输出到：`apps/site/dist`
- 构建页数约 77 pages。

### 10.3 既有 warning / hints

`astro check` 当前会提示一些 implicit any hints，例如：

- `src/pages/index.astro` 中 `.map((entry) => ...)`
- `src/pages/en/index.astro` 中 `.map((entry) => ...)`
- 多个 `[slug].astro` 中 `entry` 隐式 any。

当前没有作为阻断项处理。后续如果要清理 TypeScript 质量，可以单独开任务做类型标注。

曾经出现过：

```txt
Duplicate id "ashe-lament/index" found in ... apps/site/src/content/projects/ashe-lament/index.md
```

这个 warning 指向同一个路径，可能是 Astro 内容同步缓存或路径重复扫描问题。后续如果 EdgeOne 日志持续显示，需要单独排查内容集合 glob / 文件重复 / 缓存，不要和视觉改版混在一起处理。

---

## 11. 关键文件索引

### 11.1 页面与布局

- `apps/site/src/pages/index.astro`
  - 中文首页。
  - Hero、代表项目、Roadmap、文章、工作方式、技术栈。
  - Hero 轮播和点击/拖动脚本也在这里。

- `apps/site/src/pages/en/index.astro`
  - 英文首页。
  - 大体复用结构，但文案不深改。

- `apps/site/src/layouts/BaseLayout.astro`
  - 全站基础布局。
  - 引入左侧栏、顶部导航、右侧栏 slot、footer。
  - 当前渲染 `SiteTopChrome`。

- `apps/site/src/components/ArticleLayout.astro`
  - 文章/项目详情页布局。
  - 项目页 `bodyClass` 为 `article-page project-detail-page`。
  - 项目页 Case Study 结构、项目链接、标签等。

### 11.2 导航与侧栏

- `apps/site/src/components/Sidebar.astro`
  - 左侧栏。
  - `阈限开拓者主创` 胶囊。
  - 收起按钮和 `localStorage` 状态。

- `apps/site/src/components/SiteTopChrome.astro`
  - 全站顶部玻璃导航。
  - 手机底部导航也在此组件中。

- `apps/site/src/components/RightSidebar.astro`
  - 右侧栏。
  - 分类/标签胶囊。
  - 项目列表页右侧筛选/索引。

### 11.3 卡片与内容

- `apps/site/src/components/ProjectCard.astro`
  - 项目卡片。
  - 首页 compact 模式很重要。

- `apps/site/src/components/PostCard.astro`
  - 文章卡片。
  - 首页文章等高卡片与“无图不留空”的样式依赖它。

- `apps/site/src/content/projects/ashe-lament/index.md`
  - 重点 Case Study 样板。
  - “根语者”文案在这里。

- `apps/site/src/data/site-config.json`
  - 站点配置和 siteUrl。

- `apps/site/src/lib/content.js`
  - 内容查询、URL、taxonomyTermUrl、siteText 等。

### 11.4 样式

- `apps/site/src/styles/global.css`
  - 几乎所有视觉和响应式都在这里。
  - 重要区域包括：
    - 左侧栏与收起态。
    - 首页 Hero。
    - 首页 Roadmap / 项目卡 / 文章 / 工作方式 / 技术栈。
    - 项目详情页 Case Study。
    - 右侧目录和项目资料卡。
    - 手机底部导航。
    - 末尾多轮覆盖规则。

维护注意：`global.css` 已经很长，且存在多轮覆盖。接手时要尽量先搜索当前最终选择器，避免在上方改了又被尾部覆盖。

---

## 12. 不要做的事 / 高风险回归点

### 12.1 不要恢复 Hugo 配置

EdgeOne 或任何部署平台都不要用：

```txt
hugo
public
Hugo framework preset
```

当前站点是 Astro：

```txt
npm ci
npm run build:site
apps/site/dist
```

### 12.2 不要恢复错误的 sidebar viewport fit

历史里有：

- `ef50ae9 Tune project sidebar viewport fit`
- `299719f Revert "Tune project sidebar viewport fit"`

说明那一轮侧栏高度/viewport fit 方案被撤销过。后续不要无意恢复。

### 12.3 不要移动项目页右侧栏

用户最近明确：收起左侧栏后，右侧目录栏位置和大小不动。只允许项目主体向左变宽。

如果后续要改项目详情页布局，必须先确认这个规则。

### 12.4 不要让 Hero hover 全图触发卡片动画

当前期望：

- 鼠标在右图其他区域：图片可点击，但浮层不变。
- 鼠标在左下项目名卡片：浮层才上浮/变亮。
- 移动端隐藏浮层。

### 12.5 不要让暗色模式吞字

用户多次指出暗色模式会吞掉文字。任何背景变浅/变深都要同步检查文字对比度。

### 12.6 不要给无图文章卡留图片空位

首页文章卡如果没有图片，不要强行保留图片列/空白。

---

## 13. 后续建议任务

这些不是当前必须做，但适合作为下一轮维护方向。

### 13.1 清理 `global.css` 覆盖层

`global.css` 已经过多轮快速迭代，有多处同类选择器反复覆盖。建议后续单独做一次样式整理：

- 把首页、项目详情页、导航、侧栏分区整理。
- 删除已被尾部覆盖的旧规则。
- 避免未来维护者被上方旧规则误导。
- 整理前务必截图/回归，避免视觉漂移。

### 13.2 修 implicit any hints

`astro check` 目前有 22 个 hints，但 0 errors。可以单独处理：

- 给 `getEntries` 返回类型补充 JSDoc 或 TS 类型。
- 给 `.map((entry) => ...)` 标注类型。
- 不建议和视觉改版混做。

### 13.3 排查 duplicate id warning

如果 EdgeOne 构建日志也出现 `Duplicate id "ashe-lament/index"`，建议单独查：

- Astro content collection glob。
- 是否存在同名文件或大小写路径冲突。
- Windows / Git 大小写问题。
- `.astro` 内容缓存。

### 13.4 EdgeOne 部署后截图验收

部署完成后建议保存几张截图作为验收基准：

- 首页桌面首屏。
- 首页滚动到文章/工作方式区域。
- 项目页桌面展开左侧栏。
- 项目页桌面收起左侧栏。
- 首页手机预览。
- 项目页手机预览。

### 13.5 内容继续深改

《亚舍拉挽歌》已作为样板。后续可以按同模板深改：

- `emotion-mask`
- `smart-boat`
- `time-echo`
- `relativity-of-a-dot`

但用户此前明确：不要一次性扩大范围。每个项目建议单独任务处理。

---

## 14. 快速恢复 / 回滚参考

如果某一轮视觉改坏，可以参考提交：

- 当前最新：`0d33982 Keep project sidebar fixed on collapse`
- 如果只想回到“根语者文案修正 + 收起间距上一版”：`7842c92`
- 如果只想回到“右侧标签可点击 + Hero 点击修复”：`bf5fe4b`
- 如果想回到“首页下半部分精修 + 技术栈标签”：`913f0f7`
- 如果想回到“全站导航 + 手机底栏”：`4279bd3`
- 如果想回到“Hero 双卡图三方向”：`db11c5b`
- 如果想回到“首页图二版结构”：`73b4f88`
- 旧 Hugo/Astro 切换前备份分支点：`backup/hugo-before-astro-cutover-2026-05-28` / `b2acbc5`

注意：不要随意硬回滚公共分支。若要回滚，最好新建分支或用 revert 提交，避免破坏已部署状态。

---

## 15. 交接者上手 checklist

接手第一步建议：

1. 进入仓库：

```bash
cd C:\Users\MR\Desktop\Hugo\Left_Jun
```

2. 确认状态：

```bash
git status -sb
git log --oneline -5
```

3. 安装依赖（如首次接手）：

```bash
npm ci
```

4. 本地开发：

```bash
npm run dev:site
```

5. 提交前验证：

```bash
npm run check:site
npm run build:site
```

6. 重点手工检查：

- `/`
- `/projects/ashe-lament/`
- `/projects/emotion-mask/`
- `/posts/`
- `/tags/unity/`
- 手机尺寸首页。
- 手机尺寸项目页。
- 左侧栏展开/收起。
- 暗色模式。

7. EdgeOne 配置确认：

```txt
Root Directory: ./
Install Command: npm ci
Build Command: npm run build:site
Output Directory: apps/site/dist
Framework: Astro 或 Other
Node.js: 20.x / 22.x
Production Branch: main
```

---

## 16. 一句话总括

当前仓库是一个已从旧 Hugo 方向切到 Astro monorepo 的 Left Jun 游戏作品集站；视觉已经围绕 Apple-like 首页、专业项目 Case Study、全站玻璃导航、手机底部导航、可收起左侧栏、固定右侧目录栏完成多轮精修。后续最重要的是：部署时别再用 Hugo；改项目页时别让右侧目录栏漂移；改首页时保持低信息密度和卡片对齐；所有改动后跑 `npm run check:site` 和 `npm run build:site`。
