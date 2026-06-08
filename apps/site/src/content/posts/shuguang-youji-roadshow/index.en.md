---
title: "May 16 Chengdu Shuguang Youji Offline Roadshow Notes"
date: 2026-05-20T10:00:00+08:00
draft: false
slug: "shuguang-youji-roadshow"
description: "Notes from showing Emotion Mask and Elegy of Asherah at the first Chengdu Shuguang Youji offline game exhibition, plus follow-up directions from nearly one hundred playtests."
image: "booth-overview.png"
categories:
  - "Project Retrospective"
  - "Event Record"
tags:
  - "Shuguang Youji"
  - "Offline Roadshow"
  - "Emotion Mask"
  - "Elegy of Asherah"
  - "Independent Games"
relatedPages:
  - "projects/emotion-mask"
  - "projects/ashe-lament"
  - "retrospectives/emotion-mask-retrospective"
  - "retrospectives/ashe-lament-retrospective"
  - "plans/emotion-mask-roadmap"
  - "plans/ashe-lament-roadmap"
---

On May 16, I joined the first Chengdu Shuguang Youji offline game roadshow. The event was hosted by Lude Studio and organized with Chengdu Technological University. It brought together teams from sixteen schools and more than fifty games.

For me, this event was not only a public display. It was a direct stress test for two portfolio projects: Emotion Mask and Elegy of Asherah. I could finally see how strangers reacted before reading any design document, store page, or explanation.

This article records the event itself, the feedback I received, and the update direction that came out of the playtests. The more detailed project retrospectives and roadmaps are listed in the related reading links.

## Two Games on the Booth

![On-site booth for Emotion Mask and Elegy of Asherah](/content-assets/posts/shuguang-youji-roadshow/booth-overview.png)

I brought two works to the roadshow. Emotion Mask was placed on the left side of the booth, and Elegy of Asherah was placed on the right. They represent two different directions in my current portfolio.

Emotion Mask is a smaller platformer-puzzle prototype built around emotional mask switching. Calm reveals hidden structures, Joy improves movement, and Anger breaks obstacles. Its value as a public demo is that the core idea can be understood quickly.

Elegy of Asherah is a larger 72-hour team project. It combines platforming with spirit-energy management, underground exploration, surface climbing, shortcut construction, and multiple endings. Its value is system integration: movement, resources, route planning, story pressure, and ending settlement all point to the same resource-management center.

Across the roadshow, nearly one hundred players tried the two games. That number was important because it exposed repeated patterns instead of isolated opinions.

![Players trying both games at the booth](/content-assets/posts/shuguang-youji-roadshow/booth-playtest.png)

## Feedback on Emotion Mask

Emotion Mask attracted more interest than I expected. Many players could understand the emotional switching rule quickly. After a short explanation, they remembered that different masks meant different abilities, and they began to ask how the same room could be solved through different emotional states.

The most encouraging feedback was that players wanted more. Some asked whether there would be more masks. Some asked whether there would be more levels. Some asked whether there was a player group for future updates. This made me feel that Emotion Mask had already moved beyond the feeling of a one-time jam sketch.

At the same time, the roadshow also made the weak points clear.

Movement feel still needs tuning. A game built around state switching must make movement reliable first. If jumping, dashing, landing, or wall interaction feels uncertain, players cannot focus on the mask puzzle.

Camera feedback also needs attention. When players jump or dash, the camera should help them read the next route. It should not make the level harder to parse.

Mask-switching feedback needs to be clearer. The player should always know which state they are in, what changed after switching, and why the next obstacle asks for that state.

The tutorial should be rebuilt in smaller steps. The current concept is understandable, but the first level should teach Calm, Joy, and Anger one at a time before asking the player to combine them.

These points became the basis for the follow-up Emotion Mask development plan.

## Feedback on Elegy of Asherah

Elegy of Asherah received a different kind of feedback. Players were interested in its world, visual direction, and resource-management idea, but the first-contact process was much harder.

The game has more systems than Emotion Mask. Spirit energy, underground safe time, enhanced form, bones, shortcuts, surface climbing, and endings all appear in a compact build. When players understood the loop, they became engaged by the pressure of planning. When they did not, the same systems felt confusing.

The strongest feedback was about guidance.

The opening objective needs to be clearer. Players should not begin by holding the whole world setting in their head. They need a small first task: enter the underground area, collect one resource, return to the surface, and spend it.

The first surface-to-underground transition needs stronger direction. This is where the player learns what the game is really about. The route, prompts, and feedback should make the difference between underground collection and surface planning immediately visible.

Resource teaching needs to be staged. Spirit energy, bone shards, safe time, shortcut cost, and ending thresholds should not all arrive at once. Each rule needs a short use case before the next one appears.

Failure feedback needs to explain cause. If a player runs out of energy, they should understand whether the problem was staying underground too long, using enhanced form too much, missing a shortcut, or choosing a risky route.

The roadshow did not tell me to make Elegy of Asherah smaller. It told me that its first five minutes need to teach the existing design more carefully.

## Judgments from the Roadshow

Offline playtests are different from online download numbers. They expose the first-contact process in much more detail.

At the booth, I could watch when players noticed the poster, when they decided to sit down, when they hesitated, when they retried, and when they gave up. These reactions are more specific than a simple "like" or "download" count.

I also learned that a project needs different explanations for different stages. A poster needs to attract attention. A first screen needs to make the player willing to try. A tutorial needs to teach one thing at a time. A post-playtest conversation needs to turn feedback into development priorities.

Emotion Mask proved that a small mechanic can be memorable if players can describe it after one session.

Elegy of Asherah proved that a larger system can create strong pressure, but only if the player understands the early loop before the system expands.

For both projects, the most valuable signal was not praise or criticism by itself. It was watching where players became curious, where they became stuck, and what they remembered after leaving the keyboard.

## Next Update Plans

For Emotion Mask, the next update direction is feel first, content second. I will focus on movement tuning, camera behavior, tutorial rhythm, mask-switching feedback, and controller support before expanding into more masks and levels.

For Elegy of Asherah, the next update direction is onboarding first, system expansion second. I will rebuild the opening objective, strengthen the first surface-underground switch, stage resource teaching, improve failure feedback, and adjust early route pacing.

The two follow-up plans are:

- [Emotion Mask Development Plan](/en/plans/emotion-mask-roadmap/)
- [Elegy of Asherah Development Plan](/en/plans/ashe-lament-roadmap/)

The two project retrospectives are:

- [Emotion Mask Retrospective](/en/retrospectives/emotion-mask-retrospective/)
- [Elegy of Asherah Retrospective](/en/retrospectives/ashe-lament-retrospective/)

![Group photo from the first Chengdu Shuguang Youji event](/content-assets/posts/shuguang-youji-roadshow/group-photo.jpg)

The biggest meaning of this roadshow was that the projects left my own working environment. A playable build can look complete on my machine, but it becomes real only when someone else sits down, tries to understand it, fails, retries, asks questions, and still remembers something afterward.

That is also the next direction for my portfolio work: not only finishing projects, but making them readable, testable, and memorable for people seeing them for the first time.
