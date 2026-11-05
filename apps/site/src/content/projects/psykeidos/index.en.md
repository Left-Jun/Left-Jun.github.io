---
title: "Psykeidos"
date: 2026-10-30T10:00:00+08:00
updatedAt: 2026-11-05T13:17:00+08:00
draft: false
slug: "psykeidos"
description: "Continuing Emotion Mask's emotion-switching direction through 2.5D characters and a three-dimensional world map. Current work documents Blender landform and composition iterations."
image: "cover.jpg"
weight: 25
portfolioType: "game"
status: "in-progress"
statusTags:
  - "In active development"
  - "World-map blockout"
  - "Art review pending"
projectFacts:
  projectType: "Independent game / three-dimensional world-map development"
  developmentTime: "From October 2026, ongoing iteration"
  duration: "Ongoing development"
  role: "Game design / programming / scene composition and iteration"
  tools: "Blender / Unity / C#"
  techNote: "2.5D characters / solid landforms / overview and region-selection views"
  platform: "Windows (development target)"
  result: "v019 corrects the local front-left lake structure in the Blue region. The saved model and multiple views are available; composition and art review remain pending."
projectLinks:
  - label: "开发日志 · Chinese"
    url: "/projects/psykeidos/devlog/"
    icon: "link"
    kind: "report"
  - label: "Development log"
    url: "/en/projects/psykeidos/devlog/"
    icon: "link"
    kind: "report"
  - label: "v019 iteration record · Chinese"
    url: "/projects/psykeidos/devlog/v019/"
    icon: "link"
    kind: "report"
  - label: "v019 iteration record"
    url: "/en/projects/psykeidos/devlog/v019/"
    icon: "link"
    kind: "report"
  - label: "Emotion Mask · previous project"
    url: "/projects/emotion-mask/"
    icon: "link"
    kind: "site"
tags:
  - "Blender"
  - "Unity"
  - "2.5D"
  - "World map"
  - "Scene composition"
roleTags:
  - "Game design"
  - "Programming"
  - "Scene iteration"
relatedPages:
  - "projects/emotion-mask"
---

## From emotion switching to a three-dimensional landscape

Psykeidos continues Emotion Mask's idea of emotion changing how a player observes and acts, while exploring a 2.5D presentation that combines 2D billboard characters with three-dimensional environments. It is documented as a separate project here. Emotion Mask's prototype, release preparation and roadshow material remain on the original project page.

The current focus is a three-dimensional world map. The intended flow starts at a foreground camp overlooking three independent regions, then moves closer to a selected region to read level nodes. This map supports spatial reading and level selection; the three regions are not presented as a completed, freely explorable open world.

## The spatial framework

- **Blue: near, low and extending toward the front-left.** Coastal mountains, a lighthouse hill, a local elevated basin, waterfalls and the lowest sea establish vertical depth. Land and ridges remain behind them.
- **Yellow: farther back in the centre, broad and deep.** Rolling highlands, wide valleys, terraces and local ridges reserve space for windmills and settlement masses.
- **Red: tall on the right, extending into the distance.** Foreground cliffs, gorges, settlement terraces and rear peaks combine into a mountain-city silhouette.
- **Camp: a separate foreground viewpoint.** The character and narrowing cliff tip provide scale while the distant regions form one 16:9 composition.

Each region has its own elevation and actual spatial separation. Overlap, depth offsets and responding silhouettes should bring them together in the overview. The visual direction draws on the open space and simplified forms of Chinese landscape painting. Cloud-free geometry is checked first, before atmospheric effects.

## Current iteration: the v019 front-left lake

![Actual Blender model, v019 muted-colour overview](/content-assets/projects/psykeidos/v019-main-color.jpg)

This is a real render of the saved Blender model. Colour identifies regions; it is not a final material treatment or a finished-result claim.

v019 opens the elevated water toward the front-left of the lighthouse by reshaping local parts of the existing mesh. A continuous low rocky bank, sill and forward spillway support the existing front waterfall as it moves with the shoreline and reaches the lower sea. The left lake and right bay remain one connected, level upper body of water. The right waterfall and low side hills stay in place, and the hinterland remains dry.

![Same-camera local comparison between v018 and v019](/content-assets/projects/psykeidos/v019-local-comparison.jpg)

The overview camera, lighthouse footing, bridge supports, character and camp are preserved. Top, side and oblique rear views check solid depth, the bed and water levels. Structural checks on the saved model passed; composition, artistic approval and user acceptance remain separate.

## What remains unresolved

The lake still has limited visibility in the fixed overview. Long straight cliff walls, regular facets and placeholder waterfalls also remain. A close-up or top view can demonstrate a better water–land relationship, but cannot substitute for the overall composition. The next priority is lake presence, connected coastal forms and the rhythm of the spillway, before detailed buildings, painted materials or clouds.

The new Blender landforms remain a separate environment-art project. This iteration does not replace the production Unity map, and plans for region selection, node previews or gameplay integration are not described as completed deliverables.

## Development log

The [development log](/en/projects/psykeidos/devlog/) keeps actual changes, real multiple-view renders, checks, limitations and next steps together. The [v019 record](/en/projects/psykeidos/devlog/v019/) includes the overview, muted colour, top, side, rear and reference comparisons so that progress can be assessed across views rather than through a single favourable image.
