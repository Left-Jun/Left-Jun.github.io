---
title: "智能风动船模无线遥控系统"
date: 2026-03-28T10:00:00+08:00
draft: false
slug: "smart-boat"
description: "一个偏软硬件结合的完整项目，覆盖遥控器、接收器、驱动编写、PCB 设计和调试。"
image: "cover.png"
featured: true
featuredWeight: 20
weight: 10
portfolioType: "embedded"
projectFacts:
  developmentTime: "2026.3"
  duration: "课程 / 竞赛周期"
  role: "队长 / 主程 / 硬件设计"
  tools: "STM32F103C8T6 / HAL / 嘉立创 EDA"
  platform: "无线遥控器 + 船载接收器"
  result: "完成软硬件联调和可下水运行版本，进入决赛阶段。"
tags:
  - "STM32"
  - "Embedded"
  - "Hardware"
---

## 项目简介

这是一个偏软硬件结合的完整项目，核心目标是完成遥控器与船载接收器的无线控制系统。

## 我负责的部分

- 担任队长、主程与硬件设计。
- 独立完成遥控器与接收器的软硬件开发与调试。

## 技术实现

- 基于 STM32F103C8T6 与 HAL 完成 SPI、ADC、PWM 等驱动。
- 使用嘉立创 EDA 绘制 PCB 并完成焊接。
- 通过并联电容与软件滤波优化电源纹波和摇杆抖动。
- 完成输入采样、PWM 映射和可下水运行版本。

## 截图与工程展示

![STM32CubeMX 引脚配置](screenshot-stm32-pinout.png)

引脚配置围绕 STM32F103C8T6 展开，包含 ADC 输入、SPI 通信、USART 调试和基础 GPIO 输出。

![接收端原理图](screenshot-schematic.png)

原理图包含 3.3V 稳压、电源滤波、晶振、nRF24L01 通信模块、状态指示灯和外部接口。

![STM32CubeIDE 代码调试](screenshot-code.png)

代码侧完成 ADC 采样、油门/舵机映射、nRF24L01 数据发送和状态灯反馈，形成遥控器到船端执行机构的控制链路。

## 项目结果

- 成为少数完赛队伍，并进入决赛阶段。
