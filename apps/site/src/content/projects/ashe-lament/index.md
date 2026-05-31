---
title: "亚舍拉挽歌"
date: 2026-03-20T10:00:00+08:00
draft: false
slug: "ashe-lament"
description: "一款 72 小时内完成的 2D 平台跳跃与资源管理游戏，围绕灵能状态、地下安全时间、捷径建造和多结局推进展开。"
image: "cover.png"
coverVideo: "cover.mp4"
imagePosition: "62% center"
pinned: true
pinWeight: 10
featured: true
featuredWeight: 10
weight: 20
portfolioType: "game"
projectFacts:
  developmentTime: "2026.03 - 2026.05"
  duration: "72h"
  team: "5 人"
  event: "腾讯高校游戏极限开发大赛"
  role: "队长 / 主程 / 玩法策划"
  roleNote: "音乐制作（AI 辅助）"
  tools: "Unity / C#"
  techNote: "2D / Tilemap / Audio"
  platform: "Windows"
  platformNote: "可执行版本"
  finishedAt: "2026.05"
  trailerDuration: "01:32"
  result: "完成限时跑酷、资源收集、捷径建造、灵能结算与低 / 中 / 高三种结局。"
projectLinks:
  - label: "可执行版本"
    url: "https://pan.quark.cn/s/efcee623b3f4?pwd=TQCA"
    icon: "link"
tags:
  - "团队项目"
  - "2D 平台跳跃"
  - "资源管理"
  - "灵能系统"
  - "多结局"
  - "Photoshop"
roleTags:
  - "队长"
  - "主程"
  - "玩法策划"
relatedPages:
  - "retrospectives/ashe-lament-retrospective"
  - "plans/ashe-lament-roadmap"
  - "posts/shuguang-youji-roadshow"
---

## 项目简介

《亚舍拉挽歌》是一款把 2D 平台跳跃与资源管理结合起来的游戏。玩家扮演“阈限开拓者”，进入一片被遗忘的地下世界，在有限的地下安全时间内探索、收集灵能、建造捷径，并把资源带回地上，用一次次路线选择推动最终结局。

项目最初完成于腾讯高校游戏极限开发大赛的 72 小时开发周期中。我们没有把目标放在堆叠大量系统上，而是验证一个更集中的玩法闭环：平台跳跃提供即时操作压力，资源管理提供路线决策压力，多结局则让玩家的资源选择在叙事收束处得到反馈。

## 世界观与叙事

故事发生在生命之树“亚舍拉”衰败之后。地下世界失去了光明与秩序，残存灵能散落在根脉和遗迹之间；地上的母树仍在等待最后一次复苏，但通往树冠的路线被破碎平台、枯萎枝干和资源消耗共同阻断。

玩家不是传统意义上的救世英雄，而是最后一个还愿意维护循环的人。每一次下潜都意味着风险：是继续深入换取更多灵能，还是在安全时间耗尽前返回；是把遗骨用于建造捷径，还是保留资源应对后续路线；是追求更快的推进，还是优先保证稳定的结局条件。

## 核心玩法

<div class="case-card-grid">
  <article class="case-card">
    <h3>灵能系统</h3>
    <p>灵能同时承担生命压力、行动资源和结局评价的作用。玩家在探索中收集灵能，也会因为时间、区域和强化行为持续消耗灵能。</p>
  </article>
  <article class="case-card">
    <h3>捷径建造</h3>
    <p>玩家通过探索收集遗骨，并在地上路线中消耗资源建造捷径，把一次探索收益转化为后续尝试的路线优势。</p>
  </article>
  <article class="case-card">
    <h3>多结局推进</h3>
    <p>最终结局由剩余灵能和关键流程共同决定，让“跑得更远”和“留下多少资源”成为同一个决策问题。</p>
  </article>
</div>

这个玩法闭环的重点不是让玩家一直被资源惩罚，而是让每次操作都有方向感：地下负责制造紧张，地上负责提供规划空间，结局负责回收玩家一路做出的取舍。

## 截图与系统展示

<div class="case-media-grid">
  <figure class="case-figure">
    <img src="/content-assets/projects/ashe-lament/screenshot-notice-board.png" alt="玩法告示板" loading="lazy">
    <figcaption><strong>玩法告示板</strong><span>用一张图解释灵能、遗骨、加时器、强化状态和捷径建造，降低玩家进入主循环前的理解成本。</span></figcaption>
  </figure>
  <figure class="case-figure">
    <img src="/content-assets/projects/ashe-lament/screenshot-underground.png" alt="地下探索与灵能收集" loading="lazy">
    <figcaption><strong>地下探索</strong><span>地下区域强调时间压力和操作效率，玩家需要在收集收益与路线风险之间快速判断。</span></figcaption>
  </figure>
  <figure class="case-figure">
    <img src="/content-assets/projects/ashe-lament/screenshot-shortcut.png" alt="地上攀登与捷径建造" loading="lazy">
    <figcaption><strong>捷径建造</strong><span>地上部分把资源转化为长期路线优势，让地下收集不只是分数，而是能改变下一轮推进路径。</span></figcaption>
  </figure>
  <figure class="case-figure">
    <img src="/content-assets/projects/ashe-lament/screenshot-ending.png" alt="结局画面" loading="lazy">
    <figcaption><strong>结局反馈</strong><span>不同结局根据最终交付的灵能触发，把玩家的资源管理结果反馈到叙事收束中。</span></figcaption>
  </figure>
</div>

## 我的职责与贡献

在本项目中，我主要负责把创意拆成可完成、可调试、可交付的系统，并在 72 小时内维持团队开发节奏。

<div class="case-card-grid case-card-grid--roles">
  <article class="case-card">
    <h3>程序实现</h3>
    <ul>
      <li>搭建角色移动、跳跃、冲刺、状态切换和资源系统。</li>
      <li>实现地下安全时间、灵能流失、捷径建造与结局判定逻辑。</li>
    </ul>
  </article>
  <article class="case-card">
    <h3>玩法策划</h3>
    <ul>
      <li>设计灵能资源循环、关卡推进节奏和多结局条件。</li>
      <li>把队伍的叙事设定拆解成可实现的机制目标与 UI 提示。</li>
    </ul>
  </article>
  <article class="case-card">
    <h3>团队推进</h3>
    <ul>
      <li>组织版本计划、拆分任务，协调程序、美术、音乐与文案。</li>
      <li>控制 72 小时内的功能范围，优先保证可玩的闭环版本。</li>
    </ul>
  </article>
</div>

## 技术实现

### 系统结构思维导图

![亚舍拉挽歌系统思维导图](/content-assets/projects/ashe-lament/flow-system.svg)

这张图重新梳理了项目里的主要脚本关系：玩家输入先进入 `PlayerMove`、`PlayerJump`、`PlayerDash` 等角色控制脚本，再由 `MaskControl` 管理状态切换；资源侧通过 `EnergyManager`、`EnergyDrainController` 和 `SafetyTimer` 维持灵能、遗骨与地下安全时间；关卡交互由 `EnergyPickup`、`TimeExtendPickup`、`ShortcutBuilder`、`CheckPoint` 等脚本承接，最后交给 `EndingManager` 与场景表现脚本完成结算和反馈。

### 状态驱动角色参数

**问题：** 不同灵能状态会影响移动、跳跃、资源消耗和结局判断。如果把这些逻辑直接写进角色控制脚本，后续调参和修 Bug 会很快变乱。

**方案：** 我把角色能力拆成状态数据：`PlayerMove`、`PlayerJump` 和 `PlayerDash` 只读取当前状态参数，`MaskControl` 负责切换、广播变化，并驱动 UI 与表现层更新。

**结果：** 后续增加或调整状态时，可以先扩展状态数据和表现逻辑，不必反复修改角色移动主流程。

### 灵能作为中心资源

**问题：** 灵能既是玩家收集目标，又是消耗压力，还会影响结局。它如果分散在多个脚本里，数值来源会难以追踪。

**方案：** 使用 `EnergyManager` 维护灵能和遗骨数值，再通过事件同步给 UI、状态显示和结算逻辑。`EnergyDrainController` 根据区域、形态和地下安全时间计算流失速度。

**结果：** 玩法、UI、结局和区域反馈都围绕同一个资源状态工作，短开发周期里也能保持可调和可读。

### 地下安全时间

**问题：** 地下区域需要制造压力，但不能让玩家感觉每一步都被惩罚，否则平台跳跃节奏会被资源焦虑打断。

**方案：** 使用 `SafetyTimer` 判断玩家是否处于地下，并把倒计时与加时道具绑定。安全时间内鼓励玩家深入探索，危险期则推动玩家快速做返回或继续冒险的选择。

**结果：** 地下探索形成了明确节奏：进入、收集、判断、撤离或冒险。资源管理不再只是静态数值，而是和路线推进绑定在一起。

### 捷径建造与结局判定

**问题：** 资源系统需要一个能被玩家看见的长期收益，否则收集行为会变成单纯捡数值。

**方案：** `ShortcutBuilder` 用遗骨和灵能作为建造成本，玩家进入触发区并满足资源条件后打开捷径；`EndingManager` 读取最终灵能并触发低 / 中 / 高结局。

**结果：** 玩家能直观看到资源选择改变路线，同时在结局处获得明确反馈，形成“探索收益 → 路线优化 → 结局回收”的完整链路。

## 挑战与解决方案

<div class="case-card-grid">
  <article class="case-card">
    <h3>机制过多，时间太短</h3>
    <p>先保证一轮完整循环，再把复杂系统拆成可选扩展；功能优先级始终围绕“能否形成可玩闭环”判断。</p>
  </article>
  <article class="case-card">
    <h3>资源管理与跳跃节奏冲突</h3>
    <p>把资源消耗绑定到关键决策和区域状态，而不是频繁打断移动，让玩家主要在路线选择时感受到压力。</p>
  </article>
  <article class="case-card">
    <h3>素材整合时间紧张</h3>
    <p>提前约定命名、尺寸和导入流程，把最后阶段的精力放在连线、阈值、UI 提示和流程 Bug 上。</p>
  </article>
</div>

## 学习与收获

这个项目让我更明确地意识到，机制复杂的游戏最重要的不是“再加一个系统”，而是让玩家第一次接触时能顺利进入循环。一个资源系统如果不能被路线、反馈和结局共同解释，就很容易变成额外负担。

后续继续开发时，我会优先打磨前 5 分钟体验：让玩家更快理解地下探索、灵能消耗、捷径收益和结局目标之间的关系，再逐步展开更复杂的路线策略与叙事内容。

## 相关链接

- [可执行版本](https://pan.quark.cn/s/efcee623b3f4?pwd=TQCA)
- [项目复盘](/retrospectives/ashe-lament-retrospective/)
- [后续开发计划](/plans/ashe-lament-roadmap/)
- [成都第一届《曙光游集》线下路演记录与思考](/posts/shuguang-youji-roadshow/)
