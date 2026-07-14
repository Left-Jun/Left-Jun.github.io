---
title: "Relativity of a Dot"
date: 2026-02-10T10:00:00+08:00
draft: false
slug: "relativity-of-a-dot"
description: "一个 6 小时完成的二维 / 三维切换解谜原型，通过 DimensionManager、Cinemachine、移动轴切换和碰撞体切换验证同一关卡的空间解法变化。"
image: "cover.png"
imagePosition: "45% center"
pinWeight: 50
weight: 50
portfolioType: "game"
status: "completed"
projectFacts:
  developmentTime: "2026.2（萌芽杯 2026 创意原型）"
  duration: "6h"
  team: "独立开发"
  role: "单人开发 / 创意 Demo"
  tools: "Unity / C# / Cinemachine"
  platform: "Windows 可执行版本"
  result: "完成二维 / 三维切换、视角联动与空间解谜的核心闭环。"
projectLinks:
  - label: "可执行版本"
    url: "https://pan.quark.cn/s/0e4e5440844f?pwd=RvND"
    icon: "link"
    kind: "playable"
tags:
  - "Unity"
  - "C#"
  - "Prototype"
  - "Puzzle"
roleTags:
  - "单人开发"
  - "创意原型"
---

## 项目简介

这是一个二维 / 三维切换解谜原型，我用它来验证“同一关卡在不同空间规则下产生不同解法”这个想法是否成立。

项目灵感来自“dot（点）”这个关键词：点可以是一维的、二维的，也可以是三维空间中的投影。于是我把它转化为一个空间视角原型，让玩家在二维投影和三维场景之间切换，用同一个角色理解不同规则下的道路。

这个项目的价值不在内容规模，而在于快速证明一个机制链路是否能成立：玩家按下 `Tab` 后，视角、移动轴、落地检测和碰撞体一起变化，原本像墙的结构会因为空间深度被重新解释。它在作品集里的定位是“机制验证样本”，不是完整商业化关卡。

## 截图与机制展示

![二维视角](/content-assets/projects/relativity-of-a-dot/screenshot-2d-view.png)

二维模式下，玩家看到的是类似侧视平台关卡的投影结果，移动被限制在单一平面内，障碍关系更像传统 2D 解谜。

![三维视角](/content-assets/projects/relativity-of-a-dot/screenshot-3d-view.png)

切换到三维后，摄像机和移动规则同步变化。原本在二维中看似阻挡的结构，会因为空间深度被重新理解。

## 我负责的部分

- 单人完成机制设计、Unity 原型搭建、基础关卡结构、相机切换和可执行版本整理。
- 将“二维投影 / 三维空间”拆成可实现的工程链路：`DimensionManager` 管理当前维度，玩家控制脚本根据维度切换移动轴，场景物体根据维度切换碰撞规则。
- 快速验证维度切换、相机切换、碰撞体启用和玩家投影修正能否在同一关卡中协同工作。

## 技术实现

- `DimensionManager` 作为维度状态中心，按下 `Tab` 时通过 `BroadcastMessage` 在 `SwitchTo2D` 和 `SwitchTo3D` 之间切换，并同步调整两台 `CinemachineVirtualCamera` 的优先级。
- `PlayerMove` 保留同一个刚体角色：二维状态只写入 X 轴速度，三维状态同时写入 X / Z 轴速度，让玩家在同一对象上体验两套移动规则。
- `DimensionObject` 为同一空间物体准备二维 / 三维两套碰撞体，维度切换时启用不同 collider，使同一几何结构在不同视角下承担不同阻挡关系。
- 当玩家在二维状态落到维度物体上时，`DimensionObject` 会根据碰撞法线修正玩家 Z 轴位置，把三维物体重新压回二维投影关系，避免切换后位置漂移。
- `GroundCheck2D` 与 `GroundCheck3D` 分别使用 2D / 3D 射线检测，保证跳跃和落地判断能跟随当前空间规则。
因为制作时间只有 6 小时，我没有去做完整关卡编辑器或复杂谜题系统，而是优先验证“状态切换能否牵动所有必要规则”。所以所有实现都围绕 `DimensionManager` 展开：相机、移动轴、落地检测和碰撞体都只回答一个问题，当前到底按二维规则还是三维规则运行。

## 系统结构

- 维度切换系统：`DimensionManager` 统一控制二维 / 三维状态，并同步切换 Cinemachine 相机优先级。
- 玩家控制系统：`PlayerMove`、`PlayerJump`、`GroundCheck2D`、`GroundCheck3D` 负责两种空间规则下的移动、跳跃和落地检测。
- 空间物体系统：`DimensionObject` 根据当前维度启用不同碰撞体，并在二维状态下修正玩家投影位置。
- 菜单与流程系统：开始界面、暂停菜单和基础流程控制，保证原型具备可体验闭环。

流程上，它是一条很短但完整的空间规则链：

![Relativity of a Dot 系统流程图](/content-assets/projects/relativity-of-a-dot/flow-system.svg)

这个原型的重点不是内容量，而是验证一条清晰链路：玩家按下 `Tab` 后，维度状态切换、相机视角切换、移动轴限制、碰撞规则变化，同一关卡因此产生新的空间解法。
这次整理后，我把它放在作品集中更像一个“机制验证样本”：它证明我能把抽象概念快速拆成可验证的工程链路，也能判断哪些东西在原型阶段可以先不做。
