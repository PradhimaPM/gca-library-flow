# GCA Library Flow

A self-contained React prototype of the **Government Clause Automation (GCA)**
library import journey — every screen from the empty Library page through
import, confirmation, progress, and the post-import summaries.

Built with React 19 + TypeScript + Vite, using the
[`@pglevy/sailwind`](https://www.npmjs.com/package/@pglevy/sailwind) Appian SAIL
component library. Routing is client-side (hash-based) via `wouter`.

## See the whole flow at once

The landing page (`/`) lists **every screen** grouped by stage, each as a
clickable card. Open it first to jump to any screen, or start at the empty
state and follow the wired buttons end to end.

## Run it locally

```bash
pnpm install
pnpm dev
```

Then open the printed URL (e.g. http://localhost:5173/). The index page lists
every screen.

To build / preview the production bundle:

```bash
pnpm build
pnpm preview
```

## The screens

| Stage | Route | Screen |
|-------|-------|--------|
| Entry | `#/library` | Library — empty state (no library installed) |
| Import | `#/library/import` | Import library — upload the package (2-step) |
| Import | `#/library/import/confirm` | Confirm import — Option 1 summary / Option 2 package details |
| Import | `#/library/import/progress` | Import progress — refresh to reveal success |
| Summary | `#/library/import/summary` | Import summary — Details, Package contents, Changes applied, Imported items (click an item for a detail popup) |
| Summary | `#/library/import/summary/with-steps` | Summary with a "Next steps" card |
| Summary | `#/library/import/summary/detailed` | Detailed summary — Needs attention / All changes tabs |
| Summary | `#/library/import/rule/:id` | Full rule detail (opened from the grids) |
| Installed | `#/library-option-2` | Installed library with import history |
| Installed | `#/library-option-3` | Installed library with a call-to-action banner |

## How the flow is wired

```
/library  ──Import library──▶  /library/import
                                   │  Import
                                   ▼
                            /library/import/confirm
                                   │  Import
                                   ▼
                            /library/import/progress
                                   │  View summary
                                   ▼
                     /library/import/summary/with-steps

/library-option-2  and  /library-option-3   (installed views)
      │  click a version in import history
      ▼
/library/import/summary ──▶ /library/import/summary/detailed
                        └──▶ /library/import/rule/:id
```

## Project structure

```
src/
  App.tsx                     routes + the landing index
  main.tsx                    React entry
  index.css                   Tailwind + Sailwind theme
  pages/                      the 10 library screens
  components/
    app-nav.tsx               left site navigation
    library-shell.tsx         page frame (nav + content)
    rule-detail-body.tsx      shared rule-detail layout (page + popup)
  db/
    library-import-items.ts   mock data for every grid/detail
  lib/
    status-colors.ts          shared status-tone palette
    library-state.ts          in-session "installed?" flag
```

This is a UX prototype — all data is mock data in `src/db/`, and buttons that
aren't part of the import flow are intentionally inert.
