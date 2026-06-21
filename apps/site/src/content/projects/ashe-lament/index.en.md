---
title: "Elegy of Asherah"
date: 2026-03-20T10:00:00+08:00
draft: false
slug: "ashe-lament"
description: "A 72-hour Tencent University Game Extreme Development Competition team project: a 2D platformer and resource-management game built around spirit energy, underground safe time, shortcut construction, and multi-ending settlement."
image: "cover.png"
coverVideo: "cover.mp4"
pinned: true
pinWeight: 10
featured: true
featuredWeight: 10
weight: 10
portfolioType: "game"
projectFacts:
  developmentTime: "2026.3, Tencent University Game Extreme Development Competition"
  duration: "72 hours"
  team: "5 people"
  role: "Team lead / main programmer / gameplay designer / music producer with AI assistance"
  tools: "Unity / C#"
  platform: "Windows playable build"
  result: "Completed time-limited platforming, resource collection, shortcut construction, spirit-energy settlement, and three endings."
projectLinks:
  - label: "Playable build"
    url: "https://pan.quark.cn/s/efcee623b3f4?pwd=TQCA"
    icon: "link"
tags:
  - "Unity"
  - "Platformer"
  - "Team Project"
  - "C#"
roleTags:
  - "Team Lead"
  - "Main Programmer"
  - "Gameplay Designer"
relatedPages:
  - "retrospectives/ashe-lament-retrospective"
  - "plans/ashe-lament-roadmap"
  - "posts/shuguang-youji-roadshow"
---

## Overview

Elegy of Asherah is a Limenauts team project created for the Tencent University Game Extreme Development Competition, Chengdu site. I served as team lead, main programmer, gameplay designer, and music producer. The playable core was built within the 72-hour competition window, with portfolio material and presentation notes organized afterward. The player becomes the last "root speaker" in a dying world sustained by Asherah, the Mother Tree. To delay the final silence, the player travels between underground roots and the surface trunk, gathers remaining spirit energy, builds shortcuts, climbs upward, and tries to return the last power to the heart of the world before their own energy runs out.

The project is not only about moving quickly or jumping precisely. Its central challenge is management: time, resources, risk, and route planning all compete with each other.

## Worldbuilding

The story takes place during the Great Withering. Asherah was once the source of life: her roots reached into the earth, her crown touched the stars, and spirit energy flowed through her like a living cycle. As that energy dries up, forests lose color, civilizations scatter, and the Mother Tree enters a long final decline.

The player is the last root speaker and the final manager of this fading world. There are no legendary heroes left, only concrete decisions: collect a little more energy or return before it is too late, spend bones to build a shortcut or save them for later, move faster through a risky form or preserve spirit energy for the ending.

In this setting, "management" is not an abstract theme. It is the last attempt to maintain order inside an irreversible collapse.

## Core Gameplay

The game is built around two connected loops.

- Underground exploration: the player enters root-like spaces under strict time pressure, using platforming skills to collect spirit energy and bones.
- Surface climbing: the player spends gathered resources to climb the dead trunk of the Mother Tree, build shortcuts, and reduce the difficulty of later attempts.

Spirit energy functions as health, action fuel, time pressure, and ending resource at once. It naturally drains over time and can be consumed faster through risky actions. The amount of spirit energy delivered at the end determines the ending, directly connecting resource management to narrative outcome.

## Screenshots and Systems

![Gameplay notice board](/content-assets/projects/ashe-lament/screenshot-notice-board.png)

The notice board explains spirit energy, bones, the timer, enhanced form, and shortcut construction in one screen, helping players understand the resource pressure before entering the main loop.

![Story dialogue box](/content-assets/projects/ashe-lament/screenshot-dialogue.png)

The dialogue system carries both progression and worldbuilding. Qizhi, the remaining echo of the Mother Tree's will, introduces rules and gives emotional guidance during the journey.

![Enhanced form and underground collection](/content-assets/projects/ashe-lament/screenshot-underground.png)

The underground area focuses on time pressure and execution efficiency. The player can enter an enhanced form to move more effectively, but spirit energy drains faster, forcing a tradeoff between reward and risk.

![Surface climbing and shortcut construction](/content-assets/projects/ashe-lament/screenshot-shortcut.png)

The surface phase is more about long-term planning. Players can spend resources to build shortcuts, turning underground collection results into route advantages.

![Spirit-energy prompt](/content-assets/projects/ashe-lament/screenshot-speed-board.png)

Process prompts are layered directly into the scene, giving strong feedback when player actions consume or change core resources.

![Ending screen](/content-assets/projects/ashe-lament/screenshot-ending.png)

Different endings are triggered by the final amount of delivered spirit energy, connecting the player's resource-management performance to the narrative conclusion.

![Epilogue screen](/content-assets/projects/ashe-lament/screenshot-epilogue.png)

The epilogue visualizes a new pulse after decay, echoing the game's themes of cycle, sacrifice, and renewal.

![Staff roll](/content-assets/projects/ashe-lament/screenshot-staff.png)

The staff screen records the team roles and gives the 72-hour collaboration a clear closing note.

## My Role

- Served as team lead, main programmer, gameplay designer, and music producer, turning the team's ideas, level flow, writing, art, and code into a playable build within 72 hours.
- Led the core loop design: timed underground collection, surface climbing, bone-based shortcut construction, final spirit-energy delivery, and multi-ending feedback.
- Implemented the main gameplay systems, including movement, jumping, dashing, form switching, spirit-energy drain, safe-time logic, pickups, shortcut construction, and ending checks.
- Turned the narrative idea of fading spirit energy into tunable gameplay pressure: area, form, remaining safe time, and final delivery all affect resource management.
- Worked with writing and art teammates to translate the Mother Tree, root speaker, Great Withering, Qizhi, and spirit energy into UI prompts, scene feedback, and progression beats.

## Technical Implementation

The game was developed in Unity and C#. The key implementation decision was to treat resource management as a shared state center rather than a set of isolated mechanics.
I reframed the implementation around three inputs: player commands, area state, and resource triggers. Commands drive movement, jumping, dashing, and form switching; area state decides safe-time and drain rules; triggers handle pickups, shortcuts, dialogue, and endings. That made debugging easier under jam pressure because most bugs could be traced to the input layer, the shared state layer, or the output/feedback layer.

- `EnergyManager` stores spirit energy and bone shards, then broadcasts changes to UI, form visuals, and settlement logic through events.
- `EnergyDrainController` calculates drain rate from player Y position, current form, and remaining `SafetyTimer` time. Surface, underground safe time, underground danger time, and enhanced form all have different costs.
- `SafetyTimer` uses a Y-axis threshold to count down only while the player is underground; time-extension pickups turn exploration risk into recoverable time.
- `MaskControl` applies normal/enhanced stats to movement speed, jumping, air jumps, wall jumps, dashing, character visuals, and background state.
- `ShortcutBuilder` spends both bone shards and spirit energy when the player enters a trigger zone and presses the build key, while also handling insufficient-resource prompts.
- `EndingManager` reads final spirit energy and uses tunable thresholds for high, normal, and low endings. When energy reaches zero, it triggers a death ending, disables player control, switches music, and loads the configured return scene.
- Menus, restart, and ending return use `SceneManager.LoadScene`; the main surface/underground distinction is handled through Y-axis thresholds and triggers, keeping the jam build simpler than a heavy scene-streaming setup.

## System Structure

To keep the 72-hour project manageable, I separated the scripts into five main modules:

- Player control: `PlayerMove`, `PlayerJump`, `PlayerDash`, `GroundCheck`, `WallCheck`, and `Respawn` for the platforming feel.
- Form and spirit-energy systems: `MaskControl`, `EnergyManager`, `EnergyDrainController`, and `SafetyTimer` for form stats, resource drain, underground safe time, and energy-stage visuals.
- Level interaction: `CheckPoint`, `PlatformMove`, `TrapCheck`, `EnergyPickup`, `TimeExtendPickup`, and `ShortcutBuilder` for checkpoints, moving platforms, hazards, pickups, and shortcut construction.
- Dialogue and UI: `SimpleDialogue`, `AdvancedText`, `UIManager`, `ChoicePanel`, `EnergyValueDisplay`, `EnergyShardDisplay`, and `TimerDisplay` for text, choices, resource values, and countdown feedback.
- Presentation and endings: `BackgroundSwitcher`, `CharacterLightController`, `MusicManager`, `EndingManager`, and `TreeTopInteraction` for backgrounds, lighting, music, ending trigger, and ending flow.

As a flow, the implementation moves from player input into action checks, then lets form state, resource state, and area state decide feedback:

![Elegy of Asherah system flow](/content-assets/projects/ashe-lament/flow-system-en.svg)

The core data flow is: player input drives movement, jumping, and dashing; areas and triggers change resources or progression state; `EnergyManager` distributes spirit-energy and shard changes; `MaskControl` and UI react to that state; and `TreeTopInteraction` plus `EndingManager` resolve the run based on remaining energy. This kept gameplay, resources, dialogue, and presentation tied to one central resource while still being adjustable under jam pressure.
For team integration, I kept frequently changing level content separate from reusable system scripts. Values were exposed in the Inspector, shortcuts and pickups relied on trigger zones, and ending thresholds were centralized in `EndingManager`. That let writing, art, and level changes move quickly while I focused the final pass on wiring, thresholds, and flow bugs.

## Design Highlights

The strongest part of Elegy of Asherah is the way theme, mechanics, and narrative share the same center. Spirit energy draining represents the world's decay. Underground exploration creates pressure. Surface planning gives the player room to think. Multiple endings reflect the long-term results of the player's management decisions.

Future iteration is focused on the first five minutes of onboarding. That is a development-plan direction, not a claim that the public build already contains those revisions: the goal is to teach underground exploration, spirit-energy drain, shortcut value, and ending goals in smaller steps.

As a result, each jump and each resource cost carries more than mechanical weight. It also asks whether anything can still be saved before the world goes silent.
