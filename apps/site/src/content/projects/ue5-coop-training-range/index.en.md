---
title: "UE5 Multiplayer PvE Demo"
date: 2026-06-21T20:00:00+08:00
draft: false
slug: "ue5-coop-training-range"
description: "My first Unreal Engine 5 multiplayer PVE demo: a Blueprint and Replication based local Listen Server build with server-authoritative shooting, enemy AI, respawn, team scoring, and win-state sync."
image: "cover.webp"
imagePosition: "center"
featured: true
featuredWeight: 30
homeHeroWeight: 30
pinWeight: 30
weight: 30
portfolioType: "game"
status: "completed"
projectFacts:
  developmentTime: "2026.06"
  duration: "About 3 days"
  team: "Solo project"
  event: "Tencent Youth Tech Training Camp 2026 Spring Client Assignment"
  role: "Solo developer / Gameplay & Networking Implementation"
  tools: "Unreal Engine 5.7 / Blueprint / UMG"
  techNote: "Replication / Server RPC / Client RPC / Multicast RPC"
  platform: "Windows"
  platformNote: "Development Build / local two-instance test"
  finishedAt: "2026.06"
  result: "Completed a single-player and local Listen Server two-player loop covering enemy AI, respawn, team score, and win-state synchronization."
projectLinks:
  - label: "GitHub Repository"
    url: "https://github.com/Left-Jun/Left_Jun-Unreal-Afterclasswork_Tencent2026"
    icon: "brand-github"
    kind: "source"
  - label: "Playable Build"
    url: "https://pan.quark.cn/s/1529aa6d5da7"
    icon: "display"
    kind: "playable"
  - label: "Technical Report PDF"
    url: "/content-assets/projects/ue5-coop-training-range/technical-report.pdf"
    icon: "link"
    kind: "report"
  - label: "Submission Brief PDF"
    url: "/content-assets/projects/ue5-coop-training-range/submission-brief.pdf"
    icon: "link"
    kind: "report"
tags:
  - "Unreal Engine 5"
  - "Blueprint"
  - "Multiplayer"
  - "Replication"
  - "Gameplay Networking"
  - "UMG"
roleTags:
  - "Solo Developer"
  - "Gameplay"
  - "Networking"
---

## Overview

UE5 Multiplayer PVE Demo is my first game demo built after moving from a Unity-centered workflow into Unreal Engine 5. It was developed from the official UE5.7 First Person template, with the goal of completing a small but demonstrable combat loop that could be packaged, run locally, and tested with two instances through a Listen Server.

One player creates a local Listen Server, and another joins through the local address. After both players enter the range, they fight enemies together. Enemies search for the nearest alive player on the server, pursue through NavMesh, play attack animations, and apply damage. Players attack through a first-person line-trace weapon. Kills increase the team score, and when the target score is reached, all clients see the synchronized victory state.

This is not a commercial-scale online framework. It is a focused UE5 multiplayer practice project built around the assignment requirements: enemies move and attack players, players can defeat enemies, the game tracks score and victory, and the local Listen Server flow works end to end.

## Core Gameplay Loop

<div class="case-card-grid">
  <article class="case-card">
    <h3>Create and Join</h3>
    <p>The main menu exposes single-player, create multiplayer, and join game entries. In multiplayer mode, the first instance creates a Listen Server and the second connects locally.</p>
  </article>
  <article class="case-card">
    <h3>Co-op Combat</h3>
    <p>Two players enter the training range and shoot enemies together. Target selection, movement, attacks, and damage all run on the server, then replicate outward.</p>
  </article>
  <article class="case-card">
    <h3>Score and Win</h3>
    <p>When an enemy dies, the server increases team score. Once the target score is reached, GameState replicates the win state and every HUD shows the result.</p>
  </article>
</div>

## My Role

This was a solo project. I handled the full path from template extension and Blueprint implementation to multiplayer synchronization, UI, packaging, documentation, and video capture.

- Extended the First Person template with shooting, local line-trace feedback, and server-authoritative damage.
- Implemented player health, death menu, Owning Client RPC display logic, and server-side respawn.
- Built enemy health, damage, death, nearest-alive-player targeting, NavMesh pursuit, and melee attack flow.
- Used GameMode and GameState for team score, target score, and win-state synchronization.
- Implemented Listen Server creation, local joining, Lobby player-count checks, and ServerTravel.
- Built the HUD, crosshair, main menu, death menu, and input-mode recovery.
- Organized the GitHub repository, technical report, submission brief, and demo video.

## Multiplayer Design

The project uses a Listen Server model. Damage, death, AI, respawn, score, and win checks are handled by the server. Clients mainly handle input, local UI, and immediate visual feedback.

<div class="case-card-grid">
  <article class="case-card">
    <h3>Server RPC</h3>
    <p>Clients request shooting through <code>ServerFire</code> and respawn through <code>ServerRespawn</code>. Real hit checks, damage, death, and teleporting are executed by the server.</p>
  </article>
  <article class="case-card">
    <h3>Client / Multicast RPC</h3>
    <p>The death menu uses an Owning Client RPC so only the dead player sees it. Enemy attack animation uses Multicast RPC so all windows share the same presentation.</p>
  </article>
  <article class="case-card">
    <h3>Replication</h3>
    <p>Player health and death state, enemy movement, team score, target score, and victory state are replicated to connected clients.</p>
  </article>
</div>

<div class="case-media-grid">
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p02-img01.webp" alt="ServerFire line trace damage Blueprint" loading="lazy">
    <figcaption><strong>Server-authoritative shooting</strong><span>The client requests firing, while the server performs line tracing and Apply Damage to avoid divergent client-side results.</span></figcaption>
  </figure>
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p09-img01.webp" alt="GameMode scoring Blueprint" loading="lazy">
    <figcaption><strong>GameMode scoring</strong><span>Enemy death updates team score on the server, then shared match state is exposed through GameState.</span></figcaption>
  </figure>
</div>

## Player System

Player shooting extends the First Person template. When the player presses the fire button, the client first runs `LocalFireVisual` and draws immediate line-trace feedback. It then calls the `ServerFire` RPC, where the server performs Line Trace By Channel from the first-person camera position and direction. On hit, the server applies damage to the enemy.

The player character maintains `Health`, `MaxHealth`, and `IsDead`; health and death state are replicated. Enemy attacks apply damage on the server. In `Event AnyDamage`, the character first checks `IsDead` to prevent repeated damage after death, then clamps health into a valid range.

When health reaches zero, the server sets the death state and calls `ClientShowDeathMenu`. Because this event runs on the owning client, the death menu appears only for the dead player. Pressing respawn asks the server to restore health, reset death state, and move the character to PlayerStart.

<div class="case-media-grid">
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p03-img01.webp" alt="Player damage and death check Blueprint" loading="lazy">
    <figcaption><strong>Death check</strong><span>Damage flow checks death state before updating health and triggering the owning client's death menu.</span></figcaption>
  </figure>
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p12-img02.webp" alt="Death menu screen" loading="lazy">
    <figcaption><strong>Death menu</strong><span>The UI appears only for the affected player, not for the server window or other clients.</span></figcaption>
  </figure>
</div>

## Enemy System

Enemy AI only runs on the server Authority branch. On `BeginPlay`, the enemy starts a timer and periodically calls `UpdateEnemy`. That logic iterates over player characters, skips dead ones, selects the nearest alive player as the target, and uses AI MoveTo with NavMesh for pursuit.

When the enemy enters attack range, `LastAttackTime` and `AttackCooldown` control frequency. The attack first calls `Multicast_PlayAttack`, letting every client play the animation. After about 0.35 seconds, the server checks whether the target is still valid and still in range, then applies damage.

When enemy health reaches zero, the server calls `EnemyKilled` in GameMode to increase team score, then destroys the enemy Actor. This keeps enemy death, scoring, and win checks under one server-authoritative path.

<div class="case-media-grid">
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p05-img02.webp" alt="Nearest alive player targeting Blueprint" loading="lazy">
    <figcaption><strong>Nearest alive target</strong><span>Enemies iterate over player characters, skip dead players, and chase the nearest valid target.</span></figcaption>
  </figure>
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p08-img01.webp" alt="Enemy animation Blueprint" loading="lazy">
    <figcaption><strong>Enemy animation Blueprint</strong><span>Speed drives idle, walk, and run blending, while attack animation is layered through a Slot.</span></figcaption>
  </figure>
</div>

<div class="case-media-grid">
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p10-img01.webp" alt="Main menu entry points" loading="lazy">
    <figcaption><strong>Main menu</strong><span>Single-player, create multiplayer, and join game entries are grouped in the start menu; multiplayer begins from the Listen Server lobby.</span></figcaption>
  </figure>
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p11-img02.webp" alt="Victory prompt" loading="lazy">
    <figcaption><strong>Victory sync</strong><span>When the team reaches the target score, GameState replicates the win state and all clients show the victory prompt.</span></figcaption>
  </figure>
</div>

## Lobby, Score, and Victory

The main menu contains single-player, create multiplayer, and join game buttons. Single-player opens the combat map directly. The multiplayer button runs `open /Game/Demo/Lvl_Lobby?listen` to create a Listen Server. The join button runs `open 127.0.0.1` to connect to the local host.

Inside the lobby, `BP_LobbyGameMode` checks `GameState.PlayerArray` in `PostLogin`. When the player count reaches 2, the server performs `servertravel /Game/Demo/Lvl_FirstPerson`, moving all connected clients into the combat map.

During combat, GameMode modifies the team score, while GameState stores and replicates `TeamScore`, `TargetScore`, and `GameWon`. After the team defeats 5 enemies, the server sets the victory state and all clients display the win prompt on their HUD.

<div class="case-media-grid">
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p09-img02.webp" alt="Lobby PostLogin travel Blueprint" loading="lazy">
    <figcaption><strong>Lobby travel</strong><span>Lobby GameMode checks PlayerArray after PostLogin; once there are two players, the server performs ServerTravel.</span></figcaption>
  </figure>
  <figure class="case-figure">
    <img src="/content-assets/projects/ue5-coop-training-range/pdf-extracted/p10-img02.webp" alt="HUD state reading Blueprint" loading="lazy">
    <figcaption><strong>HUD state reading</strong><span>The HUD reads local player health and shared score / victory state from GameState.</span></figcaption>
  </figure>
</div>

## Technical Challenges

<div class="case-card-grid">
  <article class="case-card">
    <h3>Clients should not decide damage</h3>
    <p>A purely local shooting result can be visible only to one window or create divergent states. I separated visual feedback from authoritative damage: local line traces show immediately, while real Line Trace and Apply Damage run on the server.</p>
  </article>
  <article class="case-card">
    <h3>Different data needs different sync paths</h3>
    <p>Enemy movement, attack animation, death UI, and global score have different audiences. I used Replication, Server RPC, Client RPC, and Multicast RPC according to ownership and visibility, with shared match state stored in GameState.</p>
  </article>
  <article class="case-card">
    <h3>Input mode can remain in UI state</h3>
    <p>After moving from menus or death UI into combat, input can remain in UI mode. I reset Game Only input, hide the mouse, and create the HUD in local-player BeginPlay and respawn-related flow.</p>
  </article>
</div>

Packaging also exposed issues around Chinese paths, temporary C++ targets, and unused plugins. The final Development build was tested after moving key assets into English paths and disabling unnecessary plugins.

## Result and Reflection

The final version completes the required loop and can demonstrate local Listen Server two-player play through two separate exe windows. Player health, death and respawn, enemy AI, attack presentation, team score, and win state remain consistent across both ends.

This project moved my thinking from simply implementing engine features toward deciding which side should own a feature, which states must replicate, and who owns UI and input. The scope is small, but it fills a real practice gap in UE5, Blueprint, UMG, and gameplay networking.

If I continue iterating, I would first improve weapons, enemy waves, level objectives, UI and scene presentation, and room-discovery flow. Moving selected high-frequency logic into C++ is also a future learning direction, not something this version claims to have already implemented.

## Demo Video

<video class="case-video" src="/content-assets/projects/ue5-coop-training-range/demo-preview.mp4" poster="/content-assets/projects/ue5-coop-training-range/cover.webp" controls preload="metadata" playsinline></video>

## Links

- [GitHub Repository](https://github.com/Left-Jun/Left_Jun-Unreal-Afterclasswork_Tencent2026)
- [Playable Build](https://pan.quark.cn/s/1529aa6d5da7)
- [Demo Video](/content-assets/projects/ue5-coop-training-range/demo-preview.mp4)
- [Technical Report PDF](/content-assets/projects/ue5-coop-training-range/technical-report.pdf)
- [Submission Brief PDF](/content-assets/projects/ue5-coop-training-range/submission-brief.pdf)
