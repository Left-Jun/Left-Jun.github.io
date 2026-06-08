---
title: "Emotion Mask Development Plan"
date: 2026-05-20T14:00:00+08:00
draft: false
slug: "emotion-mask-roadmap"
description: "A follow-up update plan for Emotion Mask based on feedback from the May 16 Shuguang Youji offline playtest."
image: "cover.jpg"
categories:
  - "Development Plan"
tags:
  - "Emotion Mask"
  - "Shuguang Youji"
  - "Platformer"
relatedPages:
  - "projects/emotion-mask"
  - "retrospectives/emotion-mask-retrospective"
  - "posts/shuguang-youji-roadshow"
---

Emotion Mask was shown alongside Elegy of Asherah at the May 16 Chengdu Shuguang Youji offline roadshow. Across the event, nearly one hundred players tried the two games. Emotion Mask drew more interest than I expected, and several players asked whether there would be more masks, more levels, and a player update group.

That response confirmed that the core idea is understandable: players can quickly remember that emotional states change abilities and level solutions. But it also made the next priority clearer. Before expanding content, the game needs a more stable feel, camera, tutorial rhythm, and mask-switching flow.

## Current Judgment

Emotion Mask should not treat "emotion" as a skin system. Each emotion needs to be both a control state and a level-solving method.

The current foundation is:

- Calm helps the player observe and read hidden structures;
- Joy improves movement and makes traversal lighter;
- Anger breaks obstacles and creates direct routes.

This direction still works. The next stage is to make the player feel the difference faster and with less friction. If the switching action feels clumsy, the concept becomes harder to trust. If movement and camera feedback are stable, the mask system can support more content later.

## Near-Term Priorities

The first priority is movement feel. Jump height, acceleration, landing recovery, dash timing, and wall interaction need another tuning pass so each emotional state feels responsive without becoming unpredictable.

The second priority is camera follow. In the roadshow build, some players needed more visual stability when jumping, dashing, or switching states. The camera should help the player read the next decision instead of only following the character position.

The third priority is the early tutorial. Players understood the high-level idea, but the first level should teach it in smaller beats: observe with Calm, move with Joy, break through with Anger, then combine the three.

The fourth priority is mask-switching input. The player should be able to switch quickly and confidently. Keyboard, controller, and UI feedback all need to support the same mental model.

## Version Split

Version 0.2 will focus on feel. It should adjust movement parameters, dash feedback, landing response, camera smoothing, and basic state-switching rhythm.

Version 0.3 will focus on tutorial flow. It should rebuild the first level so the player learns one emotional state at a time before entering mixed puzzles.

Version 0.4 will focus on new mask prototypes. The goal is not to add many masks immediately, but to test whether future emotions can carry distinct verbs without breaking the original state system.

Version 0.5 will focus on content expansion. After the basic feel and tutorial are reliable, the game can add more short levels, stronger level combinations, and a more polished public build.

## Mid-Term Direction

New masks should be designed from gameplay verbs first. A new emotion is only useful if it changes how the player reads or solves the level. Visual style and narrative meaning should support that verb, not replace it.

Level design should also become more deliberate. The best puzzles should ask players to switch because the situation changes, not because the game simply demands variety. A good room should make Calm, Joy, and Anger each feel necessary at different moments.

The emotional presentation can become stronger through music, animation, color, and transition feedback. The player should feel that switching masks changes both the rules and the mood of the scene.

Controller support is another medium-term task. Offline playtests make it clear that public demos benefit from a simple, reliable input setup, especially when different players sit down for a short session.

## Verification

The next version should be tested with new players who have not seen the game before.

The main checks are:

- the player understands what each of the three current masks does;
- the player can switch masks without asking for the key or button again;
- the player can finish the first tutorial route without outside explanation;
- movement, dash, and camera feedback feel stable enough for repeated retries;
- players still ask for more content after the first session.

For Emotion Mask, the short-term goal is not simply "more levels." It is to make the core emotional switching loop feel strong enough that more levels are worth building on top of it.
