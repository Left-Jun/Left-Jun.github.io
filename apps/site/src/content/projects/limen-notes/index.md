---
title: "阈限手记"
date: 2026-06-21T21:30:00+08:00
draft: false
slug: "limen-notes"
description: "一个面向随笔、日记与个人表达场景的开发中 Web 产品，以暖色纸张、留白排版和低干扰交互构建写作与阅读体验。"
image: "cover.png"
imagePosition: "center"
featured: false
featuredWeight: 70
homeHeroWeight: 50
pinWeight: 70
weight: 70
portfolioType: "web"
status: "in-progress"
projectFacts:
  developmentTime: "2026.06 - 进行中"
  duration: "持续迭代"
  team: "独立开发"
  role: "产品设计 / Web 开发 / 内容系统整理"
  tools: "Next.js App Router / Supabase / PWA"
  techNote: "本地 JSON fallback / Auth / Profile / Notes"
  platform: "Web"
  platformNote: "notes.leftjun.com"
  result: "已形成公开笔记、分类、搜索、登录资料、后台编辑、PWA 外壳与心情相关原型等代码路径，仍处于持续打磨阶段。"
projectLinks:
  - label: "在线站点"
    url: "https://notes.leftjun.com"
    icon: "link"
  - label: "GitHub 仓库"
    url: "https://github.com/Left-Jun/notes"
    icon: "brand-github"
tags:
  - "Web Development"
  - "Next.js"
  - "Supabase"
  - "PWA"
  - "Responsive Design"
  - "UI / UX"
  - "Writing"
roleTags:
  - "独立开发"
  - "产品设计"
  - "Web 开发"
---

## 项目背景

“阈限手记”是我在作品集之外继续整理日常、随笔、日记和个人表达的 Web 产品。它不是传统信息流社区，而更像一个可长期维护的个人纸张空间：内容可以被分类、搜索和继续编辑，阅读体验尽量保持低干扰，让页面服务于文字本身。

这个项目目前仍在开发中。页面里展示的是已经在仓库中存在或有明确代码路径的功能，不把后续规划写成已经完成的线上成果。旧 Hugo 随笔站暂时作为内容来源和备份，当前工程则使用 Next.js App Router 重建动态内容、资料和轻量后台能力。

## 产品目标

<div class="case-card-grid">
  <article class="case-card">
    <h3>低干扰写作</h3>
    <p>把后台编辑、分类、标签和本地 fallback 做成可维护流程，让内容可以先被写下来，再逐步接入更完整的数据源。</p>
  </article>
  <article class="case-card">
    <h3>沉浸式阅读</h3>
    <p>视觉上使用暖色纸张、较大的留白和克制的界面层级，减少装饰抢走文字注意力。</p>
  </article>
  <article class="case-card">
    <h3>可继续生长</h3>
    <p>在笔记、资料、登录、评论 API、心情小径和 PWA 外壳之间保留扩展接口，便于后续迭代。</p>
  </article>
</div>

## 我的职责

本项目为独立策划与开发。我负责产品定位、信息架构、视觉方向、Next.js 页面实现、Supabase 数据结构、响应式适配、后台写入流程和版本管理。

它对我的意义不只是“做一个博客”，而是训练一个更完整的 Web 产品闭环：从内容模型、页面结构、用户资料、后台编辑，到移动端安装外壳和本地开发 fallback，都需要考虑真实维护时的可用性。

## 已实现的代码路径

根据当前仓库，项目已经具备这些可核对的实现：

- 公开笔记首页、分类页、详情页与最近记录展示。
- 基于笔记标题、摘要、标签和内容的站内搜索入口。
- `data/notes.json` 与 `lib/seed-notes.ts` 的本地内容 fallback；没有 Supabase 环境变量时也能先调试 UI。
- Supabase `notes`、`profiles`、`comments`、`mood_entries` 等表结构与 RLS 策略脚本。
- 登录、注册、个人资料页，以及头像、昵称、状态、简介和社交链接相关代码。
- 后台编辑页面与写入接口；本地开发时可以写回 JSON，接入 Supabase 后可写数据库和 Storage。
- PWA manifest、Service Worker 注册和基础离线外壳。
- 心情小径、匿名广场、状态回顾和“坏心情怪兽”小游戏原型路由。
- 评论读取与 API 结构；公开游客写入在第一版保持关闭，等待审核后台完善。

## 设计语言

我希望“阈限手记”与 Left Jun / Limenauts 主品牌保持识别关联，但不照搬作品集站的项目卡片密度。它更接近日记本、便笺和个人书桌：暖黄纸张、深色或深灰文字、较大的留白、低对比装饰，以及在必要时才出现的操作入口。

这个方向也约束了功能表达：页面不会用大量宣传式模块说明“它能做什么”，而是让阅读路径本身变得安静。首页先给最近记录、分类和心情入口，后台与资料功能则放在更明确的使用场景里。

## 工程实现

项目使用 Next.js App Router。内容读取层通过 `getNotes` 在 Supabase 与本地 JSON / seed 内容之间切换，使开发环境即使没有远端数据库也能继续推进页面和样式。

Supabase 侧包含笔记、资料、评论、心情记录和支持动作等表，并通过 RLS 限定公开读取、用户资料更新和心情记录访问范围。图片与头像使用 Storage bucket 设计，后台写入和上传接口通过服务端口令保护。

PWA 部分先采用 Web 安装壳：manifest 使用真实品牌图片，Service Worker 缓存站点外壳、品牌图和头像，作为移动端初版的基础。如果后续需要进入应用商店，可以在这一套 Next.js 站点基础上接入 Capacitor，而不是立刻维护一份原生工程。

## 当前状态与下一步

当前项目处于开发中：主要页面、内容读取、资料、后台、PWA 与心情相关原型已经有代码路径，但线上内容组织、审核后台、评论体验、心情功能的完整产品闭环仍需要继续验证。

下一步会优先把真实写作流程跑顺：内容导入、后台编辑、图片上传、移动端阅读、资料展示和基础性能。只有这些基础流程稳定后，才会继续扩大互动功能范围。
