---
title: "Invoice Format"
eyebrow: "§10.2"
summary: "One package code, one flat number, with case identifiers that allow mechanical reconciliation."
layout: "structured"
---

## Context

The invoice is the single financial document tying a delivered case to its catalogue entry. It is structured so that ADAC's finance team can reconcile against the medical record without manual translation. Mode of delivery, time of day, and minor clinical variability sit inside the flat rate, so the invoice does not need to itemize them.

## Key points

- **One line per case.** The invoice carries a single package code and a single price, drawn directly from the active catalogue.
- **No consumable itemization.** Dressings, cannulas, standard medication, and the medical report are inside the package and are not broken out.
- **Case identifiers embedded.** Each invoice references the case ID, patient identifier, date of service, package code, and ICD-10 where applicable.
- **Mode of delivery is transparent.** Clinic, hotel, or mobile delivery does not change the invoiced number.
- **Escalation invoiced separately.** When a case crosses into the escalation pathway, that portion is billed on a distinct line and clearly marked.

## What this means for ADAC

Reconciliation is mechanical rather than interpretive. Finance can match each invoice against the medical record and the catalogue without needing to query individual line items, and escalation costs are always visible as a distinct event rather than absorbed silently into a higher number.
