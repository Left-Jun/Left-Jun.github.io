---
title: "Emotion Mask"
date: 2026-01-25T10:00:00+08:00
draft: false
slug: "emotion-mask"
description: "一款围绕情绪状态切换展开的 2D 平台跳跃解谜游戏，48 小时内独立完成并上线 TapTap。"
image: "cover.png"
weight: 40
portfolioType: "game"
projectFacts:
  developmentTime: "2026.1（Global Game Jam 2026 长沙线下站）"
  duration: "48h"
  role: "独立全栈开发 / 策划 / 程序 / 像素美术 / 音乐"
  tools: "Unity / C#"
  platform: "Windows / TapTap"
  result: "单人完成并上架 TapTap，商店评分 9.4。"
tags:
  - "Unity"
  - "C#"
  - "Game Jam"
---

## 项目简介

《Emotion Mask》是一款以“情绪切换”为核心机制的 2D 平台跳跃解谜游戏，也是我在 Global Game Jam 2026 中独立完成的作品。游戏围绕当年主题“Mask”展开：玩家操控一位戴着空白面具的少年，在破碎的内心世界中切换“平静”“快乐”“愤怒”三种情绪状态，用不同能力观察道路、跨越障碍、粉碎阻挡，并收集散落的情绪碎片。

这个项目后来发布到了 TapTap。它对我来说不只是一次 Game Jam 练习，也是第一次把一个从概念、玩法、关卡到发布页面都完整走完的小型商业化展示流程。

## 核心玩法

游戏把“面具”设计成角色能力与关卡解法之间的转换器。每一种情绪不是单纯换皮，而是对应一套操作手感和环境反馈。

- 平静：看破隐藏路径和线索，帮助玩家理解关卡结构。
- 快乐：提升跳跃高度与移动轻盈感，用更强的机动性跨越平台。
- 愤怒：获得冲刺和破坏能力，撞开阻碍路线的障碍。

关卡设计的重点是让玩家意识到：真正的解法不是一直维持某种强能力，而是在不同情绪之间切换，选择当下最合适的状态。

## 主题表达

《Emotion Mask》的叙事核心是“接纳不同情绪，才可能靠近完整的自我”。平静、快乐和愤怒都不是绝对正确或错误的状态，它们分别承担观察、行动和突破的功能。玩家在不断切换面具的过程中，也是在重新理解自己与世界的关系。

因此，面具既是玩法工具，也是情绪外化的符号。它把抽象的心理状态变成了可操作、可失败、可重新尝试的游戏机制。

## 我负责的部分

- 独立完成玩法策划、程序开发、关卡设计、美术整合、音效整合与发布整理。
- 设计三种情绪面具的能力差异，并把它们接入角色移动参数、冲刺逻辑和场景反馈。
- 在 48 小时限制内完成可玩的完整流程，包括开始界面、关卡推进、死亡复活、碎片收集与结算体验。
- 整理 TapTap 商店页与 Global Game Jam 页面所需的介绍、标签、平台信息和展示素材。

## 技术实现

项目使用 Unity 与 C# 开发，重点放在角色控制、状态切换和快速迭代上。

- 实现角色移动、长短跳、二段跳、冲刺、贴墙判定、死亡复活等基础平台跳跃能力。
- 使用状态机管理三种情绪状态，让角色外观、移动参数、可用技能和关卡交互随状态同步变化。
- 将隐藏平台、可破坏障碍、情绪碎片等关卡元素与状态系统绑定，形成“能力切换即解谜”的结构。
- 在 Game Jam 时间压力下，用最小可行系统优先保证手感、反馈和关卡闭环。

## 系统结构

项目脚本主要拆成五个模块：

- 玩家控制系统：`PlayerMove`、`PlayerJump`、`PlayerDash`、`GroundCheck`、`WallCheck`、`HurtCheck`、`Respawn`。
- 面具切换与表现系统：`MaskControl`、`MaskAnimator`、`EmotionalPlatform`、`MusicManager`。
- 关卡交互系统：`CheckPoint`、`PlatformMove`、`TrapCheck`、`CollectibleRotation`。
- 流程与结算系统：`GameManager`、`GameTimer`、`PlayerCheckpoints`。
- 菜单与界面系统：开始界面、暂停菜单和基础 UI 反馈。

三种面具不只改变角色数值，也影响平台显示、障碍处理、背景与音乐反馈。玩家输入经过移动/跳跃/冲刺后进入面具切换，再推动角色参数、场景状态、平台逻辑和终点结算变化，形成完整的状态联动链路。

## 发布与反馈

《Emotion Mask》已发布到 TapTap，并同步提交到 Global Game Jam 2026。TapTap 页面展示了游戏简介、平台配置、开发者说明和玩家评分；GGJ 页面记录了项目的 Jam 年份、主题、站点、平台和开发工具。

这次发布让我第一次完整经历了“原型完成之后如何被别人看到”的过程：不仅要做出能玩的版本，还要思考封面、简介、标签、配置说明和下载入口如何共同呈现作品。

## 项目链接

- [TapTap 页面](https://www.taptap.cn/app/814556?os=pc)
- [Global Game Jam 页面](https://globalgamejam.org/games/2026/emotion-mask-6)
- [B站演示视频](https://www.bilibili.com/video/BV15e6tBNEKg/)
- [可执行版本](https://pan.quark.cn/s/e9fadb101a75?pwd=duyj)
