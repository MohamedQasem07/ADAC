---
title: "Package Template Simulator"
eyebrow: "§13.6"
summary: "Live demo: pick any package, see the medical report template and the invoice preview generate for it. Editable in front of ADAC."
layout: "structured"
---

This page is rendered by the `PackageTemplateSimulator` client component
(renderer: `package-simulator` in sections.json). The component reads
package data directly from `packages.json` so the code, name, and
"What's included" text always match the live catalogue, and the price
chip uses the existing scenario-aware `PriceBadge` so Scenario A
continues to show "To be agreed."

Demo only · no real patient data · doctor and operator review required
before any clinical or financial submission.
