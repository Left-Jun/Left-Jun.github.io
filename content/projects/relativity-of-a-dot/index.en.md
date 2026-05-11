---
title: "Relativity of a Dot"
date: 2026-02-10T10:00:00+08:00
draft: false
slug: "relativity-of-a-dot"
description: "A 2D / 3D switching puzzle prototype that quickly tests whether spatial-rule changes can create new level experiences."
image: "cover.png"
imagePosition: "45% center"
weight: 30
portfolioType: "game"
projectFacts:
  developmentTime: "2026.2, Mengya Cup 2026 creative prototype"
  duration: "6 hours"
  role: "Solo developer / creative demo"
  tools: "Unity / C# / Cinemachine"
  platform: "Windows playable build"
  result: "Completed the core loop of 2D/3D switching, camera linking, and spatial puzzle solving."
projectLinks:
  - label: "Playable build"
    url: "https://pan.quark.cn/s/0e4e5440844f?pwd=RvND"
    icon: "link"
tags:
  - "Unity"
  - "Prototype"
  - "Puzzle"
---

## Overview

This is a 2D / 3D switching puzzle prototype. I used it to test whether the same level could produce different solutions under different spatial rules.

The idea came from the keyword "dot." A dot can be a point in one dimension, a mark on a 2D plane, or a projection inside 3D space. I turned that idea into a spatial prototype where the player switches between 2D projection and 3D space to understand the same level through different rules.

## Screenshots and Mechanics

![2D view](screenshot-2d-view.png)

In 2D mode, the player sees a side-view projection of the level. Movement is constrained to one plane, and obstacles behave more like a traditional 2D puzzle.

![3D view](screenshot-3d-view.png)

After switching to 3D, the camera and movement rules change together. Structures that look like blockers in 2D can be reinterpreted through spatial depth.

## My role

- Designed the mechanic and developed the prototype independently.
- Rapidly verified dimension switching, camera switching, and object-behavior synchronization.

## Technical implementation

- Used `DimensionManager` to control dimension state, camera switching, and object behavior.
- Allowed the same player object to switch movement rules between 2D and 3D.
- Used collider switching and projected-position correction to make one scene support multiple solutions.

## System Structure

- Dimension switching: `DimensionManager` controls 2D/3D state and synchronizes Cinemachine camera priority.
- Player control: `PlayerMove`, `PlayerJump`, `GroundCheck2D`, and `GroundCheck3D` handle movement, jumping, and grounded checks under two spatial rules.
- Spatial object rules: `DimensionObject` enables different colliders depending on the current dimension and corrects projected player position in 2D mode.
- Menu and flow: start menu, pause menu, and basic flow control keep the prototype playable as a complete loop.

The prototype focuses on validating one clear chain: pressing `Tab` changes the dimension state, switches the camera, changes movement axes, updates collision rules, and creates a new spatial solution inside the same level.
