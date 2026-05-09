---
title: "Emotion Mask"
date: 2026-01-25T10:00:00+08:00
draft: false
slug: "emotion-mask"
description: "A 2D platformer-puzzle game built around emotion switching, completed solo within 48 hours and published on TapTap."
image: "cover.png"
weight: 40
portfolioType: "game"
projectFacts:
  developmentTime: "2026.1, Global Game Jam 2026 Changsha site"
  duration: "48 hours"
  role: "Solo full-stack developer / designer / programmer / pixel artist / music"
  tools: "Unity / C#"
  platform: "Windows / TapTap"
  result: "Completed solo and published on TapTap, with a 9.4 store rating."
tags:
  - "Unity"
  - "C#"
  - "Game Jam"
---

## Overview

Emotion Mask is a 2D platformer-puzzle game centered on emotion switching. It was my solo entry for Global Game Jam 2026, responding to the theme "Mask." The player controls a boy wearing a blank mask and switches between three emotional states: Calm, Joy, and Anger. Each state changes how the character moves, reads the world, and interacts with obstacles.

The project was later published on TapTap. For me, it was not only a game jam prototype, but also my first complete practice of turning a small game into a public-facing portfolio piece with a store page, screenshots, tags, platform information, and a playable build.

## Core Gameplay

The mask works as a bridge between character ability and level solution. Each emotion is tied to a distinct gameplay function rather than being a simple visual change.

- Calm reveals hidden paths and clues, helping the player understand the level.
- Joy improves mobility with higher, lighter jumps.
- Anger grants destructive force and dash-based obstacle breaking.

The level design encourages players to keep switching states. The strongest solution is rarely staying in one mode; it is choosing the right emotional state for the current problem.

## Theme

The game explores the idea that emotions are not mistakes to be removed, but different ways of responding to the world. Calm, Joy, and Anger each have value: observation, movement, and breakthrough.

In that sense, the mask is both a mechanic and a metaphor. It turns inner emotional shifts into readable rules, actions, failures, and retries.

## My Role

- Independently handled game design, programming, level design, art integration, sound integration, and release preparation.
- Designed three emotional mask states and connected them to movement parameters, dash logic, visual feedback, and level interactions.
- Completed a playable loop within the 48-hour jam window, including menu flow, level progression, death and respawn, collectible fragments, and ending feedback.
- Prepared the public TapTap and Global Game Jam pages with descriptions, tags, platform information, and presentation material.

## Technical Implementation

The game was built in Unity with C#, with a focus on responsive character control and fast iteration.

- Implemented movement, variable jumping, double jump, dash, wall detection, death, and respawn.
- Used a state-machine structure to drive emotion-specific abilities, visual changes, movement tuning, and scene feedback.
- Connected hidden platforms, breakable obstacles, and emotion fragments to the state system so that ability switching becomes the core puzzle language.
- Prioritized a minimal but complete gameplay loop under game jam time pressure, making sure the prototype had readable feedback and a finishable flow.

## System Structure

The scripts are mainly organized into five modules:

- Player control: `PlayerMove`, `PlayerJump`, `PlayerDash`, `GroundCheck`, `WallCheck`, `HurtCheck`, and `Respawn`.
- Mask switching and presentation: `MaskControl`, `MaskAnimator`, `EmotionalPlatform`, and `MusicManager`.
- Level interaction: `CheckPoint`, `PlatformMove`, `TrapCheck`, and `CollectibleRotation`.
- Flow and settlement: `GameManager`, `GameTimer`, and `PlayerCheckpoints`.
- Menu and UI: start menu, pause menu, and basic interface feedback.

The three masks change more than character stats. They also affect platform visibility, obstacle handling, background state, and music feedback. Player input flows through movement, jumping, dashing, mask switching, character-parameter updates, scene-state changes, platform logic, and final settlement.

## Release

Emotion Mask was published on TapTap and submitted to Global Game Jam 2026. The TapTap page presents the game description, platform requirements, developer note, and player rating, while the GGJ page records the jam year, theme, site, platform, tools, and project links.

This project helped me understand that finishing a prototype is only one part of showing a game. Screenshots, cover art, tags, store copy, download links, and external pages all affect how the work is perceived.

## Links

- [TapTap page](https://www.taptap.cn/app/814556?os=pc)
- [Global Game Jam page](https://globalgamejam.org/games/2026/emotion-mask-6)
- [Bilibili demo video](https://www.bilibili.com/video/BV15e6tBNEKg/)
- [Playable build](https://pan.quark.cn/s/e9fadb101a75?pwd=duyj)
