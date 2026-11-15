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
    id: "v033",
    date: "2026-11-15T11:04:47+08:00",
    title: text("蓝域地貌重建反思：三版原生拓扑试验全部否决", "Blue geology reset: three native topology-rebuild trials rejected"),
    summary: text(
      "针对 v057 完全不像自然地形的反馈，重新核对最高参考 Mother Composition 与灯塔局部参考，并暂停既有半圆湖墙上不断抬顶点、减面、塞岬角的做法。本轮直接在 Blender 从 v051 原件另存 v058、v059、v060 三份完整地貌重建试验：先用水岸距离场重新生成前湖左岸，后将前岸与后岸合并重建，最后以实际桥梁与瀑口为锚点重新生成变宽连续的右前转弯河道。但三版真实渲染均未过审：v058 留下不自然的矩形拼接与大盆口，v059 仍是巨大平滑山坡且出现大量河床穿水，v060 虽不再使用圆形湖墙，却出现了人工挖槽式水渠、边岸尖刺与水陆裂缝。三版均作为失败实验保留，不推荐作为正式场景。",
      "After feedback that v057 looked nothing like natural terrain, the highest-priority Mother Composition and blue-detail reference were reviewed again. Incremental vertex pushes, low-poly modifiers and inserted capes on the circular reservoir wall were abandoned. Three separate native Blender geology rebuilds started from the preserved v051: v058 replaced the forelake land via a shoreline distance field, v059 replaced the disconnected front/back coast with an integrated landscape, and v060 regenerated a curved river around the preserved bridge, lighthouse and waterfall. All three failed visual review: v058 shows an obvious rectangular land-mesh join; v059 retains featureless broad slopes and extensive rock/water intersections; v060 creates an artificial trench with jagged edges and terrain/water gaps. None is accepted or recommended as a production scene."
    ),
    technicalStatus: "pending",
    artStatus: "revision-needed",
    changes: [
      text("重新打开原始母图与蓝域局部母图，对照确认：母图要的是成组海岸岩层、峡谷与近景水域，不是单一半圆蓄水池。", "Reopened the actual master composition and blue detail to confirm the intended coastal archipelago, strata and natural valley are not one semicircular reservoir."),
      text("v058：独立替换前岸地形网格，用水岸距离和分层岩脊重新生成 12,816 个面；近景出现方形拼接和水边悬空，否决。", "v058 independently rebuilt the near-cape terrain with 12,816 faces from shoreline distance and strata; visible rectangular joins and suspended water edges caused rejection."),
      text("v059：独立替换后岸与前岸为一个整合的 36,590 面地形，试图修复地貌割裂；近景仍像巨大单调土坡，且水底露石问题加重，否决。", "v059 replaced the mismatched back/near banks with one 36,590-face land mesh; it remained a featureless mass with worsened rock/water intersection and was rejected."),
      text("v060：以曲线水路重建河道与两岸，保持原有灯塔、石桥、瀑口和镜头位置；实际渲染显示深挖人工渠、尖刺与河岸断裂，否决。", "v060 rebuilt a curved river and surrounding banks while retaining lighthouse, bridge, falls and cameras; genuine renders showed an excavated artificial trench, spikes and broken bank transitions, so it was rejected."),
      text("没有替换 Unity 场景，也没有把任何失败工程覆盖到 v051、v057 的历史源文件。", "No Unity scenes were replaced and none of these failed experiments overwrote the v051 or v057 source models.")
    ],
    checks: [
      {
        title: text("实机多角度审查", "Native multi-angle review"),
        detail: text("每个试验均保存独立 Blender 源工程，并渲染相同灯塔近景和蓝域俯视；对比图包括 v057、v058、v059、v060 与最高母图，没有概念合成冒充实际模型。", "Each trial has a separate saved native Blender model and genuine matching close-up and top renders; the page compares v057–v060 with the master art reference without passing off concept imagery as models.")
      },
      {
        title: text("v059 水床技术失败", "v059 lakebed technical failure"),
        detail: text("以 2,939 个水面三角中心检查，整合后的陆地有 123 处高于水面；不符合“水道自然贴合岩床”的基本要求。", "Across 2,939 sampled water triangle centres, v059 had 123 above-water terrain hits, violating basic riverbed continuity.")
      },
      {
        title: text("v060 水岸仍未正确接合", "v060 river/shore joins remain defective"),
        detail: text("v060 新水网为 360 个三角面、面积约 310,060 平方米。在 120 个水面中心抽样中有 1 处岩体穿水，虽然样本数较少，但原生近景暴露了更明显的裂口和直线拼接问题。", "v060 generated a 360-triangle upper-water strip covering about 310,060 m². One above-water rock hit was found across 120 sampled triangle centres; the native render exposes more significant cracks and straight-edged joins despite the lower sample count.")
      },
      {
        title: text("明确不通过美术验收", "No art approval"),
        detail: text("三版相较母图都存在结构性错误：真实岩层主次缺失、河岸与山脊互不支撑、前缘瀑口不像自然出水口。各版本保留用于问题复盘，不作为下一轮默认底模。", "All three remain structurally unlike the mother composition: missing geological mass hierarchy, banks disconnected from ridge formation, and an implausible waterfall mouth. They remain archived studies rather than the next production baseline.")
      }
    ],
    limitations: [
      text("这轮没有制作出合格的新蓝域。程序性距离场和规则高度场即使替换了旧拓扑，也无法自动获得符合母图的地质构造和视觉节奏；继续在错误造型上加法线或岩块不是答案。", "No acceptable new blue region emerged. Even replacing old topology using procedural distance/height fields did not reproduce the reference's geological structures or visual rhythm; more modifiers or rock inserts will not solve it."),
      text("仅检查了水面三角中心的部分岩床关系，尚无全网格自交、路径、碰撞和 Unity 导入验收；技术状态同样不能通过。", "Only sampled waterbed intersections were assessed. Full self-intersections, collision, traversal and Unity import remain unverified."),
      text("原始母图中的蓝域主要是灯塔高地、分层海岸、桥与下层海面，以及从上层水域向前溢流的视觉关系。新地形必须先形成这套大体量结构，再谈低多边形风格。", "The blue mother art is structured around lighthouse highlands, layered coastal landforms, bridges and lower sea, with foreground spilling from a higher watercourse. A new large-scale geological blockout must establish that composition before low-poly stylization.")
    ],
    nextStep: text(
      "停止对现有错误湖盆及本轮失败的程序性高度场继续打补丁。下一阶段以母图中的大块分层海岸、岩脊方向及峡谷开口为优先，先独立确定多视角自然地质体量，再将真实连续水道嵌入岩层；未获实机视觉通过前不进入正式地图。",
      "Stop patching the old enclosed basin or these unsuccessful generated heightfields. The next stage needs a geology-first blockout with large stratified coasts, coherent ridge directions and an open gorge, verified against multiple reference camera angles before fitting a truly continuous watercourse. Do not replace the production world before visual acceptance."
    ),
    comparison: [
      image("v033-08-v057-v060-close.png", "旧围墙与新挖渠：两条错误路线", "Old retaining wall vs excavated channel: both rejected", "v057 是人工水库墙，v060 是过深的人工水渠，两者都不是自然地形。", "v057 looks like a constructed retaining wall; v060 looks like a dug trench. Both are rejected.", 1960, 610),
      image("v033-09-v058-v059-close.png", "整体地貌试验：明显拼接与大斜坡", "Geology prototypes: rectangular seam and broad slope", "v058 的方形接缝、v059 的大块平坡均不符合母图。", "v058's visible seam and v059's broad monotone hill do not match the reference.", 1960, 610),
      image("v033-10-mother-v060.png", "最高母图与失败试验同屏", "Master reference and failed prototype", "用于检视差距，不暗示已符合最高参考。", "Shows the discrepancy rather than implying acceptance.", 1960, 610)
    ],
    gallery: [
      image("v033-01-v060-main-grey.png", "v060 否决 · 固定主视", "v060 rejected · fixed overview", "真实渲染，展示错误地貌的大体量关系。", "Authentic render revealing the incorrect landform hierarchy."),
      image("v033-02-v060-blue-top.png", "v060 否决 · 蓝域俯视", "v060 rejected · overhead", "河道重画了，但岩岸连接仍不自然。", "River planform changed but land joints remained unnatural."),
      image("v033-03-v060-local-close.png", "v060 否决 · 灯塔近景", "v060 rejected · lighthouse close-up", "可见不合理沟槽、尖刺及破面。", "Exposes artificial channel, spikes and visible breaks."),
      image("v033-04-v060-blue-side.png", "v060 否决 · 地形侧视", "v060 rejected · terrain side", "用于审查高差和断面。", "Checking elevation and geological profile."),
      image("v033-05-v058-failure.png", "v058 否决 · 方形地形拼接", "v058 rejected · rectangular seam", "前湖承托面被重建后仍有明显人工接缝。", "The rebuilt forelake bed visibly fails to merge with the natural coast."),
      image("v033-06-v059-failure.png", "v059 否决 · 过度光滑的大片山体", "v059 rejected · featureless hillside", "整合后岸也不能凭程序生成自然岩层。", "Merging terrain does not automatically generate realistic strata."),
      image("v033-07-v057-baseline.png", "v057 废弃基线", "v057 rejected baseline", "旧环形高墙的失败形态，用作反面比较。", "Legacy enclosing cliff retained only as a negative comparison.")
    ]
  },
  {
    id: "v032",
    date: "2026-11-15T10:26:20+08:00",
    title: text("Blender 蓝域返工：重塑左岸岩层与前崖，否决三角形灯塔山", "Blender blue-region rework: stratified left bank, fractured front cliff, rejected triangular hill"),
    summary: text(
      "针对 v051 的前湖左岸像平滑三角土坡、前缘崖壁像规则半圆水库的问题，直接用已连接的 Blender 进行 v052—v057 六轮独立建模与相同机位实拍。v052 抬出连续的斜切岸坡，v053 改动既有前崖的立面斜度与厚度，v054 在干燥岩壁雕出不等距的地质断槽，v055 让前崖上缘不再全是同一条圆弧。v056 试图扩张灯塔山脚却在实拍中出现另一块突兀大三角，立即否决；v057 回到 v055，微调前崖断口作可回退候选。所有这些实际地形修改都不是最终美术通过：旧版 C 形水库感仍然明显，说明后续必须动前崖的整体轮廓拓扑，不能继续靠小范围加减高度堆迭。",
      "Six independent Blender iterations (v052–v057) address v051's flat triangular reclaimed shore and man-made semicircular retaining cliff. v052 builds broad continuous angular bank planes; v053 inclines and shears the original exterior cliff; v054 erodes nonuniform stratal gullies; v055 varies the existing dry rim geometry. v056 expanded the lighthouse base but native captures revealed an unwanted triangular rock protrusion, so it was rejected. v057 restarts from v055 for a limited broken escarpment experiment. This is not art-approved: the C-shaped reservoir look still persists and a more fundamental outer-cliff topology redesign is required rather than incremental local deformations."
    ),
    technicalStatus: "pending",
    artStatus: "revision-needed",
    changes: [
      text("v052：在原有 V007_Blue_Near_Cape 网格雕刻连续岩层，调整 18,117 个干岸顶点，最大高程变化约 67.7 米；不添加独立岩块。", "v052 sculpts the existing Near Cape into continuous strata, changing 18,117 dry-bank vertices with up to 67.7 m uplift, without adding detached rocks."),
      text("v053：调整 16,807 个前崖顶点，使崖壁下部呈不等距倾斜岩面，最大水平移动约 52.9 米；不改变上湖水网。", "v053 moves 16,807 existing exterior-cliff vertices to create asymmetric inclined faces, with up to 52.9 m horizontal displacement; the water mesh remains unchanged."),
      text("v054、v055：继续在既有崖面雕刻断槽与分层，并对局部干燥崖缘作水平剪切，试图打破人工连续圆墙。", "v054/v055 add faulted strata and localized dry-cliff shear on the same source mesh to break the monotonous circular retaining wall."),
      text("v056 灯塔山脚扩建实拍出现突兀的三角块，与之前被否决的插入式岬角同类，明确否决；v057 不继承 v056 的任何灯塔山网格修改。", "v056's lighthouse-hill expansion produced an obvious triangular projection and was rejected. v057 inherits none of that trial's lighthouse geometry."),
      text("v057 在 v055 基础上对 12,745 个干燥前崖顶点进行不规则轮廓下切，最大降低 11 米，另存独立 Blender 文件并渲染 16:9 主视、近景、俯视、侧视及淡彩。", "v057 performs a bounded erosion pass on 12,745 dry escarpment vertices from v055 (maximum lowering 11 m) and saves a separate native Blender model with authentic overview, close-up, top, side and muted-colour renders.")
    ],
    checks: [
      {
        title: text("水网与地标锁定", "Water and landmark constraints"),
        detail: text("v051 → v057 保持同一张 8,815 三角面的高位水网，面积约 382,239 平方米、水位 −225 米。v057 没有移动塔、桥、瀑口和固定相机；被否决 v056 的山脚放大没有进入保留版。", "v051 → v057 retains the same 8,815-triangle upper-water mesh covering approximately 382,239 m² at −225 m. Tower, bridge, outlet and frozen cameras are untouched in v057; the rejected v056 headland expansion is excluded.")
      },
      {
        title: text("真实水底承托复测", "Actual lakebed sampling"),
        detail: text("相同 2,939 个水面三角形抽样位置：v051、v055、v057 的漏床数量均为 0，旧模型微小岩体穿水均为 3 处，未因为这一轮新增。这只是采样，并非完整碰撞与自交回归。", "The same 2,939 sampled water-triangle positions show zero missing bed in v051, v055 and v057, with the same three inherited minor exposed-rock hits. These samples do not replace a complete collision and self-intersection regression.")
      },
      {
        title: text("失败方案主动否决", "Rejection of malformed candidate"),
        detail: text("v056 实机近景出现明显新三角大岩块，故没有将它误标为成功；v052—v057 源文件彼此独立，旧版不覆盖。", "Actual v056 close-up revealed a large inserted-looking triangular rock face, so the model was rejected. v052–v057 are independent native Blender files and earlier versions remain available.")
      },
      {
        title: text("当前保留源文件", "Retained native Blender candidate"),
        detail: text("v057 原生文件 SHA256 为 f1577c12cd0bbb539adbda9b933a4c26bb3c4f2b70e98d567d29b4106b3a4d61。真实截图均来自这一已保存的模型或明确标记的失败版，不能用作艺术完成证明。", "The native v057 model SHA256 is f1577c12cd0bbb539adbda9b933a4c26bb3c4f2b70e98d567d29b4106b3a4d61. Every capture is from the saved model or an explicitly rejected native trial; none establishes art sign-off.")
      }
    ],
    limitations: [
      text("虽然岩层方向和崖壁底部有所调整，C 字形的前湖环岸仍然过于像人工蓄水池；v057 与最高 Mother Composition 差距明显，当前不建议替换 Unity 正式世界。", "Despite different rock directions and cliff slopes, the C-shaped retaining rim still resembles an artificial reservoir. v057 remains visibly far from the master composition and is not recommended as a Unity production-map replacement."),
      text("旧网格拓扑已经成为视觉瓶颈。靠降低、拉伸、零星切角很难从根本上改掉环形峡谷，下一次需要在锁定瀑口、河道和灯塔后局部重建前崖几何轮廓。", "The legacy mesh topology is the visual bottleneck. Incremental lifts, stretches and small cuts cannot reliably remove the artificial ring; the front escarpment needs topology-level reconstruction while preserving the river, outlet and lighthouse."),
      text("尚未完成全网格自交、路径、碰撞、Unity 导入与最终水墨材质回归；技术和美术都保持待验证状态。", "Full mesh-intersection, navigation, collision, Unity import and ink-wash material regression remain unverified. Both technical and art statuses are pending.")
    ],
    nextStep: text(
      "不再沿 C 字形旧外墙逐段雕泥塑。下一轮应该先重新画多折面悬崖的开放前缘轮廓，再重建局部岸床与水面交接处的真正拓扑，确保水只在所需出口形成瀑布。固定相机和母图将继续作为最高验收参考。",
      "Stop incrementally sculpting around the old C-shaped wall. Redraw an open faceted escarpment silhouette, then reconstruct the local cliff/shore topology around the river and waterfall while keeping all protected landmarks and evaluating the master reference from fixed cameras."
    ),
    comparison: [
      image("v032-08-v051-v057-close.png", "近景对比：旧平滑盆壁与局部斜切岩面", "Close-up: original smooth rim vs local angular geology", "这组是相同 Blender 相机下的真实岩体变化；外圈人工环墙仍未彻底解决。", "True same-camera rock changes, but the old artificial enclosing rim remains unresolved.", 1960, 610),
      image("v032-09-v051-v057-top.png", "俯视：湖面范围不变、干岸有局部调整", "Top view: same water footprint with changed dry shore", "水网没有被再缩小；检查旧 C 字形环岸仍存在的问题。", "Water was not further narrowed; the C-shaped ring remains a known failure.", 1960, 610),
      image("v032-10-v051-v057-main.png", "主视：同机位实机灰模", "Overview: native fixed-camera clay comparison", "未移动任何主镜头，重点看蓝域实际可见体量变化。", "No main-camera changes; evaluates visible blue-region massing.", 1960, 610),
      image("v032-11-v055-v056-failure.png", "否决 v056：灯塔山脚变成大三角", "Rejected v056: triangular lighthouse-foot protrusion", "左为继承基底，右为错误扩建；该错误没有进入最终候选。", "The rejected triangular expansion on the right was not kept in the retained candidate.", 1960, 610),
      image("v032-12-mother-v057.png", "最高母图与 v057 灰模", "Master composition versus v057 clay", "如实保留美术差距，不宣称已达到目标。", "Documents the remaining art discrepancy; no acceptance claimed.", 1960, 610)
    ],
    gallery: [
      image("v032-01-v057-main-grey.png", "v057 · 固定主视", "v057 · fixed clay overview", "来自保存的真实 Blender 工程。", "Native render from the saved Blender project."),
      image("v032-02-v057-main-color.png", "v057 · 三域淡彩主视", "v057 · muted three-region overview", "诊断用配色，不是正式材质。", "Diagnostic colours, not final materials."),
      image("v032-03-v057-blue-top.png", "v057 · 蓝域俯视", "v057 · blue-region top", "检查水陆分配与人工环岸问题。", "Reviewing water/land massing and the circular-rim issue."),
      image("v032-04-v057-local-close.png", "v057 · 灯塔与前崖近景", "v057 · lighthouse and front cliff close-up", "主要观察面片与前缘岩层。", "Inspection of facets and escarpment layers."),
      image("v032-05-v057-blue-side.png", "v057 · 蓝域侧视", "v057 · blue-region side view", "对照高位水和下海的悬崖高差。", "High lake and lower sea cliff-height relationship."),
      image("v032-06-rejected-v056.png", "否决 v056 形体", "Rejected v056 geometry", "山体多出不自然的三角形巨块。", "Unnatural triangular projection from the mountain base."),
      image("v032-07-v052-diagnostic.png", "岩体对象分色诊断", "Object-colour terrain diagnostic", "显示前崖与左岸是同一块绿色实体网格，非独立拼接石块。", "Confirms the front cliff and left shore belong to the same green solid rock mesh.")
    ]
  },
  {
    id: "v031",
    date: "2026-11-15T02:12:09+08:00",
    title: text("Blender 蓝域轮廓重做：收窄左湖，水湾向右前方弯出", "Blender blue-region reshaping: narrower left lake, forward-right curved bay"),
    summary: text(
      "按俯视图反馈，撤回 v046 在湖里顶出两块岩岬的方案，回到没有岩岬的 v043。逐行测量原高位水域，确认前湖左侧由约 300 米宽的河道骤增为 600 多米宽的湖面。先后尝试 v047 的大幅抬湖床与 v048、v049 的水平拉伸，实际渲染出现巨大土坡、岩帘和裂缝，均否决。v050 依据旧湖床实际高程，将左侧多余水域收回为与原陆地相连的浅坡；v051 在同一地形网格上增加不同方向的大块岩层切面。湖面保持单体与平滑曲线，主体逐渐向右前鼓出，原有灯塔、石桥、瀑口及镜头不动。该版是更稳定的构图候选，但前缘人工环形岩岸仍需精修，未通过美术总验收。",
      "The new review rejects v046's protruding capes and restarts from clean v043. Measured cross-sections confirmed that a roughly 300 m upstream river spread into a 600+ m-wide left forelake. v047's extreme uplift and v048/v049's broad planar warps were rejected after native renders revealed huge wedges, geological curtains and cracks. v050 instead uses surveyed lakebed elevation to form a shallow connected shore while clipping only the oversized left water; v051 adds large directional strata on the same rock mesh. The smooth upper water now bends forward-right. Lighthouse, bridge, spillways and cameras stay fixed. This is a safer composition candidate, not an accepted final landscape: the old ring-like front cliff still needs art work."
    ),
    technicalStatus: "pending",
    artStatus: "revision-needed",
    changes: [
      text("从 v043 独立另存多轮候选，完全放弃 v046 往湖内顶出两块凸起岩肩的错误造型。", "Returned to a clean independent v043 baseline, abandoning v046's two protruding interior headlands."),
      text("实际扫描蓝域水位、岸床与多条俯视剖面：v=−240 米处的原有水宽约 660 米，后方河道约 300 米；明确问题是左侧整体水面过宽，而非缺少湖中装饰。", "Surveyed actual terrain and lake cross-sections: at v=−240 m the former water was roughly 660 m wide versus a roughly 300 m river upstream. The issue was over-broad water to the left, not missing decorative rocks."),
      text("否决 v047、v048、v049：过度抬高地形或水平拉扯旧网格产生无法接受的巨型坡面、薄岩带与破缝，所有失败截图和工程保留用于复盘。", "Rejected v047, v048 and v049; excessive vertical uplift or horizontal warping produced large artificial wedges, thin rock strips and visible cracks. Their files and genuine failed renders remain preserved."),
      text("v050 只对旧湖床浅层抬高，最大约 25.4 米，不再上抬百余米；在现有湖面对象上重建水面三角网，形成前湖向右前方弯出的收窄主体。", "v050 raised the surveyed bedrock shelf by at most about 25.4 m—not hundreds of metres—and retriangulated the original water object to create a narrowed, forward-right bend."),
      text("v051 在同一实体岸床上添加两组非均匀斜切地层，局部最多再抬约 16.3 米；未新增独立岛屿、环形外堤、第二水面，也未移动固定镜头与灯塔。", "v051 formed two nonuniform angled strata across the same underlying bank, raising it at most a further 16.3 m locally. No islands, exterior ring, second water body or camera/landmark shifts were introduced.")
    ],
    checks: [
      { title: text("真实水宽对照", "Actual cross-section widths"), detail: text("在相同的世界坐标 v=−240 米剖面，原 v043 约 660 米宽，新 v051 约 350 米；在 v=−300 米，新水道约 240 米宽，延续向右前收束的弧线。此为地形 UV 中的水平剖面，并非相机截图像素宽度。", "At the same world-space v=−240 m cross-section, water width changed from roughly 660 m in v043 to 350 m in v051. At v=−300 m the channel is about 240 m wide and bends toward the front-right. These are terrain-plane measurements, not screenshot pixel lengths.") },
      { title: text("上层水域面积与连通", "Upper-water area and connectivity"), detail: text("高位水面从 452,585.9 平方米调整为 382,239.2 平方米，减少约 70,346.7 平方米（15.5%）。最终仍是一个连续水网，8,815 个三角面，水位维持 −225 米；上游河道、前湖出口均得到保留。", "Upper water area fell from 452,585.9 m² to 382,239.2 m², a reduction of roughly 70,346.7 m² (15.5%). The result remains a single continuous network of 8,815 triangles at −225 m, retaining upstream and forelake outlet witnesses.") },
      { title: text("实地形岩床抽样", "Actual terrain-bed sampling"), detail: text("从实际评估后的岩体顶面向下抽检最终水面 2,939 个三角形位置，发现漏床 0 处、穿水岩体 3 处；这 3 处均位于未修改的远处旧网格，原 v043 在相同测试方案下有 5 处。仍不能算完整技术验收。", "Across 2,939 final-water triangle samples, evaluated rock geometry showed no missing bed and three small exposed-rock intersections, located in distant unchanged older geometry; the v043 baseline had five in the same test. This is not full technical acceptance.") },
      { title: text("保留原件、地标与 16:9 实拍", "Preserved originals, landmarks and native renders"), detail: text("v043 原件、v047 至 v051 独立文件均保留；v051 SHA256：9b800cbecd24bca4e85ec2599e7f87efb332907cf6474f365adecf106a9fed57。灯塔山、石桥、两瀑口和 54 台相机保持不变，5 张 1920×1080 主视/俯视/近景/侧视/淡彩图均真实渲染于 v051。", "The original v043 and independent v047–v051 files remain intact. v051 SHA256: 9b800cbecd24bca4e85ec2599e7f87efb332907cf6474f365adecf106a9fed57. Lighthouse, bridge, two falls and 54 cameras retain their placement; five genuine 1920×1080 views come from v051.") },
    ],
    limitations: [
      text("虽然水域由左侧大圆盆改为渐窄、向右前弯的水湾，但旧前缘石墙仍有明显人工环形感，左岸新露出的部分岩面也比较平，尚不能称为真实地质效果。", "The lake now narrows into a forward-right curve rather than a broad left bowl, but the original front stone rim still looks artificially circular and portions of the reclaimed bank are too flat for a finished natural-geology treatment."),
      text("后岸、灯塔山及外湖岸并未整体重做。新地形还没有完成全网格自交、碰撞、路径导航和 Unity 导入回归；本轮艺术状态仍为需要继续修订。", "The rear coast, lighthouse hill and entire outer shore have not been fully rebuilt. Complete intersection, collision, navigation and Unity-import regressions remain undone; art status stays revision-needed."),
      text("v047 的高土坡和 v048 的破碎岸面是明确失败案例，不将它们用于下一轮基底；v051 只是当前最稳的可回退候选，不应直接替换正式 Unity 地图。", "v047's giant bank and v048's torn coast are explicitly rejected. v051 is a stable, reversible candidate rather than an approved replacement for the Unity scene.")
    ],
    nextStep: text(
      "围绕 v051 继续精修前缘圆形人工岩墙，将其处理为有主次切片和自然破角的开放海岸，同时强化左岸与后岸的地层连接。所有后续改动仍需保留前缘瀑布、灯塔和右前弧形水道，固定俯视及主镜头逐轮真实验收。",
      "Continue from v051 by replacing the circular-looking front retaining rim with an open rocky coastline of hierarchical large and small angular strata, and better integrating the left/rear banks. Preserve the front waterfall, lighthouse and forward-right water curve, reviewing actual overhead and fixed-camera captures each round."
    ),
    comparison: [
      image("v031-08-v043-v051-blue-top.png", "俯视对照：大圆湖 → 右前弯水湾", "Top comparison: oversized bowl → forward-right curve", "v043 与 v051 的相同真实俯视镜头；这是本次最重要的轮廓修改。", "Matching genuine top views, the principal planform change in this round.", 1960, 610),
      image("v031-09-v043-v051-local-close.png", "灯塔近景：左岸从大水面变成连续岩岸", "Lighthouse close-up: water replaced by connected shore", "仍能看到前缘人工岩墙，保留问题供下一轮精修。", "The artificial front rim remains visible and is not concealed.", 1960, 610),
      image("v031-10-v043-v051-main-grey.png", "固定主视：三域整体与蓝域占比", "Fixed overview: regional scale and blue share", "真正相同镜头，用于观察蓝域水陆体量变化是否可读。", "Same authentic camera, used to judge the water/land massing shift.", 1960, 610),
      image("v031-11-mother-v051.png", "最高母图与 v051 原生灰模", "Mother reference and native v051 clay", "左为最高母图，右为实际 Blender 渲染；不将技术连通等同美术通过。", "Master reference versus actual Blender render; topology is not art approval.", 1960, 610)
    ],
    gallery: [
      image("v031-01-v051-main-grey.png", "v051 固定主视灰模", "v051 fixed overview clay", "16:9 实际 Blender 输出，镜头位置未更改。", "Actual 16:9 Blender render with the original camera."),
      image("v031-02-v051-main-color.png", "v051 蓝黄红淡彩体块", "v051 three-region muted clay", "淡彩为审查区域关系，不是最终材质。", "Colour identifies regions, not final materials."),
      image("v031-03-v051-blue-top.png", "v051 蓝域真实俯视", "v051 true blue-region top", "湖湾轮廓向右前方收束，左岸不再大片铺水。", "The bay narrows and turns toward the right front, reducing the left water bowl."),
      image("v031-04-v051-local-close.png", "v051 岸坡与灯塔近景", "v051 bank and lighthouse close-up", "便于检查新岸的切片效果及残留问题。", "Shows new angled strata and remaining unfinished details."),
      image("v031-05-v051-blue-side.png", "v051 蓝域真实侧视", "v051 blue-region real side", "观察湖水、岸坡与前缘悬崖的高差。", "Elevation relationship of water, banks and forward cliff."),
      image("v031-06-rejected-v047.png", "否决 v047：过高地形形成岩帘", "Rejected v047: excessive uplifting rock curtains", "失败截图公开记录，不冒充完成版。", "True failed render retained as transparent evidence."),
      image("v031-07-rejected-v048.png", "否决 v048：旧网格水平拉裂", "Rejected v048: horizontally torn legacy mesh", "水平压缩虽然使水湾变窄，却造成不可接受的结构破坏。", "Planform became narrower, but inherited mesh geometry tore under horizontal warping.")
    ]
  },
  {
    id: "v030",
    date: "2026-11-15T01:15:09+08:00",
    title: text("Blender 蓝域体量重分配：两道折面山肩切入空湖", "Blender blue-region massing: faceted hill shoulders reclaim lake space"),
    summary: text(
      "针对 v043 蓝域前湖太大太空、山体显得小而单薄的问题，本轮直接在原有蓝域承托岩床上试雕塑两道不对称的折面岬角：一处从灯塔侧山脚压入湖中，另一处从左侧山岸延伸。水体、外湖轮廓、灯塔、石桥、瀑口和固定镜头均不移动。v044 初稿突起太陡、像人工岩盒而被否决；v045 调整连接与坡度；v046 形成从山侧高、向湖侧降低的多面折脊。最终保留 v046 为可回退的艺术候选，实际可见水面抽样减少约 6.6%，水路未被截断，但湖盆环岸仍明显过圆，未通过整体美术验收。",
      "To address the oversized, visually empty lake and under-scaled hills in v043, this pass sculpted two asymmetric angular headlands directly out of the existing blue rockbed: one projecting from the lighthouse-side hills and another advancing from the left coast. The water mesh, external lake boundary, lighthouse, bridge, spillways and fixed cameras remain intact. v044 rose too abruptly and was rejected as box-like; v045 softened and attached the shoulders; v046 introduced stronger directional rock strata, higher inland and tapering toward the water. v046 is retained as a reversible art candidate. Sampled visible water coverage fell by 6.6% without obstructing the water route; the old circular lake rim still needs correction."
    ),
    technicalStatus: "pending",
    artStatus: "revision-needed",
    changes: [
      text("从 v043 原始硬面风格工程独立保存 v044、v045、v046；未叠加外围山墙、独立岛屿对象或第二张水面。", "Built independent v044, v045 and v046 projects from the preserved faceted v043, adding no exterior enclosing wall, separate island object or second water plane."),
      text("仅修改现有 V007_Blue_Near_Cape 的 10,283 个网格顶点，以两片不规则多边形占地和有方向的折脊塑造岸地；最大世界高度调整约 83.9 米。", "Modified only 10,283 vertices of the existing V007_Blue_Near_Cape mesh, using two irregular polygonal extents and directional facet ridges; maximum world-height change is approximately 83.9 m."),
      text("重点从塔山近岸和左侧山岸向内湖推进，山体靠近内陆更厚、接近水面逐步变低；从视觉上打断整片空水皮，而不缩小原湖水对象。", "The lighthouse and left coastal shoulders now project toward the inner lake, with bulkier uphill sides descending toward the water to break up the empty visible surface without shrinking the actual lake object."),
      text("v044 出现过高的块状岩台后主动否决；v045 调整山脚联系，v046 以多方向倾斜面取代单一水平平台。保留所有版本以供回退。", "Rejected the excessively box-like v044. v045 reinforced the landward transition, and v046 replaced flat mesa-like tops with multiple inclined rock planes. Every candidate remains saved for rollback."),
      text("没有改动海岸外轮廓、营地尖角、黄红域、灯塔、桥、两处瀑布及 54 台相机；沿用 v043 的岩体多切面与原水面平滑效果。", "Preserved the outer coast, pointed campsite, yellow/red domains, lighthouse, bridge, both waterfalls and 54 cameras, retaining v043's angular rock treatment and original smooth water.")
    ],
    checks: [
      { title: text("可见湖面的实际减少", "Measured visible-water reduction"), detail: text("在固定蓝域采样窗口以 12 米间隔比较原 v043 与 v046 的水面被岩岸遮挡情况：原有 1,536 个可见水面位置，新版为 1,435 个，减少 101 个，约 6.58%。这是限定窗口内的可见面积估计，不是水体对象面积减少。", "A 12-metre sampling grid across the fixed blue-region window found 1,536 visible-water locations in v043 versus 1,435 in v046: 101 fewer, a 6.58% reduction. This estimates visible water in the sampled region, not a reduction in water-mesh area.") },
      { title: text("水面与瀑口保护", "Water and outlet protection"), detail: text("原有 9,355 个高位水面三角面完全保留，水位仍为 −225 米；从上游河谷到前方湖口的采样连通路径未阻断。未新增外围水面，也没有删减原水体。", "All 9,355 upper-water triangles remain intact at −225 m. A visible-water connectivity grid retains a path from the upstream valley to the foreground outlet. No exterior water was added and none of the original upper-water mesh was deleted.") },
      { title: text("地标与源文件独立", "Landmark and source preservation"), detail: text("灯塔山本体、塔身、桥梁和瀑布对象保持原网格和变换；54 台相机变换与镜头参数保持。v046 独立工程 SHA256 为 a5b8b712766bcc821fc71c094f2815876a457672c7c28ba15d48c10bdc973993。", "Lighthouse landmass, tower components, bridge and waterfall object geometry/transforms are unchanged; all 54 cameras retain their transforms and lens settings. Independent v046 model SHA256: a5b8b712766bcc821fc71c094f2815876a457672c7c28ba15d48c10bdc973993.") },
      { title: text("真实 16:9 多机位", "Genuine 16:9 multi-angle renders"), detail: text("主视、灯塔近景、蓝域俯视、侧视与淡彩识别图均由保存的 v046 Blender 原生工程真实渲染；比较图为相同镜头的 v043 与 v046 拼接。", "Overview, lighthouse close-up, blue top/side and muted-region images were genuinely rendered from the saved v046 Blender source; comparisons juxtapose v043 and v046 from matching cameras.") }
    ],
    limitations: [
      text("可见水面只减少约 6.6%，并未彻底解决湖过大、形状过圆的问题；现有前湖仍显得像一片被环岸围住的空水盘，当前只能作为体量实验。", "Only about 6.6% of sampled visible water has been reclaimed; the lake remains overly large and circular, with an old ring-like retaining bank. This is a massing experiment, not a complete design fix."),
      text("岩岬的斜切面仍有部分规整、人工感，且目前没有对整张模型进行高精度布尔自交、角色移动、碰撞与 Unity 运行时回归。", "Some new planar cliff sections are still rather regular and artificial. High-resolution self-intersection, navigation, collision and Unity runtime regressions have not been completed."),
      text("旧湖盆外围在本轮未修改，避免重演 v035 大幅外扩的问题；后续不能把限制修改范围理解为要求保留不合理的整圈高墙。", "The original outer lake geometry was left untouched to avoid repeating v035's runaway exterior expansion. Preserving the editing boundary does not mean the unrealistic ring wall should be artistically accepted.")
    ],
    nextStep: text(
      "以 v046 的原生工程为体量对照，继续针对灯塔山肩与左岸接合处去掉过于规则的岩面，同时优先解决旧湖盆的环形高岸；保持前方瀑口、开放水岸、单一水路和冻结镜头，必要时回退到 v043。",
      "Use v046 as the massing reference, refine still-regular facet transitions at the lighthouse and left shore, then correct the pre-existing artificial circular bank. Keep the spillway, open shore, continuous water route and frozen cameras, with v043 available for rollback."
    ),
    comparison: [
      image("v030-07-v043-v046-main.png", "相同固定主视：v043 → v046", "Same fixed overview: v043 → v046", "对照山肩向湖内延伸后主视可见水面是否减少，以及湖仍然过空的地方。", "Compare how landward shoulders reclaim visible lake area, including what remains overly empty.", 1960, 610),
      image("v030-08-v043-v046-local.png", "灯塔近景：岩面体量与水岸", "Lighthouse close-up: facet massing and shore", "实际网格变化，不是二维贴片；水仍平滑，岩面朝湖方向降低。", "Genuine mesh changes, not a painted overlay; smooth water and descending angular geology.", 1960, 610),
      image("v030-09-v043-v046-top.png", "俯视：水路连续、外围保持", "Top view: open water, unchanged exterior", "可看出两个不对称岸岬和仍未解决的湖盆圆形外岸。", "Shows the two asymmetric rocky projections and the old unresolved circular rim.", 1960, 610),
      image("v030-10-mother-v046.png", "最高母图与 v046 实机", "Master reference versus native v046", "母图仍为绝对构图与造型最高参考，本版未宣称通过。", "The mother reference remains authoritative for all shape and composition checks; v046 is not art-approved.", 1960, 610)
    ],
    gallery: [
      image("v030-01-main-v046.png", "v046 固定主视灰模", "v046 fixed overview clay", "真实 1920×1080 Blender 渲染。", "Native 1920×1080 Blender capture."),
      image("v030-02-local-v046.png", "v046 灯塔与湖岸近景", "v046 lighthouse and shore close-up", "重点检视不对称岩肩、折面大小与人工感。", "Inspecting asymmetric rocky shoulders, facet size and remaining artificial planes."),
      image("v030-03-top-v046.png", "v046 蓝域俯视", "v046 blue top view", "保留原水网和外侧轮廓，新增地貌位于原湖水内侧。", "Original water network and exterior remain, with land rising inside the former lake footprint."),
      image("v030-04-side-v046.png", "v046 蓝域侧视", "v046 blue side view", "检查山体相对湖面的高度。", "Verifying relative rock and lake heights."),
      image("v030-05-color-v046.png", "v046 三域淡彩结构识别", "v046 muted three-region overview", "淡彩仅用于识别体量，非最终水墨材质。", "Muted colour identifies terrain massing, not final ink-wash materials."),
      image("v030-06-rejected-v044.png", "否决的 v044 高岩台", "Rejected v044 box-like rock mesa", "第一轮过于突兀，故另存重做 v045 与 v046。", "First attempt rose too abruptly and was replaced by v045/v046.")
    ]
  },
  {
    id: "v029",
    date: "2026-11-14T19:00:08+08:00",
    title: text("Psykeidos 地貌风格试验：多边形硬折面，水面保留曲线", "Psykeidos geology style test: angular rock planes, smooth water"),
    summary: text(
      "从 v040 独立试验整体地貌的多边形切面语言，回应原模型山坡、峡谷和岸壁过于圆滑的问题。v041 仅取消地形平滑着色，实际渲染出现密集碎三角纹理，判为不合适；v042、v043 进一步在蓝、黄、红地貌采用可撤销的 Decimate 减面修改器与硬面法线，形成更大、方向不同的斜切岩面。最终保留 v043 作风格候选，水、瀑布、塔桥及相机均未改动。前湖沿岸原本过圆的围岸仍存在，需要另行重塑，不能视为美术验收通过。",
      "Starting from immutable v040, this pass tests a more polygonal art direction across blue, yellow and red rock masses. Simply disabling smooth normals in v041 produced excessive tiny triangle noise and was rejected. v042 and v043 instead combine unsmoothed face normals with reversible decimation modifiers to produce fewer, larger, differently oriented rock planes. v043 is retained as a style candidate; water, waterfalls, landmarks and cameras remain unedited. The old overly circular forelake bank remains a separate art problem."
    ),
    technicalStatus: "pending",
    artStatus: "revision-needed",
    changes: [
      text("把“地貌多切面、水流保留平滑曲线”作为分开的两种造型规则，不再整场景统一抹圆。", "Separated polygonal terrain geology from the smooth curvature intended for water."),
      text("v041 仅取消平滑法线，实机发现高密度微小三角纹，否决这种假低模效果。", "v041 switched off terrain smoothing only, but dense microfacets made the result noisy and were rejected."),
      text("v042 与 v043 针对蓝域海岸、灯塔山、黄域丘陵、红域山峰等地貌单独调整面片密度，采用非破坏性可调节减面修改器。", "v042/v043 applied independent, non-destructive face-density settings to the blue coast, lighthouse hill, yellow highlands and red mountains."),
      text("保留 v040、v041、v042 和 v043 独立原生工程。未重新生成湖水、未增建前湖外围岩圈，灯塔、桥、瀑口及相机保持不变。", "Preserved all four standalone Blender models, without regenerating water, adding an outer rock ring, or editing lighthouse, bridge, outlets or cameras.")
    ],
    checks: [
      { title: text("蓝域实际渲染", "Blue-region native rendering"), detail: text("固定主视、灯塔近景、蓝域俯视与侧视，以及主视淡彩识别图，均从 v043 保存工程真实渲染，不是二维叠图伪装模型。", "Fixed overview, lighthouse close-up, blue-region top/side and muted-colour view were rendered natively from the saved v043 model, not fabricated 2D model edits.") },
      { title: text("硬面与水面分离", "Faceted terrain, smooth water"), detail: text("共 29 个地貌对象切换到多边形面法线，其中 15 个主要地形对象使用不同强度的可撤销减面修改器；原始水体三角面数量与平滑法线设置保持不变。", "Twenty-nine terrain objects use flat polygon normals and fifteen major terrain objects gain separately tuned, reversible decimation modifiers. Water topology and smooth shading remain unchanged.") },
      { title: text("湖床抽样回归", "Sampled lakebed regression"), detail: text("对 9,355 个高位水面三角形间隔抽样 1,560 个位置：v040、v042 与 v043 均为 0 个漏床、0 个岩体穿出水面。减面改变评估后的地形面数，但原始网格数据不被覆盖。", "Across 1,560 sampled positions from 9,355 upper-water triangles, v040, v042 and v043 each showed zero missing bed and zero exposed rock. Decimation changes evaluated terrain geometry while preserving original base meshes.") },
      { title: text("版本可回退", "Independent model and reversibility"), detail: text("v043 SHA256：84d5b0dc0a47fccdcfb3d9b48f71b5480f91d05cb6b3c0ef751e3f38d1406222。减面为 Blender 修改器，可直接禁用或调节比例，未经应用，不覆盖 v040 基线。", "v043 SHA256: 84d5b0dc0a47fccdcfb3d9b48f71b5480f91d05cb6b3c0ef751e3f38d1406222. Decimation remains editable and unapplied; v040 is not overwritten.") }
    ],
    limitations: [
      text("该轮改变的是地貌光照切面和评估后的面片疏密，并没有完成方向明确的手工断层雕刻。部分三角面仍偏均匀，需要进一步塑造大块不等距、棱脊有层次的岩层。", "This pass changes facet normals and evaluated polygon density, not a fully hand-sculpted fault and stratum system. Some triangles remain uniform; larger irregular planes and stratified ridges are still needed."),
      text("前湖盆的旧圆形岸壁和灯塔山脚关系仍未符合最高母图；水系虽然平滑连通，但不代表外围地貌的造型已经正确。", "The old round forelake bank and lighthouse foothill relationship still differ from the master composition. Smooth connected water does not establish shoreline art approval."),
      text("本轮没有完整测试 Unity 导入、碰撞、路径与所有地形布尔自交；水面抽样不等于整项技术验证。", "Unity import, collision, traversal and full self-intersection checks were not rerun. Sampled water support is not a full technical sign-off.")
    ],
    nextStep: text(
      "下一轮按大块不规则平面与分层棱脊造型，手工处理灯塔山及蓝域岸壁，优先消除前湖外围圆形高墙的视觉语言；河流水面、灯塔、桥与固定镜头必须保留，并在每轮真实渲染中比较。",
      "Next sculpt asymmetric broad rock planes and layered ridges at the lighthouse and blue coast, especially replacing the circular visual language of the forelake retaining wall. Preserve river water, lighthouse, bridge and fixed camera and compare in native renders."
    ),
    comparison: [
      image("v029-07-v040-v043-main.png", "固定主视：弧形 v040 与多切面 v043", "Fixed overview: rounded v040 vs faceted v043", "相同固定镜头的真实灰模，用来检查整体蓝黄红三域的造型变化。", "Same camera and genuine blockout captures showing the style shift across all regions.", 1960, 608),
      image("v029-08-v040-v043-close.png", "蓝域近景：山坡与岩壁切面比较", "Blue close-up: angular geology comparison", "v043 的灯塔山与前岸切面更大，水面则保留平滑。", "The lighthouse and bank show larger planar faces in v043, while water stays smooth.", 1960, 608),
      image("v029-09-v041-v043-close.png", "错误的微三角纹理 vs 大块岩面", "Tiny-triangle failure vs larger planar rock faces", "左侧 v041 只取消平滑产生高密度纹理，已否决；右侧为减面后的 v043。", "Rejected v041 merely disabled smoothing, creating small facets; v043 reduces geometry density.", 1960, 608),
      image("v029-10-mother-v043.png", "最高母图与 v043 实机主视", "Master reference vs native v043 overview", "这是审美差距记录，不表示符合母图或已经被验收。", "Documents the remaining visual gap rather than claiming master-reference acceptance.", 1960, 608)
    ],
    gallery: [
      image("v029-01-faceted-main.png", "v043 16:9 主视灰模", "v043 16:9 fixed clay overview", "蓝黄红三域的地貌切面层次。", "Terrain face hierarchy across blue, yellow and red."),
      image("v029-02-faceted-local.png", "v043 灯塔山局部近景", "v043 lighthouse close-up", "清晰查看地形面片大小与方向。", "Inspecting size and direction of real terrain facets."),
      image("v029-03-faceted-blue-top.png", "v043 蓝域俯视", "v043 blue-region top", "用于检查水域范围与岸线是否保持。", "Reviewing preserved water extent and shore."),
      image("v029-04-faceted-side.png", "v043 蓝域侧视", "v043 blue-region side", "检查多切面后山体和上下水位的层级。", "Checking faceted hills and height separation between water levels."),
      image("v029-05-faceted-color.png", "v043 淡彩主视", "v043 muted region overview", "配色仅用于识别地貌，非最终材质。", "Region colour remains diagnostic, not final art."),
      image("v029-06-rejected-flat-only.png", "被否决的 v041 微小三角纹", "Rejected v041 microfacet noise", "不将密集三角纹理冒充真正的大块硬面地貌。", "Dense triangles alone are not proper angular geology.")
    ]
  },
  {
    id: "v028",
    date: "2026-11-13T18:06:17+08:00",
    title: text("Blender 蓝域：只补灯塔左下缺失水面，不再改外湖岸", "Blender blue region: fill only missing lighthouse-left water, preserve outer shore"),
    summary: text(
      "恢复 Chat On Steroids 连接后，继续从 v038 独立另存 Blender v040。分色实机渲染确认前湖入口附近的橙色后岸和绿色前岸有重叠视觉，同时发现一批岩床已低于 −225 米水位、但高位水面没有覆盖的空缺。此次仅重建同一个高位水面的局部三角面片，补齐小范围缺水约 4,336 平方米；岩岸、湖盆外围、灯塔山、桥、瀑布和相机均不动。结构抽查通过，但旧环状岩岸的美术问题依旧存在，不作美术通过判定。",
      "After reconnecting to the desktop tools, a separate Blender v040 was built from v038. Object-coloured diagnostic renders exposed the overlapping back/near banks and a series of genuine gaps where the rockbed lay below −225 m but the upper-water mesh was absent. This pass retriangulates only the existing upper-water object, filling roughly 4,336 m² of missing local water without sculpting terrain, changing the outer lake, lighthouse, bridge, waterfalls or cameras. Structural sampling passes; the old circular-looking cliff rim still needs art work."
    ),
    technicalStatus: "pending",
    artStatus: "revision-needed",
    changes: [
      text("基于 v039 标记的唯一连接口检查高程、岩体归属和水面覆盖，不把上层水网连通性误当成视觉已解决。", "Surveyed terrain height, mesh ownership and actual wet coverage in the small v039-marked connector; topological connection alone is not treated as visual acceptance."),
      text("利用独立分色实机渲染辨识灯塔左下橙色后岸、绿色前岸及蓝色水面，确认部分空缺实质上是水面三角网遗漏。", "Rendered true object-coloured diagnostics for the orange back coast, green near cape and blue water, showing that some apparent separations were missing water triangles."),
      text("v040 只修改 V015 蓝域高位水面的已有网格；以原水体边缘为约束，重新三角化并在限定范围补水，没有创建第二张湖面或增添一圈外岸。", "v040 modifies the existing V015 upper-water mesh only. Constrained triangulation preserves the original shoreline while filling a tightly bounded gap—no separate pond or new exterior berm."),
      text("未修改任一地形网格，未动灯塔山、桥、瀑口或固定镜头，原 v038 保留。", "No terrain meshes, lighthouse, bridge, outlets or frozen cameras were edited; v038 remains intact.")
    ],
    checks: [
      { title: text("水域外圈保护", "Outer lake footprint protected"), detail: text("对连接口以外的水面覆盖范围以 10 米步长抽查，v038 与 v040 差异为 0。水位继续为世界坐标 −225 米。", "A 10-metre coverage comparison outside the local connector found zero differences between v038 and v040. World-space water elevation stays at −225 m.") },
      { title: text("局部真实补水", "Measured local water fill"), detail: text("原水面面积 448,249.51 平方米，新水面 452,585.94 平方米，增加约 4,336.43 平方米；原连接区域 5 米采样覆盖点为 916，新版为 1,084。", "Upper-water area increased from 448,249.51 to 452,585.94 m² (+4,336.43 m²). The count of locally wet 5-metre sample positions rose from 916 to 1,084.") },
      { title: text("单一水面与承托", "Single water mesh and rockbed"), detail: text("v040 高位水面为 1 个连通分量，5,172 顶点、9,355 个三角面。连接区域内 1,084 个水面覆盖采样位置没有检测到漏床或水面上方岩体穿插。", "v040 upper water remains one connected component containing 5,172 vertices and 9,355 triangles. No missing terrain bed or exposed rock was found across 1,084 wet positions in the local five-metre sample.") },
      { title: text("独立源工程与真实渲染", "Independent model and genuine renders"), detail: text("v040 原生源工程 SHA256：149adf7cd40057a5c5705ba05de3ec14845a38e1947c3e7c4bb3af9187d4ac2c。五张 1920×1080 的正式角度截图均来自这份已保存的模型。", "Blender v040 model SHA256: 149adf7cd40057a5c5705ba05de3ec14845a38e1947c3e7c4bb3af9187d4ac2c. Five native 1920×1080 angle captures were rendered directly from the saved model.") }
    ],
    limitations: [
      text("本轮仅补齐原有水面缺口，原来人工环形岩岸与山脚过渡仍然没有完成美术精修；不能将增水面积或连通分量数视为母图验收通过。", "This pass fills missing water only. The artificial circular bank and hill-to-water transition remain unresolved artistically; water area and component count do not establish mother-reference art acceptance."),
      text("新增三角网经过局部湖床抽样与外围覆盖保护，但尚未进行全场网格碰撞、行走路径、渲染材质、Unity 联调和完整物理回归。", "New triangles passed local lakebed sampling and outer footprint checks, but global mesh collisions, traversal, materials, Unity integration and a full physics regression remain outstanding."),
      text("诊断分色图及对比图是用于说明真实问题的评审资料，颜色并非最终美术材质，也没有伪装为完成地形。", "The object-colour and comparison images explain the observed issue; their colours are diagnostic, not final art materials.")
    ],
    nextStep: text(
      "下一轮继续严格以 v039 的内部连接口为唯一施工边界，重点去除橙色后岸和绿色前岸重叠造成的突兀岩舌；只在不改变外围轮廓与灯塔山体量的前提下修顺岸坡。每次修改后必须实际渲染并复验水面范围和湖床承托。",
      "Next work only inside the v039 connector boundary, smoothing the overlapping orange/green rock tongue while keeping the entire outer footprint and lighthouse mass unchanged. Every sculpt must be checked with genuine renders and water/bed sampling."
    ),
    comparison: [
      image("v028-07-v038-v040-close.png", "局部近景：原 v038 与补水 v040", "Local close-up: v038 versus filled-water v040", "同镜头真实渲染；新增水面只在内部缺口，不是外围陆地扩建。", "Real same-camera comparison; water fills internal gaps only, without exterior terrain expansion.", 1960, 610),
      image("v028-08-v038-v040-top.png", "蓝域俯视：外围形状不变", "Blue top view: unchanged outer boundary", "对照原有湖盆形状与内部补水范围。", "Compares the protected lake footprint with the small internal fill.", 1960, 610),
      image("v028-09-mother-v040.png", "原始母图与真实主视", "Mother composition and genuine overview", "结构仍未完全达到母图，美术状态保持待修。", "The terrain remains short of the master composition, so art acceptance stays pending.", 1960, 610)
    ],
    gallery: [
      image("v028-01-main-grey.png", "v040 固定主视灰模", "v040 fixed overview clay", "来自已保存 Blender 工程的 16:9 真实渲染。", "Genuine 16:9 render from the saved Blender model."),
      image("v028-02-main-color.png", "v040 三域淡彩主视", "v040 muted region overview", "用于区分区域结构，非正式材质。", "Region distinction only; not finished material."),
      image("v028-03-blue-top.png", "v040 蓝域俯视", "v040 blue-region top", "用于确认湖盆原有外缘未改变。", "Checks the unchanged outer forelake footprint."),
      image("v028-04-local-close.png", "v040 连接处近景", "v040 connector close-up", "补水后仍有需精修的山脚岩岸。", "The hill banks still need sculpting after the water repair."),
      image("v028-05-blue-side.png", "v040 蓝域侧视", "v040 blue-region side", "用于检查上湖与下海的高差关系。", "Shows height separation between upper lake and lower sea."),
      image("v028-06-diagnostic-source.png", "v038 岩岸对象分色诊断", "v038 source terrain ownership diagnostic", "橙色后岸、绿色前岸与蓝色水面来自实际 Blender 对象，帮助识别连接处缺水原因。", "Orange back-coast, green near-cape and blue water are real Blender objects, revealing missing water at the connector.")
    ]
  },
  {
    id: "v027",
    date: "2026-11-13T13:49:00+08:00",
    title: text("Blender 蓝域：锁定开放水岸与唯一连接处，停止外围扩建", "Blender blue region: lock open shoreline and the only editable inlet"),
    summary: text(
      "重新对照原始 Mother Composition 与现有蓝域实机俯视，确认前湖不应被新建的环形岸墙当作封闭水池。把 v035 的外围陆地扩建与湖面缩小明确列为禁改方案。以 v038 保留灰模为基础，独立保存 v039 评审指引：在 Blender 视图中添加不参与渲染的边界线，在真实俯视和近景上标记唯一允许修改的灯塔左下短连接处。v039 没有变更任何实体地形、水网或镜头，本轮用于锁定美术方向，不冒充模型修改成功。",
      "Reviewed the original mother composition against genuine Blender blue-region views. The projecting lake should not be treated as an enclosed pond requiring a new perimeter wall. The rejected v035 exterior expansion and lake shrinkage are explicitly forbidden. Starting from retained v038, an independent v039 review guide adds viewport-only lines and marked real top/close-up captures identifying just the short internal inlet below-left of the lighthouse. No terrain, water or camera meshes were changed in v039; it is an art-direction boundary lock, not a sculpting acceptance."
    ),
    technicalStatus: "pending",
    artStatus: "revision-needed",
    changes: [
      text("固定母图中的开放水岸关系：水沿连续山岸自然扩展，不能将前湖变为外圈围墙的水库。", "Locked the open-shore interpretation of the mother reference: the water broadens naturally against continuous coast, not into a reservoir with a new wall around it."),
      text("明确禁止把 v035 的外缘扩建和缩湖引入后续版本；现有 v038 的湖水覆盖范围及灯塔山体量是本轮的暂时保护基线。", "Prohibited reinstating v035's exterior expansion or shrunken lake. v038's water footprint and lighthouse mass are the current protected baseline."),
      text("只在灯塔左下内部连接带设置局部可编辑范围；青色水流轴线表达河道接入前湖，而不是一张新水面。", "Marked only the lower-left interior connector as editable; the cyan flow guide represents continuity, not a new water surface."),
      text("独立创建 v039 Blender 评审工程，添加四组仅在视图中显示的曲线。原始地形、水面、地标及所有相机的网格数量、变换保持不变。", "Created an independent v039 Blender review guide with four non-rendering viewport curves. Original terrain, water, landmarks and all camera geometry/transforms were verified unchanged.")
    ],
    checks: [
      { title: text("不改动已有几何", "No original geometry changes"), detail: text("v039 检查所有原有网格对象的变换、顶点与面数及可渲染状态，和 v038 基线一致；相机的变换与参数亦一致。", "v039 checks preserved all original mesh object transforms, vertex/face counts and render visibility, plus camera transforms and settings, against v038.") },
      { title: text("独立评审版本", "Independent review version"), detail: text("原 v038 完整保留。v039 单独保存，SHA256 为 dda0f97c49ca4b909939bd5d66bed8b5d297a576287fdd57713537694775c8ca；没有把指导曲线当作地形提交。", "v038 remains intact. The separate v039 guide has SHA256 dda0f97c49ca4b909939bd5d66bed8b5d297a576287fdd57713537694775c8ca, and its guide curves are not terrain.") },
      { title: text("真实截图标注", "Annotations on genuine captures"), detail: text("俯视、近景均来自 v038 保存工程的 1920×1080 原始 Blender 灰模，只叠加颜色与说明；不是渲染修改后的新地形。", "Both top and close-up images originate in true 1920×1080 v038 Blender captures. Coloured lines and captions were overlaid for review; they do not show newly modified geography.") }
    ],
    limitations: [
      text("当前仍有明显人工圆盆感，这份图示只是把设计意图与施工禁区明确下来，未修正湖岸模型；不能标记美术通过。", "The old bowl-like appearance remains. The guide clarifies intent and exclusion zones but does not yet correct the lake coast; art remains unaccepted."),
      text("绿色只表示原有湖面占地和外围位置不可进一步改动，不表示必须保留高出水面的规则围堤。后续需要在不改变范围的条件下处理不合理的围堤视觉。", "Green marks the protected water footprint and outer spatial position, not an endorsement of a raised artificial ring. Future sculpting must address the unnatural berm without enlarging the land or shrinking water.")
    ],
    nextStep: text(
      "以 v039 保护区域为边界，先测内部岩埂的真实高程，再仅修灯塔左下连接口。保留湖面范围和灯塔山，完成后重新从真实主视、局部近景、俯视和侧视验收，不扩大至外围重构。",
      "Using the v039 boundary lock, measure the true ridge profile first, then change only the short inlet below-left of the lighthouse. Preserve the lake footprint and lighthouse hill, and validate genuine overview, close-up, top and side views without revisiting the outer landscape."
    ),
    comparison: [
      image("v027-01-water-boundary-top.png", "蓝域俯视 · 施工禁区与水路", "Blue top view · locked shoreline and flow direction", "黄色为唯一可改范围，青色为连续水路轴线，绿色只锁位置和范围，不表示保留圆形围墙。标注依据真实灰模，并非新模型。", "Amber is the sole editable connector, cyan is the flow axis, green locks footprint only—not a circular wall. Annotation on a real blockout, not a new model."),
      image("v027-02-connector-close.png", "局部近景 · 只动连接处", "Close-up · connector only", "没有移动灯塔或外岸；画面用于避免后续再次误改整片湖。", "Lighthouse and outer shore are untouched; this is a scope guide for the next sculpting pass.")
    ],
    gallery: [
      image("v027-03-original-top.png", "v038 原始俯视（未标注）", "Original v038 top view without annotation", "提供无标注灰模供判断实际地形。", "Unannotated Blender reference for evaluating actual geometry."),
      image("v027-04-original-close.png", "v038 原始近景（未标注）", "Original v038 close-up without annotation", "旧盆口和内部割裂仍在，此图不是已完成修复。", "The former rim and separation still remain; this is not a finished repair.")
    ]
  },
  {
    id: "v026",
    date: "2026-11-13T13:26:00+08:00",
    title: text("Blender 蓝域返工：撤销外围重构，只修灯塔左下连接处", "Blender blue-region rollback: restore coast, edit only the lighthouse-left connector"),
    summary: text(
      "针对上一轮 v035 改动范围错误、在湖盆外侧增添大块地形并使灯塔山显小的问题，明确否决该版。重新从 v026 原件出发，保持灯塔山和前湖全部外围轮廓，仅在灯塔山左下、河道与前湖之间的短岩埂做平滑下沉，让原本分开的观感转为一处连续浅水连接。v036、v037 的布尔切割产生生硬缺口而被否决，保留 v038 局部塑形候选，并提供真实同镜头对照。美术仍需用户验收。",
      "The previous v035 iteration went outside the requested scope, added a large exterior land mass and made the lighthouse hill read smaller; that version is rejected. Restarting from untouched v026, v038 preserves the lighthouse and every outer forelake boundary, smoothly lowering only the short internal ridge connecting the river and forelake. Boolean-cut v036/v037 created hard openings and were rejected. Native same-camera comparisons are provided; art still awaits review."
    ),
    technicalStatus: "pending",
    artStatus: "revision-needed",
    changes: [
      text("v035 全域重构被撤销：不再采用新增的外围陆地、重新生成的外岸和变小的灯塔山视觉比例。保留历史文件仅供问题复盘。", "The v035 whole-landscape rebuild was rolled back; its oversized exterior, regenerated coast and visually reduced lighthouse mass are not retained. Historical files remain for review only."),
      text("从原始 v026 另存新工程，锁定灯塔山、外湖岸、石桥、瀑口及主视相机；仅操作左下连接处的后岸与前岸两块现有实体。", "Created new isolated models from v026, locking the lighthouse, original lake perimeter, bridge, outlets and main camera; only the two existing rock meshes at the local connection were sculpted."),
      text("v036、v037 使用局部布尔开口，但真实近景出现垂直切口和尖角，均被否决；v038 改为沿原网格平滑降低岩埂，不新建外围地形。", "v036/v037 attempted local Boolean cuts, but genuine close-up renders showed harsh creases and spikes. v038 instead smoothly lowers the existing ridge vertices without adding outer terrain."),
      text("v038 在原水面边界约束下只补齐连接处水面，其他岸线保持原状；水位仍为 −225 米。", "v038 extends only the short connecting segment of the existing planar water, preserving all other shoreline geometry and keeping the level at −225 m.")
    ],
    checks: [
      { title: text("原模型与灯塔保护", "Source model and lighthouse protection"), detail: text("v026 原件 SHA256 为 6a6b106e3945aee45d9d11b6b3a3c25aa93570f5bb2698320c32b1f770b775dd。新 v038 的灯塔山主体、塔身、桥梁、两处瀑口和原有摄像机经过脚本核对，保持原网格或变换参数。", "The v026 source keeps SHA256 6a6b106e3945aee45d9d11b6b3a3c25aa93570f5bb2698320c32b1f770b775dd. Script checks protected the headland, tower components, bridge, both falls and existing cameras.") },
      { title: text("外围轮廓未变", "Unchanged outer shoreline"), detail: text("围绕连接处排除局部范围后，以 10 米步长抽检原水面与 v038 的覆盖区域，发现 0 个差异点；两块被修改的岩体仅在连接带局部平滑下沉，未更改其网格拓扑。", "Outside the connector ROI, a 10 m coverage sampling comparison between original and v038 upper water found zero differences. The two affected rock bodies were smoothly lowered only within the connector band, with their topology preserved.") },
      { title: text("水网和局部湖床", "Water network and local lakebed"), detail: text("v038 上层水面为一个连通分量，4,431 顶点、7,907 个三角面。按 5 米网格复核连接区附近 2,959 个被水覆盖位置，未发现漏床和岩体穿出水面的情况；这仍不是全工程的技术回归。", "v038 upper water remains one connected component with 4,431 vertices and 7,907 triangles. A five-metre grid sampled 2,959 wet positions around the connector with no missing bed or exposed rock, but this does not constitute full project validation.") },
      { title: text("独立工程与真实截图", "Independent Blender source and native captures"), detail: text("v038 独立工程 SHA256 为 48ad5160006f67662b523cb6d455883c8fff165f3bcb4b6df4667c6616848adb，保留 v026、v035、v036 和 v037；展示的 1920×1080 灰模均为真实 Blender 渲染。", "The independent v038 model has SHA256 48ad5160006f67662b523cb6d455883c8fff165f3bcb4b6df4667c6616848adb. v026, v035, v036 and v037 remain preserved. All 1920×1080 blockout shots are genuine Blender renders.") }
    ],
    limitations: [
      text("本次只解决被错误扩大的修改范围与局部连接口，不将这一轮宣布为整体母图美术通过。湖缘的自然过渡和塔山规模观感仍须以主镜头及原始 Mother Composition 继续检验。", "This corrects the over-broad edit and local connection only, not the entire mother-reference composition. Natural banks and lighthouse visual scale still require final art review in the preserved camera."),
      text("脚本验证的是局部采样、保护对象及水面连通性，没有完成岩体全局自交、碰撞、路径、Unity 导入或完整项目回归。", "Checks cover local sampling, protected meshes and water connectivity; global intersections, collision, navigation, Unity import and full-project regression remain unverified."),
      text("v035 是明确否决版本，不作为继续施工基底。v038 是当前局部修正候选，并非自动通过美术验收。", "v035 is explicitly rejected as a future base. v038 is the current localized correction candidate, not automatically art-approved.")
    ],
    nextStep: text(
      "仅针对 v038 的连接口近景检查水岸是否自然贯通；如需继续，仍以 v026 外轮廓和灯塔体量为不可变条件，只微调局部过渡，不触碰湖盆外围。",
      "Review only the v038 connector close-up for natural water-to-land continuity. Further changes must keep the v026 outer perimeter and lighthouse scale fixed, adjusting only the local transition."
    ),
    comparison: [
      image("v026-07-v026-v038-close.png", "局部近景：原 v026 与仅改连接处的 v038", "Local close-up: v026 vs connector-only v038", "相同镜头，重点观察灯塔左下短岩埂与两片水面的衔接，不以新增外岸掩盖问题。", "Same camera shows the original short bank and newly opened local transition; no new outer coast is used.", 1960, 608),
      image("v026-08-v026-v038-top.png", "蓝域俯视：外圈不变", "Blue top view: original shoreline retained", "验证前湖外缘仍是 v026 形态，仅改变内部连接处。", "Confirms the forelake perimeter stays as in v026, with the edit confined to the inner connection.", 1960, 608),
      image("v026-09-v035-v038-main.png", "撤销错误外围：v035 与 v038", "Rejecting enlarged exterior: v035 vs v038", "左图为否决的额外外围地形，右图重新恢复 v026 的主视构图。", "The rejected oversized exterior appears left; right restores the original v026 composition.", 1960, 608),
      image("v026-10-mother-v038.png", "原始 Mother Composition 与新灰模", "Original mother composition and revised clay view", "母图永远高于灰模，v038 不改变母图约束。", "The mother reference remains authoritative over the blockout.", 1960, 608)
    ],
    gallery: [
      image("v026-01-local-v038.png", "v038 · 灯塔与湖盆近景", "v038 · lighthouse and forelake close-up", "独立保存工程的真实局部灰模，展示仅修改连接处。", "Native close-up of the saved model showing the local change."),
      image("v026-02-top-v038.png", "v038 · 蓝域俯视", "v038 · blue-region top", "外围轮廓保留，便于检查局部连通。", "Preserved outer lake footprint, with the connection visible."),
      image("v026-03-main-v038.png", "v038 · 固定主视 16:9", "v038 · fixed 16:9 overview", "与 v026 相机一致，灯塔山及其他区域均保留。", "Same original camera, lighthouse and other regions preserved."),
      image("v026-04-side-v038.png", "v038 · 蓝域侧视", "v038 · blue-region side", "对照水面与地形体量。", "Terrain volume and water-level relationship."),
      image("v026-05-color-v038.png", "v038 · 淡彩三域主视", "v038 · muted three-region overview", "仅用于识别区域，不代表最终材质。", "Colour is diagnostic, not final art."),
      image("v026-06-rejected-v035.png", "被否决的 v035 近景", "Rejected v035 close-up", "此前错误增加外围地形的案例，保留用于解释为什么回滚。", "Shows the unwanted outer-landmass changes that were rolled back.")
    ]
  },
  {
    id: "v025",
    date: "2026-11-13T12:44:00+08:00",
    title: text("Blender 蓝域重构：打通灯塔左下水湾与前湖盆", "Blender blue-region rebuild: unify lighthouse inlet, river and forelake"),
    summary: text(
      "针对灯塔山左下水域仍像两块独立池塘的问题，不再继续拉伸旧网格，而是实机重建了蓝域主体的一块连续实体地形，并依照新河谷重新生成单一高位水面。河道、桥下水湾、灯塔侧水路与前伸湖盆如今都位于同一个地形系统。最终保留 Blender v035，完整保留旧地形作隐藏档案。结构连通与抽样湖床检查通过，但外侧崖壁仍有规则的灰模条纹，整体美术尚未验收。",
      "Responding to the separated-looking water below-left of the lighthouse, this pass replaces the old split coast meshes with one contiguous closed terrain solid and regenerates one upper-water mesh across the river, bridge bay, lighthouse inlet and projecting forelake. The retained Blender v035 keeps the old terrain hidden for rollback. Connectivity and sampled lakebed checks pass, while the stepped outer rock faces still need artistic refinement."
    ),
    technicalStatus: "pending",
    artStatus: "revision-needed",
    changes: [
      text("v028 在真实三维岩体中尝试布尔开宽河谷，v029 重建水面；实机暴露水岸悬空和切割痕迹，两版均否决。", "v028 carved an actual 3D inlet with booleans; v029 regenerated the water. Native review revealed exposed gaps and cutting artifacts, so both were rejected."),
      text("v030 从 v026 基础重新采样，将后方海岸、前伸湖岸和灯塔山脚重建为一块闭合的连续地形；三块旧地形仅隐藏，没有删除。", "v030 resampled v026 to rebuild the mainland, forelake shores and lighthouse hillside as one closed continuous terrain; the three original source meshes remain archived and hidden."),
      text("v031 按实际新河谷重建同一张高位水面，删除 5 个面、约 36 平方米的离散残片；六个水路验证节点保留在唯一主体连通分量内。", "v031 regenerated one planar upper-water mesh on the actual riverbed, dropping only a five-face, roughly 36 m² detached fragment while retaining all six approved water witnesses in the main component."),
      text("v032 重新雕塑连续的灯塔山肩和湖盆过渡，v033、v034 分别处理外海崖壁与河岸，不再把每处水边都做成直立围墙。", "v032 resculpted the connected lighthouse shoulders and lake transition; v033/v034 refined the distinction between offshore cliffs and submerged riverbanks instead of treating every shore as an upright wall."),
      text("v035 依据最终真实地形重新裁剪水面，消除抽样发现的水面—岩岸穿插；没有移动灯塔、石桥、瀑口和冻结镜头。", "v035 reclipped the upper water to the final terrain, removing sampled water/rock overlaps while leaving the lighthouse, bridge, outlets and frozen cameras in place.")
    ],
    checks: [
      { title: text("实体地形一体化", "Single connected terrain solid"), detail: text("v035 蓝域主体网格包含 36,296 顶点、36,294 面，封闭边检查为 0 条非流形边；源自一块单连通实体，而非三个并列灰模。", "The v035 main blue solid has 36,296 vertices and 36,294 faces with zero nonmanifold edges and descends from one topologically connected terrain mesh rather than three adjacent blockouts.") },
      { title: text("上层水系连续", "Contiguous upper water"), detail: text("v035 最终高位水面为 4,703 顶点、8,510 个三角面，只有 1 个连通分量。上游、桥下、前湖盆、右支与两瀑入口六个节点均属于同一水网，水平水位 −225 米。", "The final upper water contains 4,703 vertices and 8,510 triangles in one connected component. All six witnesses—from upstream and bridge bay through forelake and right branch to two outlet inlets—remain connected at world elevation −225 m.") },
      { title: text("实际湖床抽样复核", "Actual lakebed sample validation"), detail: text("抽查 2,837 个最终水面三角形位置，漏床 0、水面上方岩体穿插 0；相较重裁剪前的 39 处穿插已修正。此为抽样，不等于全工程完整技术验收。", "Sampling 2,837 final water triangles found zero missing terrain bed and zero exposed rock above the water; 39 sampled overlaps found before reclipping were corrected. This is sampled evidence, not full technical sign-off.") },
      { title: text("独立版本与真实截图", "Independent files and actual renders"), detail: text("保留 v026 及 v028—v035 的独立工程记录。v035 源工程 SHA256 为 2ec47423865636bf6cd65f81c0593783e2a1f9a75ffd90d7424c223a9ff8dff2，7 张 1920×1080 无云渲染均来自这一保存工程。", "v026 and independent v028–v035 candidates remain intact. Retained v035 source SHA256: 2ec47423865636bf6cd65f81c0593783e2a1f9a75ffd90d7424c223a9ff8dff2. Seven native 1920×1080 cloud-free images were rendered from that saved model.") }
    ],
    limitations: [
      text("完成的是实际拓扑与水路的一体化，不等于母图美术完成：当前外海崖壁仍有明显规则条纹，灯塔山—湖盆的自然曲折仍需修形，主视整体尺度、黄红域和营地纵深仍有差距。", "Actual land and water connectivity are rebuilt, but this is not mother-reference art approval. Offshore cliffs retain repetitive bands, the hill–lake bends need sculpting, and the world-scale composition, yellow/red regions and camp depth remain unfinished."),
      text("本轮尚未重跑完整岩体自交检测、碰撞、角色路径、瀑布近景物理细节或 Unity 实机联动。旧版的技术通过结论不能直接移植到新网格。", "Full mesh self-intersection, collision, traversal, waterfall close-up and Unity runtime checks have not been rerun. Earlier technical acceptance cannot simply be inherited by the rebuilt solid."),
      text("v028 与 v031 的截图用作失败案例，不能当作正式采用版本；水面裁剪完成的最终评审版本为 v035。", "v028 and v031 screenshots document rejected candidates rather than approved art; v035 is the saved candidate for this review.")
    ],
    nextStep: text(
      "继续精修 v035 的外海岸坡与近湖岩层，消除规则条纹和人工高度场边缘；保持已验证的单连通水网、岩床与灯塔地标位置，然后按最高母图复验蓝域体量、俯视轮廓和实际 Unity 眺望镜头。",
      "Next refine the outer shore slope and near-lake cliff strata to remove repeating heightfield bands without undoing the verified continuous water, rockbed or landmark anchors. Reassess the reference composition and eventual Unity vantage afterwards."
    ),
    comparison: [
      image("v025-10-v026-v035-main.png", "旧 v026 与重构 v035 · 同一主视", "Original v026 vs rebuilt v035 · fixed overview", "左右均为真实 Blender 灰模，右侧结构已重建，但仍不代表美术完成。", "Both are genuine Blender blockout renders; the rebuilt structure still needs artistic finishing.", 1960, 610),
      image("v025-11-v026-v035-blue-top.png", "蓝域俯视 · 河道—前湖连续性", "Blue top view · river–forelake continuity", "比较两轮的河谷、灯塔山、前湖岸床关系。", "Comparing the river valley, lighthouse landmass and forelake banks.", 1960, 610),
      image("v025-12-mother-v035-main.png", "最高母图对照", "Highest-priority mother comparison", "左侧是母图的整体眺望主画面，右侧是保存的 v035 实机灰模。", "The original primary reference vista is left; the actual saved v035 clay render is right.", 1960, 610)
    ],
    gallery: [
      image("v025-01-main-grey.png", "v035 · 固定 16:9 灰模", "v035 · fixed 16:9 clay overview", "真实主镜头渲染。", "Real fixed-camera render."),
      image("v025-02-main-color.png", "v035 · 三域淡彩主视", "v035 · muted three-region overview", "淡彩仅作为结构识别，不是完成材质。", "Colours are structural markers, not final materials."),
      image("v025-03-blue-top.png", "v035 · 蓝域俯视", "v035 · blue-region top", "可检查水面与山体连续关系。", "Shows the water and landmass continuity."),
      image("v025-04-local-close.png", "v035 · 灯塔与前湖近景", "v035 · lighthouse/forelake close-up", "可见目前仍有过于规整的岩层，保留真实问题。", "Retains evidence of unfinished repetitive rock layers."),
      image("v025-05-blue-side.png", "v035 · 蓝域侧视", "v035 · blue side", "观察真实高差与承托关系。", "Actual heights and rockbed relationships."),
      image("v025-06-blue-rear.png", "v035 · 蓝域斜后视", "v035 · blue rear", "检查从后方看到的实体岩岸。", "Checks the solid terrain from behind."),
      image("v025-07-global-top.png", "v035 · 三域整体俯视", "v035 · global top", "确保重建没有借用透视掩盖空间问题。", "Checks actual spatial placement independent of perspective."),
      image("v025-08-rejected-v028.png", "否决候选 · 初次实体开谷", "Rejected candidate · first CSG inlet", "开谷后水面尚未适配，出现真实缺口，已被后续方案替代。", "Exposed openings before water was regenerated; replaced later."),
      image("v025-09-rejected-v031.png", "否决候选 · 未精修的连续地形", "Rejected candidate · raw unified land", "虽已合成实体，但粗糙采样造成岩齿和折面，不能当作成果。", "Although physically unified, rough sampling caused faceted spikes, so it was rejected.")
    ]
  },
  {
    id: "v024",
    date: "2026-11-13T11:59:00+08:00",
    title: text("Blender 蓝域：灯塔山、河道与前湖盆连续性试雕塑", "Blender blue region: lighthouse hill, river and forelake continuity review"),
    summary: text(
      "围绕灯塔山显得孤立、前湖盆像独立圆盘的问题，从 v022 独立保存并实机比较 v023 至 v027 多个 Blender 候选。v023、v024 的上层局部抬升产生竖直岩帘，v027 过度收窄湖岸造成缺口，均主动否决。当前保留 v026：岸床与同一连通水面采用协调的水平曲线变形，并在避开水道和塔桥基础的干岸区域扩宽灯塔山肩。真实 16:9 灰模与多角度截图齐全，但整体美术仍未通过。",
      "Addressed the isolated lighthouse mound and disconnected-looking circular forelake by saving and reviewing independent Blender v023–v027 candidates from v022. v023/v024 created torn vertical rock curtains and were rejected. v027 over-constricted the forelake and created a shoreline gap, also rejected. The retained v026 uses coordinated horizontal deformation of the continuous water and banks and expands dry lighthouse shoulders without touching channels or tower/bridge foundations. Native 16:9 renders and multi-view captures are provided, but artistic acceptance is still pending revision."
    ),
    technicalStatus: "pending",
    artStatus: "revision-needed",
    changes: [
      text("核实原 v022 高位水面本来就是单一连通网格；问题不在于水被拆成两个对象，而在于湖盆环岸、灯塔山脚和后方曲折河谷在主镜头中不连贯。", "Confirmed that the v022 upper water was already one connected mesh. The mismatch is visual: the circular forebank, lighthouse foothills and winding rear river do not read as one coherent landform."),
      text("v025 先将前湖湾水面与两块大型岸床同步进行曲线平面变形，保留上下水位、桥与瀑口位置，避免另建独立湖面。", "v025 first reshaped the existing lake surface and supporting coast meshes together in the horizontal plane, preserving the water levels, bridge and waterfall outlets without adding a separate pond."),
      text("v026 在实际干岸区域对灯塔山肩和后方地貌做整柱平滑升降，保留灯塔台基不动，试图加厚山体并增强与后方山地的联系。", "v026 used smooth full-column displacement on dry lighthouse and hinterland shoulders to broaden the terrain without moving the lighthouse footing."),
      text("主动否决 v023/v024 岩帘和 v027 前湖岸缘缺口，只保留经过实机截图比较后较稳妥的 v026 独立工程。", "Rejected the v023/v024 rock curtains and the v027 forelake gap, retaining only the comparatively stable independently saved v026 model."),
      text("所有版本均独立保存，未覆盖 v020、v022；未修改 Unity 世界地图、角色、玩法、相机或菜单逻辑。", "Saved each candidate independently without overwriting v020/v022, and made no changes to the Unity overworld, characters, gameplay, cameras or menus.")
    ],
    checks: [
      { title: text("水面连通性", "Water connectivity"), detail: text("保留模型中高位水网为 1 个连通分量、4,111 个顶点、7,258 个面；世界水位 −225 米未变。", "The retained upper-water mesh remains one connected component with 4,111 vertices and 7,258 faces at world height −225 m.") },
      { title: text("湖床抽样对照", "Lakebed probe comparison"), detail: text("从水面三角形间隔抽检 1,452 个位置，v022 与 v026 均为 0 个漏床；此为抽样结果，不替代 v020 的完整 29,032 点验证。", "A 1,452-position subsample of upper-water faces found no missing bed in either v022 or v026. This sampling is not a substitute for the earlier comprehensive 29,032-point v020 verification.") },
      { title: text("相机和重要地标", "Camera and landmark preservation"), detail: text("建模脚本核对 54 台摄像机的参数，以及灯塔组件、石桥结构和两处瀑布对象的变换与顶点数保持。", "Build scripts verified the original 54 cameras and preserved transforms/vertex counts for lighthouse components, bridge elements and both waterfall objects.") },
      { title: text("已保存工程与渲染", "Saved model and native captures"), detail: text("v026 独立模型 SHA256 为 6a6b106e3945aee45d9d11b6b3a3c25aa93570f5bb2698320c32b1f770b775dd，7 张无云评审图由同一保存工程在 1920×1080 真实渲染。", "The separate v026 model has SHA256 6a6b106e3945aee45d9d11b6b3a3c25aa93570f5bb2698320c32b1f770b775dd. Seven cloud-free 1920×1080 images were rendered from this same saved model.") }
    ],
    limitations: [
      text("固定主视与俯视下，前湖盆仍有较强的独立椭圆盆口感，灯塔山与湖水的自然咬合尚不充分。没有宣布蓝域一体化完成，整体美术需要继续修改。", "The forelake still reads as a distinct oval basin in fixed overview and top view, and the lighthouse hill does not yet interlock naturally with the lake. No full integration or art approval is claimed."),
      text("本轮验证了水面拓扑和部分湖床抽样，但没有完整重跑三大岩体自交、细部岸线密封、关卡行走路径、碰撞以及 Unity 实机流程。", "Water topology and sampled bed support were checked, but complete rock self-intersection, fine bank sealing, navigation, collision and Unity runtime tests have not been rerun."),
      text("失败候选图片是明确的反例，不能视作可采用美术。黄色和红色区域的整体体量、营地主构图也仍需按最高母图继续验收。", "Rejected candidate screenshots document failure, not usable artwork. Yellow/red massing and the camp composition still require review against the original mother image.")
    ],
    nextStep: text(
      "下一轮优先用连续重拓扑／局部布尔融合重塑灯塔山—前湖岸床的实体关系，再根据真实水路重新生成不规则湖缘，而非反复对已有细密网格施加大幅单独变形；沿用固定主镜头和原始母图验收。",
      "Next, rebuild the lighthouse–forelake rock relationship through coherent local remeshing or boolean fusion, then regenerate the irregular shore based on the actual river network instead of repeatedly warping dense existing meshes. Validate against the fixed camera and original mother image."
    ),
    comparison: [
      image("v024-10-v022-v026-main.png", "固定主视：v022 与保留 v026", "Fixed overview: v022 and retained v026", "相同 16:9 镜头；改动仍不足以宣布整体视觉完成。", "Same fixed 16:9 camera; changes are not sufficient for artistic acceptance.", 1960, 610),
      image("v024-11-mother-v026-main.png", "原始最高母图对照", "Original mother-reference comparison", "左侧为构图母图的主要眺望部分，右侧为真实 Blender 灰模。", "The primary vista from the mother reference is on the left; actual Blender clay render is on the right.", 1960, 610),
      image("v024-12-v022-v026-top.png", "蓝域俯视：v022 与 v026", "Blue top view: v022 and v026", "显示现有连续水网和前湖盆的实际轮廓，仍有独立盆口感。", "Shows the real contiguous water footprint and still-overisolated forelake outline.", 1960, 610)
    ],
    gallery: [
      image("v024-01-main-grey.png", "v026 固定主镜头灰模", "v026 fixed overview clay", "同一保存工程的真实 1920×1080 无云渲染。", "Native cloud-free 1920×1080 render of the retained model."),
      image("v024-02-main-color.png", "v026 三域淡彩主视", "v026 muted region overview", "颜色只区分地貌，不是正式材质。", "Region colour is diagnostic, not finished material."),
      image("v024-03-blue-top.png", "v026 蓝域俯视", "v026 blue-region top", "用于检验河谷、湖盆与灯塔山的真实平面关系。", "Checks the real river valley, lake and lighthouse footprint."),
      image("v024-04-blue-side.png", "v026 蓝域侧视", "v026 blue-region side", "检查上湖、厚岩岸与下海高差。", "Verifies upper lake, solid banks and lower sea from the side."),
      image("v024-05-blue-rear.png", "v026 蓝域斜后视", "v026 blue-region rear", "确认后方地貌的实体厚度和山地延伸。", "Checks the thickness and continuity of the rear terrain."),
      image("v024-06-global-top.png", "v026 全局俯视", "v026 global top", "确认三域构图和营地均保留，不以局部代替全局。", "Confirms all regions and camp are retained; local views do not replace global review."),
      image("v024-07-local-close.png", "v026 前湖与灯塔近景", "v026 lighthouse and forelake close-up", "核查保留塔桥和岸线，仍可见未解决的分离感。", "Inspecting preserved bridge/tower and the still unresolved shoreline split."),
      image("v024-08-rejected-v023.png", "被否决的 v023 岩帘", "Rejected v023 rock curtains", "过强的分层变形造成突兀岩壁和网格缺陷。", "Over-aggressive partial-height sculpt generated unnatural rock curtains."),
      image("v024-09-rejected-v027.png", "被否决的 v027 湖岸缺口", "Rejected v027 shoreline gap", "过度收窄湖盆时，水岸承托出现明显裂口。", "Over-constriction produced a clear break in the forelake bank.")
    ]
  },
  {
    id: "v023",
    date: "2026-11-13T10:50:00+08:00",
    title: text("Blender 世界地图：构图接管、黄域塑形与红域失败回退", "Blender overworld: composition takeover, yellow-land sculpt and rejected red spur"),
    summary: text(
      "从保存的 Blender v020 出发，独立保存 v021 与 v022，围绕原始母图开展第一轮整体灰模修正。黄域调整连续丘陵起伏，营地局部收窄；v021 尝试的红域前伸山脊在固定主视中形成巨大遮挡，经真实截图评审后主动否决。v022 移除失败岩脊，改为现有红域实体的局部雕塑。模型已保存、6 张 1920×1080 截图真实生成；整体美术仍需继续修改。",
      "Started from saved Blender v020 and created separate v021/v022 models for a first composition-oriented blockout pass against the original mother reference. Sculpted continuous yellow hills and slightly narrowed the camp lookout. The v021 red forward spur became an oversized occluding wall in the fixed camera and was explicitly rejected from genuine renders. v022 removes that spur and sculpts existing red terrain instead. The model and six native 1920×1080 captures are saved; overall art still requires revision."
    ),
    technicalStatus: "pending",
    artStatus: "revision-needed",
    changes: [
      text("黄域在原有三块实体地形上调整大尺度丘陵起伏，共变动 1,208 个网格顶点，并保留风车、城镇基础的局部接地位置。", "Reshaped large-scale rolling relief on three existing yellow landforms, editing 1,208 mesh vertices while masking windmill and town foundations."),
      text("v021 新增真实体积的红域前伸岩脊，但固定主镜头显示其形成过大的斜向岩墙，阻挡远景；该修改已在 v022 删除，没有将失败版本作为完成效果。", "A volumetric red forward spur was created in v021, but the fixed camera showed an oversized diagonal wall obstructing the vista. It was removed in v022 rather than presented as a finished result."),
      text("v022 改为塑形红域原有前崖、峡谷西侧、城镇肩部与东侧坡脊，避免再次增加独立巨型山体。", "v022 instead sculpts the existing red forecrag, western canyon, city shoulder and eastern flank, avoiding another massive freestanding landform."),
      text("营地眺望尖角局部收窄并增加轻微崖壁起伏；角色锚点及 54 台原有相机均未移动。", "Slightly narrowed the camp lookout and adjusted cliff relief while preserving the player anchor and all 54 existing cameras."),
      text("保留蓝域湖盆、水网、灯塔和桥的现有结构，本轮没有修改 Unity 正式地图。", "Retained blue basin, water network, lighthouse and bridge structures without modifying the production Unity world.")
    ],
    checks: [
      { title: text("原始工程与独立版本", "Source and version isolation"), detail: text("v020 原工程 SHA256 仍为 3f0e360deca79a8a305bdb5f759ab5320e2002bb587d88755e175f5d2607b904；分别另存 v021 与 v022。v022 模型 SHA256 为 48729ad9fb4ff8fd82de16b95d81035d56ee67cfdcfdbe49185c5cc7b8a7ca62。", "The untouched v020 source retains SHA256 3f0e360deca79a8a305bdb5f759ab5320e2002bb587d88755e175f5d2607b904. Both v021 and v022 were saved separately. v022 SHA256: 48729ad9fb4ff8fd82de16b95d81035d56ee67cfdcfdbe49185c5cc7b8a7ca62.") },
      { title: text("镜头与蓝域保护", "Camera and blue-region protection"), detail: text("建模脚本核对 54 台原有相机的变换与参数保持；蓝域水网相关对象的顶点／面数量保持。本轮没有重跑 v020 全部水网与自交验证。", "The build script confirmed preserved transformations and parameters for all 54 cameras and unchanged vertex/face counts on blue-water objects. The full v020 water and intersection suite was not rerun.") },
      { title: text("真实截图与主动否决", "Genuine captures and explicit rejection"), detail: text("v022 同一保存模型生成 6 张原生 1920×1080 渲染；另保留 v021 失败主视与俯视，并制作 v020→v022 和母图→v022 比较图。", "Six native 1920×1080 renders come from the same saved v022 model. The rejected v021 overview and top view remain available, alongside v020/v022 and mother/v022 comparisons.") }
    ],
    limitations: [
      text("母图的宏大纵深尚未实现。黄域整体仍偏单峰台地，红域仍有规则岩块与背景墙感，营地尖角的前景面积依然偏大；美术状态明确为需要继续修改。", "The reference's monumental depth is still missing. Yellow reads too much like a single plateau, red remains blocky and wall-like, and the camp lookout still occupies too much foreground. Art review explicitly requires revision."),
      text("这次为构图试雕塑，没有做全工程碰撞、节点路径、岩体自交或 Unity 实机验收；不能继承 v020 的完整技术通过结论。", "This was a composition sculpting pass, not a full validation of collisions, navigation, mesh self-intersections or Unity runtime. It cannot inherit v020's full technical acceptance."),
      text("v021 的红色斜向岩墙是失败候选，截图仅用于展示问题和回退依据，不应作为正式视觉成果。", "The v021 diagonal red wall is a rejected candidate, shown solely to document the failure and subsequent correction.")
    ],
    nextStep: text(
      "下一轮仍以原始 Mother Composition 为 P0，先重新安排黄域前中后丘陵与红域的遮挡层级，控制右下营地在主镜头中的占幅；保持蓝域水网、原镜头和地标不动，直到灰模轮廓真正成立。",
      "Next, retain the mother composition as P0 and revise the yellow landform's near/mid/far rhythm, red occlusion hierarchy and camp footprint in the main camera. Blue waterways, established cameras and landmarks remain protected until the blockout silhouette works."
    ),
    comparison: [
      image("v023-09-v020-v022-comparison.png", "固定 16:9 主视：v020 → v022", "Fixed 16:9 overview: v020 → v022", "相同主镜头，记录本轮较小的有效变化；不代表母图构图已经达成。", "Same camera: small retained changes only; not acceptance of the mother composition.", 1960, 608),
      image("v023-10-mother-v022-comparison.png", "最高母图与 v022 灰模", "Highest-priority mother reference vs v022", "左侧是原始视觉目标，右侧是真实 Blender v022；母图不是当前实现画面。", "The original visual reference is on the left and actual Blender v022 on the right; they are not the same artifact.", 1960, 608)
    ],
    gallery: [
      image("v023-01-main-grey.png", "v022 · 固定眺望灰模", "v022 · fixed grey overview", "同一保存工程的无云 1920×1080 灰模。", "Cloud-free 1920×1080 render of the saved model."),
      image("v023-02-main-color.png", "v022 · 三域淡彩", "v022 · muted region colours", "仅用于区分三域形态，不代表完成的艺术材质。", "Muted region colours are for identification, not finished art."),
      image("v023-03-global-top.png", "v022 · 世界俯视", "v022 · global top view", "核对三域实际空间分布和红域回退后的地形范围。", "Inspecting the three regions and the revised red-land footprint."),
      image("v023-04-blue-top.png", "v022 · 蓝域俯视", "v022 · blue top view", "蓝域保持原有 v020 河谷与湖盆水网结构。", "Blue valley, basin and water network retain their v020 structure."),
      image("v023-05-blue-side.png", "v022 · 蓝域侧视", "v022 · blue side view", "从侧面检查保存地形中的岩体与水位关系。", "Side view of saved land geometry and water levels."),
      image("v023-06-blue-local-close.png", "v022 · 蓝域湖盆近景", "v022 · blue basin close-up", "局部对比所保护的灯塔、桥梁和湖盆关系。", "Close-up of the preserved lighthouse, bridge and forelake."),
      image("v023-07-rejected-v021-main.png", "v021 失败候选 · 红域遮挡", "Rejected v021 · red occlusion", "巨大斜向岩墙挡住远景，已经在 v022 删除。", "An oversized diagonal rock wall obstructed the vista and was removed in v022."),
      image("v023-08-rejected-v021-top.png", "v021 失败候选 · 狭长岩脊", "Rejected v021 · narrow spur", "俯视说明该体量缺乏自然前伸高地的形态，不能通过验收。", "Top view shows the narrow spur was not a convincing natural foreland.")
    ]
  },
  {
    id: "v022",
    date: "2026-11-12T23:55:00+08:00",
    title: text("Blender 世界地图：蓝域河谷、前湖与双瀑地形", "Blender overworld: blue-region river valley, forelake and two waterfalls"),
    summary: text(
      "以 v019 三域灰模为基础，保存独立可编辑的 Blender v020 工程，重新塑造蓝域内陆河谷、灯塔左前湖盆与前瀑，并检查桥塔承托、岩体闭合及水面连通。14 张评审画面均来自本次保存模型。技术结构检查通过；构图、美术及正式游戏中的效果仍待验收。",
      "Built on the v019 three-region blockout and saved a separate editable Blender v020 scene. Reshaped the blue-region inland river valley, the lake before the lighthouse and the front waterfall, while checking bridge/lighthouse support, solid meshes and continuous water. Fourteen review images come from the saved model. Technical geometry checks passed; composition, art and in-game presentation remain unapproved."
    ),
    technicalStatus: "passed",
    artStatus: "pending",
    changes: [
      text("保持原有灯塔山网格、塔桥位置、营地及相机，针对蓝域河谷与海岸主体塑形；对相关地貌进行 5 米重采样重拓扑，并为前湖增加连续岩足与湖床。", "Preserved the original lighthouse hill mesh, bridge, camp and cameras while reshaping the blue-region valley and coastal masses. Applied 5 m remeshing to affected terrain and added continuous solid support and a bed beneath the forelake."),
      text("将内陆弯曲河道接入桥下水湾，再向灯塔左前展开为湖盆；右支沿低谷通往第二处瀑布，两条水路共用上层水位。", "Connected the winding inland river to the bay beneath the bridge and widened it into a lake in front-left of the lighthouse. A second branch follows the low valley to the other waterfall at the same upper water level."),
      text("将前湖溢流口真实下切至低海，降低原有中间平顶结构并补齐灯塔山左前岸肩；在后方陆地补充连续坡脊。", "Cut the front-lake spillway down toward the lower sea, lowered a former flat intermediate shelf, filled the lighthouse hill's front-left coastal shoulder and extended continuous dry ridges behind the water."),
      text("保留六个已确认的选关节点平面位置，并在地形修改后核对接地；节点仅用于本轮结构评审，非最终章节配置。", "Retained the approved plan positions of six level-selection nodes and checked their ground contact after the terrain edits. These markers are review aids, not final chapter configuration."),
      text("生成同一模型的 14 张 1920×1080 无云评审图，包含固定主镜头、蓝域俯侧后视、河湖水网和 v019／母图对照。", "Generated fourteen cloud-free 1920×1080 review captures of the same model: fixed overview, blue-region top/side/rear views, water-network inspection and comparisons against v019 and the composition reference.")
    ],
    checks: [
      { title: text("模型与原始场景保护", "Model and scene preservation"), detail: text("检查原有 487 个对象的位置、层级与可见性，以及 54 台相机参数；灯塔山、塔桥与 PLAN 节点保持。", "Verified transforms, hierarchy and visibility for 487 original objects and parameters for 54 cameras, preserving the lighthouse hill, bridge and PLAN nodes.") },
      { title: text("岩体拓扑与基础承托", "Solid topology and ground support"), detail: text("三块重点岩体均闭合、正体积、自交为 0；基础承托通过，最大地面偏差 0.98 毫米。", "All three inspected rock masses are closed and positively oriented with zero self-intersections; ground-support checks passed with 0.98 mm maximum deviation.") },
      { title: text("湖床、水网与双瀑", "Lakebed, water connectivity and waterfalls"), detail: text("六个核心水点处于同一上层连通水网；29,032 个湖床探针漏床为 0；两处瀑布的源水接触、堰床和落海检查通过。", "Six key water points belong to one connected upper network; 29,032 lakebed probes found zero missing beds. Both waterfall outlets passed source, sill and lower-sea checks.") },
      { title: text("水位与区域边界", "Water levels and region boundaries"), detail: text("模型内上层水位比低海高 95 米；三域实体分离、右岸干地及黄红相邻边界检查通过。", "The model's upper water level sits 95 m above the lower sea. Three-region separation, dry right bank and yellow/red adjacency checks passed.") },
      { title: text("真实模型与渲染证据", "Saved scene and render evidence"), detail: text("保存 Blender v020 源工程；14 张评审图附相机与哈希记录，最终模型 SHA256 为 3f0e360deca79a8a305bdb5f759ab5320e2002bb587d88755e175f5d2607b904。", "Saved the Blender v020 source project. Fourteen captures have camera and hash records; final model SHA256: 3f0e360deca79a8a305bdb5f759ab5320e2002bb587d88755e175f5d2607b904.") }
    ],
    limitations: [
      text("这是 Blender 蓝域结构阶段的可编辑模型，不是已经导入 Unity 的最终 Overworld，也未获得美术或用户验收。", "This is an editable Blender model at the blue-region structural stage, not the final Overworld imported into Unity. Neither art nor user acceptance has been granted."),
      text("前湖岸缘仍偏连续、局部左岸接缝与上游右岸尖角待修；有一处岸缘岩唇仅高于水面约 1.7 厘米。", "The forelake banks remain too continuous in places, with left-bank seams and a sharp upstream right bank still requiring polish. One local rock lip rises only about 1.7 cm above the water."),
      text("上游河源、部分后方坡脊与选关节点落点尚待确定；固定主镜头的整体纵深、黄红体量和营地比例仍需与母图对照。", "The precise river source, some hinterland ridges and node placements remain provisional. Overall depth, yellow/red massing and camp proportions still need reference-based composition review."),
      text("本页的水网标注图和母图对比是评审材料；标注节点不是游戏内最终 UI，母图也不是已实现的游戏画面。", "Water-network overlays and reference comparisons are review evidence. Node annotations are not final in-game UI, and the composition reference is not a completed game render.")
    ],
    nextStep: text(
      "先验收蓝域前湖与河谷在固定 16:9 镜头中的实际轮廓、上下水位和两处瀑布，再修整岸岬与河源；之后再推进三域整体构图与 Unity 接入。",
      "First review the forelake/valley silhouette, water levels and both waterfalls in the fixed 16:9 camera; then refine shoreline shapes and the river source before global three-region composition and Unity integration."
    ),
    comparison: [
      image("v022-13-main-v019-v020.png", "固定主镜头 · v019 与 v020", "Fixed overview · v019 vs v020", "同机位版本对照，检查蓝域结构修改对整体构图的实际影响。", "Same-camera version comparison showing the effect of blue-region geometry edits on the overall composition.", 1920, 630),
      image("v022-14-mother-blue-comparison.png", "蓝域母图对照", "Blue-region reference comparison", "母图是构图目标，右侧为实际 Blender 评审模型；两者不可混淆。", "The reference shows the intended composition; the other view is actual Blender review geometry. The reference is not a finished model.", 1920, 630)
    ],
    gallery: [
      image("v022-01-main-grey.png", "正式眺望 · 灰模", "Primary vista · clay render", "无云遮挡、固定 16:9 主视角。", "Cloud-free fixed 16:9 overview."),
      image("v022-02-main-color.png", "正式眺望 · 淡彩", "Primary vista · muted regions", "以区域色区分蓝、黄、红三个地貌主体，尚非正式材质。", "Region colours distinguish blue, yellow and red terrain masses; not final materials."),
      image("v022-06-local-close.png", "蓝域近景 · 灯塔与前湖", "Blue close-up · lighthouse and forelake", "观察湖盆、岸肩及溢流口的局部实体关系。", "Inspecting the local lake basin, coastal shoulder and spillway."),
      image("v022-03-local-top.png", "前湖局部俯视", "Forelake top view", "检查河道进入湖盆、岸线围合与前溢流路径。", "Checking river inflow, lakebank enclosure and fore-spillway routing."),
      image("v022-04-blue-top.png", "蓝域全貌俯视", "Blue region top view", "检查蓝域河谷、灯塔山和海岸的总体占地。", "Reviewing the footprints of the river valley, lighthouse hill and coastal masses."),
      image("v022-05-global-top.png", "三域整体俯视", "Three-region top view", "核对蓝、黄、红地形的真实空间分布。", "Checking the actual spatial arrangement of all three regions."),
      image("v022-07-blue-side.png", "蓝域侧视 · 水位与岩层", "Blue side view · water and rock", "侧面核对湖床、厚岩岸、瀑布及低海。", "Inspecting lakebed, solid banks, waterfall and lower sea from the side."),
      image("v022-08-blue-rear.png", "蓝域斜后视", "Blue rear oblique", "从主镜头以外检查后陆连续性与真实地形厚度。", "Assessing dry hinterland continuity and solid terrain depth beyond the main camera."),
      image("v022-09-formal-code-camera.png", "正式镜头基准对照", "Formal camera baseline", "保留固定镜头的代码基准；并非 Unity 最终稳定态验收。", "A reference for the fixed production camera, not acceptance of the final Unity runtime view."),
      image("v022-10-global-noderoute.png", "全局选关节点与路线", "Global node and route review", "评审用节点标注，非最终玩家界面。", "Planning node annotations for review only, not final gameplay UI.", 1920, 1164),
      image("v022-11-blue-noderoute.png", "蓝域选关路线", "Blue-region node routing", "六个节点的地形接地与路径位置核对。", "Review of six node positions, ground contact and route.", 1920, 1164),
      image("v022-12-local-waterstructure.png", "湖盆水网结构", "Forelake water-network structure", "展示前湖、桥下水湾、右支与双瀑的模型关系。", "Visualizing the model relationships between forelake, bridge bay, right branch and two waterfalls.", 1920, 1164)
    ]
  },
  {
    id: "v021",
    date: "2026-11-12T17:30:00+08:00",
    title: text("NPC 对话统一：立绘身份、镜头与世界地图接入", "Unified NPC dialogue: speaker portraits, cameras and world-map integration"),
    summary: text(
      "将 2D 关卡与 2.5D 世界地图 NPC 接入同一套立绘对话框与播放状态机。玩家固定左侧、NPC 固定右侧，姓名跟随发言立绘；正文始终从左侧排版，选项左对齐。新增镜头进退与异常退出恢复，并通过定向自动化测试。",
      "NPC conversations in 2D levels and the 2.5D world map now share the same portrait dialogue box and playback state machine. Player portraits remain left, NPC portraits right, with names beneath the active portrait. The text body stays left-aligned and choices remain on the left. Camera transitions and invalidation recovery received targeted automated coverage."
    ),
    technicalStatus: "passed",
    artStatus: "pending",
    changes: [
      text("世界地图 NPC 从独立纸张会话切换到统一 DialoguePlayback + DialogueBox；纸张信息面板继续服务非 NPC 地点。", "World-map NPCs now use the shared DialoguePlayback + DialogueBox instead of a separate paper conversation; the paper panel remains for non-NPC location information."),
      text("新增显式的玩家／NPC 身份字段及角色资源继承，避免根据本地化姓名猜测立绘左右位置。姓名跟随发言者，正文不随立绘换边。", "Explicit player/NPC identity and speaker-profile inheritance prevent guessing portrait positions from localized names. Speaker labels follow the active portrait without moving the dialogue body."),
      text("2D 对话通过现有 GameplayCameraDirector 以 Dialogue 优先级平滑拉近和恢复；世界地图保留既有 NPC 聚焦镜头。", "2D conversations smoothly zoom using the existing GameplayCameraDirector at Dialogue priority; the world map retains its established NPC focus camera."),
      text("分支确认改为报告真实推进结果，避免把快显误判为已选择；新增 NPC 失效、镜头与输入恢复的回归测试。", "Branch confirmation now reports actual advancement rather than treating quick reveal as a choice; regression coverage includes NPC invalidation, camera return and input recovery."),
      text("将布局、镜头时序、文本继承和验收边界写入版本化设计规则，并同步 Text & Dialogue Studio 的角色侧设置。", "Versioned design rules now cover layout, camera timing, text inheritance and acceptance boundaries; the authoring tool exposes speaker-side controls.")
    ],
    checks: [
      { title: text("角色身份解析", "Speaker identity resolution"), detail: text("EditMode 13/13 通过：角色资源身份、单段显式覆盖与多语言姓名独立解析。", "13/13 EditMode tests passed for speaker-profile identity, explicit per-line overrides and localized speaker names.") },
      { title: text("统一对话回归", "Unified dialogue regression"), detail: text("文字系统 PlayMode 12/12 通过，包含左右立绘与姓名、正文位置不变、分支和输入生命周期。", "12/12 text-system PlayMode tests passed, including portrait/name sides, fixed body placement, branching and input lifecycle.") },
      { title: text("世界地图交互", "World-map interaction"), detail: text("NPC 分支与镜头回归、鼠标/手柄混合输入、NPC 中途禁用恢复三项定向 PlayMode 均通过。", "Targeted PlayMode checks passed for NPC branches/camera, mixed mouse/controller input and recovery when an NPC is disabled mid-conversation.") },
      { title: text("源码与发布", "Source and release"), detail: text("实现与设计文档已合入 Emotion-Mask main，提交 5083058；本轮没有发布游戏安装包。", "Implementation and design rules merged into Emotion-Mask main at commit 5083058. No downloadable game build was released.") }
    ],
    limitations: [
      text("v021 新截图来自 2026-11-12 重新构建的 Windows 开发版，使用真实 Unity 运行画面和测试角色资源；不是实际剧情关卡的最终美术。", "New v021 screenshots come from a freshly built Windows development player on 2026-11-12, using real Unity runtime captures with test speaker assets, not final story-level art."),
      text("本次完成立绘左右、姓名与选项的实机截图；世界地图 NPC 实际场景与 2D 镜头拉近/退出的逐帧视觉截图仍待补拍。", "Runtime captures now cover left/right portraits, speaker names and choices. Real world-map NPC scenes and frame-by-frame 2D camera transitions still await dedicated screenshots."),
      text("本轮不代表全工程零缺陷；完整 EditMode 批量运行曾在旧预览渲染阶段遇到 Unity 原生崩溃。", "This does not establish project-wide defect-free status; a full EditMode batch previously encountered a native Unity crash during legacy preview rendering.")
    ],
    nextStep: text(
      "继续采集真实世界地图 NPC 场景与 2D 镜头进退截图；补齐角色最终立绘并进行排版人工验收。",
      "Next, capture NPC conversations in the real world map and 2D camera entry/exit; finish portrait assets and perform final visual review."
    ),
    comparison: [
      image("v021-player-left.png", "v021 实机 · 玩家左侧发言", "v021 runtime · player speaking on left", "2026-11-12 Windows 开发版 1600×900：玩家立绘及其下方姓名，正文仍从大对话框左侧开始。", "2026-11-12 Windows development player at 1600×900: player portrait and name beneath it, with body text starting at the left."),
      image("v021-npc-right.png", "v021 实机 · NPC 右侧发言", "v021 runtime · NPC speaking on right", "同一构建同一对话框：NPC 立绘及其下方姓名位于右侧，正文阅读起点保持不变。", "Same build and shared dialogue box: NPC portrait and name on the right while body alignment stays unchanged.")
    ],
    gallery: [
      image("v021-choices-left.png", "v021 实机 · 左侧分支选项", "v021 runtime · left-aligned choices", "NPC 发言后的分支选项仍在大对话框左侧排版。", "Branch choices remain aligned to the left of the shared dialogue box after the NPC speaks."),
      image("v021-expression.png", "v021 实机 · 表情立绘切换", "v021 runtime · portrait expression", "对话播放中的角色立绘表情切换截图。", "Runtime capture of a speaker portrait expression change."),
      image("v021-missing-portrait.png", "v021 实机 · 缺少立绘的台词", "v021 runtime · line without portrait", "没有指定立绘资源时的文字与姓名显示，用于检查降级布局。", "Text/name fallback when no portrait resource is assigned."),
      image("v020-zh-worldpaper.png", "历史对照 · 世界地图旧纸张对话（v020）", "Historical comparison · old world-map paper dialogue (v020)", "这是改造前的 v020 运行画面，不是 v021 世界地图实机验收。", "This is a pre-change v020 runtime image, not v021 world-map acceptance evidence.")
    ]
  },
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
