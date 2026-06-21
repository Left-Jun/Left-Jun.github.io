---
title: "Emotion Mask"
date: 2026-01-25T10:00:00+08:00
draft: false
slug: "emotion-mask"
description: "A 2D platformer-puzzle game built around an emotion state machine, platform visibility, dash-based breaking, shard collection, timer settlement, and public release flow, completed solo within 48 hours and published on TapTap."
image: "cover.png"
featured: true
featuredWeight: 20
pinWeight: 20
weight: 20
portfolioType: "game"
projectFacts:
  developmentTime: "2026.1, Global Game Jam 2026 Changsha site"
  duration: "48 hours"
  team: "Solo"
  role: "Solo full-stack developer / designer / programmer / pixel artist / music"
  tools: "Unity / C#"
  platform: "Windows / TapTap"
  result: "Completed solo and published on TapTap, with a 9.4 store rating."
projectLinks:
  - label: "TapTap page"
    url: "https://www.taptap.cn/app/868040?os=pc"
    icon: "link"
  - label: "Global Game Jam"
    url: "https://globalgamejam.org/games/2026/emotion-mask-6"
    icon: "link"
  - label: "Bilibili demo video"
    url: "https://www.bilibili.com/video/BV15e6tBNEKg/"
    icon: "brand-bilibili"
  - label: "Playable build"
    url: "https://pan.quark.cn/s/c587f493752e"
    icon: "link"
tags:
  - "Unity"
  - "C#"
  - "Game Jam"
  - "Photoshop"
roleTags:
  - "Solo Developer"
  - "Designer"
  - "Programmer"
relatedPages:
  - "retrospectives/emotion-mask-retrospective"
  - "plans/emotion-mask-roadmap"
  - "posts/shuguang-youji-roadshow"
---

## Overview

Emotion Mask is a 2D platformer-puzzle game centered on emotion switching. It was my solo entry for Global Game Jam 2026, responding to the theme "Mask." The player controls a boy wearing a blank mask and switches between three emotional states: Calm, Joy, and Anger. Each state changes how the character moves, reads the world, and interacts with obstacles.

The project was later published on TapTap. For me, it was not only a game jam prototype, but also my first complete practice of turning a small game into a public-facing portfolio piece with a store page, screenshots, tags, platform information, and a playable build. The public result here refers to the jam build, TapTap page, Global Game Jam page, and demo video; future plans around feel, tutorial flow, and additional masks are still iteration targets.

## Core Gameplay

The mask works as a bridge between character ability and level solution. Each emotion is tied to a distinct gameplay function rather than being a simple visual change.

- Calm reveals hidden paths and clues, helping the player understand the level.
- Joy improves mobility with higher, lighter jumps.
- Anger grants destructive force and dash-based obstacle breaking.

The level design encourages players to keep switching states. The strongest solution is rarely staying in one mode; it is choosing the right emotional state for the current problem.

## Screenshots and Mechanics

![Platforms visible under the Calm mask](/content-assets/projects/emotion-mask/screenshot-neutral-platform.png)

In the Calm state, certain hidden platforms become visible, allowing the player to observe the level and choose a safer route.

![The same platform logic under the Joy mask](/content-assets/projects/emotion-mask/screenshot-happy-platform.png)

After switching to Joy, the same platform is no longer visible, but the character gains faster movement. This contrast shows the core idea: masks are not simple buffs; they change how the level can be read.

![Platforming and state switching inside the level](/content-assets/projects/emotion-mask/screenshot-level.png)

The level combines spikes, walls, moving platforms, and mask states so the player keeps switching between execution and decision-making.

![Mask-switching tutorial area](/content-assets/projects/emotion-mask/screenshot-mask-tutorial.png)

The tutorial area explains the three mask abilities: Calm reveals moving platforms, Joy is faster, and Anger can destroy obstacles.

## Theme

The game explores the idea that emotions are not mistakes to be removed, but different ways of responding to the world. Calm, Joy, and Anger each have value: observation, movement, and breakthrough.

In that sense, the mask is both a mechanic and a metaphor. It turns inner emotional shifts into readable rules, actions, failures, and retries.

## My Role

- Independently handled game design, programming, level design, pixel-art integration, audio integration, build release, and store-page preparation.
- Designed three emotional mask states and connected state switching to movement speed, jumping, air jumps, wall jumps, dash count, character visuals, backgrounds, and music.
- Built the core rule that each state changes how the level is read: Calm reveals hidden platforms, Joy improves mobility, and Anger enables dash-based obstacle breaking.
- Completed the full 48-hour loop: start menu, level flow, checkpoints, death and respawn, shard collection, timer settlement, and victory screen.
- In the later local Unity project, organized the build scene flow as `StartMenu -> 001 -> 002 -> 003` and added per-level leaderboard timing, a level-complete menu, volume control, and trigger-driven typewriter prompts.
- Prepared the TapTap page, Global Game Jam page, Bilibili demo, playable package, descriptions, tags, platform information, and presentation material.

## Technical Implementation

The game was built in Unity with C#, with the main focus on responsive character control, state events, and fast level-feedback loops.
I explain the project through five layers: player control, emotion state, level feedback, death/respawn, and release flow. This structure reflects the real core of Emotion Mask: the masks are not three skins, but a state machine that changes how the level can be read and solved.

- `MaskControl` acts as the emotion state center. It maintains `Neutral`, `Happy`, and `Angry`, then notifies platform, music, and feedback systems through `OnEmotionChangedEvent`.
- Each emotion owns an `EmotionStats` set that writes into `PlayerMove`, `PlayerJump`, and `PlayerDash`, changing movement speed, jump force, air jumps, wall jumps, dash speed, cooldown, and air-dash count.
- Calm-state platforms are controlled through `neutralPlatforms` and `EmotionalPlatform`, which toggle renderer and collider state. When leaving Calm, the script also detaches the player from hidden platforms to avoid carrying the player with a disabled object.
- Anger connects to the dash and breakable-wall systems: `PlayerDash` checks whether the current emotion is `Angry`, and `Hurtcheck` only calls `BreakableTilemap` or obstacle animation when the player is both angry and dashing.
- Death and respawn are linked through `Hurtcheck`, `CheckPoint`, and `GetRespawn`: traps trigger death feedback and then return the player to the latest checkpoint instead of breaking the level flow.
- Shard collection notifies `GameManager`; once the target count is reached, the game stops the timer, records leaderboard data, locks player control, switches to ending music, and shows the win flow.

## System Structure

The scripts are mainly organized into five modules:

- Player control: `PlayerMove`, `PlayerJump`, `PlayerDash`, `GroundCheck`, and `WallCheck` for platforming feel and dash behavior.
- Mask switching and presentation: `MaskControl`, `MaskAnimator`, `EmotionalPlatform`, and `MusicManager` for state, visuals, platform visibility, and music switching.
- Level interaction: `CheckPoint`, `GetRespawn`, `Hurtcheck`, `TrapCheck`, `PlatformMove`, `BreakableTilemap`, and `CollectibleRotation` for failure, respawn, moving platforms, breakable obstacles, and shard feedback.
- Flow and settlement: `GameManager`, `GameTimer`, `LevelLeaderboard`, `LevelCompleteMenu`, and `PlayerCheckpoints` for shard goals, final time, level ranking, level chaining, and input locking.
- Menu and UI: `StartMenu`, `GamingMenu`, `SceneLoadButton`, `MapSelector`, and basic UI animation for start, pause, level select, restart, and return flow.

As a flow, the key is not having many states, but making every state return to level feedback:

![Emotion Mask system flow](/content-assets/projects/emotion-mask/flow-system-en.svg)

The core data flow is: the player switches masks, `MaskControl` updates state and character parameters, state events drive platform visibility and music, and player movement/jumping/dashing enters level interaction. Traps go through the respawn chain, angry dashes go through the breaking chain, and shard collection goes through the settlement chain. This kept the 48-hour implementation light while making every feedback path point back to emotion switching.
The main engineering tradeoff was reliability over spectacle. Before hidden platforms are disabled, the player is detached from them; traps return the player to the latest checkpoint; and the victory sequence locks player control while switching to ending music. Those details are quiet, but they made the jam build much easier for strangers to finish.

## Release

Emotion Mask was published on TapTap and submitted to Global Game Jam 2026. The TapTap page presents the game description, platform requirements, developer note, and player rating, while the GGJ page records the jam year, theme, site, platform, tools, and project links.

This project helped me understand that finishing a prototype is only one part of showing a game. Screenshots, cover art, tags, store copy, download links, and external pages all affect how the work is perceived. The later local multi-level flow, leaderboard, and UI support systems are iteration foundations, but they still need manual Play Mode and build verification before being described as part of a public release.
