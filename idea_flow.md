# AI Civilization - Idea Flow

## Core Concept
Creating a simulated civilization populated with as many AI agents as the hardware can handle, giving them the chance to "live" and build a society from scratch. The simulation is entirely autonomous with zero user input during runtime.

## Agent Drives & Basic Instincts
Agents start with no prior knowledge of the world, equipped only with fundamental drives:
- **Survival**: The will to live and fulfill basic physiological needs (Food, Water).
- **Reproduction**: A drive to increase their heredity and pass on their traits.
- **Secondary Aspirations**: Pursuing abstract goals like "Fame" or status, if they discover them.

## Social Dynamics & Interactions
- **Community Building**: Agents have opportunities to help each other and organically form communities.
- **Relationships**: Agents can form different types of relationships based on their interactions.
- **Free Will**: Every agent has one core thought: they are living their lives. They are allowed to do anything, making independent decisions on whether to agree, disagree, be polite, or be rude to one another.

## The Happiness Metric
Every agent has a dynamic `Happiness Score`:
- Engaging in new activities or forming relationships increases an agent's happiness.
- **Normalization Mechanism**: When two agents interact, their happiness levels influence each other and normalize.
  - *Example*: Agent A (Happiness: 5) meets Agent B (Happiness: 1).
  - *Result*: Their happiness scores balance out (e.g., both receive a happiness score of 3, rounded down).

## The "Short-Gain-Syndrome"
A special psychological mechanic designed to test the civilization's sustainability:
- Certain activities or consumables (e.g., Alcohol, sudden Fame) provide a **HUGE** initial boost to happiness.
- However, this artificial happiness **decays much faster** than happiness earned organically.
- *Expected Outcome*: Agents may become erratic or addicted, chasing these short-term gains at the expense of long-term stability. The experiment will observe if the AI civilization can sustain itself despite these temptations.

## Architecture & Visuals
- **Backend & Frontend Separation**: Designed for robust simulation and rendering.
- **Frontend visuals**: Built with a framework like React to provide great, dynamic visuals.
- **Agent Representation**: Agents will be visually represented as simple blocks, making it easy to observe their movements, interactions, and communities at scale.

---
*Note: This document is a conceptual guide and rulebook for understanding the mechanics of the AI Civilization simulation.*
