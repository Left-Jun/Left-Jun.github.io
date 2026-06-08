---
title: "Emotion Mask Retrospective"
date: 2026-05-21T10:30:00+08:00
draft: false
slug: "emotion-mask-retrospective"
description: "A retrospective on Emotion Mask, from a Global Game Jam prototype to an offline roadshow demo, covering development choices, mechanic tradeoffs, and follow-up direction."
image: "cover.jpg"
categories:
  - "Project Retrospective"
tags:
  - "Emotion Mask"
  - "Game Jam"
  - "Solo Development"
  - "Platformer"
relatedPages:
  - "projects/emotion-mask"
  - "plans/emotion-mask-roadmap"
  - "posts/shuguang-youji-roadshow"
---

Emotion Mask began as my solo entry for Global Game Jam 2026. The theme was "Mask," and I chose to treat the mask not as a costume, but as an external form of emotional state.

The first version was completed within 48 hours. Later, I brought the game to an offline roadshow and watched players experience it directly. This retrospective focuses on how a small jam prototype became something that could be shown publicly, and what still needs to improve.

## Initial Judgment

At the beginning of the jam, the most important question was simple: can players understand in a few seconds that switching emotions changes the solution to a level?

I did not want three masks to become three visual skins. Each emotion needed a distinct function.

Calm became the observing state. It reveals hidden platforms and clues, helping the player read the level.

Joy became the mobility state. It gives the player lighter movement and makes traversal feel more open.

Anger became the breakthrough state. It lets the player destroy obstacles through dash-based action.

This structure gave the prototype a clear testable center. If players could describe the three states after playing, the core idea worked.

## Tradeoffs in 48 Hours

The 48-hour limit forced me to cut many ideas. I focused on the smallest playable chain: character control, state switching, level interaction, failure and respawn, collection, victory, and public release material.

The result was not a large game, but it had a complete loop. The player could move, switch masks, read hidden platforms, break obstacles, collect shards, die, respawn, finish the level, and see a result.

This mattered because a jam project needs closure. A beautiful idea without a finish line is hard to evaluate. A smaller idea with a playable loop can be tested, published, and improved.

The biggest tradeoff was input and feel polish. Under time pressure, I prioritized reliability over deep tuning. That made the build playable, but the later roadshow showed that movement feel, camera behavior, and switch feedback deserve more attention.

## System Chain Retrospective

The system can be understood through four layers.

The input layer includes movement, jumping, dashing, and mask switching. These actions need to feel immediate because the whole game depends on state changes.

The state layer is the mask controller. It stores the current state and pushes changes into movement parameters, platform visibility, music, and visual feedback.

The scene layer includes hidden platforms, breakable obstacles, traps, collectibles, checkpoints, and win triggers. These objects listen to or react to the player's current emotion.

The output layer includes character appearance, music changes, platform visibility, death feedback, shard collection feedback, and victory settlement.

The structure was useful because every visible change came back to one rule: the mask changes how the player can read and act inside the level.

If the game adds more masks later, this state structure will need a careful refactor. More emotions should not simply add more if-statements. Each new state needs clear data, clear input mapping, and clear feedback.

## Changes After the Offline Roadshow

The roadshow gave me the most useful external signal so far. Players understood the concept faster than I expected, and several asked for more masks, more levels, and an update group.

That told me the idea had memory value. People did not only say "the art is nice" or "the game is cute." They remembered the rule: different emotions create different abilities.

The weaknesses were also visible.

Movement feel needs another pass. If the player is unsure about jump height, dash timing, or landing response, the emotional puzzle becomes harder to enjoy.

Camera follow needs to support route reading. A platformer-puzzle game should let players plan the next action, not just react to the character's current position.

Switching feedback needs to become clearer. The player should never wonder which mask is currently active or why an obstacle changed.

The tutorial needs to teach one state at a time. A good first level should make Calm, Joy, and Anger feel obvious before combining them.

## What I Learned

Emotion Mask taught me that a small mechanic can become a strong portfolio project if players can describe it after one short session.

The project also changed how I think about game jam work. A jam prototype does not need to be large, but it needs a readable core. If the core can survive public playtests, it can become a real iteration target.

For the next stage, I want to make Emotion Mask more stable before making it bigger. Movement, camera, tutorial flow, state-switching feedback, and controller support come before adding many new masks.

The best future version of this game is not just a collection of emotions. It is a compact platformer where each emotional state changes how the player understands the level.
