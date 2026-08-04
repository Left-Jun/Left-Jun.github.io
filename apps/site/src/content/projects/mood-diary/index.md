---
title: "Mood Diary 心情日记"
draft: false
slug: "mood-diary"
description: "基于 C++17 与 Qt Widgets 的本地情绪日记应用，包含记录管理、情绪空间、情绪转化互动与 JSON 持久化。"
image: "cover.png"
portfolioType: "web"
status: "completed"
projectFacts:
  projectType: "C++ 课程团队项目"
  team: "4 人课程团队"
  role: "初版主开发 / 报告主笔"
  tools: "C++17 / Qt Widgets / CMake / JSON"
  platform: "Windows"
  result: "完成初版数据模型、日记增删改查、Qt 界面、JSON 存储、构建脚本与报告整合。"
attachments:
  - title: "Mood Diary 情绪空间界面"
    type: "PNG"
    description: "脱敏界面截图，展示最近 30 天的情绪星图、阶段摘要与本地桌面应用布局。"
    thumbnail: "mood-space.png"
    previewUrl: "/content-assets/projects/mood-diary/mood-space.png"
    fileSize: "61 KB"
tags:
  - "C++"
  - "Qt"
  - "JSON"
  - "桌面应用"
roleTags:
  - "初版主开发"
  - "报告主笔"
---

## 项目简介

Mood Diary 是一款基于 C++17 与 Qt Widgets 的本地单机应用，用于记录日记、情绪能量、强度、主情绪、诱因和应对方式。项目在初版日记管理基础上继续加入情绪空间、情绪转化互动和漂流瓶扩展，作为《C++ 面向对象程序设计》课程团队大作业完成。

## 我的职责

我负责项目选题、初版核心数据模型、日记增删改查、基础 Qt Widgets 界面、JSON 本地存储、CMake 构建脚本和初版打包流程，并主笔整合课程报告。后续成员在同一框架上扩展漂流瓶和情绪互动，因此页面只把初版开发和报告整合归为我的直接贡献。

## 系统结构

项目按界面层、核心业务层、存储层和扩展互动层组织。`DiaryManager` 管理日记与查询，`StorageManager` 负责 JSON 读写，情绪空间通过自定义 QWidget 绘制近期状态，互动模块使用继承和多态表示不同情绪对象。

## 实现结果

应用支持日记新增、修改、删除和筛选，记录情绪字段并在重启后恢复数据。图形化入口包含首页、记录页、情绪空间、情绪转化和漂流瓶；控制台入口用于验证核心类可以脱离 GUI 运行。

## 项目边界

原始课程报告包含学号和其他成员姓名，因此保持私有，不作为附件公开。项目页使用脱敏截图和职责说明展示成果，不把团队后续扩展全部归入我的个人实现。
