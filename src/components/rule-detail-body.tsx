import {
  HeadingField,
  RichTextDisplayField,
  TextItem,
  CardLayout,
  MessageBanner,
  TagField,
} from '@pglevy/sailwind'
import type { RuleDetail, RuleConditionGroup } from '../db/library-import-items'
import { tonePalette } from '../lib/status-colors'

/** Label-value row used in the left Summary panel. */
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
    <div className={`py-2.5 text-sm ${isLast ? '' : 'border-b border-gray-100'}`}>
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-gray-900">{value}</div>
    </div>
  )
}

/** Pill-shaped joiner (OR / AND) that sits between condition rows or groups. */
function JoinerPill({ joiner }: { joiner: 'AND' | 'OR' }) {
  return (
    <div className="my-2 pl-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{joiner}</span>
    </div>
  )
}

/** One condition rendered as a bordered row with field, operator, value. */
function ConditionRow({
  field,
  operator,
  value,
}: {
  field: string
  operator: string
  value: string
}) {
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm">
      <span className="text-gray-900">{field}</span>
      <span className="text-gray-500"> {operator} </span>
      <span className="text-gray-900">{value}</span>
    </div>
  )
}

/** One condition group — a titled grey-tinted card wrapping conditions. */
function ConditionGroupCard({ group }: { group: RuleConditionGroup }) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-100 p-4">
      {group.title && <div className="mb-2 text-sm font-medium text-gray-700">{group.title}</div>}
      {group.conditions.map((c, index) => (
        <div key={index}>
          <ConditionRow field={c.field} operator={c.operator} value={c.value} />
          {index < group.conditions.length - 1 && <JoinerPill joiner={group.joiner} />}
        </div>
      ))}
    </div>
  )
}

/**
 * The body of a rule detail — Summary panel on the left, Conditions +
 * Included / Excluded Clauses on the right. Shared by the standalone Rule
 * Detail page and the popup opened from the import summary grid.
 */
export default function RuleDetailBody({ rule }: { rule: RuleDetail }) {
  const statusColor =
    rule.status === 'Active'
      ? { bg: tonePalette.POSITIVE.bg, fg: tonePalette.POSITIVE.fg }
      : { bg: tonePalette.NEUTRAL.bg, fg: tonePalette.NEUTRAL.fg }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      {/* Left: Summary panel */}
      <div>
        <HeadingField
          text="Summary"
          size="SMALL"
          headingTag="H2"
          fontWeight="SEMI_BOLD"
          marginBelow="EVEN_LESS"
        />
        <CardLayout padding="STANDARD" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
          <DetailRow
            label="Status"
            value={
              <TagField
                size="SMALL"
                tags={[
                  { text: rule.status, backgroundColor: statusColor.bg, textColor: statusColor.fg },
                ]}
                marginBelow="NONE"
              />
            }
          />
          <DetailRow label="Source" value={rule.source} />
          <DetailRow label="Library version" value={rule.libraryVersion} />
          <DetailRow label="Added in version" value={rule.addedInVersion} />
          <DetailRow label="FAR/DFARS baseline" value={rule.farDfarsBaseline} />
          <DetailRow label="Last updated" value={rule.lastUpdated} isLast />
        </CardLayout>
      </div>

      {/* Right: Conditions + clauses */}
      <div className="space-y-6 min-w-0">
        <CardLayout padding="NONE" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
          <div className="px-5 py-4 border-b border-gray-200">
            <HeadingField
              text="Conditions"
              size="SMALL"
              headingTag="H2"
              fontWeight="SEMI_BOLD"
              marginBelow="NONE"
            />
          </div>
          <div className="px-5 py-4">
            {rule.conditionGroups.map((group, index) => (
              <div key={index}>
                <ConditionGroupCard group={group} />
                {index < rule.conditionGroups.length - 1 && (
                  <JoinerPill joiner={rule.groupJoiner} />
                )}
              </div>
            ))}
          </div>
        </CardLayout>

        <CardLayout padding="NONE" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
          <div className="px-5 py-4 border-b border-gray-200">
            <HeadingField
              text="Included Clauses"
              size="SMALL"
              headingTag="H2"
              fontWeight="SEMI_BOLD"
              marginBelow="NONE"
            />
          </div>
          <div className="px-5 py-4">
            {rule.includedClauses.length === 0 ? (
              <RichTextDisplayField
                value={[
                  <TextItem
                    key="empty"
                    text="No clauses included."
                    color="SECONDARY"
                    size="STANDARD"
                  />,
                ]}
                marginBelow="NONE"
              />
            ) : (
              <ul className="space-y-2">
                {rule.includedClauses.map(clause => (
                  <li key={clause.number}>
                    <RichTextDisplayField
                      value={[
                        <TextItem key="num" text={clause.number} size="STANDARD" />,
                        <TextItem key="sep" text="  " size="STANDARD" />,
                        <TextItem
                          key="title"
                          text={clause.title}
                          color="SECONDARY"
                          size="STANDARD"
                        />,
                      ]}
                      marginBelow="NONE"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardLayout>

        <CardLayout padding="NONE" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
          <div className="px-5 py-4 border-b border-gray-200">
            <HeadingField
              text="Excluded Clauses"
              size="SMALL"
              headingTag="H2"
              fontWeight="SEMI_BOLD"
              marginBelow="NONE"
            />
          </div>
          <div className="px-5 py-4">
            {rule.excludedClauses.length === 0 ? (
              <MessageBanner
                primaryText="No clauses excluded."
                backgroundColor="INFO"
                highlightColor="INFO"
                icon="info"
                showDecorativeBar={false}
                marginBelow="NONE"
              />
            ) : (
              <ul className="space-y-2">
                {rule.excludedClauses.map(clause => (
                  <li key={clause.number}>
                    <RichTextDisplayField
                      value={[
                        <TextItem key="num" text={clause.number} size="STANDARD" />,
                        <TextItem key="sep" text="  " size="STANDARD" />,
                        <TextItem
                          key="title"
                          text={clause.title}
                          color="SECONDARY"
                          size="STANDARD"
                        />,
                      ]}
                      marginBelow="NONE"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardLayout>
      </div>
    </div>
  )
}
