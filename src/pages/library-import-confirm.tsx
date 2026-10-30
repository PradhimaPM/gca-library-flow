import { useState } from 'react'
import { useLocation } from 'wouter'
import {
  HeadingField,
  CardLayout,
  ButtonWidget,
  MessageBanner,
  TabsField,
  TagField,
  ReadOnlyGrid,
  GridColumn,
} from '@pglevy/sailwind'
import LibraryShell from '../components/library-shell'
import { tonePalette } from '../lib/status-colors'
import {
  packageRules,
  packageQuestions,
  packageQuestionnaires,
  type PackageDetailItem,
  type ChangeType,
} from '../db/library-import-items'

/** Simple label / value row used in the Option 1 summary card. */
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-6 py-2.5 text-sm">
      <div className="text-gray-500">{label}</div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  )
}

/** Colored "Change" tag for the package-details grid. */
function ChangeTag({ change }: { change: ChangeType }) {
  const toneByChange: Record<ChangeType, keyof typeof tonePalette | null> = {
    Created: 'POSITIVE',
    Updated: 'WARN',
    Retired: 'NEGATIVE',
    Unchanged: null,
  }
  const labelByChange: Record<ChangeType, string> = {
    Created: 'New',
    Updated: 'Changed',
    Retired: 'Retired',
    Unchanged: 'Unchanged',
  }

  const tone = toneByChange[change]
  if (!tone) {
    // Unchanged renders as plain muted text, no pill.
    return <span className="text-sm text-gray-500">Unchanged</span>
  }

  const palette = tonePalette[tone]
  return (
    <TagField
      size="SMALL"
      tags={[
        {
          text: labelByChange[change],
          backgroundColor: palette.bg,
          textColor: palette.fg,
        },
      ]}
      marginBelow="NONE"
    />
  )
}

/** Strip a leading FAR/DFARS clause number from a rule name. */
function stripClausePrefix(name: string): string {
  return name.replace(/^(?:FAR|DFARS)\s+\S+(?:\s+Alt\s+\S+)?\s+/, '')
}

/** A "Package details" grid for one item type (Rules / Questions / Questionnaires). */
function PackageDetailsGrid({
  data,
  nameHeader = 'Name',
  stripClause = false,
}: {
  data: PackageDetailItem[]
  nameHeader?: string
  stripClause?: boolean
}) {
  return (
    <ReadOnlyGrid
      data={data}
      pageSize={10}
      borderStyle="LIGHT"
      rowHeader={0}
      pagingControls="STANDARD"
      accessibilityText="Items contained in this library package"
    >
      <GridColumn
        label={nameHeader}
        sortField="name"
        value={stripClause ? (row: PackageDetailItem) => stripClausePrefix(row.name) : 'name'}
      />
      <GridColumn label="Status" sortField="status" width="NARROW" value="status" />
      <GridColumn
        label="Change"
        width="NARROW"
        value={(row: PackageDetailItem) => <ChangeTag change={row.change} />}
      />
    </ReadOnlyGrid>
  )
}

export default function LibraryImportConfirm() {
  const [, setLocation] = useLocation()
  const [option, setOption] = useState<'option1' | 'option2'>('option1')
  const [itemTab, setItemTab] = useState<'rules' | 'questions' | 'questionnaires'>('rules')

  const runImport = () => {
    // Go to the transient progress screen; it marks the library installed
    // once the simulated import finishes, then links to the summary.
    setLocation('/library/import/progress')
  }

  return (
    <LibraryShell>
      <div className="px-8 py-8 max-w-5xl mx-auto">
        <CardLayout padding="NONE" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <HeadingField
              text="Import library"
              size="LARGE"
              headingTag="H1"
              fontWeight="REGULAR"
              marginBelow="EVEN_LESS"
            />
            <div className="text-sm text-gray-500">
              Required fields are marked with an asterisk (*)
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-6">
            {/* Message banner at the top */}
            <MessageBanner
              primaryText="Importing doesn't change your custom rules, questions or questionnaires."
              backgroundColor="INFO"
              highlightColor="INFO"
              icon="info"
              showDecorativeBar={false}
            />

            {/* Option tabs */}
            <TabsField
              tabs={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
              ]}
              value={option}
              onValueChange={value => setOption(value as 'option1' | 'option2')}
              variant="UNDERLINE"
              size="MEDIUM"
              navigationOnly={true}
              marginBelow="NONE"
            />

            {option === 'option1' ? (
              /* ---------- Option 1 — simple summary ---------- */
              <div className="max-w-2xl">
                <HeadingField
                  text="Confirm the import"
                  size="MEDIUM"
                  headingTag="H2"
                  fontWeight="SEMI_BOLD"
                  marginBelow="EVEN_LESS"
                />
                <div className="rounded-lg border border-gray-200 bg-white px-5 py-2 divide-y divide-gray-100">
                  <SummaryRow label="Incoming version" value="4.1.0" />
                  <SummaryRow label="Installed version" value="-" />
                  <SummaryRow label="FAR/DFARS baseline" value="FAC 2025-06" />
                  <SummaryRow label="Minimum GCA version" value="4.1" />
                  <SummaryRow
                    label="Package contents"
                    value="1,184 rules, 412 questions, 1 questionnaire"
                  />
                </div>
              </div>
            ) : (
              /* ---------- Option 2 — package details grid ---------- */
              <div>
                <HeadingField
                  text="Package details"
                  size="MEDIUM"
                  headingTag="H2"
                  fontWeight="SEMI_BOLD"
                  marginBelow="STANDARD"
                />

                <TabsField
                  tabs={[
                    { value: 'rules', label: `Rules (${packageRules.length})` },
                    { value: 'questions', label: `Questions (${packageQuestions.length})` },
                    {
                      value: 'questionnaires',
                      label: `Questionnaires (${packageQuestionnaires.length})`,
                    },
                  ]}
                  value={itemTab}
                  onValueChange={value =>
                    setItemTab(value as 'rules' | 'questions' | 'questionnaires')
                  }
                  variant="UNDERLINE"
                  size="SMALL"
                  navigationOnly={true}
                  marginBelow="STANDARD"
                />

                {itemTab === 'rules' && (
                  <PackageDetailsGrid data={packageRules} nameHeader="Rule name" stripClause />
                )}
                {itemTab === 'questions' && (
                  <PackageDetailsGrid data={packageQuestions} nameHeader="Question" />
                )}
                {itemTab === 'questionnaires' && (
                  <PackageDetailsGrid data={packageQuestionnaires} nameHeader="Questionnaire" />
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ButtonWidget
                label="Cancel"
                style="LINK"
                color="ACCENT"
                onClick={() => setLocation('/library')}
              />
              <ButtonWidget
                label="Back"
                style="OUTLINE"
                color="ACCENT"
                onClick={() => setLocation('/library/import')}
              />
            </div>
            <ButtonWidget
              label="Import"
              style="SOLID"
              color="ACCENT"
              onClick={runImport}
            />
          </div>
        </CardLayout>
      </div>
    </LibraryShell>
  )
}
