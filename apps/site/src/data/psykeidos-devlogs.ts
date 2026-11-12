import type { SiteLanguage } from "../lib/seo";

export type DevlogText = Record<SiteLanguage, string>;
export interface DevlogImage {
  file: string;
  title: DevlogText;
  caption: DevlogText;
  width: number;
  height: number;
}
export interface PsykeidosDevlog {
  id: string;
  date: string;
  title: DevlogText;
  summary: DevlogText;
  technicalStatus: "passed" | "pending";
  artStatus: "pending" | "accepted" | "revision-needed";
  changes: DevlogText[];
  checks: { title: DevlogText; detail: DevlogText }[];
  limitations: DevlogText[];
  nextStep: DevlogText;
  comparison: DevlogImage[];
  gallery: DevlogImage[];
}

const text = (zh: string, en: string): DevlogText => ({ "zh-cn": zh, en });
const image = (file: string, zh: string, en: string, captionZh: string, captionEn: string, width = 1920, height = 1080): DevlogImage => ({
  file, title: text(zh, en), caption: text(captionZh, captionEn), width, height
});

export const psykeidosDevlogs: PsykeidosDevlog[] = [
  {
    id: "v020",
    date: "2026-11-12T15:00:00+08:00",
    title: text("文字与多语言系统：统一播放框架", "Text and localization: unified playback foundation"),
    summary: text(
      "将场景旁白、NPC 对话与世界地图纸张对话接入统一的文字解析、播放状态和演出参数体系；完成四语言、双分辨率的运行截图验证。本轮是文字系统基础设施更新，并非剧情内容全部完成。",
      "Unified parsing, playback state and presentation tuning across environmental text, NPC conversations and world-map paper dialogue. Captured runtime validation in four languages at two resolutions. This is a foundation update, not completion of all narrative content."
    ),
    technicalStatus: "passed",
    artStatus: "pending",
    changes: [
      text("统一文字播放状态、TMP 字符渐显与播放请求生命周期，兼容原有自动文字、NPC 对话和世界地图展示端。", "Unified playback state, TMP glyph fades and request lifecycle while preserving existing environmental, NPC and world-map presentation surfaces."),
      text("建立共享 Tuning → 对话默认值 → 单段覆盖 → 段内标记的演出参数体系；旧内容默认保持兼容。", "Introduced shared tuning, sequence defaults, per-line overrides and inline markup, with legacy content remaining compatible by default."),
      text("完善简体中文、英语、日语和韩语的正文、角色名称与分支选项解析；切换语言时重建当前播放段。", "Expanded Simplified Chinese, English, Japanese and Korean resolution for lines, speakers and choices; language switches rebuild the active line."),
      text("场景文本总控支持 NPC / 非 NPC 分类、Scene 矩形触发区、正文编辑、参数来源检查和独立预览。", "The scene authoring tool now covers NPC and non-NPC entries, Scene-view trigger rectangles, content editing, parameter-source inspection and isolated preview.")
    ],
    checks: [
      { title: text("编辑器与运行时测试", "Editor and runtime tests"), detail: text("原任务验收记录：706 项 EditMode 与 285 项 PlayMode 通过；另有 1 项预览重生成测试跳过。之后独立复测文字播放状态 8/8 通过。", "Original acceptance: 706 EditMode and 285 PlayMode tests passed; one preview-regeneration test was skipped. A subsequent independent playback-state retest passed 8/8.") },
      { title: text("四语言视觉矩阵", "Four-language visual matrix"), detail: text("简中、英、日、韩 × 1280×720、1920×1080，共 80 张实际运行截图；下方选取 1920×1080 样本展示。", "Simplified Chinese, English, Japanese and Korean at 1280×720 and 1920×1080 produced 80 runtime screenshots; selected 1920×1080 samples appear below.") },
      { title: text("Windows 构建", "Windows build"), detail: text("开发构建通过，Steam 独立门禁通过；此次未发布新游戏版本。", "Development build and standalone Steam gate passed; no new public game build was released.") }
    ],
    limitations: [
      text("旧 Feature Validator 与 Runtime Menu 综合门禁仍有 26 项和 4 项失败记录，主要涉及既有菜单、设置及场景配置；不能称为全工程零缺陷。", "Legacy Feature Validator and Runtime Menu gates still report 26 and 4 failures, mostly concerning existing menus, settings and scene configuration; the entire project is not defect-free."),
      text("Scene 视图拖框、撤销重做和真实关卡交互尚待完整人工验收；截图为测试场景记录，不代表最终 UI 美术。", "Scene-view dragging, undo/redo and full in-level interaction still need hands-on verification. Screenshots are test-scene evidence, not final UI art."),
      text("本轮未完成剧情文本填充，也未宣布全部语言的最终译文与排版验收。", "Narrative writing and final translation/layout acceptance for all languages remain incomplete.")
    ],
    nextStep: text("在实际关卡中完成触发、快显、分支、暂停与语言切换的端到端验收，再逐步替换测试文本并优化排版。", "Verify triggering, quick reveal, branching, pause and language switching end to end in production levels, then replace test copy and refine layouts."),
    comparison: [
      image("v020-zh-complete.png", "简体中文 · 对话完整显示", "Simplified Chinese · complete line", "1920×1080 实机测试截图，验证中文正文及对话展示。", "1920×1080 runtime validation of Chinese dialogue text."),
      image("v020-en-complete.png", "英语 · 同一对话", "English · same dialogue", "同分辨率下的英语排版与字符显示检查。", "English layout and glyph display at the same resolution.")
    ],
    gallery: [
      image("v020-zh-choices.png", "简体中文 · 分支选项", "Simplified Chinese · choices", "对话分支选项在实际运行中的显示。", "Branch choices shown in the runtime test."),
      image("v020-en-choices.png", "英语 · 分支选项", "English · choices", "核对较长英文选项的布局。", "Checking layout of longer English choices."),
      image("v020-ja-complete.png", "日语 · 正文", "Japanese · dialogue", "日文字形与对话框的运行截图。", "Japanese glyphs and dialogue box in the runtime capture."),
      image("v020-ko-complete.png", "韩语 · 正文", "Korean · dialogue", "韩文字形与对话框的运行截图。", "Korean glyphs and dialogue box in the runtime capture."),
      image("v020-zh-worldpaper.png", "简体中文 · 世界地图纸张对话", "Simplified Chinese · world-map paper", "验证世界地图展示端的文字接入。", "Validating the world-map paper presentation surface."),
      image("v020-en-worldpaper.png", "英语 · 世界地图纸张对话", "English · world-map paper", "世界地图纸张对话的英文显示。", "English display in the world-map paper dialogue."),
      image("v020-ja-worldpaper.png", "日语 · 世界地图纸张对话", "Japanese · world-map paper", "世界地图纸张对话的日文显示。", "Japanese display in the world-map paper dialogue."),
      image("v020-ko-worldpaper.png", "韩语 · 世界地图纸张对话", "Korean · world-map paper", "世界地图纸张对话的韩文显示。", "Korean display in the world-map paper dialogue.")
    ]
  },
  {
    id: "v019",
    date: "2026-11-05T13:17:00+08:00",
    title: text("灯塔左前湖盆与前瀑", "The lake in front of the lighthouse"),
    summary: text(
      "打开灯塔左前的高位湖面，让围岸、岩槛与瀑布接回同一套地貌。保留右侧连通水湾和后方陆地，继续用固定镜头检验空间。",
      "Opening the upper lake to the front-left of the lighthouse, reconnecting its rocky banks, sill and waterfall while retaining the right bay and dry hinterland. The overview camera stays fixed."
    ),
    technicalStatus: "passed",
    artStatus: "pending",
    changes: [
      text("局部调整已保存的岸床与岸肩，把湖面向灯塔左前打开；后方仍是山地与陆地。", "Reshaped the existing bed and shoulders to open water to the front-left of the lighthouse. The rear remains dry, mountainous land."),
      text("修整连续低岩岸和真实溢流口，原前瀑随岸线前移，落入低海；没有增加第三条瀑布。", "Reconnected the low rocky forebank and spillway. The existing front waterfall moved with the shoreline and still reaches the lower sea; no third waterfall was added."),
      text("左湖与右湾保持同一水平水位、真实连通，上下水面高差为 95 米；右瀑与低矮侧山保留。", "The left lake and right bay share one connected, level water surface, 95 metres above the sea. The right waterfall and low side hills are retained."),
      text("保留桥台、塔基、固定 16:9 机位、人物与营地；本轮不改黄红区域，也未替换 Unity 正式地图。", "Preserved the bridge and lighthouse support, fixed 16:9 camera, character and camp. The yellow and red regions and the production Unity map were not changed.")
    ],
    checks: [
      { title: text("实体与承托", "Solid geometry and support"), detail: text("闭合、法线、自交及桥塔承托检查通过。", "Closed geometry, normals, self-intersection and bridge/lighthouse support checks passed.") },
      { title: text("水陆关系", "Water and land"), detail: text("上湖保持同高连通；围岸、岩床和两处瀑口均有真实几何承接。", "The upper lake is level and connected, with actual rocky banks, bed and support beneath both waterfall outlets.") },
      { title: text("同模型取景", "One model, consistent views"), detail: text("9 张原生 1920×1080 渲染出自同一保存模型；原镜头和受保护内容保持。", "Nine native 1920×1080 renders come from one saved model; original cameras and protected content remain unchanged.") }
    ],
    limitations: [
      text("固定总览中，左湖仍偏向画面左缘，可见面积有限，尚未达到母图的水陆节奏。", "In the fixed overview, the lake still sits close to the left edge with limited visible area. The reference's water–land rhythm has not yet been reached."),
      text("长直岸墙、规则折面和瀑布占位感仍然明显，需要继续整理大型轮廓。", "Long straight cliffs, angular surfaces and placeholder waterfalls remain visible. The larger silhouettes still need work."),
      text("技术检查通过仅证明本轮结构条件；构图、美术与最终体验仍待验收。", "Technical checks confirm structural conditions only. Composition, art direction and the final experience still await review.")
    ],
    nextStep: text(
      "下一轮先核对左前湖在总览中的占幅、围岸高低与前瀑关系，再继续调整大型地貌；暂不进入精细建筑、复杂水材质或云雾制作。",
      "Next, review the front-left lake's overview footprint, bank heights and front waterfall before adjusting the larger landforms. Detailed buildings, complex water materials and clouds remain deferred."
    ),
    comparison: [
      image("v019-local-comparison.jpg", "灯塔与湖盆：v018 → v019", "Lighthouse and lake: v018 → v019", "同机位真实渲染。左前湖面扩大，前缘接回厚实岩岸与瀑口。", "Actual renders from the same camera: the expanded front-left lake meets the solid rocky bank and spillway.", 2048, 810),
      image("v019-top-comparison.jpg", "俯视水陆分布：v018 → v019", "Water and land from above: v018 → v019", "从真实三维分布检查左前湖、右湾与后方陆地，而非只依赖主镜头遮挡。", "Checking the actual arrangement of the front-left lake, right bay and dry hinterland beyond the overview's occlusion.", 2048, 810),
      image("v019-main-comparison.jpg", "固定 16:9 主视：v018 → v019", "Fixed 16:9 overview: v018 → v019", "镜头不变。局部结构改善，但总览的水面可读性仍是未解决项。", "The camera is unchanged. Local structure improves, while overview water visibility remains unresolved.", 2048, 810),
      image("v019-mother-comparison.jpg", "原始母图与当前灰模", "Original reference and current blockout", "左侧为构图参考，右侧为实际 Blender 灰模。参考图不代表已完成效果。", "The composition reference is on the left; the actual Blender blockout is on the right. The reference is not a finished result.", 2048, 810)
    ],
    gallery: [
      image("v019-main-grey.jpg", "无云灰模 · 正式眺望主视", "Cloud-free blockout · overview", "固定 16:9 画幅，直接检验三域与营地的轮廓、落差和遮挡。", "The fixed 16:9 frame exposes the silhouettes, height differences and occlusion between the three regions and camp."),
      image("v019-main-color.jpg", "同机位淡彩预览", "Muted colour · same overview", "颜色仅用于辨认区域，不以复杂材质或云雾遮盖结构。", "Colour identifies regions without complex materials or clouds masking their structure."),
      image("v019-local-close.jpg", "灯塔、湖盆与前瀑近景", "Lighthouse, lake and front waterfall", "近景核对真实岸床、塔基和湖口，但不代替总览构图验收。", "A close view checks the actual bank, lighthouse footing and spillway; it does not replace overview review."),
      image("v019-local-top.jpg", "局部俯视 · 湖与陆地", "Local top view · water and land", "左前湖与侧后水道同层连通，后方保留大片陆地。", "The front-left basin and side/rear channel remain at one level, while the hinterland stays dry."),
      image("v019-blue-top.jpg", "蓝域整体俯视", "Blue region · top view", "检查海岸山地系统、岛链与低海的真实占地范围。", "The coastal landform system, islands and lower sea seen in their actual footprint."),
      image("v019-blue-overview.jpg", "蓝域区域总览", "Blue region · regional overview", "从蓝域整体视角核对湖盆、灯塔山与海岸系统。", "A regional view of the basin, lighthouse hill and surrounding coastal system."),
      image("v019-blue-side.jpg", "蓝域正交侧视", "Blue region · orthographic side", "直接查看上湖、岩壁、瀑布与最低海面之间的厚度和落差。", "An orthographic view of the upper lake, cliffs, waterfalls and lowest sea level."),
      image("v019-bridge-side.jpg", "桥塔承托 · 局部侧视", "Bridge and lighthouse support", "石桥连接高位岩体，灯塔保留完整的山体承托。", "The bridge connects supported high ground, while the lighthouse retains its rock footing."),
      image("v019-blue-rear.jpg", "蓝域斜后视", "Blue region · oblique rear view", "从非主视方向检查实体厚度、山地延伸和水陆关系。", "Checking solid depth, hinterland extent and water–land relations away from the primary camera."),
      image("v019-side-levels.jpg", "实际高度关系", "Actual water levels", "上湖比低海高 95 米。标高来自当前模型，不是对母图的测绘结论。", "The upper lake is 95 metres above the sea. These are model heights, not a geographic survey of the reference.", 2300, 1200)
    ]
  }
];

export const devlogAsset = (file: string): string => `/content-assets/projects/psykeidos/${file}`;
export const psykeidosProjectUrl = (lang: SiteLanguage = "zh-cn"): string => `${lang === "en" ? "/en" : ""}/projects/psykeidos/`;
export const psykeidosDevlogUrl = (lang: SiteLanguage = "zh-cn", id = ""): string => `${psykeidosProjectUrl(lang)}devlog/${id ? `${id}/` : ""}`;
export const orderedPsykeidosDevlogs = (): PsykeidosDevlog[] => [...psykeidosDevlogs].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
export const devlogDate = (date: string, lang: SiteLanguage = "zh-cn"): string => new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "zh-CN", { timeZone: "Asia/Shanghai", year: "numeric", month: "long", day: "numeric" }).format(new Date(date));
export const devlogArtStatus = (entry: PsykeidosDevlog, lang: SiteLanguage): string => ({
  pending: text("美术待验收", "Art review pending"),
  accepted: text("美术验收通过", "Art review accepted"),
  "revision-needed": text("需要继续修改", "Revision requested")
}[entry.artStatus][lang]);

export function getPsykeidosDevlogSearchEntries(lang: SiteLanguage = "zh-cn") {
  return orderedPsykeidosDevlogs().map((entry) => {
    const title = `Psykeidos ${entry.id} · ${entry.title[lang]}`;
    const tags = ["Psykeidos", "Blender", lang === "en" ? "Development log" : "开发日志", lang === "en" ? "World map" : "世界地图"];
    return {
      title,
      description: entry.summary[lang],
      url: psykeidosDevlogUrl(lang, entry.id),
      section: "projects",
      tags,
      date: entry.date,
      search: [title, entry.summary[lang], ...tags, ...entry.changes.map((item) => item[lang]), ...entry.limitations.map((item) => item[lang])].join(" ").toLowerCase()
    };
  });
}
