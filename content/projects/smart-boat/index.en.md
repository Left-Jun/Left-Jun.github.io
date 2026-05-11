---
title: "Wireless Remote-Control System for a Wind-Powered Smart Boat Model"
date: 2026-03-28T10:00:00+08:00
draft: false
slug: "smart-boat"
description: "A complete software-hardware project covering remote control, receiver design, driver programming, PCB design, and debugging."
image: "cover.png"
featured: true
featuredWeight: 20
weight: 10
portfolioType: "embedded"
projectFacts:
  developmentTime: "2026.3"
  duration: "Course / competition cycle"
  role: "Team lead / main programmer / hardware designer"
  tools: "STM32F103C8T6 / HAL / JLC EDA"
  platform: "Wireless remote controller + onboard receiver"
  result: "Completed software-hardware integration and a water-testable version, reaching the final stage."
tags:
  - "STM32"
  - "Embedded"
  - "Hardware"
---

## Overview

This is a complete software-hardware project. The core goal was to build a wireless control system consisting of a handheld remote and an onboard boat receiver.

## My role

- Served as team lead, main programmer, and hardware designer.
- Independently completed software and hardware development and debugging for the remote controller and receiver.

## Technical implementation

- Implemented SPI, ADC, PWM, and related drivers based on STM32F103C8T6 and HAL.
- Designed the PCB with JLC EDA and completed soldering.
- Optimized power ripple and joystick jitter with parallel capacitors and software filtering.
- Completed input sampling, PWM mapping, and a version that could operate on water.

## Screenshots and Engineering Details

![STM32CubeMX pinout configuration](screenshot-stm32-pinout.png)

The pinout is built around the STM32F103C8T6, including ADC input, SPI communication, USART debugging, and basic GPIO output.

![Receiver schematic](screenshot-schematic.png)

The schematic includes 3.3V regulation, power filtering, crystal oscillator, nRF24L01 communication module, status LED, and external connectors.

![STM32CubeIDE code debugging](screenshot-code.png)

The code side handles ADC sampling, throttle and steering mapping, nRF24L01 data transmission, and LED feedback, forming the control chain from remote input to onboard actuation.

## Result

- Became one of the few teams to finish the race and reached the final stage.
