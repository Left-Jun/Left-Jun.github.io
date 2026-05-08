---
title: "Asherah's Lament"
date: 2026-03-20T10:00:00+08:00
draft: false
slug: "ashe-lament"
description: "A 2D platformer and resource-management game built around dual-state switching, collection loops, multi-ending progression, and team collaboration."
image: "cover.png"
coverVideo: "cover.mp4"
pinned: true
pinWeight: 10
weight: 20
portfolioType: "game"
tags:
  - "Unity"
  - "Platformer"
  - "Team Project"
---

## Overview

Asherah's Lament is a 2D platformer and resource-management game created for the Tencent University Game Extreme Development Competition, Chengdu site. The player becomes the last "root speaker" in a dying world sustained by Asherah, the Mother Tree. To delay the final silence, the player travels between underground roots and the surface trunk, gathers remaining spirit energy, builds shortcuts, climbs upward, and tries to return the last power to the heart of the world before their own energy runs out.

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

## My Role

- Served as team lead, main programmer, gameplay designer, and music producer.
- Designed and implemented core movement, dual-state switching, spirit energy consumption, collection loops, shortcut construction, and multi-ending checks.
- Coordinated the overall flow from underground collection to surface climbing to ending feedback.
- Worked with writing and art teammates to translate concepts such as the Mother Tree, root speaker, Great Withering, and spirit energy into scenes, UI, and progression.

## Technical Implementation

The game was developed in Unity, with the main challenge being to build a complete and adjustable system under a short production window.

- Implemented movement, jumping, dashing, wall detection, respawn, area triggers, and dual-state switching.
- Built a spirit-energy system that unifies health, time pressure, action cost, and ending conditions.
- Implemented underground safe time, surface climbing rhythm, resource collection, bone spending, and shortcut construction.
- Used asynchronous scene loading and area triggers to connect underground and surface phases with less friction.
- Designed tunable thresholds for multiple endings so that the player's management performance could be clearly resolved.

## Design Highlights

The strongest part of Asherah's Lament is the way theme, mechanics, and narrative share the same center. Spirit energy draining represents the world's decay. Underground exploration creates pressure. Surface planning gives the player room to think. Multiple endings reflect the long-term results of the player's management decisions.

As a result, each jump and each resource cost carries more than mechanical weight. It also asks whether anything can still be saved before the world goes silent.

## Links

- [Playable build](https://pan.quark.cn/s/efcee623b3f4?pwd=TQCA)
