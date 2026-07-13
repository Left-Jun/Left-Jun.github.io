---
title: "UE5 多人 PVE Demo"
date: 2026-06-21T20:00:00+08:00
draft: false
slug: "ue5-coop-training-range"
description: "第一次使用 Unreal Engine 5 完成的多人 PVE Demo。基于 Blueprint、Replication 与 Listen Server，实现服务器权威射击、敌人 AI、死亡重生、协作计分和胜利同步。"
image: "cover.webp"
imagePosition: "center"
featured: false
featuredWeight: 30
homeHeroWeight: 30
pinWeight: 30
weight: 30
portfolioType: "game"
status: "completed"
projectFacts:
  developmentTime: "2026.06"
  duration: "约 3 天"
  team: "独立开发"
  event: "腾讯青科训练营 2026 春客户端大作业"
  role: "独立开发 / Gameplay & Networking Implementation"
  tools: "Unreal Engine 5.7 / Blueprint / UMG"
  techNote: "Replication / Server RPC / Client RPC / Multicast RPC"
  platform: "Windows"
  platformNote: "Development Build / 本地双开测试"
  finishedAt: "2026.06"
  result: "完成单人模式与本地 Listen Server 双人联机闭环，覆盖敌人 AI、玩家死亡重生、队伍计分和胜利同步。"
projectLinks:
  - label: "GitHub 仓库"
    url: "https://github.com/Left-Jun/Left_Jun-Unreal-Afterclasswork_Tencent2026"
    icon: "brand-github"
  - label: "可执行版本"
    url: "https://pan.quark.cn/s/1529aa6d5da7"
    icon: "display"
  - label: "技术说明 PDF"
    url: "/content-assets/projects/ue5-coop-training-range/technical-report.pdf"
    icon: "link"
  - label: "提交简述 PDF"
    url: "/content-assets/projects/ue5-coop-training-range/submission-brief.pdf"
    icon: "link"
tags:
  - "Unreal Engine 5"
  - "Blueprint"
  - "Multiplayer"
  - "Replication"
  - "Gameplay Networking"
  - "UMG"
roleTags:
  - "独立开发"
  - "Gameplay"
  - "Networking"
---

## 项目简介

这是我从 Unity 工作流切换到 Unreal Engine 5 后完成的第一个游戏 Demo。项目基于 UE5.7 官方 First Person 模板开发，目标是在约三天内完成一个可以独立运行、打包并进行本地双人联机演示的战斗闭环。

玩家可以创建本地 Listen Server，另一名玩家通过本机地址加入。两名玩家进入训练场后共同对抗敌人：敌人会在服务器端寻找最近的存活玩家，基于 NavMesh 追击，并在攻击范围内播放动画和造成伤害；玩家使用第一人称射线武器攻击敌人，击杀会增加队伍分数，达到目标后所有玩家同步看到胜利提示。

这个项目不是完整商业化联机框架，而是一次小范围、可演示的 UE5 多人网络实践。我把重点放在题目要求的核心功能：敌人移动和攻击玩家、玩家击败敌人、基础得分与胜利机制，以及本地 Listen Server 双人联机流程。

## 核心玩法闭环

<div class="case-card-grid">
  <article class="case-card">
    <h3>创建与加入</h3>
    <p>主菜单提供单人、创建多人游戏和加入游戏入口。多人模式下，第一个实例创建 Listen Server，第二个实例连接本机地址。</p>
  </article>
  <article class="case-card">
    <h3>协作战斗</h3>
    <p>两名玩家进入训练场后共同射击敌人。敌人只在服务器端运行索敌、移动、攻击和伤害逻辑，状态再同步到客户端。</p>
  </article>
  <article class="case-card">
    <h3>计分与胜利</h3>
    <p>敌人死亡后服务器增加队伍分数。达到目标击杀数后，GameState 复制胜利状态，所有客户端 HUD 同步显示结果。</p>
  </article>
</div>

## 我的职责与贡献

本项目为独立开发。我负责从模板扩展、蓝图实现、多人同步、UI 到打包测试的完整流程。

- 扩展 First Person 模板，完成第一人称射击、射线反馈和服务器权威伤害判定。
- 实现玩家生命、死亡菜单、Owning Client RPC 显示逻辑和服务器重生流程。
- 搭建敌人血量、受伤、死亡、最近存活玩家索敌、NavMesh 追击和近战攻击。
- 使用 GameMode / GameState 维护队伍分数、目标分数和胜利状态。
- 实现 Listen Server 创建与加入、Lobby 人数判断和 ServerTravel 切图流程。
- 完成 HUD、准星、主菜单、死亡复活菜单和输入模式恢复。
- 整理 GitHub 仓库、技术说明 PDF、提交简述 PDF 和演示视频。

## 多人网络设计

项目使用 Listen Server 模式。与伤害、死亡、AI、重生、得分和胜利有关的核心状态由服务器统一处理；客户端主要负责输入、本地 UI 与即时视觉反馈。

<div class="case-card-grid">
  <article class="case-card">
    <h3>Server RPC</h3>
    <p>客户端通过 <code>ServerFire</code> 请求开火，通过 <code>ServerRespawn</code> 请求复活。真正的命中、扣血、死亡和传送由服务器执行。</p>
  </article>
  <article class="case-card">
    <h3>Client / Multicast RPC</h3>
    <p>死亡菜单使用 Owning Client RPC，只显示给死亡玩家；敌人攻击动画使用 Multicast RPC，让所有窗口看到一致表现。</p>
  </article>
  <article class="case-card">
    <h3>Replication</h3>
    <p>玩家生命和死亡状态、敌人移动、队伍分数、目标分数和胜利状态通过 Replication 同步给所有客户端。</p>
  </article>
</div>

<div class="case-media-grid">
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p02-img01.webp" alt="ServerFire 射线伤害蓝图" loading="lazy">
    <figcaption><strong>服务器权威射击</strong><span>客户端请求开火，服务器执行射线检测和 Apply Damage，避免不同窗口各自计算伤害。</span></figcaption>
  </figure>
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p09-img01.webp" alt="GameMode 击杀得分逻辑蓝图" loading="lazy">
    <figcaption><strong>GameMode 计分</strong><span>敌人死亡后由服务器侧 GameMode 修改队伍分数，并通过 GameState 同步公共比赛状态。</span></figcaption>
  </figure>
</div>

## 玩家系统

玩家射击基于 First Person 模板扩展。按下鼠标左键后，客户端先执行 `LocalFireVisual`，本地绘制射线反馈，减少等待网络往返造成的迟滞感；随后调用 `ServerFire` RPC，由服务器根据第一人称摄像机位置和朝向执行 Line Trace By Channel。命中目标后，服务器调用 Apply Damage，对敌人造成伤害。

玩家角色维护 `Health`、`MaxHealth` 和 `IsDead` 变量，其中生命值和死亡状态设置为 Replicated。敌人攻击玩家时由服务器调用 Apply Damage。角色在 `Event AnyDamage` 中先判断 `IsDead`，避免死亡后重复扣血，并将生命值 Clamp 到有效范围。

当生命值归零时，服务器设置死亡状态，并调用 `ClientShowDeathMenu`。该事件设置为 Run on Owning Client，因此死亡菜单只会出现在死亡玩家自己的窗口中。点击复活后，客户端请求服务器恢复生命、重置死亡状态并传送至 PlayerStart。

<div class="case-media-grid">
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p03-img01.webp" alt="玩家扣血与死亡判断蓝图" loading="lazy">
    <figcaption><strong>死亡判断</strong><span>玩家受伤后先检查死亡状态，再更新生命值并触发 Owning Client 的死亡菜单。</span></figcaption>
  </figure>
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p12-img02.webp" alt="死亡菜单界面" loading="lazy">
    <figcaption><strong>死亡菜单</strong><span>死亡 UI 只显示给对应玩家，避免服务器或其他客户端误弹界面。</span></figcaption>
  </figure>
</div>

## 敌人系统

敌人蓝图只在服务器 Authority 分支运行 AI。`BeginPlay` 中启动定时器，周期性调用 `UpdateEnemy`。该逻辑遍历所有玩家角色，跳过已经死亡的角色，选择距离最近的存活玩家作为目标，并使用 AI MoveTo 基于 NavMesh 追击。

进入攻击范围后，敌人使用 `LastAttackTime` 和 `AttackCooldown` 控制攻击频率。攻击触发时先调用 `Multicast_PlayAttack`，让所有客户端播放攻击动画；动画播放后延迟约 0.35 秒，再检查目标是否仍然有效且位于攻击范围内，然后执行 Apply Damage。

敌人生命归零后，服务器调用 GameMode 中的 `EnemyKilled` 增加队伍分数，再销毁敌人 Actor。这样敌人死亡、得分和胜利判断都由服务器统一处理，避免多个客户端分别计算导致状态不一致。

<div class="case-media-grid">
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p05-img02.webp" alt="敌人选择最近存活玩家蓝图" loading="lazy">
    <figcaption><strong>最近存活玩家索敌</strong><span>敌人遍历玩家角色，跳过已死亡目标，并选择最近的存活玩家进行追击。</span></figcaption>
  </figure>
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p08-img01.webp" alt="敌人动画蓝图" loading="lazy">
    <figcaption><strong>敌人动画蓝图</strong><span>通过速度参数驱动待机、行走、奔跑混合，攻击动画通过 Slot 叠加播放。</span></figcaption>
  </figure>
</div>

<div class="case-media-grid">
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p10-img01.webp" alt="主菜单界面与按钮入口" loading="lazy">
    <figcaption><strong>主菜单入口</strong><span>单人、创建多人游戏和加入游戏入口集中在主菜单中，多人流程从 Listen Server Lobby 开始。</span></figcaption>
  </figure>
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p11-img02.webp" alt="胜利提示界面" loading="lazy">
    <figcaption><strong>胜利同步</strong><span>队伍击杀数达到目标后，GameState 复制胜利状态，所有客户端 HUD 显示游戏胜利。</span></figcaption>
  </figure>
</div>

## 大厅、得分与胜利

主菜单包含单人游戏、创建多人游戏和加入游戏按钮。单人按钮直接打开战斗关卡；多人按钮通过 `open /Game/Demo/Lvl_Lobby?listen` 创建 Listen Server；加入按钮通过 `open 127.0.0.1` 连接本机服务器。

在 Lobby 中，`BP_LobbyGameMode` 通过 `PostLogin` 读取 `GameState.PlayerArray` 人数。当玩家数量达到 2 时，服务器执行 `servertravel /Game/Demo/Lvl_FirstPerson`，将所有客户端切换到战斗地图。

进入战斗地图后，GameMode 负责修改队伍得分；GameState 保存并复制 `TeamScore`、`TargetScore` 和 `GameWon`。当队伍击败 5 名敌人后，服务器设置胜利状态，所有客户端 HUD 同步显示胜利提示。

<div class="case-media-grid">
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p09-img02.webp" alt="Lobby PostLogin 跳转逻辑蓝图" loading="lazy">
    <figcaption><strong>Lobby 跳转逻辑</strong><span>Lobby GameMode 在 PostLogin 后统计 PlayerArray，人数达到 2 时由服务器执行 ServerTravel。</span></figcaption>
  </figure>
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p10-img02.webp" alt="HUD 读取玩家生命与 GameState 状态蓝图" loading="lazy">
    <figcaption><strong>HUD 状态读取</strong><span>HUD 读取本地玩家生命值，并从 GameState 获取队伍分数和胜利状态。</span></figcaption>
  </figure>
</div>

## 技术挑战与解决方式

<div class="case-card-grid">
  <article class="case-card">
    <h3>客户端射击不能直接决定伤害</h3>
    <p>本地射击结果如果直接决定伤害，容易只在自身窗口可见，或让多个窗口状态不一致。我将视觉反馈和权威伤害分离：本地立即绘制射线，真正的 Line Trace 与 Apply Damage 放在服务器执行。</p>
  </article>
  <article class="case-card">
    <h3>同步方式需要按信息类型拆分</h3>
    <p>敌人移动、攻击动画、死亡 UI 和全局得分的传播范围不同。我分别使用 Replication、Server RPC、Client RPC 与 Multicast RPC，并把公共比赛状态放入 GameState。</p>
  </article>
  <article class="case-card">
    <h3>菜单切图后输入模式残留</h3>
    <p>从主菜单或死亡界面进入战斗后，输入模式可能仍停留在 UI 状态。我在本地玩家 BeginPlay 与复活流程中恢复 Game Only 输入、隐藏鼠标并创建 HUD。</p>
  </article>
</div>

打包阶段还遇到过中文路径、临时 C++ Target 和未使用插件带来的构建问题。最终通过将关键资源迁移至英文目录、关闭未使用插件，并使用 Windows Development 配置完成可执行版本测试。

## 结果与反思

最终版本完成了题目要求的核心闭环，并能通过两个独立 exe 窗口演示 Listen Server 双人联机。玩家生命、死亡重生、敌人 AI、攻击表现、队伍得分和胜利状态能够在两端保持一致。

这个项目让我从“在引擎中实现功能”进一步转向“决定功能应由哪一端执行、哪些状态需要复制、谁拥有 UI 与输入”的多人游戏思维。虽然项目规模较小，但它补足了我在 UE5、Blueprint、UMG 和网络同步方面的实践空白。

如果继续迭代，我会优先完善更完整的武器系统、敌人生成波次、关卡目标引导、UI 与场景视觉，以及更稳定的房间发现流程；部分高频逻辑迁移至 C++ 也会作为后续学习方向，而不是当前版本已经完成的内容。

## 演示视频

<video class="case-video" src="/content-assets/projects/ue5-coop-training-range/demo-preview.mp4" poster="/content-assets/projects/ue5-coop-training-range/cover.webp" controls preload="metadata" playsinline></video>

## 相关链接

- [GitHub 仓库](https://github.com/Left-Jun/Left_Jun-Unreal-Afterclasswork_Tencent2026)
- [可执行版本](https://pan.quark.cn/s/1529aa6d5da7)
- [演示视频](/content-assets/projects/ue5-coop-training-range/demo-preview.mp4)
- [技术说明 PDF](/content-assets/projects/ue5-coop-training-range/technical-report.pdf)
- [提交简述 PDF](/content-assets/projects/ue5-coop-training-range/submission-brief.pdf)
