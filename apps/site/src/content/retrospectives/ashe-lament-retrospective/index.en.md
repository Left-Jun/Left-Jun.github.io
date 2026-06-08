---
title: "Elegy of Asherah Retrospective"
date: 2026-05-21T11:00:00+08:00
draft: false
slug: "ashe-lament-retrospective"
description: "A retrospective on Elegy of Asherah, a 72-hour Limenauts team project, covering system design, production coordination, resource-management gameplay, and offline playtest feedback."
image: "cover.jpg"
categories:
  - "Project Retrospective"
tags:
  - "Elegy of Asherah"
  - "Team Project"
  - "Resource Management"
  - "Platformer"
relatedPages:
  - "projects/ashe-lament"
  - "plans/ashe-lament-roadmap"
  - "posts/shuguang-youji-roadshow"
---

Elegy of Asherah was created by Limenauts for the Tencent University Game Extreme Development Competition, Chengdu site. I served as team lead, main programmer, gameplay designer, and music producer. The team completed the playable core within a 72-hour window.

Compared with Emotion Mask, this project carried a very different pressure. Emotion Mask was about proving whether one small mechanic could be understood quickly. Elegy of Asherah was about compressing resources, level flow, narrative pressure, shortcut construction, and multiple endings into one playable version.

Looking back, the project taught me less about adding more systems and more about controlling system density.

## Core Idea

The core idea of Elegy of Asherah is that every action has a cost.

The player moves between two spaces. Underground areas provide spirit energy, bone shards, and time-extension opportunities, but they also create pressure through limited safe time and higher risk. The surface asks the player to climb the dead trunk of the Mother Tree, spend resources, build shortcuts, and move toward the ending.

Spirit energy is the center of the design. It is health, fuel, time pressure, and ending resource at the same time. The player can spend energy to move more efficiently, but saving more energy can lead to a better ending. That contradiction is the main tension of the game.

The story supports this structure. The world is already withering, and the player is not a hero with unlimited power. They are the last person trying to manage the remaining life of a dying system.

## Team Development Flow

My main task as team lead was to keep the project closed-loop. In a 72-hour competition, a complex idea can become dangerous very quickly. If the team builds many disconnected pieces, the final version may look rich but fail to play.

I kept the work centered on a few questions:

- What is the player doing in the first minute?
- What value is being collected?
- What decision does that value create?
- How does that decision change the next route?
- How does the final ending read the player's resource result?

This helped the team divide work more clearly. Programming focused on movement, resource state, form switching, shortcuts, UI, timers, and endings. Writing and art focused on the Mother Tree, root speaker, spirit energy, Qizhi, scene prompts, and ending mood. The important point was that every part had to return to the same gameplay loop.

## System Chain Retrospective

The implementation can be understood as an input-state-output chain.

The input layer includes movement, jumping, dashing, form switching, pickups, shortcut construction, and ending interaction. These inputs are simple by themselves, but they become meaningful because they affect shared resource state.

The state layer includes spirit energy, bone shards, underground safe time, form state, current height, checkpoints, and ending thresholds. This is where the game decides whether the player is recovering, spending, risking, or settling resources.

The output layer includes UI changes, countdown feedback, background switching, shortcut state, death and respawn, dialogue prompts, and ending results. These outputs need to help the player understand what the system has decided.

The strongest part of the implementation is that most mechanics point back to the same center. A pickup changes resource state. A shortcut spends resource state. Enhanced form accelerates cost. The ending reads the final remaining energy.

The weakest part is that this chain was compressed too tightly for new players. The system made sense internally, but the first version did not teach the chain slowly enough.

## Main Problem

The main problem was not that the game lacked content. It was that onboarding did not keep up with system complexity.

During the offline roadshow, players who understood the loop became interested in planning and retrying. But several players were lost before they reached that point. They saw spirit energy, bones, countdowns, form switching, underground routes, surface climbing, and shortcut prompts too close together.

This is an important lesson for a resource-management platformer. A system can be coherent to the developer and still unreadable to a first-time player.

The first five minutes should not explain everything. They should create one successful loop: enter, collect, return, spend, and feel the value of the next attempt.

## What I Learned

Elegy of Asherah taught me that complex mechanics need first-contact design, not only system design.

As a programmer, I can connect state, events, triggers, UI, and endings into one working loop. As a designer, I also need to decide how a player discovers that loop without standing beside them and explaining it.

The project also showed the value of shared center design. Spirit energy worked because it connected movement pressure, survival, route planning, and narrative outcome. When a project has many systems, a strong center keeps the design from becoming scattered.

For future iteration, the direction is clear. I will not add more mechanics first. I will rebuild the opening route, stage resource teaching, improve failure feedback, and make shortcut value visible earlier.

The public build proved that the system has potential. The next version needs to make that potential easier for strangers to enter.
