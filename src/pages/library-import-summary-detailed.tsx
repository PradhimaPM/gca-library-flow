import { useState } from 'react'
import { useLocation } from 'wouter'
import {
  HeadingField,
  RichTextDisplayField,
  TextItem,
  CardLayout,
  MessageBanner,
  TabsField,
  TagField,
  DropdownField,
  ReadOnlyGrid,
  GridColumn,
  ButtonWidget,
} from '@pglevy/sailwind'
import LibraryShell from '../components/library-shell'
import {
  needsAttentionItems,
  allChangeItems,
  type NeedsAttentionItem,
  type AllChangeItem,
} from '../db/library-import-items'
import { tonePalette } from '../lib/status-colors'

/** Compact label-value row used in the Details and Package contents cards. */
function DetailRow({
  label,
  value,
  isLast = false,
}: {
  label: string
  value: React.ReactNode
  isLast?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-2.5 text-sm ${
        isLast ? '' : 'border-b border-gray-100'
      }`}
    >
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  )
}

/** One line in the Changes applied section. */
function ChangeRow({
  label,
  added,
  changed,
  retired,
}: {
  label: string
  added: number
  changed: number
  retired: number
}) {
  return (
    <div className="flex items-center justify-between py-2.5 text-sm">
      <span className="text-gray-900">{label}</span>
      <span className="text-gray-600">
        <span className="font-semibold text-gray-900">{added}</span> new
        <span className="text-gray-300 mx-2">·</span>
        <span className="font-semibold text-gray-900">{changed}</span> changed
        <span className="text-gray-300 mx-2">·</span>
        <span className="font-semibold text-gray-900">{retired}</span> retired
      </span>
    </div>
  )
}

/**
 * Accent link cell used across the detailed grids. On this page the links are
 * intentionally unwired — they look clickable but don't navigate anywhere yet.
 */
function LinkCell({ text }: { text: string }) {
  return (
    <RichTextDisplayField
      value={[
        <TextItem
          key="l"
          text={text}
          color="ACCENT"
          size="STANDARD"
          link={() => {}}
          linkStyle="STANDALONE"
        />,
      ]}
      marginBelow="NONE"
    />
  )
}

type ItemTab = 'attention' | 'all'

/**
 * Changes applied, as new/changed/retired per object type. Package-contents
 * totals are derived from these sums so the two cards always agree.
 */
const CHANGES = {
  rules: { added: 43, changed: 118, retired: 6 },
  questions: { added: 12, changed: 9, retired: 2 },
  questionnaires: { added: 0, changed: 1, retired: 0 },
}
const sum = (c: { added: number; changed: number; retired: number }) =>
  c.added + c.changed + c.retired
const RULES_TOTAL = sum(CHANGES.rules)
const QUESTIONS_TOTAL = sum(CHANGES.questions)
const QUESTIONNAIRES_TOTAL = sum(CHANGES.questionnaires)

export default function LibraryImportSummaryDetailed() {
  const [, setLocation] = useLocation()
  const [sectionTab, setSectionTab] = useState<'summary' | 'history'>('summary')
  const [itemTab, setItemTab] = useState<ItemTab>('attention')

  // All-changes filters
  const [objectTypeFilter, setObjectTypeFilter] = useState<string>('All')
  const [changeTypeFilter, setChangeTypeFilter] = useState<string>('All')
  const filteredChanges = allChangeItems.filter(
    row =>
      (objectTypeFilter === 'All' || row.objectType === objectTypeFilter) &&
      (changeTypeFilter === 'All' || row.change === changeTypeFilter)
  )

  return (
    <LibraryShell>
      <div className="px-8 py-6">
        {/* Page header */}
        <HeadingField
          text="Library import 4.1.2"
          size="LARGE"
          headingTag="H1"
          fontWeight="REGULAR"
          marginBelow="STANDARD"
        />

        {/* Pill tabs: Summary / Import history */}
        <div className="mb-6">
          <TabsField
            tabs={[
              { value: 'summary', label: 'Summary' },
              { value: 'history', label: 'Import history' },
            ]}
            value={sectionTab}
            onValueChange={value => {
              setSectionTab(value as 'summary' | 'history')
              if (value === 'history') setLocation('/library-option-2')
            }}
            variant="PILL"
            color="ACCENT"
            size="SMALL"
            navigationOnly={true}
            marginBelow="NONE"
          />
        </div>

        {/* Completed-with-items-to-verify banner */}
        <MessageBanner
          primaryText="The import is completed, but please verify all the items below to use the library."
          backgroundColor="WARN"
          highlightColor="WARN"
          icon="warning"
          showDecorativeBar={true}
          marginBelow="STANDARD"
        />

        {/* Two-column body: left stack + right stack */}
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left column — identical to the base summary page */}
          <div className="space-y-6">
            <CardLayout padding="STANDARD" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
              <HeadingField
                text="Details"
                size="SMALL"
                headingTag="H2"
                fontWeight="SEMI_BOLD"
                marginBelow="STANDARD"
              />

              <div className="grid grid-cols-2 gap-3 pb-3 mb-1 border-b border-gray-100">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                    Status
                  </div>
                  <TagField
                    size="SMALL"
                    tags={[
                      { text: 'Completed', backgroundColor: tonePalette.POSITIVE.bg, textColor: tonePalette.POSITIVE.fg },
                    ]}
                    marginBelow="NONE"
                  />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
                    Version
                  </div>
                  <div className="text-sm text-gray-900">4.1.2</div>
                </div>
              </div>

              <DetailRow label="Previous version" value="4.1.0" />
              <DetailRow label="FAR/DFARS baseline" value="FAC 2025-06" />
              <DetailRow label="Minimum GCA version" value="4.1" />
              <DetailRow label="Imported by" value="Privilege User" />
              <DetailRow label="Imported on" value="Oct 23, 2026 8:12 PM" isLast />
            </CardLayout>

            <CardLayout padding="STANDARD" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
              <HeadingField
                text="Package contents"
                size="SMALL"
                headingTag="H2"
                fontWeight="SEMI_BOLD"
                marginBelow="STANDARD"
              />
              <DetailRow
                label="Rules"
                value={<span className="font-medium">{RULES_TOTAL}</span>}
              />
              <DetailRow
                label="Questions"
                value={<span className="font-medium">{QUESTIONS_TOTAL}</span>}
              />
              <DetailRow
                label="Questionnaires"
                value={<span className="font-medium">{QUESTIONNAIRES_TOTAL}</span>}
                isLast
              />
            </CardLayout>
          </div>

          {/* Right column */}
          <div className="space-y-6 min-w-0">
            {/* Changes applied — identical to the base summary page */}
            <CardLayout padding="STANDARD" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
              <HeadingField
                text="Changes applied"
                size="SMALL"
                headingTag="H2"
                fontWeight="SEMI_BOLD"
                marginBelow="STANDARD"
              />
              <div className="divide-y divide-gray-100">
                <ChangeRow label="Rules" {...CHANGES.rules} />
                <ChangeRow label="Questions" {...CHANGES.questions} />
                <ChangeRow label="Questionnaires" {...CHANGES.questionnaires} />
              </div>
            </CardLayout>

            {/* Imported items — FOUR detailed tabs */}
            <CardLayout padding="STANDARD" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
              <HeadingField
                text="Imported items"
                size="SMALL"
                headingTag="H2"
                fontWeight="SEMI_BOLD"
                marginBelow="STANDARD"
              />

              <div className="mb-4 [&_[role=tab]]:px-4">
                <TabsField
                  tabs={[
                    { value: 'attention', label: `Needs attention (${needsAttentionItems.length})` },
                    { value: 'all', label: `All changes (${RULES_TOTAL + QUESTIONS_TOTAL + QUESTIONNAIRES_TOTAL})` },
                  ]}
                  value={itemTab}
                  onValueChange={value => setItemTab(value as ItemTab)}
                  variant="UNDERLINE"
                  navigationOnly={true}
                  fullWidthSeparator={true}
                  marginBelow="NONE"
                />
              </div>

              {/* ---- Tab 1: Needs attention ---- */}
              {itemTab === 'attention' && (
                <>
                  <ReadOnlyGrid
                    data={needsAttentionItems}
                    pageSize={10}
                    borderStyle="LIGHT"
                    rowHeader={1}
                    accessibilityText="Items needing attention after this import"
                  >
                    <GridColumn label="Type" width="NARROW" value="kind" />
                    <GridColumn
                      label="Object"
                      value={(row: NeedsAttentionItem) => (
                        <div>
                          {row.objectLink ? (
                            <LinkCell text={row.objectName} />
                          ) : (
                            <span className="text-sm text-gray-900">{row.objectName}</span>
                          )}
                          {row.objectTag && (
                            <div className="mt-1">
                              <TagField
                                size="SMALL"
                                tags={[
                                  {
                                    text: row.objectTag.text,
                                    backgroundColor: tonePalette[row.objectTag.tone].bg,
                                    textColor: tonePalette[row.objectTag.tone].fg,
                                  },
                                ]}
                                marginBelow="NONE"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    />
                    <GridColumn label="Details" value="details" />
                    <GridColumn
                      label="Actions"
                      value={(row: NeedsAttentionItem) => (
                        <div>
                          {row.actions.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {row.actions.map(a => (
                                <ButtonWidget
                                  key={a.label}
                                  label={a.label}
                                  style="OUTLINE"
                                  color={a.tone}
                                  size="SMALL"
                                  width="MINIMIZE"
                                  onClick={() => {}}
                                />
                              ))}
                            </div>
                          ) : null}
                        </div>
                      )}
                    />
                  </ReadOnlyGrid>
                </>
              )}

              {/* ---- Tab 2: All changes ---- */}
              {itemTab === 'all' && (
                <>
                  <div className="flex flex-wrap gap-4 mb-4 max-w-md">
                    <div className="flex-1 min-w-[160px]">
                      <DropdownField
                        label="Object type"
                        choiceLabels={['All', 'Rule', 'Question', 'Response', 'Questionnaire placement']}
                        choiceValues={['All', 'Rule', 'Question', 'Response', 'Questionnaire placement']}
                        value={objectTypeFilter}
                        saveInto={v => setObjectTypeFilter(v ?? 'All')}
                        marginBelow="NONE"
                      />
                    </div>
                    <div className="flex-1 min-w-[160px]">
                      <DropdownField
                        label="Change type"
                        choiceLabels={['All', 'Created', 'Updated', 'Retired']}
                        choiceValues={['All', 'Created', 'Updated', 'Retired']}
                        value={changeTypeFilter}
                        saveInto={v => setChangeTypeFilter(v ?? 'All')}
                        marginBelow="NONE"
                      />
                    </div>
                  </div>
                  <ReadOnlyGrid
                    data={filteredChanges}
                    pageSize={10}
                    borderStyle="LIGHT"
                    rowHeader={2}
                    pagingControls="ROW_COUNT"
                    accessibilityText="All changes applied by this import"
                  >
                    <GridColumn label="Object type" width="NARROW_PLUS" value="objectType" />
                    <GridColumn
                      label="Change"
                      width="NARROW"
                      value={(row: AllChangeItem) => (
                        <span className="text-sm text-gray-900">{row.change}</span>
                      )}
                    />
                    <GridColumn
                      label="Item"
                      value={(row: AllChangeItem) => (
                        <div>
                          <LinkCell text={row.name} />
                          {row.sub && (
                            <div className="text-xs text-gray-500 mt-0.5">{row.sub}</div>
                          )}
                        </div>
                      )}
                    />
                    <GridColumn
                      label="Clause"
                      width="NARROW_PLUS"
                      value={(row: AllChangeItem) => (
                        <span className="text-sm text-gray-900">{row.clause ?? '—'}</span>
                      )}
                    />
                    <GridColumn
                      label="Version"
                      width="NARROW_PLUS"
                      value={(row: AllChangeItem) => (
                        <RichTextDisplayField
                          value={[<TextItem key="v" text={row.version} size="STANDARD" />]}
                          preventWrapping={true}
                          marginBelow="NONE"
                        />
                      )}
                    />
                  </ReadOnlyGrid>
                </>
              )}

            </CardLayout>
          </div>
        </div>
      </div>
    </LibraryShell>
  )
}
