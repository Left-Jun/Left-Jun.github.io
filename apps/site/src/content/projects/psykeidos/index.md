---
title: "Psykeidos"
date: 2026-10-30T10:00:00+08:00
updatedAt: 2026-11-05T13:17:00+08:00
draft: false
slug: "psykeidos"
description: "承继 Emotion Mask 的情绪切换方向，以 2.5D 人物与三维山川世界地图继续探索情绪、空间和关卡选择；当前记录 Blender 地貌与构图迭代。"
image: "cover.jpg"
weight: 25
portfolioType: "game"
status: "in-progress"
statusTags:
  - "持续开发"
  - "世界地图灰模"
  - "美术待验收"
projectFacts:
  projectType: "独立游戏 / 三维世界地图开发"
  developmentTime: "2026.10 起，持续迭代中"
  duration: "持续开发中"
  role: "游戏设计 / 程序 / 场景构图与迭代"
  tools: "Blender / Unity / C#"
  techNote: "2.5D 人物 / 三维地貌 / 固定镜头与选关视角"
  platform: "Windows（开发目标）"
  result: "v019 完成蓝域左前湖盆的局部结构修正；真实模型与多视图已保存，构图与美术仍待验收。"
projectLinks:
  - label: "开发日志"
    url: "/projects/psykeidos/devlog/"
    icon: "link"
    kind: "report"
  - label: "Development log · English"
    url: "/en/projects/psykeidos/devlog/"
    icon: "link"
    kind: "report"
  - label: "v019 本轮记录"
    url: "/projects/psykeidos/devlog/v019/"
    icon: "link"
    kind: "report"
  - label: "v019 record · English"
    url: "/en/projects/psykeidos/devlog/v019/"
    icon: "link"
    kind: "report"
  - label: "Emotion Mask · 先前项目"
    url: "/projects/emotion-mask/"
    icon: "link"
    kind: "site"
tags:
  - "Blender"
  - "Unity"
  - "2.5D"
  - "世界地图"
  - "场景构图"
roleTags:
  - "游戏设计"
  - "程序"
  - "场景迭代"
relatedPages:
  - "projects/emotion-mask"
---

## 从情绪切换走向三维山川

《Psykeidos》承继《Emotion Mask》以情绪改变观察与行动方式的设计方向，继续探索 2D 纸片人物与三维场景结合的 2.5D 表现。它在本站作为独立项目记录，原《Emotion Mask》的原型、发行准备和路演材料继续保留在原项目页。

当前工作的重点是三维世界地图：玩家从近景营地眺望蓝、黄、红三片独立地貌，并在后续选关视角中拉近区域、查看节点。这里的地图以空间阅读与关卡选择为目标，不将三域表述为已经完成的自由探索开放世界。

## 世界的空间骨架

- **蓝域：近、低、向左前展开。** 以海岸山地、灯塔山、局部高位湖盆、瀑布与最低海面形成纵向落差，后方仍保留陆地和山脊。
- **黄域：中央偏后、宽阔而有腹地。** 以丘陵高原、宽谷、台地与局部山脊组织纵深，为风车和聚落留下体量空间。
- **红域：右侧高耸、向后延伸。** 以前沿断崖、峡谷、城址台地和后峰构成复合山城轮廓。
- **营地：独立的近景观察点。** 人物和向左前伸出的悬崖尖角提供尺度参照，远方三域在同一幅 16:9 画面中形成整体。

三域在空间上分离，各有高度基准；在主镜头里通过前后错位、遮挡和轮廓呼应组成一幅山川画卷。目标气质来自国画山水的虚实、留白和概括性形体，当前仍先检查无云灰模，不用氛围效果掩盖地貌问题。

## 当前进展：v019 左前湖盆

![v019 同机位淡彩主视：实际 Blender 灰模](/content-assets/projects/psykeidos/v019-main-color.jpg)

这是保存模型的真实 Blender 渲染，颜色用于辨认区域，不代表最终材质或已完成效果。

v019 在原有网格上局部打开灯塔左前的高位湖面，修整连续低岩岸、岩槛与前向溢流口，让原前瀑随岸线前移并落入低海。左湖和右湾仍是同一水位、真实连通的上湖，右侧瀑布与低矮侧山保留，后方没有重新变成大面积湖水。

![v018 与 v019 的同机位局部对照](/content-assets/projects/psykeidos/v019-local-comparison.jpg)

本轮保持固定镜头、塔基、桥台、人物与营地，并用俯视、侧视、斜后视检查地形厚度、岸床和水位关系。保存工程的结构检查已通过，但这不等于构图、美术或用户验收通过。

## 仍在解决什么

固定总览中的左湖可见面积仍有限，长直岸墙、规则折面与瀑布占位感也没有完全消除。局部近景和俯视能证明水陆关系改善，却不能代替主镜头的整体美感。后续先继续调整湖盆占幅、连续海岸与瀑口节奏，再讨论关键建筑、材质笔触和云雾。

新的 Blender 地貌目前是独立场景美术工程；本轮没有替换 Unity 正式地图，也不将后续选区、节点预览或玩法接入计划写成已经交付的完成项。

## 开发日志与版本记录

[开发日志](/projects/psykeidos/devlog/)集中展示每轮实际修改、真实多视图、检查结果、未解决问题与下一步方向。[v019 详细记录](/projects/psykeidos/devlog/v019/)保留本轮主视、淡彩、俯视、侧视、斜后视和参考对照，便于持续比较，而不是只留下最有利的一张截图。
