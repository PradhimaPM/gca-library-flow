import { Route, Router, Switch, useLocation } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import {
  HeadingField,
  RichTextDisplayField,
  TextItem,
  CardLayout,
} from '@pglevy/sailwind'

import Library from './pages/library'
import LibraryOption2 from './pages/library-option-2'
import LibraryOption3 from './pages/library-option-3'
import LibraryImport from './pages/library-import'
import LibraryImportConfirm from './pages/library-import-confirm'
import LibraryImportProgress from './pages/library-import-progress'
import LibraryImportSummary from './pages/library-import-summary'
import LibraryImportSummaryWithSteps from './pages/library-import-summary-with-steps'
import LibraryImportSummaryDetailed from './pages/library-import-summary-detailed'
import LibraryRuleDetail from './pages/library-rule-detail'

/**
 * Every screen in the Library flow. `path` matches the wouter route;
 * order groups them by the stage of the journey.
 */
const pages = [
  {
    path: '/library',
    title: 'Library — empty state',
    group: 'Entry',
    description: 'First visit: no library installed. "Import library" starts the flow.',
    component: Library,
  },
  {
    path: '/library/import',
    title: 'Import library — upload package',
    group: 'Import',
    description: 'Two-step upload: download from Forum, then upload the package JSON.',
    component: LibraryImport,
  },
  {
    path: '/library/import/confirm',
    title: 'Import library — confirm',
    group: 'Import',
    description: 'Review the package (Option 1 summary / Option 2 package details) before importing.',
    component: LibraryImportConfirm,
  },
  {
    path: '/library/import/progress',
    title: 'Import library — progress',
    group: 'Import',
    description: 'Transient "importing…" screen. Refresh status reveals the success state.',
    component: LibraryImportProgress,
  },
  {
    path: '/library/import/summary',
    title: 'Import summary',
    group: 'Summary',
    description: 'Post-import summary: Details, Package contents, Changes applied, Imported items grid (click an item for a detail popup).',
    component: LibraryImportSummary,
  },
  {
    path: '/library/import/summary/with-steps',
    title: 'Import summary — with Next steps',
    group: 'Summary',
    description: 'Same summary with a "Next steps" card (turn on rules, set default questionnaire).',
    component: LibraryImportSummaryWithSteps,
  },
  {
    path: '/library/import/summary/detailed',
    title: 'Import summary — detailed',
    group: 'Summary',
    description: 'Detailed summary with Needs attention / All changes tabs.',
    component: LibraryImportSummaryDetailed,
  },
  {
    path: '/library/import/rule/:id',
    title: 'Library rule detail',
    group: 'Summary',
    description: 'Full rule detail — summary, conditions, included/excluded clauses.',
    component: LibraryRuleDetail,
    // Linked from the grids; not shown as a standalone card target.
    hideFromIndex: true,
  },
  {
    path: '/library-option-2',
    title: 'Library — installed (Option 2)',
    group: 'Installed',
    description: 'Installed library with an import-history grid.',
    component: LibraryOption2,
  },
  {
    path: '/library-option-3',
    title: 'Library — installed (Option 3)',
    group: 'Installed',
    description: 'Installed library with a call-to-action banner and import history.',
    component: LibraryOption3,
  },
]

const groupOrder = ['Entry', 'Import', 'Summary', 'Installed'] as const

/** Landing index — links to every screen so the whole flow is visible at once. */
function Index() {
  const [, setLocation] = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="max-w-4xl mx-auto">
        <HeadingField
          text="GCA Library Flow"
          size="LARGE"
          headingTag="H1"
          fontWeight="REGULAR"
          marginBelow="EVEN_LESS"
        />
        <RichTextDisplayField
          value={[
            <TextItem
              key="sub"
              text="Every screen in the Government Clause Automation library import journey. Open any screen below, or start at the empty state and follow the wired buttons through the whole flow."
              color="SECONDARY"
              size="STANDARD"
            />,
          ]}
          marginBelow="MORE"
        />

        {groupOrder.map(group => (
          <div key={group} className="mb-8">
            <HeadingField
              text={group}
              size="SMALL"
              headingTag="H2"
              fontWeight="SEMI_BOLD"
              marginBelow="STANDARD"
            />
            <div className="grid gap-4 md:grid-cols-2">
              {pages
                .filter(p => p.group === group && !p.hideFromIndex)
                .map(p => (
                  <button
                    key={p.path}
                    type="button"
                    onClick={() => setLocation(p.path)}
                    className="text-left"
                  >
                    <CardLayout
                      padding="STANDARD"
                      showBorder={true}
                      shape="SEMI_ROUNDED"
                      style="STANDARD"
                    >
                      <HeadingField
                        text={p.title}
                        size="SMALL"
                        headingTag="H3"
                        fontWeight="SEMI_BOLD"
                        marginBelow="EVEN_LESS"
                      />
                      <RichTextDisplayField
                        value={[
                          <TextItem
                            key="d"
                            text={p.description}
                            color="SECONDARY"
                            size="STANDARD"
                          />,
                        ]}
                        marginBelow="EVEN_LESS"
                      />
                      <RichTextDisplayField
                        value={[
                          <TextItem
                            key="path"
                            text={`#${p.path}`}
                            color="ACCENT"
                            size="SMALL"
                          />,
                        ]}
                        marginBelow="NONE"
                      />
                    </CardLayout>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <Router hook={useHashLocation}>
      <div className="min-h-screen bg-gray-50">
        <Switch>
          <Route path="/" component={Index} />
          {pages.map(({ path, component: Component }) => (
            <Route key={path} path={path} component={Component} />
          ))}
          <Route component={Index} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
