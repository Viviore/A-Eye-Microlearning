# A-Eye: The Digital Investigator Game

## Overview
A-Eye is an educational browser game designed to help users—especially youth and students—learn how to spot AI-generated fake images and misinformation. Players act as digital investigators, analyzing simulated social feeds to find inconsistencies and decide whether content is trustworthy. 

## The Flow (How It Works)
The game is built around a core learning loop designed to measure improvement before and after the investigation phases:

1. **Pre-Assessment Quiz:** Establish a baseline of your knowledge and ability to spot fakes.
2. **Investigation Levels (1-3):** 
   - Analyze posts across different simulated platforms (e.g., Instagram, Facebook, LinkedIn style).
   - Use advanced tools like zoom, forensic heatmaps, and redaction pens to mark evidence.
   - Look for artifacts, submit your verdict (e.g., Advance Fee Fraud, AI Image Generation, Deepfake Video), and rate your confidence.
   - **Gameplay Dynamics:** Session rounds are randomly pulled from a pool per session. Be careful—misclicks, tool usages, and incorrect retries now result in live negative score deductions!
3. **Feedback & Summary:** Review your investigation results, complete with visual tape styling and detailed explanations of missed artifacts.
4. **Post-Assessment Quiz:** Measure how much your critical thinking and visual artifact detection have improved!

## Tech Stack
- Next.js (React) + TypeScript + Tailwind CSS
- Fully static, zero-friction browser experience (no custom backend required).

## Getting Started

To run the project locally:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to start playing.
