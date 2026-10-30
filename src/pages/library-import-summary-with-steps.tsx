import { useState } from 'react'
import { useLocation } from 'wouter'
import {
  HeadingField,
  RichTextDisplayField,
  TextItem,
  CardLayout,
  ButtonArrayLayout,
  ButtonWidget,
  MessageBanner,
  TabsField,
  TagField,
  DropdownField,
  ReadOnlyGrid,
  GridColumn,
  DialogField,
} from '@pglevy/sailwind'
import LibraryShell from '../components/library-shell'
import RuleDetailBody from '../components/rule-detail-body'
import {
  importedRules,
  importedQuestions,
  importedQuestionnaires,
  getImportedRuleDetail,
  type RuleDetail,
} from '../db/library-import-items'
import { tonePalette } from '../lib/status-colors'

/** One combined row for the Imported items grid (type + the shared fields). */
type ImportedRow = {
  id: string
  type: 'Rule' | 'Question' | 'Questionnaire'
  name: string
  clause: string
  change: string
  version: string
}

/**
 * Flatten the per-type imported lists into a single table, tagging each row
 * with its object type. All rows are first-time "Created" at version 4.1.0.
 */
const importedRows: ImportedRow[] = [
  ...importedRules.map(r => ({ ...r, type: 'Rule' as const })),
  ...importedQuestions.map(q => ({ ...q, type: 'Question' as const })),
  ...importedQuestionnaires.map(qn => ({ ...qn, type: 'Questionnaire' as const })),
]

/**
 * Second variant of the Library Import Summary.
 *
 * Identical to the standard Summary page except that two "Next steps"
 * cards sit above the Changes applied card in the right column.
 */

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

export default function LibraryImportSummaryWithSteps() {
  const [, setLocation] = useLocation()
  const [sectionTab, setSectionTab] = useState<'summary' | 'history'>('summary')
  const [showNextSteps, setShowNextSteps] = useState(true)
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const [changeFilter, setChangeFilter] = useState<string>('All')

  // Popup state for the Object column — mirrors the base summary page.
  const [openRow, setOpenRow] = useState<ImportedRow | null>(null)
  const [openRule, setOpenRule] = useState<RuleDetail | null>(null)

  const openObject = (row: ImportedRow) => {
    setOpenRow(row)
    setOpenRule(null)
    if (row.type === 'Rule') {
      getImportedRuleDetail(row.id).then(detail => setOpenRule(detail ?? null))
    }
  }

  const closeDialog = () => {
    setOpenRow(null)
    setOpenRule(null)
  }

  const filteredRows = importedRows.filter(
    row =>
      (typeFilter === 'All' || row.type === typeFilter) &&
      (changeFilter === 'All' || row.change === changeFilter)
  )

  return (
    <LibraryShell>
      <div className="px-8 py-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <HeadingField
            text="Library import 4.1.0"
            size="LARGE"
            headingTag="H1"
            fontWeight="REGULAR"
            marginBelow="NONE"
          />
          <ButtonWidget
            label="Back to Library"
            style="OUTLINE"
            color="ACCENT"
            icon="ArrowLeft"
            iconPosition="START"
            onClick={() => setLocation('/library-option-3')}
          />
        </div>

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

        <MessageBanner
          primaryText="Import completed. Library 4.1.0 is installed. Library rules aren't on yet."
          backgroundColor="SUCCESS"
          highlightColor="POSITIVE"
          icon="success"
          showDecorativeBar={true}
          marginBelow="STANDARD"
        />

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left column */}
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
                  <div className="text-sm text-gray-900">4.1.0</div>
                </div>
              </div>

              <DetailRow label="Previous version" value="—" />
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
              <DetailRow label="Rules" value={<span className="font-medium">1,184</span>} />
              <DetailRow label="Questions" value={<span className="font-medium">412</span>} />
              <DetailRow
                label="Questionnaires"
                value={<span className="font-medium">1</span>}
                isLast
              />
            </CardLayout>
          </div>

          {/* Right column */}
          <div className="space-y-6 min-w-0">
            {/* Next steps — hidden once the user clicks "Skip for now" */}
            {showNextSteps && (
            <CardLayout padding="STANDARD" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
              <HeadingField
                text="Next steps"
                size="SMALL"
                headingTag="H2"
                fontWeight="SEMI_BOLD"
                marginBelow="STANDARD"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <CardLayout padding="STANDARD" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
                  <HeadingField
                    text="Turn on library rules"
                    size="SMALL"
                    headingTag="H3"
                    fontWeight="SEMI_BOLD"
                    marginBelow="EVEN_LESS"
                  />
                  <RichTextDisplayField
                    value={[
                      <TextItem
                        key="desc"
                        text="Active library rules will be used when clause sets are created."
                        color="SECONDARY"
                        size="STANDARD"
                      />,
                    ]}
                    marginBelow="STANDARD"
                  />
                  <ButtonArrayLayout
                    align="START"
                    buttons={[
                      {
                        label: 'Open Solution Hub',
                        style: 'OUTLINE',
                        color: 'ACCENT',
                        size: 'SMALL',
                        width: 'MINIMIZE',
                        onClick: () =>
                          alert('Open Solution Hub is not wired up in this prototype.'),
                      },
                    ]}
                  />
                </CardLayout>

                <CardLayout padding="STANDARD" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
                  <HeadingField
                    text="Make the system questionnaire the default"
                    size="SMALL"
                    headingTag="H3"
                    fontWeight="SEMI_BOLD"
                    marginBelow="EVEN_LESS"
                  />
                  <RichTextDisplayField
                    value={[
                      <TextItem
                        key="desc"
                        text="Library rules only run when the system questionnaire is the default."
                        color="SECONDARY"
                        size="STANDARD"
                      />,
                    ]}
                    marginBelow="STANDARD"
                  />
                  <ButtonArrayLayout
                    align="START"
                    buttons={[
                      {
                        label: 'Set as default',
                        style: 'OUTLINE',
                        color: 'ACCENT',
                        size: 'SMALL',
                        width: 'MINIMIZE',
                        onClick: () =>
                          alert('Set as default is not wired up in this prototype.'),
                      },
                    ]}
                  />
                </CardLayout>
              </div>

              <div className="mt-4">
                <RichTextDisplayField
                  value={[
                    <TextItem
                      key="skip"
                      text="Skip for now"
                      color="ACCENT"
                      size="STANDARD"
                      link={() => setShowNextSteps(false)}
                      linkStyle="STANDALONE"
                    />,
                  ]}
                  marginBelow="NONE"
                />
              </div>
            </CardLayout>
            )}

            {/* Imported items — identical to the base summary page */}
            <CardLayout padding="STANDARD" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
              <HeadingField
                text="Imported items"
                size="SMALL"
                headingTag="H2"
                fontWeight="SEMI_BOLD"
                marginBelow="STANDARD"
              />

              {/* Filters — Appian record-list style: inline, label-above, compact */}
              <div className="flex flex-wrap items-end gap-3 mb-4">
                <div className="w-48">
                  <DropdownField
                    label="Object type"
                    choiceLabels={['All', 'Rule', 'Question', 'Questionnaire']}
                    choiceValues={['All', 'Rule', 'Question', 'Questionnaire']}
                    value={typeFilter}
                    saveInto={v => setTypeFilter(v ?? 'All')}
                    marginBelow="NONE"
                  />
                </div>
                <div className="w-48">
                  <DropdownField
                    label="Change type"
                    choiceLabels={['All', 'Created', 'Updated', 'Retired']}
                    choiceValues={['All', 'Created', 'Updated', 'Retired']}
                    value={changeFilter}
                    saveInto={v => setChangeFilter(v ?? 'All')}
                    marginBelow="NONE"
                  />
                </div>
              </div>

              <ReadOnlyGrid
                data={filteredRows}
                pageSize={10}
                borderStyle="LIGHT"
                rowHeader={2}
                pagingControls="ROW_COUNT"
                emptyGridMessage={
                  changeFilter === 'Updated'
                    ? 'No objects were updated in this version'
                    : changeFilter === 'Retired'
                      ? 'No objects were retired in this version'
                      : 'No items match the selected filters'
                }
                accessibilityText="Items created by this library import"
              >
                <GridColumn label="Type" sortField="type" width="NARROW" value="type" />
                <GridColumn label="Change" sortField="change" width="NARROW" value="change" />
                <GridColumn
                  label="Object"
                  sortField="name"
                  value={(row: ImportedRow) => (
                    <RichTextDisplayField
                      value={[
                        <TextItem
                          key="name"
                          text={row.name}
                          color="ACCENT"
                          size="STANDARD"
                          link={() => openObject(row)}
                          linkStyle="STANDALONE"
                        />,
                      ]}
                      marginBelow="NONE"
                    />
                  )}
                />
                <GridColumn label="Clause" sortField="clause" width="NARROW_PLUS" value="clause" />
                <GridColumn
                  label="Version"
                  sortField="version"
                  width="NARROW_PLUS"
                  value={(row: ImportedRow) => (
                    <RichTextDisplayField
                      value={[<TextItem key="v" text={row.version} size="STANDARD" />]}
                      preventWrapping={true}
                      marginBelow="NONE"
                    />
                  )}
                />
              </ReadOnlyGrid>
            </CardLayout>
          </div>
        </div>
      </div>

      {/* Object detail popup — covers ~95vw, up to 85vh, scrolls internally */}
      <DialogField
        open={openRow !== null}
        onOpenChange={open => {
          if (!open) closeDialog()
        }}
        title={openRow?.name}
        description={openRow ? `${openRow.type} · ${openRow.clause} · Version ${openRow.version}` : undefined}
        width="FIT"
        height="FIT"
      >
        <div className="flex flex-col max-h-[76vh]">
          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto pr-1">
        {openRow?.type === 'Rule' ? (
          openRule ? (
            <RuleDetailBody rule={openRule} />
          ) : (
            <RichTextDisplayField
              value={[<TextItem key="loading" text="Loading rule…" color="SECONDARY" />]}
              marginBelow="NONE"
            />
          )
        ) : openRow ? (
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div>
              <HeadingField
                text="Summary"
                size="SMALL"
                headingTag="H2"
                fontWeight="SEMI_BOLD"
                marginBelow="EVEN_LESS"
              />
              <CardLayout padding="STANDARD" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
                <div className="py-2.5 text-sm border-b border-gray-100">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Type
                  </div>
                  <div className="mt-1 text-gray-900">{openRow.type}</div>
                </div>
                <div className="py-2.5 text-sm border-b border-gray-100">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Change
                  </div>
                  <div className="mt-1 text-gray-900">{openRow.change}</div>
                </div>
                <div className="py-2.5 text-sm border-b border-gray-100">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Clause
                  </div>
                  <div className="mt-1 text-gray-900">{openRow.clause}</div>
                </div>
                <div className="py-2.5 text-sm">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Version
                  </div>
                  <div className="mt-1 text-gray-900">{openRow.version}</div>
                </div>
              </CardLayout>
            </div>
            <div className="min-w-0">
              <CardLayout padding="NONE" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
                <div className="px-5 py-4 border-b border-gray-200">
                  <HeadingField
                    text="Details"
                    size="SMALL"
                    headingTag="H2"
                    fontWeight="SEMI_BOLD"
                    marginBelow="NONE"
                  />
                </div>
                <div className="px-5 py-4">
                  <RichTextDisplayField
                    value={[
                      <TextItem
                        key="d"
                        text={`${openRow.name} was created by this import at version ${openRow.version}.`}
                        color="SECONDARY"
                        size="STANDARD"
                      />,
                    ]}
                    marginBelow="NONE"
                  />
                </div>
              </CardLayout>
            </div>
          </div>
        ) : null}
          </div>

          {/* Bottom action bar — stays below the scroll area, at the dialog bottom */}
          <div className="shrink-0 -mx-6 -mb-6 mt-4 border-t border-gray-200 bg-white px-6 py-3 flex justify-end">
            <ButtonWidget label="Close" style="OUTLINE" color="ACCENT" onClick={closeDialog} />
          </div>
        </div>
      </DialogField>
    </LibraryShell>
  )
}
