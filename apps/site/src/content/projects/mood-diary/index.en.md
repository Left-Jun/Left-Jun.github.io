---
title: "Mood Diary"
draft: false
slug: "mood-diary"
description: "A local mood-journal application built with C++17 and Qt Widgets, covering record management, a mood space, emotion-transformation interactions, and JSON persistence."
image: "cover.png"
portfolioType: "web"
status: "completed"
projectFacts:
  projectType: "C++ course team project"
  team: "Four-person course team"
  role: "Initial main developer / lead report writer"
  tools: "C++17 / Qt Widgets / CMake / JSON"
  platform: "Windows"
  result: "Delivered the initial data model, diary CRUD, Qt interface, JSON persistence, build scripts, and integrated report."
attachments:
  - title: "Mood Diary mood-space interface"
    type: "PNG"
    description: "Sanitized interface screenshot showing the 30-day mood plot, period summaries, and local desktop-app layout."
    thumbnail: "mood-space.png"
    previewUrl: "/content-assets/projects/mood-diary/mood-space.png"
    fileSize: "61 KB"
tags:
  - "C++"
  - "Qt"
  - "JSON"
  - "Desktop App"
roleTags:
  - "Initial Main Developer"
  - "Lead Report Writer"
---

## Overview

Mood Diary is a local desktop application built with C++17 and Qt Widgets. It records diary entries, emotional energy, intensity, primary emotions, triggers, and coping actions. The team extended the initial journal manager with a mood space, emotion-transformation interaction, and a message-bottle module for a C++ object-oriented programming course project.

## My Role

I defined the initial project direction and built the first core data model, diary CRUD, base Qt Widgets interface, local JSON persistence, CMake build scripts, and early packaging flow. I also led the integrated course report. Other members later extended the same framework, so this page attributes only the initial development and report integration to me.

## Structure

The project separates the interface, core business logic, persistence, and interaction layers. `DiaryManager` handles entries and queries, `StorageManager` reads and writes JSON, the mood space uses a custom QWidget to visualize recent records, and the interaction layer uses inheritance and polymorphism for emotion objects.

## Result

The application supports adding, editing, deleting, and filtering diary entries, recording structured mood fields, and restoring data after restart. The graphical application includes home, records, mood space, emotion transformation, and message-bottle pages, while a console entry verifies the core classes independently of the GUI.

## Public Boundary

The original course report contains student IDs and other members' names, so it remains private. The public page uses sanitized screenshots and a scoped role statement instead of attributing all later team extensions to my individual work.
