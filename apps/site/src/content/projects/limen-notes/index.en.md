---
title: "阈限手记"
date: 2026-06-21T21:30:00+08:00
draft: false
slug: "limen-notes"
description: "A personal web product in progress for journals, essays, and personal expression, using warm paper-like visuals, generous spacing, and low-interruption interaction for writing and reading."
image: "cover.png"
imagePosition: "center"
featured: false
featuredWeight: 70
pinWeight: 70
weight: 70
portfolioType: "web"
projectFacts:
  developmentTime: "2026.06 - in progress"
  duration: "Ongoing iteration"
  team: "Solo project"
  role: "Product design / Web development / Content system"
  tools: "Next.js App Router / Supabase / PWA"
  techNote: "Local JSON fallback / Auth / Profile / Notes"
  platform: "Web"
  platformNote: "notes.leftjun.com"
  result: "The repository contains code paths for public notes, categories, search, login profiles, admin editing, a PWA shell, and mood-related prototypes, while the product is still being refined."
projectLinks:
  - label: "Live Site"
    url: "https://notes.leftjun.com"
    icon: "link"
  - label: "GitHub Repository"
    url: "https://github.com/Left-Jun/notes"
    icon: "brand-github"
tags:
  - "Web Development"
  - "Next.js"
  - "Supabase"
  - "PWA"
  - "Responsive Design"
  - "UI / UX"
  - "Writing"
roleTags:
  - "Solo Developer"
  - "Product Design"
  - "Web Development"
---

## Background

阈限手记 is a personal web product for journals, essays, daily notes, and quieter forms of personal expression beyond the project portfolio. It is not designed as a traditional social feed. I treat it more like a long-term personal paper space where content can be categorized, searched, edited, and read with minimal interruption.

The project is still in progress. This page describes what exists in the repository or has a clear code path, without presenting future plans as finished public features. The previous Hugo notes site remains a backup and content source, while the current project rebuilds the dynamic content, profile, and lightweight admin flow with Next.js App Router.

## Product Goals

<div class="case-card-grid">
  <article class="case-card">
    <h3>Low-interruption Writing</h3>
    <p>Keep editing, categories, tags, and local fallback content maintainable so writing can happen first and data integration can mature afterward.</p>
  </article>
  <article class="case-card">
    <h3>Immersive Reading</h3>
    <p>Use warm paper tones, generous spacing, and restrained visual hierarchy so the interface supports the text instead of competing with it.</p>
  </article>
  <article class="case-card">
    <h3>Room to Grow</h3>
    <p>Leave clear extension points across notes, profiles, login, comments API, mood trail prototypes, and the PWA shell for later iteration.</p>
  </article>
</div>

## My Role

This is a solo product and development project. I handle product positioning, information architecture, visual direction, Next.js page implementation, Supabase schema design, responsive layout, admin writing flow, and version management.

For me, the value is not only "building a blog." It is practice in shaping a small but real web product loop: content model, page structure, user profile, admin editor, mobile install shell, and a local development fallback all need to stay usable over time.

## Implemented Code Paths

Based on the current repository, the project includes these verifiable pieces:

- Public notes homepage, category pages, note detail pages, and recent notes.
- Site search based on note title, summary, tags, and content.
- Local content fallback through `data/notes.json` and `lib/seed-notes.ts`, allowing UI work without Supabase environment variables.
- Supabase schema and RLS policies for `notes`, `profiles`, `comments`, `mood_entries`, and related tables.
- Login, registration, profile pages, and profile fields such as avatar, display name, status, bio, and social links.
- Admin editor and write APIs; local development can write back to JSON, while a Supabase setup can write to the database and Storage.
- PWA manifest, Service Worker registration, and a basic offline shell.
- Prototype routes for Mood Trail, anonymous square, stats review, and a "bad mood monster" mini-game.
- Comment reading and API structure; public guest writing remains closed in v1 until a moderation flow is ready.

## Design Language

I want 阈限手记 to stay connected to the Left Jun / Limenauts identity without copying the denser project-card language of the portfolio. It should feel closer to a notebook, memo paper, and personal desk: warm paper colors, dark text, larger whitespace, low-contrast decoration, and actions that appear only when useful.

This design direction also limits how features are presented. The page should not turn into a promotional feature wall. The homepage leads with recent notes, categories, and mood entry points; admin and profile tools live in more explicit use cases.

## Engineering

The project uses Next.js App Router. The content layer switches between Supabase and local JSON / seed notes through `getNotes`, so page and style work can continue even when a remote database is not configured.

On the Supabase side, the schema covers notes, profiles, comments, mood entries, and support actions. RLS policies constrain public reading, profile updates, and mood-record access. Storage buckets are planned for note images and profile avatars, while admin write and upload APIs are protected through server-side tokens.

The PWA work starts as a web install shell: the manifest uses real brand imagery, and the Service Worker caches the site shell, brand images, and avatars for basic fallback behavior. If the project later needs app-store distribution, the same Next.js site could be wrapped with Capacitor instead of maintaining a separate native codebase immediately.

## Current Status and Next Steps

The project is still in progress. Core pages, content loading, profiles, admin editing, PWA setup, and mood-related prototypes have code paths, but live content organization, moderation, comment experience, and the complete mood-product loop still need validation.

The next priority is to make the real writing workflow reliable: content import, admin editing, image upload, mobile reading, profile display, and basic performance. Only after those foundations are stable should the interactive scope expand.
