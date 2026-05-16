---
title: "Worked Example · Package Flow"
eyebrow: "§13.5"
summary: "One illustrative case showing how a single outpatient package moves from ADAC notification through reporting and invoice. Example workflow only — no real patient data."
layout: "structured"
packageCode: "HMC-GI-03"
scenario: "Acute gastroenteritis / dehydration · German traveler at a Red Sea hotel"
---

This page is rendered by the `WorkedExampleCard` component (renderer:
`worked-example` in sections.json). The component reads the package
definition directly from `packages.json` so the code, name, and
"What's included" text always match the live catalogue, and the price
chip uses the existing scenario-aware `PriceBadge` so Scenario A
continues to show "To be agreed."
