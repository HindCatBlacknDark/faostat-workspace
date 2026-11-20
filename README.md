# Fieldnotes — FAOSTAT student workspace

Run locally with Python 3 (no packages to install):

```sh
cd faostat-workspace
python3 -m http.server 8017 --bind 127.0.0.1
```

Open http://127.0.0.1:8017. Stop with Ctrl+C. Use a local server rather than opening index.html directly.

Explore countries and years, review definitions and caveats in Understand, then build and download a supported interpretation in Explain. The CSV export contains original observations for the current selection; the explanation export includes selected endpoint evidence and provenance. Downloads use the browser's normal download location. Draft text persists in browser local storage when available; clear the fields to remove saved text. It is not synced or sent to a service.

## Reproduce data and checks

```sh
python3 scripts/prepare.py
node --test tests/*.test.js
python3 scripts/verify_export.py
node --check app.js
```

Node.js 18+ is needed only for checks. Original CSV bytes remain in data/original/. Generated observations and audit JSON can be recreated. See PROJECT_CONTEXT.md for scope, provenance and interpretation limits. This prototype has not established educational benefit or novelty. Exact indicator methodology remains to verify.

## Verification performed

Four automated test groups passed; CSV export round-trip preserved all 430 rows and fields. Browser verification confirmed data loading, separate charts, endpoint values, country selection, Explain navigation, evidence insertion and the browser draft-save status. Browser download delivery and responsive layouts were subsequently checked; see EXPLORATION_QA.md.

## Sourced definitions

Understand includes official unit meanings and a methodology guide. External explanations, review date, references and remaining uncertainties are in data/methodology.json and METHODOLOGY_SOURCES.md. Explanation downloads carry these notes and links. Original CSV fields are preserved.

After editing data/methodology.json, run `python3 scripts/render_methodology.py` to embed the readable guide and update the browser script version. Methodology text is embedded in HTML so a cached script or failed fetch cannot leave empty headings.

## Exploring the data

Search countries by name (case and accent insensitive), then select their checkboxes. Up to six countries can be compared. Search only filters the choices: it does not change selected countries. Selected-country buttons remove a country; Clear selection removes all.

Every yearly value lists all selected country/indicator/year entries with exact source value text, unit, flag and availability status. Column and row headers, a caption and a keyboard-focusable scrolling region make the table usable without chart interaction. A missing observation or blank value is labelled rather than replaced with zero.

Hover, focus, click or tap a chart point to show its country, year, indicator, value, unit and flag in the detail panel below the chart. Enter or Space selects a focused point; Escape clears the panel. Narrow screens scroll within each chart and table rather than widening the page. Actual phones and screen-reader software have not been tested; responsive browser checks are documented in EXPLORATION_QA.md.

## GitHub Pages

The public prototype is deployed by `.github/workflows/pages.yml` on pushes to `main`. The workflow validates transformations and exports, then publishes only `index.html`, JavaScript, CSS and the `data/` directory. The original and supplemental FAOSTAT data downloads remain available. Source documentation, scripts and tests remain in the repository but are excluded from the Pages payload.

Data source: user-supplied FAOSTAT exports; FAO statistical data are offered under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See [FAO dataset metadata](https://data.fao.org/catalog/iso/cda4ff45-1549-4b71-bede-3c4ad4a859d4) and METHODOLOGY_SOURCES.md for attribution and source limitations. This student prototype is not an official FAO service.

Student drafts are stored in the visitor's browser; there is no submission service. GitHub Pages supplies hosting. The website is public and its URL is not an access restriction.

To build locally: `python3 scripts/build_site.py`. Host the generated `dist/` directory. Use relative paths so project-site URLs work without a custom domain.
