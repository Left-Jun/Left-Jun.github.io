---
title: "Elegy of Asherah Development Plan"
date: 2026-05-20T13:30:00+08:00
draft: false
slug: "ashe-lament-roadmap"
description: "A follow-up plan for Elegy of Asherah based on feedback from the May 16 Shuguang Youji offline playtest, focused on onboarding and system feedback."
image: "cover.jpg"
categories:
  - "Development Plan"
tags:
  - "Elegy of Asherah"
  - "Shuguang Youji"
  - "Resource Management"
relatedPages:
  - "projects/ashe-lament"
  - "retrospectives/ashe-lament-retrospective"
  - "posts/shuguang-youji-roadshow"
---

This plan comes from the May 16 Chengdu Shuguang Youji offline roadshow. Elegy of Asherah received steady interest around its art direction and world setting, but the most repeated feedback was clear: before adding more systems, the first-contact experience needs to become easier to understand.

The current build already has the core pressure I want: underground collection, surface climbing, spirit-energy consumption, bones, shortcut construction, and multiple endings. The problem is that these rules arrive too close together. Some players could understand the loop and then became engaged, while others were lost before they had enough context to make a meaningful decision.

## Current Judgment

For the next stage, I do not want to solve the problem by adding more mechanics. The more urgent goal is to clarify the existing loop.

Elegy of Asherah should first teach players four things:

- why they need to go underground;
- when they should return to the surface;
- what spirit energy and bones are used for;
- how shortcut construction changes the next attempt.

If players understand these four points, the resource-management tension becomes readable. If they do not, the same system feels like a pile of rules.

## Near-Term Priorities

The first priority is to rebuild the opening objective. The player should not begin with a broad instruction such as "restore the Mother Tree." That emotional goal can stay in the story, but the first playable goal needs to be smaller: enter the root area, collect one resource, return, and spend it.

The second priority is to strengthen the first transition between surface and underground. This transition is the moment where the game explains its identity. It needs clearer visual guidance, stronger prompts, and a safer first route, so the player can understand that the two spaces serve different purposes.

The third priority is staged resource teaching. Spirit energy, bone shards, safe time, enhanced form, shortcut cost, and ending thresholds should not all be taught at once. Each step should add one new pressure after the previous step has been used.

The fourth priority is failure feedback. When a player runs out of energy or fails to return in time, the game should make the cause clear. The player needs to know whether the problem was spending too much energy, staying underground too long, missing a shortcut, or choosing a risky route too early.

## Version Split

Version 0.2 will focus on onboarding. It should rebuild the opening route, first objective, first underground entry, first resource pickup, and first return.

Version 0.3 will focus on resources. It should separate the teaching of spirit energy, bone shards, safe time, enhanced form, and shortcut construction into clearer steps.

Version 0.4 will focus on feedback. It should improve energy change prompts, insufficient-resource prompts, failure reasons, ending hints, and route feedback.

Version 0.5 will focus on pacing. It should adjust early route length, shortcut value, repeated-attempt rhythm, and the balance between pressure and recovery.

## Mid-Term Direction

After the first five minutes become clearer, I want to revisit the structure of the early route. The game should give players one compact loop first, then open into a larger route after they have built confidence.

The resource UI also needs a more intentional hierarchy. Spirit energy is the most important value, but bone shards, safe time, and shortcut cost all compete for attention. The interface should show what is immediately relevant instead of treating every number with the same weight.

Guidance text should be short and tied to action. When the player enters a new rule, the text should appear near the action and disappear after the rule has been used. The goal is not to cover the screen with explanation, but to make each decision understandable at the moment it is made.

Shortcut construction also needs better feedback. A shortcut should feel like a long-term investment, not just a one-time purchase. The next run should make its value visible quickly.

## Verification

This update will be considered successful only if new players can complete the basic loop without outside explanation.

The main checks are:

- the player can enter the underground area, collect resources, return to the surface, and continue climbing;
- the player understands the difference between spirit energy and bone shards;
- the player can explain why a shortcut is useful;
- after failure, the player knows what to change on the next attempt;
- the player understands that resource management affects the ending.

For this project, the next step is not making the system larger. It is making the existing system legible enough that players can feel the pressure I already designed.
