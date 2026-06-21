import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";

const require = createRequire(import.meta.url);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const buildDir = path.join(root, ".portfolio-build");
const projectAssetRoot = path.join(root, "apps", "site", "public", "content-assets", "projects");
const outputPdf = path.join(root, "apps", "site", "public", "files", "left-jun-portfolio.pdf");
const outputHtml = path.join(buildDir, "left-jun-portfolio.html");
const previewPng = path.join(buildDir, "left-jun-portfolio-preview.png");
const pdfAssetDir = path.join(buildDir, "pdf-assets");
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

function runWithInput(command, args, input) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    child.stderr.on("data", (chunk) => (stderr += chunk.toString()));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${command} exited with ${code}\n${stdout}\n${stderr}`));
    });
    child.stdin.end(input);
  });
}

async function prepareOptimizedPdfImages() {
  const pythonCandidates = [
    process.env.PYTHON,
    path.join(
      process.env.USERPROFILE || "",
      ".cache",
      "codex-runtimes",
      "codex-primary-runtime",
      "dependencies",
      "python",
      "python.exe",
    ),
    "python",
  ].filter(Boolean);

  const script = `
import pathlib
import sys
from PIL import Image

src_root = pathlib.Path(sys.argv[1])
out_root = pathlib.Path(sys.argv[2])
out_root.mkdir(parents=True, exist_ok=True)
for src in src_root.rglob("*"):
    if src.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
        continue
    rel = src.relative_to(src_root).with_suffix(".jpg")
    out = out_root / rel
    out.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as im:
        im.thumbnail((1500, 1000), Image.Resampling.LANCZOS)
        if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
            rgba = im.convert("RGBA")
            bg = Image.new("RGB", rgba.size, (246, 248, 250))
            bg.paste(rgba, mask=rgba.split()[-1])
            im = bg
        else:
            im = im.convert("RGB")
        im.save(out, "JPEG", quality=84, optimize=True, progressive=True)
`;

  for (const python of pythonCandidates) {
    try {
      await fs.mkdir(pdfAssetDir, { recursive: true });
      await runWithInput(python, ["-", projectAssetRoot, path.join(pdfAssetDir, "projects")], script);
      return true;
    } catch {
      // Try the next Python runtime, then fall back to original images.
    }
  }

  return false;
}

await prepareOptimizedPdfImages();

const originalProjectPath = (slug, file) => path.join(projectAssetRoot, slug, file);
const projectPath = (slug, file) => {
  const optimized = path.join(pdfAssetDir, "projects", slug, file.replace(/\.[^.]+$/, ".jpg"));
  return fsSync.existsSync(optimized) ? optimized : originalProjectPath(slug, file);
};
const img = (slug, file) => pathToFileURL(projectPath(slug, file)).href;

const profile = {
  name: "左涵俊",
  alias: "Left Jun / Limenaut",
  school: "四川大学 · 电子信息类本科 · 2029 年 6 月毕业",
  direction: "游戏客户端 / Gameplay 系统 / UE5 与 Unity 原型 / Web 与 STM32 实践",
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
    systems: [
      "PlayerMove / PlayerJump / PlayerDash：平台跳跃基础操作、移动参数与冲刺反馈。",
      "GroundCheck / WallCheck / Respawn：落地、贴墙、死亡与检查点复活。",
      "MaskControl / EnergyManager / EnergyDrainController：普通/强化状态与灵能流逝。",
      "SafetyTimer / ShortcutBuilder / EndingManager：地下安全时间、捷径建造与结局阈值。",
      "SimpleDialogue / UIManager / MusicManager：对话、UI 反馈、音乐与场景表现联动。",
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
    systems: [
      "ADC1 / ADC2：读取摇杆输入并做范围限制、死区与比例映射。",
      "SPI1 + nRF24L01：遥控端打包舵机角度与油门数据，接收端解析执行。",
      "PWM：将输入映射到舵机和动力输出，形成遥控器到船端执行机构链路。",
      "电源与通信硬件：AMS1117-3.3 稳压、滤波电容、晶振、状态 LED 与外部接口。",
      "调试策略：用状态灯、串口与逐项外设验证排查供电、抖动和通信问题。",
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
    systems: [
      "PlayerMove / PlayerJump / PlayerDash：移动、长短跳、二段跳、冲刺与贴墙判定。",
      "MaskControl / MaskAnimator：平静、快乐、愤怒三种状态的能力与表现切换。",
      "EmotionalPlatform / TrapCheck：按状态控制平台显示、陷阱判定和关卡路径变化。",
      "CheckPoint / Respawn / GameTimer：死亡复活、流程推进、计时与结算统计。",
      "MusicManager：不同面具状态下的背景、音乐与操作反馈联动。",
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
    systems: [
      "Godot 场景组织：按古代、现代、未来拆分场景层级，保持同一地点在三个时代中的对应关系。",
      "角色与平台规则：拆解移动、蹬墙跳、翻滚、条件二段跳、交互触发和时间切换需求。",
      "交互道具：时间门、乐器、NPC 对话、可改变过去并影响现在的场景状态。",
      "团队协作：把策划案拆成程序任务、美术分层素材、对白文本和每日可验收版本。",
    ],
    gallery: [
      [img("time-echo", "screenshot-ancient-dialogue.png"), "古代乐师与竹笛：音乐作为敬畏"],
      [img("time-echo", "screenshot-modern-scene.png"), "现代公园与吉他：时间门和怀念乐章"],
      [img("time-echo", "screenshot-future-platforming.png"), "未来高塔：冷色空间与机器人核心"],
    ],
  },
  {
    title: "Relativity of a Dot",
    subtitle: "6 小时维度切换创意原型",
    role: "单人开发 / 创意 Demo",
    tools: "Unity / C# / Cinemachine",
    image: img("relativity-of-a-dot", "cover.png"),
    text:
      "验证同一关卡在二维投影与三维空间规则下产生不同解法的可能性。完成相机切换、移动规则切换、碰撞体切换和空间解谜闭环。",
    systems: [
      "DimensionManager：统一维护 2D / 3D 状态，并切换 Cinemachine 相机优先级。",
      "PlayerMove：根据维度状态切换移动轴，二维限制单轴，三维开放平面移动。",
      "GroundCheck2D / GroundCheck3D：分别处理两种空间规则下的落地检测。",
      "DimensionObject：按当前维度启用不同碰撞体，并在二维状态下修正玩家投影位置。",
      "流程联动：Tab 输入触发维度、相机、玩家控制、碰撞规则和关卡解法同步变化。",
    ],
    gallery: [
      [img("relativity-of-a-dot", "screenshot-2d-view.png"), "二维投影视角：规则更接近传统平台关卡"],
      [img("relativity-of-a-dot", "screenshot-3d-view.png"), "三维视角：空间深度改变路径理解"],
    ],
  },
];

const skills = [
  ["Unity / C#", "游戏客户端、角色控制、跳跃/冲刺/贴墙、状态机、资源系统、检查点、结算、多结局、UI 与音频反馈。"],
  ["工程拆分", "按玩家控制、状态资源、关卡交互、UI 对话、场景表现、结局流程拆模块，保持短周期可维护。"],
  ["Godot 原型", "做过叙事解谜项目的场景组织、交互道具拆解、时间线切换需求设计和流程调试。"],
  ["STM32 / HAL", "ADC、SPI、PWM、USART、GPIO、nRF24L01，无线遥控链路与船端执行机构控制。"],
  ["硬件实践", "嘉立创 EDA 原理图/PCB、稳压滤波、晶振、接口、焊接、供电与通信问题排查。"],
  ["发布与协作", "Git、Visual Studio、VS Code、Keil、STM32CubeIDE、TapTap/GGJ 发布、Astro 静态作品集维护。"],
];

const techStack = [
  {
    title: "游戏程序",
    items: [
      "角色控制：移动、长短跳、二段跳、冲刺、贴墙、受伤、死亡、复活。",
      "状态系统：面具/强化状态、参数切换、能力开关、场景反馈和音乐联动。",
      "关卡交互：移动平台、陷阱、隐藏平台、检查点、资源收集、道具与触发器。",
      "流程系统：开始/暂停、计时、结算、多结局阈值、对话和 UI 反馈。",
    ],
  },
  {
    title: "嵌入式与硬件",
    items: [
      "STM32F103C8T6 + HAL，外设包含 ADC、SPI、PWM、USART、GPIO。",
      "nRF24L01 无线通信，遥控器端打包发送舵机角度与油门数据。",
      "PCB 原理图与布局，处理稳压、滤波、晶振、外部接口和状态 LED。",
      "调试中使用死区、范围限制、软件滤波和状态反馈定位抖动/供电/通信问题。",
    ],
  },
  {
    title: "项目组织",
    items: [
      "能把 Game Jam 创意拆成核心闭环、可验收模块和后续表现增强。",
      "多次担任队长，负责功能拆解、版本整合、每日推进和交付范围控制。",
      "将策划文本转译为程序任务、美术素材清单、交互节点和测试路径。",
      "维护 Astro 双语静态作品集，并能将项目内容整理成网页与 PDF 展示材料。",
    ],
  },
];

const systemIndex = [
  {
    title: "Emotion Mask",
    accent: "#2b82d8",
    flow: "输入：移动 / 跳跃 / 冲刺 / 面具切换 → 状态：MaskControl 维护平静、快乐、愤怒 → 输出：隐藏平台、破坏物、音乐、死亡复活、碎片结算。",
    modules: [
      "MaskControl / EmotionStats：情绪状态与角色参数中心。",
      "PlayerMove / PlayerJump / PlayerDash：把状态变化落到手感。",
      "EmotionalPlatform / Hurtcheck：把状态变化落到关卡读法。",
      "GameManager / GameTimer：收束碎片、计时和胜利流程。",
    ],
  },
  {
    title: "亚舍拉挽歌",
    accent: "#2b82d8",
    flow: "输入：玩家动作 / 区域高度 / 资源触发器 → 状态：灵能、遗骨、地下安全时间、普通/强化形态 → 输出：UI、捷径、死亡复活、多结局。",
    modules: [
      "EnergyManager：统一维护灵能与遗骨，驱动 UI 和结局。",
      "EnergyDrainController / SafetyTimer：处理地下压力和形态消耗。",
      "ShortcutBuilder：把收集资源转换为路线优势。",
      "EndingManager：用灵能阈值完成低/中/高结局判断。",
    ],
  },
  {
    title: "智能船模",
    accent: "#149f96",
    flow: "输入：ADC 摇杆采样 → 通信：3 字节无线包经 nRF24L01 / SPI 发送 → 输出：接收端解析后映射 50Hz PWM，驱动舵机与电调。",
    modules: [
      "ADC + 死区/限幅：降低摇杆抖动对控制的影响。",
      "nRF24L01 + SPI：完成遥控端到船载端的数据链路。",
      "PWM：把舵机角度和油门转换成可执行信号。",
      "PCB / 电源滤波：处理稳压、纹波和整机联调问题。",
    ],
  },
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
      <p class="cover-sub">Game Client · Gameplay Systems · Embedded Practice</p>
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
      <p>我目前就读于四川大学电子信息类本科，主要方向是游戏客户端与 Gameplay 系统开发。作品集重点展示我在短周期项目里把想法落成可运行版本的能力：从机制验证、系统实现、内容整合，到团队推进和公开发布。</p>
      <p>我更关注“机制是否真的能被玩出来”：角色控制是否顺手、状态切换是否带来决策、叙事是否能落到关卡和系统里，以及工程结构是否足够清晰，能在有限时间内继续迭代。</p>
      <div class="quick-facts">
        <div><strong>方向</strong><span>游戏客户端 / Gameplay / 嵌入式实践</span></div>
        <div><strong>毕业</strong><span>2029 年 6 月</span></div>
        <div><strong>主力工具</strong><span>Unity、UE5、C#、STM32、Astro</span></div>
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
    <p class="eyebrow">Technical Stack</p>
    <h2>技术栈与工程能力</h2>
  </div>
  <div class="tech-stack-grid">
    ${techStack
      .map(
        (group) => `
      <article>
        <h3>${esc(group.title)}</h3>
        <ul>${group.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
      </article>
    `,
      )
      .join("")}
  </div>
  <div class="code-tree">
    <h3>常见项目拆分方式</h3>
    <div class="tree-grid">
      <pre>Player Control
├─ PlayerMove / PlayerJump
├─ PlayerDash
├─ GroundCheck / WallCheck
└─ Respawn / CheckPoint</pre>
      <pre>State & Resource
├─ MaskControl
├─ EnergyManager
├─ EnergyDrainController
└─ EndingManager</pre>
      <pre>Embedded Control
├─ ADC sampling
├─ SPI + nRF24L01
├─ PWM mapping
└─ PCB / power debug</pre>
    </div>
  </div>
`, "tech-page");

page(`
  <div class="section-title">
    <p class="eyebrow">Left Jun Portfolio · 2026 Content Update</p>
    <h2>技术索引：系统流程与脚本结构</h2>
    <p>这一页不是新增经历，而是把网站近期补充的流程图和脚本结构压缩成便于快速阅读的工程索引。</p>
  </div>
  <div class="system-index-grid">
    ${systemIndex
      .map(
        (item) => `
      <article style="--system-accent: ${item.accent}">
        <div class="system-index-head">
          <span>#</span>
          <h3>${esc(item.title)}</h3>
        </div>
        <p class="system-flow">${esc(item.flow)}</p>
        <ul>${item.modules.map((module) => `<li>${esc(module)}</li>`).join("")}</ul>
      </article>
    `,
      )
      .join("")}
  </div>
  <div class="system-index-note">
    <strong>阅读方式：</strong>先看输入如何进入状态中心，再看状态如何分发到 UI、关卡、结算或硬件输出。这样比脚本清单更容易判断项目是否有清晰工程主线。
  </div>
`, "system-index-page");

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
  <div class="project-copy-row">
    <div>
      <h3>我完成的关键工作</h3>
      <ul>${featured[0].highlights.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    </div>
    <div>
      <h3>程序模块</h3>
      <ul>${featured[0].systems.slice(0, 4).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    </div>
  </div>
  <div class="wide-image-row">
    ${imageCard(img("ashe-lament", "screenshot-notice-board.png"), "告示板：资源、加时器、捷径与强化状态")}
    ${imageCard(img("ashe-lament", "screenshot-dialogue.png"), "对话框：栖枝与母树意识残响")}
  </div>
`, "project-page");

page(`
  <div class="section-title compact">
    <p class="eyebrow">Asherah System Details</p>
    <h2>亚舍拉挽歌：资源循环与结果反馈</h2>
  </div>
  <div class="image-grid two-by-two">
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
  <div class="project-copy-row compact-copy">
    <div>
      <h3>工程链路</h3>
      <ul>${featured[1].highlights.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    </div>
    <div>
      <h3>底层与调试</h3>
      <ul>${featured[1].systems.slice(0, 4).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    </div>
  </div>
  <div class="boat-showcase">
    ${imageCard(img("smart-boat", "screenshot-schematic.png"), "接收端原理图")}
    ${imageCard(img("smart-boat", "screenshot-code.png"), "ADC / PWM / nRF24L01 代码调试")}
    ${imageCard(img("smart-boat", "screenshot-stm32-pinout.png"), "STM32CubeMX 引脚配置")}
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
      <h3>程序模块</h3>
      <ul>${featured[2].systems.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    </div>
    <div class="image-grid two-by-two small-cards">
      ${imageCard(img("emotion-mask", "screenshot-neutral-platform.png"), "平静：隐藏平台可见")}
      ${imageCard(img("emotion-mask", "screenshot-happy-platform.png"), "快乐：同位置平台不可见")}
      ${imageCard(img("emotion-mask", "screenshot-level.png"), "关卡：尖刺、墙面、移动平台")}
      ${imageCard(img("emotion-mask", "screenshot-mask-tutorial.png"), "教学：三种面具能力")}
    </div>
  </div>
`, "project-page");

page(`
  <div class="project-header">
    <div>
      <p class="eyebrow">Additional Work / Spatial Prototype</p>
      <h2>${esc(secondary[1].title)}</h2>
      <p>${esc(secondary[1].text)}</p>
      ${chipList(["Unity", "C#", "Cinemachine", "维度切换"])}
    </div>
    <div class="fact-box">
      <p><strong>时间</strong>2026.2 · 6h</p>
      <p><strong>角色</strong>${esc(secondary[1].role)}</p>
      <p><strong>工具</strong>${esc(secondary[1].tools)}</p>
    </div>
  </div>
  <div class="chapter-layout relativity-chapter">
    ${imageCard(secondary[1].image, "封面：二维/三维切换创意原型")}
    <div>
      <h3>技术实现</h3>
      <ul>${secondary[1].systems.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <h3>核心验证</h3>
      <p>这个原型重点验证一条完整联动链路：玩家按下 Tab 后，维度状态、相机、玩家移动轴、碰撞规则和关卡解法同步变化。</p>
    </div>
  </div>
  <div class="chapter-gallery two-wide">
    ${secondary[1].gallery.map(([src, caption]) => imageCard(src, caption)).join("")}
  </div>
`, "chapter-page");

page(`
  <div class="project-header">
    <div>
      <p class="eyebrow">Additional Work / Narrative Prototype</p>
      <h2>${esc(secondary[0].title)}</h2>
      <p>${esc(secondary[0].text)}</p>
      ${chipList(["Godot", "三时间线", "叙事解谜", "团队推进"])}
    </div>
    <div class="fact-box">
      <p><strong>时间</strong>2025.11 · 7 天</p>
      <p><strong>角色</strong>${esc(secondary[0].role)}</p>
      <p><strong>工具</strong>${esc(secondary[0].tools)}</p>
    </div>
  </div>
  <div class="chapter-layout time-echo-chapter">
    ${imageCard(secondary[0].image, "封面：音乐、记忆与时间回响")}
    <div>
      <h3>程序与制作拆分</h3>
      <ul>${secondary[0].systems.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <h3>我负责的内容</h3>
      <p>我负责将“同一地点在三个时代变化”的概念拆解成可执行结构：每个时代有什么场景、道具、NPC、音乐线索，以及哪些行为会改变后续时间线。</p>
    </div>
  </div>
  <div class="chapter-gallery three-wide">
    ${secondary[0].gallery.map(([src, caption]) => imageCard(src, caption)).join("")}
  </div>
`, "chapter-page");

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
  .main-art, .cover-art .mini-row img {
    object-fit: contain;
    background: rgba(255, 255, 255, .08);
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
  .tech-stack-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5mm;
  }
  .tech-stack-grid article {
    min-height: 84mm;
    padding: 5mm;
    border: 1px solid #dde0df;
    border-radius: 5mm;
    background: #fffdf8;
  }
  .tech-stack-grid h3 { color: #0c546d; }
  .tech-stack-grid li {
    font-size: 9.35pt;
    margin-bottom: 2.1mm;
  }
  .code-tree {
    margin-top: 7mm;
    padding: 5mm;
    border-radius: 5mm;
    background: #102236;
    color: #fff;
  }
  .tree-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4mm;
  }
  pre {
    margin: 0;
    padding: 4mm;
    border-radius: 4mm;
    background: rgba(255, 255, 255, .08);
    color: #eaf3f5;
    font-family: Consolas, "Cascadia Mono", monospace;
    font-size: 9pt;
    line-height: 1.45;
    white-space: pre-wrap;
  }
  .system-index-page .section-title {
    margin-bottom: 7mm;
  }
  .system-index-page .section-title p:not(.eyebrow) {
    max-width: 210mm;
    color: #626b77;
  }
  .system-index-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5mm;
  }
  .system-index-grid article {
    min-height: 114mm;
    padding: 7mm 6mm;
    border: 1.5px solid color-mix(in srgb, var(--system-accent) 44%, #d9e3ec);
    border-radius: 7mm;
    background: #edf8ff;
    box-shadow: 0 12px 28px rgba(28, 86, 136, .09);
  }
  .system-index-head {
    display: flex;
    align-items: center;
    gap: 4mm;
    margin-bottom: 7mm;
  }
  .system-index-head span {
    display: grid;
    place-items: center;
    width: 13mm;
    height: 10mm;
    border-radius: 999px;
    background: var(--system-accent);
    color: #fff;
    font-size: 12pt;
    font-weight: 900;
  }
  .system-index-head h3 {
    margin: 0;
    font-size: 17pt;
  }
  .system-flow {
    min-height: 34mm;
    margin-bottom: 6mm;
    color: #526173;
    font-size: 10pt;
    line-height: 1.65;
  }
  .system-index-grid li {
    margin-bottom: 2.25mm;
    font-size: 9.45pt;
  }
  .system-index-note {
    margin-top: 7mm;
    padding: 5mm 6mm;
    border-left: 2mm solid #2b82d8;
    border-radius: 5mm;
    background: #fffdf8;
    color: #526173;
    font-size: 11pt;
  }
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
  .featured-three img {
    height: 48mm;
    margin-bottom: 4mm;
    object-fit: contain;
    background: #eef2f3;
  }
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
    margin-bottom: 5mm;
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
  .project-copy-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8mm;
    margin-bottom: 4mm;
  }
  .project-copy-row.compact-copy {
    margin-bottom: 4mm;
  }
  .project-copy-row.compact-copy li,
  .project-copy-row.compact-copy p {
    font-size: 9.7pt;
  }
  .image-grid { display: grid; gap: 4mm; }
  .image-grid.two { grid-template-columns: 1fr 1fr; }
  .image-grid.three { grid-template-columns: repeat(3, 1fr); }
  .image-grid.four { grid-template-columns: repeat(4, 1fr); }
  .image-grid.two-by-two { grid-template-columns: repeat(2, 1fr); }
  .image-card {
    margin: 0;
    border-radius: 5mm;
  }
  .image-card img { height: 73mm; object-fit: cover; }
  .wide-image-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5mm;
  }
  .wide-image-row .image-card img {
    height: 49mm;
    object-fit: contain;
    background: #eef2f3;
  }
  .image-grid.two-by-two .image-card img {
    height: 50mm;
    object-fit: contain;
    background: #eef2f3;
  }
  .image-grid.three .image-card img { height: 73mm; object-fit: contain; background: #fff; }
  .image-grid.four .image-card img { height: 88mm; }
  .small-cards .image-card img { height: 43mm; }
  .boat-showcase {
    display: grid;
    grid-template-columns: 1fr 1fr .68fr;
    gap: 4mm;
  }
  .boat-showcase .image-card img {
    height: 58mm;
    object-fit: contain;
    background: #fff;
  }
  figcaption {
    padding-top: 2mm;
    color: #5d6570;
    font-size: 8.5pt;
  }
  .gallery-page .image-grid.two-by-two .image-card img { height: 52mm; }
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
  .chapter-layout {
    display: grid;
    grid-template-columns: .92fr 1.08fr;
    gap: 7mm;
    align-items: start;
    margin-bottom: 5mm;
  }
  .chapter-layout .image-card img {
    height: 58mm;
    object-fit: contain;
    background: #eef2f3;
  }
  .chapter-layout li {
    font-size: 9pt;
    margin-bottom: 1.45mm;
  }
  .chapter-layout p {
    font-size: 9.25pt;
  }
  .chapter-gallery {
    display: grid;
    gap: 4mm;
  }
  .chapter-gallery.three-wide {
    grid-template-columns: repeat(3, 1fr);
  }
  .chapter-gallery.two-wide {
    grid-template-columns: repeat(2, 1fr);
  }
  .chapter-gallery .image-card img {
    height: 41mm;
    object-fit: contain;
    background: #eef2f3;
  }
  .chapter-gallery.two-wide .image-card img {
    height: 46mm;
  }
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

function runEdge(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(edgePath, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    child.stderr.on("data", (chunk) => (stderr += chunk.toString()));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`Edge exited with ${code}\n${stdout}\n${stderr}`));
    });
  });
}

function loadPlaywright() {
  const candidates = [
    () => require("playwright"),
    () => {
      const bundled = path.join(
        process.env.USERPROFILE || "",
        ".cache",
        "codex-runtimes",
        "codex-primary-runtime",
        "dependencies",
        "node",
        "node_modules",
      );
      return createRequire(path.join(bundled, "package.json"))("playwright");
    },
  ];

  for (const candidate of candidates) {
    try {
      return candidate();
    } catch {
      // Fall back to the next local runtime or Edge CLI.
    }
  }

  return null;
}

const htmlUrl = pathToFileURL(outputHtml).href;
const playwright = loadPlaywright();
let renderer = "edge-cli";

if (playwright?.chromium) {
  renderer = "playwright";
  const browser = await playwright.chromium.launch({
    headless: true,
    executablePath: edgePath,
  });
  const pageRef = await browser.newPage({ viewport: { width: 1684, height: 1190 }, deviceScaleFactor: 1 });
  await pageRef.goto(htmlUrl, { waitUntil: "networkidle" });
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
} else {
  await runEdge([
    "--headless=new",
    "--disable-gpu",
    "--allow-file-access-from-files",
    `--print-to-pdf=${outputPdf}`,
    htmlUrl,
  ]);
  await runEdge([
    "--headless=new",
    "--disable-gpu",
    "--allow-file-access-from-files",
    "--window-size=1684,1190",
    `--screenshot=${previewPng}`,
    htmlUrl,
  ]);
}

const stat = await fs.stat(outputPdf);
console.log(JSON.stringify({
  pdf: outputPdf,
  html: outputHtml,
  preview: previewPng,
  bytes: stat.size,
  pages: pages.length,
  renderer,
}, null, 2));
