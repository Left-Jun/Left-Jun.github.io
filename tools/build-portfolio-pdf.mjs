import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const buildDir = path.join(root, ".portfolio-build");
const outputPdf = path.join(root, "static", "files", "left-jun-portfolio.pdf");
const outputHtml = path.join(buildDir, "left-jun-portfolio.html");
const previewPng = path.join(buildDir, "left-jun-portfolio-preview.png");
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const projectPath = (slug, file) => path.join(root, "content", "projects", slug, file);
const img = (slug, file) => pathToFileURL(projectPath(slug, file)).href;

const profile = {
  name: "左涵俊",
  alias: "Left Jun / Limenaut",
  school: "四川大学 · 电子信息类本科 · 2029 年 7 月毕业",
  direction: "Unity 游戏原型、玩法系统实现、叙事交互、STM32 软硬件结合项目",
  email: ["Zuo051607@163.com", "Limenaut0@gmail.com"],
  contact: ["QQ 1508017864", "微信 Zuo18481428798"],
  links: [
    ["GitHub", "https://github.com/Left-Jun"],
    ["YouTube", "https://www.youtube.com/@Limenaut"],
    ["B站", "https://space.bilibili.com/498452594"],
    ["小红书", "https://www.xiaohongshu.com/user/profile/608d850d000000000100987d"],
  ],
};

const featured = [
  {
    title: "亚舍拉挽歌",
    subtitle: "72 小时团队游戏 · 腾讯高校游戏极限开发大赛",
    role: "队长 / 主程 / 玩法策划 / 音乐制作",
    tools: "Unity / C#",
    image: img("ashe-lament", "cover.png"),
    tags: ["资源管理", "平台跳跃", "多结局", "团队推进"],
    summary:
      "围绕生命之树枯萎的世界，设计地下收集与地上攀登的双循环，把灵能做成生命、时间压力与结局评价共用的核心资源。",
    highlights: [
      "完成角色移动、跳跃、冲刺、贴墙、复活与双形态切换等基础系统。",
      "设计灵能流失、遗骨收集、捷径建造和多结局结算，让资源管理直接影响叙事收束。",
      "担任队长推进 72 小时内的程序、美术、文案、音乐和版本整合。",
    ],
  },
  {
    title: "智能风动船模无线遥控系统",
    subtitle: "软硬件结合项目 · 进入决赛阶段",
    role: "队长 / 主程 / 硬件设计",
    tools: "STM32F103C8T6 / HAL / nRF24L01 / 嘉立创 EDA",
    image: img("smart-boat", "cover.png"),
    tags: ["STM32", "PCB", "无线通信", "调试"],
    summary:
      "完成遥控器与船载接收器的无线控制链路，覆盖 ADC 采样、SPI 通信、PWM 映射、PCB 绘制、焊接和整机联调。",
    highlights: [
      "用 STM32 HAL 完成 ADC、SPI、PWM 和状态指示灯等底层驱动。",
      "设计接收端原理图和 PCB，处理 3.3V 稳压、滤波、晶振、通信模块与外部接口。",
      "通过软件滤波和电源优化降低摇杆抖动与纹波影响，完成可下水运行版本。",
    ],
  },
  {
    title: "Emotion Mask",
    subtitle: "Global Game Jam 2026 · 单人 48 小时作品",
    role: "独立开发 / 策划 / 程序 / 像素美术 / 音乐",
    tools: "Unity / C#",
    image: img("emotion-mask", "cover.png"),
    tags: ["状态切换", "平台解谜", "TapTap 上架", "9.4 评分"],
    summary:
      "以 Mask 主题展开，玩家切换平静、快乐、愤怒三种面具状态，用不同能力观察道路、跨越障碍和破坏阻挡。",
    highlights: [
      "独立完成策划、程序、像素美术、音频整合、关卡流程和发布整理。",
      "将情绪状态绑定到移动参数、平台显示、障碍处理和场景反馈。",
      "上架 TapTap 并同步提交 Global Game Jam 项目页，完成从原型到公开展示的闭环。",
    ],
  },
];

const secondary = [
  {
    title: "时瞳回响",
    subtitle: "7 天团队叙事解谜 Game Jam",
    role: "队长 / 策划 / 文案 / 玩法设计",
    tools: "Godot / AI 辅助场景生成",
    image: img("time-echo", "cover.png"),
    text:
      "围绕古代、现代、未来三重时间线，设计音乐、记忆与时间回响的叙事解谜结构。负责世界观、三幕式流程、对话文案、美术需求拆解与团队推进。",
  },
  {
    title: "Relativity of a Dot",
    subtitle: "6 小时维度切换创意原型",
    role: "单人开发 / 创意 Demo",
    tools: "Unity / C# / Cinemachine",
    image: img("relativity-of-a-dot", "cover.png"),
    text:
      "验证同一关卡在二维投影与三维空间规则下产生不同解法的可能性。完成相机切换、移动规则切换、碰撞体切换和空间解谜闭环。",
  },
];

const skills = [
  ["游戏开发", "Unity / C#、角色控制、跳跃/冲刺/贴墙、状态机、资源系统、检查点、结算与多结局。"],
  ["玩法策划", "从主题拆解核心机制、关卡流程、叙事结构和可执行素材需求，适合限时原型开发。"],
  ["叙事交互", "把世界观、道具、UI 提示和系统压力合并，让玩家在机制中理解故事。"],
  ["嵌入式", "STM32F103C8T6、HAL、SPI、ADC、PWM、nRF24L01、PCB 绘制、焊接与联调。"],
  ["团队推进", "多次担任队长，负责拆任务、推进例会、整合版本、控制范围和保证可运行交付。"],
  ["工具链", "Git、Visual Studio、VS Code、Keil、STM32CubeIDE、嘉立创 EDA、Hugo、AI 辅助开发。"],
];

const pages = [];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function chipList(items) {
  return `<div class="chips">${items.map((item) => `<span>${esc(item)}</span>`).join("")}</div>`;
}

function page(inner, className = "") {
  pages.push(`<section class="page ${className}">${inner}<div class="folio">${pages.length + 1}</div></section>`);
}

function imageCard(src, caption = "") {
  return `<figure class="image-card"><img src="${src}" alt=""><figcaption>${esc(caption)}</figcaption></figure>`;
}

page(`
  <div class="cover-grid">
    <div class="cover-copy">
      <p class="eyebrow">Portfolio 2026</p>
      <h1>左涵俊作品集</h1>
      <p class="cover-sub">Game Systems · Interactive Prototypes · Embedded Practice</p>
      <div class="cover-meta">
        <span>${esc(profile.school)}</span>
        <span>${esc(profile.direction)}</span>
      </div>
    </div>
    <div class="cover-art">
      <img class="main-art" src="${featured[0].image}" alt="">
      <div class="mini-row">
        <img src="${featured[1].image}" alt="">
        <img src="${featured[2].image}" alt="">
      </div>
    </div>
  </div>
`, "cover");

page(`
  <div class="section-title">
    <p class="eyebrow">Profile</p>
    <h2>我是谁，以及现在最值得看的方向</h2>
  </div>
  <div class="profile-layout">
    <div class="profile-main">
      <h3>${esc(profile.name)} <span>${esc(profile.alias)}</span></h3>
      <p>我目前就读于四川大学电子信息类本科，主要做游戏原型、互动系统、玩法系统实现和软硬件结合项目。作品集重点展示我在短周期项目里把想法落成可运行版本的能力：从机制验证、系统实现、内容整合，到团队推进和公开发布。</p>
      <p>我更关注“机制是否真的能被玩出来”：角色控制是否顺手、状态切换是否带来决策、叙事是否能落到关卡和系统里，以及工程结构是否足够清晰，能在有限时间内继续迭代。</p>
      <div class="quick-facts">
        <div><strong>方向</strong><span>游戏系统 / 玩法原型 / 嵌入式实践</span></div>
        <div><strong>毕业</strong><span>2029 年 7 月</span></div>
        <div><strong>主力工具</strong><span>Unity、C#、STM32、Hugo</span></div>
      </div>
    </div>
    <div class="profile-side">
      <h4>代表项目顺序</h4>
      <ol>
        <li>亚舍拉挽歌</li>
        <li>智能风动船模无线遥控系统</li>
        <li>Emotion Mask</li>
      </ol>
      <h4>联系</h4>
      <p>${profile.email.map(esc).join("<br>")}</p>
      <p>${profile.contact.map(esc).join("<br>")}</p>
    </div>
  </div>
`, "profile");

page(`
  <div class="section-title">
    <p class="eyebrow">Representative Works</p>
    <h2>三个最能代表当前能力面的项目</h2>
  </div>
  <div class="featured-three">
    ${featured
      .map(
        (item, index) => `
      <article>
        <div class="rank">0${index + 1}</div>
        <img src="${item.image}" alt="">
        <h3>${esc(item.title)}</h3>
        <p class="muted">${esc(item.subtitle)}</p>
        ${chipList(item.tags)}
        <p>${esc(item.summary)}</p>
      </article>
    `,
      )
      .join("")}
  </div>
`, "works");

page(`
  <div class="project-header">
    <div>
      <p class="eyebrow">Game / Team Lead / Main Programmer</p>
      <h2>${esc(featured[0].title)}</h2>
      <p>${esc(featured[0].summary)}</p>
      ${chipList(featured[0].tags)}
    </div>
    <div class="fact-box">
      <p><strong>时间</strong>2026.3 · 72h</p>
      <p><strong>角色</strong>${esc(featured[0].role)}</p>
      <p><strong>工具</strong>${esc(featured[0].tools)}</p>
    </div>
  </div>
  <div class="two-col">
    <div>
      <h3>我完成的关键工作</h3>
      <ul>${featured[0].highlights.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <h3>设计重点</h3>
      <p>项目把灵能设计成生命、行动能量和结局评价资源，让玩家每一次探索、返回、攀登、建造捷径都会影响最终叙事。玩法压力和世界观衰亡主题因此被压在同一套规则上。</p>
    </div>
    <div class="image-grid two">
      ${imageCard(img("ashe-lament", "screenshot-notice-board.png"), "告示板：资源、加时器、捷径与强化状态")}
      ${imageCard(img("ashe-lament", "screenshot-dialogue.png"), "对话框：栖枝与母树意识残响")}
    </div>
  </div>
`, "project-page");

page(`
  <div class="section-title compact">
    <p class="eyebrow">Asherah System Details</p>
    <h2>亚舍拉挽歌：资源循环与结果反馈</h2>
  </div>
  <div class="image-grid four">
    ${imageCard(img("ashe-lament", "screenshot-underground.png"), "地下收集：时间压力与强化风险")}
    ${imageCard(img("ashe-lament", "screenshot-shortcut.png"), "地上攀登：资源换捷径")}
    ${imageCard(img("ashe-lament", "screenshot-ending.png"), "结局：按资源管理结果结算")}
    ${imageCard(img("ashe-lament", "screenshot-epilogue.png"), "尾声：回应循环、牺牲与再生主题")}
  </div>
  <div class="note-band">
    <strong>结构收获：</strong>在 72 小时限制内，我把移动、形态、资源、场景切换、对话、结局拆成可并行整合的模块，让团队能够先保证闭环，再补表现和叙事密度。
  </div>
`, "gallery-page");

page(`
  <div class="project-header">
    <div>
      <p class="eyebrow">Embedded / Team Lead / Hardware</p>
      <h2>${esc(featured[1].title)}</h2>
      <p>${esc(featured[1].summary)}</p>
      ${chipList(featured[1].tags)}
    </div>
    <div class="fact-box">
      <p><strong>时间</strong>2026.3</p>
      <p><strong>角色</strong>${esc(featured[1].role)}</p>
      <p><strong>工具</strong>${esc(featured[1].tools)}</p>
    </div>
  </div>
  <div class="two-col embedded">
    <div>
      <h3>工程链路</h3>
      <ul>${featured[1].highlights.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <h3>可展示能力</h3>
      <p>这个项目能补足纯游戏作品里不容易体现的工程面：硬件原理图、外设配置、无线通信、输入采样、执行机构映射和现场调试。</p>
    </div>
    <div class="image-grid three">
      ${imageCard(img("smart-boat", "screenshot-stm32-pinout.png"), "STM32CubeMX 引脚配置")}
      ${imageCard(img("smart-boat", "screenshot-schematic.png"), "接收端原理图")}
      ${imageCard(img("smart-boat", "screenshot-code.png"), "ADC / PWM / nRF24L01 代码调试")}
    </div>
  </div>
`, "project-page");

page(`
  <div class="project-header">
    <div>
      <p class="eyebrow">Game Jam / Solo Developer</p>
      <h2>${esc(featured[2].title)}</h2>
      <p>${esc(featured[2].summary)}</p>
      ${chipList(featured[2].tags)}
    </div>
    <div class="fact-box">
      <p><strong>时间</strong>2026.1 · 48h</p>
      <p><strong>角色</strong>${esc(featured[2].role)}</p>
      <p><strong>工具</strong>${esc(featured[2].tools)}</p>
    </div>
  </div>
  <div class="two-col">
    <div>
      <h3>机制表达</h3>
      <p>三种面具不是简单数值增益：平静负责观察隐藏平台，快乐带来更强机动性，愤怒负责破坏和突破。玩家需要在不同情绪之间切换，才能读懂关卡。</p>
      <h3>我完成的关键工作</h3>
      <ul>${featured[2].highlights.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    </div>
    <div class="image-grid four small-cards">
      ${imageCard(img("emotion-mask", "screenshot-neutral-platform.png"), "平静：隐藏平台可见")}
      ${imageCard(img("emotion-mask", "screenshot-happy-platform.png"), "快乐：同位置平台不可见")}
      ${imageCard(img("emotion-mask", "screenshot-level.png"), "关卡：尖刺、墙面、移动平台")}
      ${imageCard(img("emotion-mask", "screenshot-mask-tutorial.png"), "教学：三种面具能力")}
    </div>
  </div>
`, "project-page");

page(`
  <div class="section-title">
    <p class="eyebrow">Additional Works</p>
    <h2>补充项目：叙事策划与快速原型能力</h2>
  </div>
  <div class="secondary-grid">
    ${secondary
      .map(
        (item) => `
      <article>
        <img src="${item.image}" alt="">
        <div>
          <h3>${esc(item.title)}</h3>
          <p class="muted">${esc(item.subtitle)}</p>
          <p><strong>角色：</strong>${esc(item.role)}</p>
          <p><strong>工具：</strong>${esc(item.tools)}</p>
          <p>${esc(item.text)}</p>
        </div>
      </article>
    `,
      )
      .join("")}
  </div>
  <div class="image-strip">
    <img src="${img("time-echo", "screenshot-ancient-dialogue.png")}" alt="">
    <img src="${img("relativity-of-a-dot", "screenshot-3d-view.png")}" alt="">
    <img src="${img("time-echo", "screenshot-future-platforming.png")}" alt="">
  </div>
`, "additional");

page(`
  <div class="section-title">
    <p class="eyebrow">Skills & Contact</p>
    <h2>我能稳定交付的部分</h2>
  </div>
  <div class="skill-grid">
    ${skills
      .map(
        ([name, text]) => `
      <article>
        <h3>${esc(name)}</h3>
        <p>${esc(text)}</p>
      </article>
    `,
      )
      .join("")}
  </div>
  <div class="contact-band">
    <div>
      <h3>联系我</h3>
      <p>${profile.email.map(esc).join(" · ")}<br>${profile.contact.map(esc).join(" · ")}</p>
    </div>
    <div>
      <h3>主页</h3>
      <p>${profile.links.map(([name, url]) => `${esc(name)}：${esc(url)}`).join("<br>")}</p>
    </div>
  </div>
`, "skills");

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>左涵俊作品集</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #e8ebef;
    color: #172033;
    font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", Arial, sans-serif;
    line-height: 1.55;
  }
  .page {
    position: relative;
    width: 297mm;
    height: 210mm;
    padding: 15mm 16mm;
    overflow: hidden;
    background: #f7f4ee;
    page-break-after: always;
  }
  .page::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-top: 7mm solid #0c546d;
  }
  .folio {
    position: absolute;
    right: 12mm;
    bottom: 8mm;
    color: #8b929d;
    font-size: 9pt;
  }
  h1, h2, h3, h4, p { margin-top: 0; }
  h1 { font-size: 42pt; line-height: 1; margin-bottom: 7mm; letter-spacing: 0; }
  h2 { font-size: 25pt; line-height: 1.12; margin-bottom: 7mm; letter-spacing: 0; }
  h3 { font-size: 14pt; margin-bottom: 3mm; letter-spacing: 0; }
  h4 { font-size: 11pt; margin: 6mm 0 2mm; }
  p, li { font-size: 10.5pt; }
  ul { margin: 0; padding-left: 5mm; }
  li { margin-bottom: 2mm; }
  img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .eyebrow {
    margin-bottom: 3mm;
    color: #c94a3d;
    font-size: 9pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .9pt;
  }
  .muted { color: #626b77; }
  .chips { display: flex; flex-wrap: wrap; gap: 2mm; margin: 4mm 0; }
  .chips span {
    display: inline-flex;
    align-items: center;
    min-height: 7mm;
    padding: 1.3mm 3mm;
    border: 1px solid #cfd5d9;
    border-radius: 999px;
    background: #fffdf8;
    color: #243244;
    font-size: 8.8pt;
    font-weight: 700;
  }
  .cover {
    color: #fff;
    background: #123449;
  }
  .cover::before { border-color: #ffcb59; opacity: .95; }
  .cover-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: .95fr 1.15fr;
    gap: 12mm;
    height: 100%;
    align-items: center;
  }
  .cover-copy { padding-top: 8mm; }
  .cover-sub {
    color: #f3d99a;
    font-size: 18pt;
    font-weight: 800;
    margin-bottom: 11mm;
  }
  .cover-meta {
    display: grid;
    gap: 4mm;
    color: #d9e4e8;
    font-size: 11pt;
  }
  .cover-art {
    display: grid;
    grid-template-rows: 1fr 36mm;
    gap: 4mm;
    height: 158mm;
  }
  .main-art, .cover-art .mini-row img, .featured-three img, .secondary-grid img, .image-card img {
    border-radius: 5mm;
    box-shadow: 0 8px 26px rgba(9, 26, 39, .22);
  }
  .mini-row { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
  .profile-layout {
    display: grid;
    grid-template-columns: 1.45fr .72fr;
    gap: 12mm;
  }
  .profile-main h3 {
    font-size: 20pt;
  }
  .profile-main h3 span {
    color: #69747f;
    font-size: 13pt;
    font-weight: 600;
  }
  .quick-facts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4mm;
    margin-top: 9mm;
  }
  .quick-facts div, .profile-side, .fact-box, .note-band, .skill-grid article {
    border: 1px solid #dde0df;
    border-radius: 5mm;
    background: #fffdf8;
    padding: 5mm;
  }
  .quick-facts strong, .quick-facts span { display: block; }
  .quick-facts strong { margin-bottom: 1mm; color: #c94a3d; }
  .profile-side ol { margin: 0; padding-left: 6mm; }
  .profile-side li { font-weight: 800; }
  .featured-three {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6mm;
  }
  .featured-three article {
    position: relative;
    min-height: 138mm;
    padding: 4.5mm;
    border: 1px solid #dde0df;
    border-radius: 6mm;
    background: #fffdf8;
  }
  .featured-three img { height: 51mm; margin-bottom: 4mm; }
  .rank {
    position: absolute;
    top: 6mm;
    left: 6mm;
    width: 13mm;
    height: 13mm;
    display: grid;
    place-items: center;
    border-radius: 999px;
    background: #102236;
    color: #fff;
    font-weight: 900;
    font-size: 10pt;
  }
  .project-header {
    display: grid;
    grid-template-columns: 1fr .56fr;
    gap: 10mm;
    align-items: start;
    margin-bottom: 7mm;
  }
  .project-header h2 { margin-bottom: 4mm; }
  .fact-box p {
    display: grid;
    grid-template-columns: 19mm 1fr;
    gap: 2mm;
    margin-bottom: 2.5mm;
    font-size: 9.7pt;
  }
  .fact-box strong { color: #c94a3d; }
  .two-col {
    display: grid;
    grid-template-columns: .9fr 1.15fr;
    gap: 8mm;
  }
  .two-col.embedded { grid-template-columns: .8fr 1.22fr; }
  .image-grid { display: grid; gap: 4mm; }
  .image-grid.two { grid-template-columns: 1fr 1fr; }
  .image-grid.three { grid-template-columns: repeat(3, 1fr); }
  .image-grid.four { grid-template-columns: repeat(4, 1fr); }
  .image-card {
    margin: 0;
    border-radius: 5mm;
  }
  .image-card img { height: 73mm; object-fit: cover; }
  .image-grid.three .image-card img { height: 73mm; object-fit: contain; background: #fff; }
  .image-grid.four .image-card img { height: 88mm; }
  .small-cards .image-card img { height: 58mm; }
  figcaption {
    padding-top: 2mm;
    color: #5d6570;
    font-size: 8.5pt;
  }
  .gallery-page .image-grid.four .image-card img { height: 108mm; }
  .note-band {
    margin-top: 8mm;
    font-size: 11pt;
  }
  .secondary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 7mm;
  }
  .secondary-grid article {
    display: grid;
    grid-template-columns: .9fr 1fr;
    gap: 5mm;
    padding: 4.5mm;
    border: 1px solid #dde0df;
    border-radius: 6mm;
    background: #fffdf8;
  }
  .secondary-grid img { height: 69mm; }
  .image-strip {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 4mm;
    margin-top: 7mm;
    height: 42mm;
  }
  .image-strip img { border-radius: 4mm; }
  .skill-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5mm;
  }
  .skill-grid article { min-height: 38mm; }
  .skill-grid h3 { color: #0c546d; }
  .contact-band {
    display: grid;
    grid-template-columns: .9fr 1.3fr;
    gap: 6mm;
    margin-top: 7mm;
    padding: 6mm;
    border-radius: 6mm;
    background: #102236;
    color: #fff;
  }
  .contact-band p { color: #e1e9ef; }
</style>
</head>
<body>
${pages.join("\n")}
</body>
</html>`;

await fs.mkdir(buildDir, { recursive: true });
await fs.mkdir(path.dirname(outputPdf), { recursive: true });
await fs.writeFile(outputHtml, html, "utf8");

const browser = await chromium.launch({
  headless: true,
  executablePath: edgePath,
});
const pageRef = await browser.newPage({ viewport: { width: 1684, height: 1190 }, deviceScaleFactor: 1 });
await pageRef.goto(pathToFileURL(outputHtml).href, { waitUntil: "networkidle" });
await pageRef.pdf({
  path: outputPdf,
  printBackground: true,
  preferCSSPageSize: true,
});
await pageRef.screenshot({
  path: previewPng,
  fullPage: false,
});
await browser.close();

const stat = await fs.stat(outputPdf);
console.log(JSON.stringify({
  pdf: outputPdf,
  html: outputHtml,
  preview: previewPng,
  bytes: stat.size,
  pages: pages.length,
}, null, 2));
