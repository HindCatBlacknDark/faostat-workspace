# Project context

An early, local student-focused educational workspace for exploring real food and agriculture data, understanding indicators, and writing defensible interpretations. Educational value and novelty are not established. The contribution is the interaction and learning experience, without model training, advanced mathematics, or AI-generated interpretation.

## First question
How did energy and dietary fibre availability from cereals change across selected African countries between 2019 and 2023?

## Evidence and scope
The workspace directory was empty; there was no existing repository. The requested /mnt/data path was unavailable on this Mac. The original attachment was recovered using the referenced conversation's attachment path and copied byte-for-byte into data/original/FAOSTAT Data Nov 16 2026(1).csv. The earlier conversation ends at “BUILD THE FIRST”; no additional requirements or screenshot could be recovered. Expected selections from the supplied text were checked against the actual CSV.

Actual domain: Availability (based on supply utilization accounts), code SUA. Food group: Cereals and their products, FG1. 430 observations, 43 countries, 2019–2023 inclusive; Energy supply (4003, kcal/cap/d, element 6128) and Dietary fibre supply (4007, g/cap/d, element 6123). All flags E, with supplied description Estimated value. Notes are all blank. No missing values, zero values, duplicate observation keys, or absent combinations within the observed country/indicator/year grid. Country names, codes, full columns and file hash are recorded in data/audit.json. This does not imply complete African country coverage. Official unit meanings and domain methodology were reviewed on 2026-11-19 and are documented separately in data/methodology.json. Export-specific revisions and analytical details remain to verify.

## Product
Explore: select 1–6 countries and a valid year interval; separate unit-specific trend panels, accessible endpoint table, raw selected observations CSV retaining original columns and flags.
Understand: exact source labels, inspection report, unchanged original download, and interpretation limits.
Explain: claim/evidence/limits/next-question prompts, optional evidence insertion, browser-local draft persistence, Markdown export containing draft, current evidence and provenance. No automatic grading or AI calls.

## Interpretation rules
Availability is not measured individual consumption. National averages hide inequalities. Cereals alone cannot establish overall diet quality or cereals' share of total energy. Changes do not establish causes. Keep units separate, missing distinct from zero, and never compute an unweighted Africa-wide per-person average.

## Transformations and validation
prepare.py reads the source with UTF-8 BOM handling and the standard CSV parser. It retains original row strings, including leading-zero codes, and creates a numeric value only for calculations; blanks map to null. Duplicate compound keys stop preparation rather than aggregating. Missing combinations are reported only within observed coverage, never filled.
Absolute change = end minus start. Percentage = difference / start × 100; zero starts yield undefined percentages. Missing/ambiguous endpoints or differing units produce no calculation. Charts use zero baselines, independent indicator scales and gaps for absent values.
Tests check source hash, observed unique coverage, all 86 endpoint comparisons, missing/zero/duplicate/unit-mismatch edge cases, CSV escaping and Python CSV round-trip equality with original rows. Dependency-free static browser application, no network data services, deployment, or analytics.

## Methodology review — 2026-11-19

Understand now includes sourced unit expansions, student explanations, method overview, cereals group scope, flag limits and explicit unresolved details. Methodology notes are included in explanation downloads and available as separate JSON. See METHODOLOGY_SOURCES.md for evidence and access limits. The export is not asserted to use a specific conversion-table or population revision. Original CSV labels, rows and flags are unchanged.

### Blank-guide correction
The browser was displaying the new headings with a cached older script, leaving the dynamically populated guide empty. The guide is now embedded in HTML at authoring time, runtime rendering replaces existing lists without duplicates, the script URL carries a content version, and JSON fetches bypass browser cache. Browser inspection confirmed both indicator explanations, all methodology paragraphs, three unresolved items and six source entries are visible.

The user verified the Global NCT compilation from 13 FCTs selected using the FAO/INFOODS Evaluation Framework; official FAO catalog indexed metadata independently corroborated this. Added to the method summary and sources. Exact export revision remains unresolved.

Supplemental calcium/all-food-groups query and result preserved separately with an inspection report; not merged with the active dataset. User-supplied national data collection channels added to Understand and explanation exports, with attribution and verification limits. These materials do not resolve fibre analytical definitions or energy factors.

Understand now explicitly displays full-domain versus exercise coverage, supplemental calcium CSV/SQL findings with download links, and the reported contact/custodian catalog entries and preview limitation. Supplemental data remains separate.

## Exploration improvements

Replaced the native multi-select with searchable labelled checkboxes, selected-country removal buttons and a six-country limit. Search preserves selection, ignores case and accents, and exposes result/selection counts. Added a full selected-year table with semantic column/row headers, source value text, units, flags, and explicit missing/ambiguous statuses. Charts retain separate indicator scales and now expose keyboard- and pointer-operable point details. Mobile chart/table overflow is contained within labelled, focusable regions. Versioned app, model and stylesheet URLs prevent stale browser modules after updates.

Seven automated test groups pass. Responsive browser checks, downloaded-file verification and known verification limits are in EXPLORATION_QA.md. Original CSV unchanged; no supplemental observations merged. Existing student draft text was preserved during QA.
