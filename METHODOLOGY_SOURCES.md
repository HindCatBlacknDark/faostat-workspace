# Methodology sources

Reviewed 2026-11-19. Student explanations are paraphrases, not quotations or replacement CSV metadata. Source access is documented below.

## FAO catalog — Nutrients availability based on supply utilization accounts

https://data.fao.org/catalog/iso/cda4ff45-1549-4b71-bede-3c4ad4a859d4

Supports: Unit meanings for energy and dietary fibre.

Access: Official catalog search-index text reviewed; direct page returned HTTP 403.

## FAO — About food consumption estimates

https://www.fao.org/measuring-hunger/food-consumption/about-food-consumption-estimates/en

Supports: Separate data sources for availability, apparent intake and individual intake; nutrient conversion tables.

Access: Official page reviewed.

## Moltedo et al. (FAO), 2026 — The First Global Platform for Harmonized Dietary Data

https://doi.org/10.1016/j.tjnut.2026.101828

Supports: Methods: SUA food variable, population denominator and national availability limitations.

Access: Publisher search-index full-text passages reviewed; direct publisher page returned HTTP 403.

## FAO — Global nutrient conversion table for FAO supply utilization accounts (2024)

https://www.fao.org/food-composition/tables-and-databases/detail/global-nutrient-conversion-table-for-fao-supply-utilization-accounts/en

Supports: Official reference for the nutrient conversion resource; not confirmation of the version used in this CSV.

Access: Official resource page search-index text reviewed; linked full publication not reviewed.

## FAO — Food group classification used on FAOSTAT Food and Diet (PDF, pages 1–2)

https://files-faostat.fao.org/production/FB/food_group_classification_e.pdf

Supports: Published cereals group boundaries and subgroups.

Access: Official PDF text reviewed, pages 1–2.

## FAOSTAT — Availability (based on supply utilization accounts)

https://www.fao.org/faostat/en/#data/SUA

Supports: Official dataset entry point.

Access: Dynamic entry point; no readable metadata returned. Not used alone to establish definitions.

## Evidence boundaries

The unit expansions come from the official catalog’s indexed text. The domain methods explanation follows the FAO-authored 2026 methods paper and FAO’s food-consumption overview. Food-group examples follow pages 1–2 of the official classification PDF; they do not establish the commodity composition of the supplied aggregate export. The conversion-table listing establishes the resource’s existence, not the exact version used in these observations.

The indicator codes, labels, element codes and flag description are established by the original CSV. E is not interpreted as a confidence interval or proof of any particular estimation algorithm. The exact dietary-fibre analytical definition, energy factors, population revision, conversion-table version and country/year composition remain to verify for this export.

No external observations were imported, no country averages were calculated, and no source data was altered.

## Global NCT compilation — user verification incorporated

The Global NCT was compiled from 13 selected food composition tables from around the world, with quality selection based on the FAO/INFOODS Evaluation Framework. The user supplied this finding; it was independently corroborated in the official FAO catalog’s indexed metadata on 2026-11-19. Framework reference: https://www.fao.org/documents/card/en?details=cc5371en. The framework document itself was not retrieved in this check. This establishes the compilation approach, not the precise revision used for the supplied export.

## Supplemental files and user-supplied collection metadata

Preserved Nutrients Availability Result.csv and Nutrients Availability SUA Query.sql in data/supplemental with hashes and inspection.json. The CSV is FG0 / Calcium supply (4009), mg/cap/d, 178 countries/territories, 2010–2023, 2,411 observations, all flagged Estimated value; 81 country-year combinations are absent in the observed grid. No duplicate observation keys or blank values. This is a different scope from the active cereals exercise and was not merged. The SQL template was inspected only, not executed; parameter bindings are absent.

Collection channels were supplied by the user and attributed accordingly in the guide. The user also reported pointOfContact and custodian resources naming the FAO Statistics Division (ESS), Crops, Livestock and Food Statistics Team, with no views created. These reported catalog role entries are not treated as missing nutrient-methodology documents, and their underlying resource pages were not available for verification.
