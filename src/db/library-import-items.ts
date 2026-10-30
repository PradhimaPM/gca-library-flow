/**
 * Mock data layer for items touched by a Library import.
 *
 * Shared by the two Library Import Summary variants and the Rule Detail page
 * that opens when a rule name is clicked.
 */

export type ChangeType = 'Created' | 'Updated' | 'Retired' | 'Unchanged'

/** Row shown in the "Imported items" grid on the summary page. */
export interface ImportedItem {
  id: string
  name: string
  clause: string
  change: ChangeType
  version: string
}

/** One leaf condition in a rule's condition tree, e.g. "Field Equals Value". */
export interface RuleCondition {
  field: string
  operator: string
  value: string
}

/**
 * One group of conditions joined by AND or OR. Groups themselves are joined
 * at the top level by the rule's own joiner (also AND or OR).
 */
export interface RuleConditionGroup {
  title?: string
  joiner: 'AND' | 'OR'
  conditions: RuleCondition[]
}

export interface ClauseRef {
  number: string
  title: string
}

/** Full detail for a single rule, shown on the Rule Detail page. */
export interface RuleDetail {
  id: string
  clauseLabel: string
  name: string
  status: 'Active' | 'Inactive'
  source: string
  libraryVersion: string
  addedInVersion: string
  farDfarsBaseline: string
  lastUpdated: string
  /** How the top-level groups are joined. */
  groupJoiner: 'AND' | 'OR'
  conditionGroups: RuleConditionGroup[]
  includedClauses: ClauseRef[]
  excludedClauses: ClauseRef[]
}

// First-time 4.1.0 import: every item is newly created at version 4.1.0.
export const importedRules: ImportedItem[] = [
  { id: 'r1', name: 'Small Business Subcontracting Plan Inclusion', clause: 'FAR 52.219-9 Alt II', change: 'Created', version: '4.1.0' },
  { id: 'r2', name: 'Basic Safeguarding of Covered Contractor Information Systems Inclusion', clause: 'FAR 52.204-21', change: 'Created', version: '4.1.0' },
  { id: 'r3', name: 'Limitations on Subcontracting Inclusion', clause: 'FAR 52.219-14', change: 'Created', version: '4.1.0' },
  { id: 'r4', name: 'Compliance with Safeguarding of Covered Defense Information Controls Inclusion', clause: 'DFARS 252.204-7008', change: 'Created', version: '4.1.0' },
  { id: 'r5', name: 'Commercial Products Baseline', clause: 'FAR 52.212-4', change: 'Created', version: '4.1.0' },
  { id: 'r6', name: 'Combating Trafficking in Persons', clause: 'FAR 52.222-50', change: 'Created', version: '4.1.0' },
  { id: 'r7', name: 'Equal Opportunity', clause: 'FAR 52.222-26', change: 'Created', version: '4.1.0' },
  { id: 'r8', name: 'Buy American—Supplies', clause: 'FAR 52.225-1', change: 'Created', version: '4.1.0' },
  { id: 'r9', name: 'Payment by Electronic Funds Transfer', clause: 'FAR 52.232-33', change: 'Created', version: '4.1.0' },
  { id: 'r10', name: 'Termination for Convenience', clause: 'FAR 52.249-2', change: 'Created', version: '4.1.0' },
  { id: 'r11', name: 'Rights in Technical Data—Noncommercial Items', clause: 'DFARS 252.227-7013', change: 'Created', version: '4.1.0' },
  { id: 'r12', name: 'Service Contract Reporting Requirements', clause: 'FAR 52.204-15', change: 'Created', version: '4.1.0' },
]

export const importedQuestions: ImportedItem[] = [
  { id: 'q1', name: 'Is the contract for commercial items?', clause: 'FAR 52.212-3', change: 'Created', version: '4.1.0' },
  { id: 'q2', name: 'Does the contract exceed the micro-purchase threshold?', clause: 'FAR 52.213-1', change: 'Created', version: '4.1.0' },
  { id: 'q3', name: 'Will the contractor handle covered defense information?', clause: 'DFARS 252.204-7012', change: 'Created', version: '4.1.0' },
  { id: 'q4', name: 'Is the contract set aside for small business?', clause: 'FAR 52.219-6', change: 'Created', version: '4.1.0' },
  { id: 'q5', name: 'Is domestic end product sourcing required?', clause: 'FAR 52.225-2', change: 'Created', version: '4.1.0' },
  { id: 'q6', name: 'Does the contract require performance in the US?', clause: 'FAR 52.222-21', change: 'Created', version: '4.1.0' },
  { id: 'q7', name: 'Will the contractor employ workers under FLSA?', clause: 'FAR 52.222-6', change: 'Created', version: '4.1.0' },
  { id: 'q8', name: 'Does the contract exceed $7.5M?', clause: 'FAR 52.219-9', change: 'Created', version: '4.1.0' },
  { id: 'q9', name: 'Is the acquisition for IT services?', clause: 'FAR 52.239-1', change: 'Created', version: '4.1.0' },
  { id: 'q10', name: 'Is a Service Contract Act applicable?', clause: 'FAR 52.222-41', change: 'Created', version: '4.1.0' },
]

export const importedQuestionnaires: ImportedItem[] = [
  { id: 'qn1', name: 'OOTB Library Questionnaire', clause: '—', change: 'Created', version: '4.1.0' },
]

/**
 * "Package details" preview rows shown on the Import confirm page (Option 2),
 * before the import is actually run. Each row carries the rule/question/
 * questionnaire name, its resulting Active/Inactive status, and how the
 * package changes it (New / Changed / Retired / Unchanged).
 */
export interface PackageDetailItem {
  id: string
  name: string
  status: 'Active' | 'Inactive'
  change: ChangeType
}

// First-time import: every item is brand new, so change is 'Created' ("New")
// across the board.
export const packageRules: PackageDetailItem[] = [
  { id: 'pr1', name: 'FAR 52.219-14 Limitations on Subcontracting Inclusion', status: 'Active', change: 'Created' },
  { id: 'pr2', name: 'FAR 52.204-21 Basic Safeguarding Inclusion', status: 'Active', change: 'Created' },
  { id: 'pr3', name: 'FAR 52.212-4 Commercial Products Baseline', status: 'Active', change: 'Created' },
  { id: 'pr4', name: 'DFARS 252.204-7012 Safeguarding CDI', status: 'Active', change: 'Created' },
  { id: 'pr5', name: 'FAR 52.222-50 Combating Trafficking', status: 'Active', change: 'Created' },
  { id: 'pr6', name: 'FAR 52.223-99 Legacy Chemicals Clause', status: 'Active', change: 'Created' },
  { id: 'pr7', name: 'FAR 52.222-26 Equal Opportunity', status: 'Active', change: 'Created' },
  { id: 'pr8', name: 'FAR 52.222-41 Service Contract Labor Standards', status: 'Active', change: 'Created' },
  { id: 'pr9', name: 'FAR 52.225-1 Buy American—Supplies', status: 'Active', change: 'Created' },
  { id: 'pr10', name: 'FAR 52.232-33 Payment by Electronic Funds Transfer', status: 'Active', change: 'Created' },
  { id: 'pr11', name: 'FAR 52.219-9 Small Business Subcontracting Plan', status: 'Active', change: 'Created' },
  { id: 'pr12', name: 'FAR 52.204-15 Service Contract Reporting', status: 'Active', change: 'Created' },
  { id: 'pr13', name: 'DFARS 252.227-7013 Rights in Technical Data', status: 'Active', change: 'Created' },
  { id: 'pr14', name: 'FAR 52.249-2 Termination for Convenience', status: 'Active', change: 'Created' },
  { id: 'pr15', name: 'FAR 52.203-13 Contractor Code of Business Ethics', status: 'Active', change: 'Created' },
]

export const packageQuestions: PackageDetailItem[] = [
  { id: 'pq1', name: 'Is the contract for commercial items?', status: 'Active', change: 'Created' },
  { id: 'pq2', name: 'Does the contract exceed the micro-purchase threshold?', status: 'Active', change: 'Created' },
  { id: 'pq3', name: 'Will the contractor handle covered defense information?', status: 'Active', change: 'Created' },
  { id: 'pq4', name: 'Is the contract set aside for small business?', status: 'Active', change: 'Created' },
  { id: 'pq5', name: 'Is domestic end product sourcing required?', status: 'Active', change: 'Created' },
  { id: 'pq6', name: 'Does the contract require performance in the US?', status: 'Active', change: 'Created' },
  { id: 'pq7', name: 'Is a hazardous-materials review required?', status: 'Active', change: 'Created' },
  { id: 'pq8', name: 'Will the contractor employ workers under FLSA?', status: 'Active', change: 'Created' },
  { id: 'pq9', name: 'Is the acquisition for IT services?', status: 'Active', change: 'Created' },
  { id: 'pq10', name: 'Is a Service Contract Act applicable?', status: 'Active', change: 'Created' },
  { id: 'pq11', name: 'Does the contract include construction work?', status: 'Active', change: 'Created' },
  { id: 'pq12', name: 'Is the contractor a foreign entity?', status: 'Active', change: 'Created' },
  { id: 'pq13', name: 'Will the contract use government-furnished property?', status: 'Active', change: 'Created' },
  { id: 'pq14', name: 'Does the acquisition require a sustainability review?', status: 'Active', change: 'Created' },
  { id: 'pq15', name: 'Is the contract funded by a grant?', status: 'Active', change: 'Created' },
]

export const packageQuestionnaires: PackageDetailItem[] = [
  { id: 'pqn1', name: 'OOTB Library Questionnaire', status: 'Active', change: 'Created' },
]

/**
 * Full detail for each rule, keyed by rule id. r1 is the reference rule
 * (FAR 52.219-9 Alt II). The others use lighter data so the detail page
 * still renders meaningfully if someone navigates to them.
 */
const ruleDetails: Record<string, RuleDetail> = {
  r1: {
    id: 'r1',
    clauseLabel: 'FAR 52.219-9 Alt II',
    name: 'Small Business Subcontracting Plan Inclusion',
    status: 'Active',
    source: 'System (library)',
    libraryVersion: '4.1.2',
    addedInVersion: '4.1.0',
    farDfarsBaseline: 'FAC 2025-06',
    lastUpdated: 'Library import · Oct 21, 2026 10:05 AM',
    groupJoiner: 'AND',
    conditionGroups: [
      {
        title: 'Condition Group 1',
        joiner: 'OR',
        conditions: [
          {
            field: 'OOTB Library Questionnaire (Default) - Will the contractor store, process or transmit Federal contract information?',
            operator: 'Equals',
            value: 'Yes',
          },
          {
            field: 'OOTB Library Questionnaire (Default) - Will the contractor use information systems to perform the contract?',
            operator: 'Equals',
            value: 'Yes',
          },
        ],
      },
      {
        joiner: 'AND',
        conditions: [
          {
            field: 'Acquisition Type',
            operator: 'Not equal to',
            value: 'Commercially available off-the-shelf (COTS) items',
          },
        ],
      },
    ],
    includedClauses: [
      { number: '52.204-21', title: 'Basic Safeguarding of Covered Contractor Information Systems' },
    ],
    excludedClauses: [],
  },
  r2: {
    id: 'r2',
    clauseLabel: 'FAR 52.204-21',
    name: 'Basic Safeguarding of Covered Contractor Information Systems Inclusion',
    status: 'Active',
    source: 'System (library)',
    libraryVersion: '4.1.2',
    addedInVersion: '4.1.0',
    farDfarsBaseline: 'FAC 2025-06',
    lastUpdated: 'Library import · Oct 21, 2026 10:05 AM',
    groupJoiner: 'AND',
    conditionGroups: [
      {
        joiner: 'AND',
        conditions: [
          { field: 'Acquisition Type', operator: 'Equals', value: 'Covered contract' },
        ],
      },
    ],
    includedClauses: [
      { number: '52.204-21', title: 'Basic Safeguarding of Covered Contractor Information Systems' },
    ],
    excludedClauses: [],
  },
}

/** Async read of all rules in the imported items grid. */
export async function getImportedRules(): Promise<ImportedItem[]> {
  return importedRules
}

/** Async read of all questions in the imported items grid. */
export async function getImportedQuestions(): Promise<ImportedItem[]> {
  return importedQuestions
}

/** Async read of all questionnaires in the imported items grid. */
export async function getImportedQuestionnaires(): Promise<ImportedItem[]> {
  return importedQuestionnaires
}

/**
 * Fetch the full detail for a rule by id.
 *
 * Falls back to a generic Active rule derived from the imported items row
 * when there's no bespoke detail recorded, so navigation never dead-ends.
 */
export async function getImportedRuleDetail(id: string): Promise<RuleDetail | undefined> {
  const bespoke = ruleDetails[id]
  if (bespoke) return bespoke

  const row = importedRules.find(r => r.id === id)
  if (!row) return undefined

  return {
    id: row.id,
    clauseLabel: row.clause,
    name: row.name,
    status: 'Active',
    source: 'System (library)',
    libraryVersion: '4.1.2',
    addedInVersion: '4.1.0',
    farDfarsBaseline: 'FAC 2025-06',
    lastUpdated: 'Library import · Oct 21, 2026 10:05 AM',
    groupJoiner: 'AND',
    conditionGroups: [
      {
        joiner: 'AND',
        conditions: [
          { field: 'Acquisition Type', operator: 'Equals', value: 'Covered contract' },
        ],
      },
    ],
    includedClauses: [{ number: row.clause.replace(/^FAR |^DFARS /, ''), title: row.name }],
    excludedClauses: [],
  }
}

/* ==========================================================================
 * Detailed-summary datasets (standalone "detailed" summary page only).
 * These back the four tabs of the Imported items card on that page:
 * Needs attention / New rules / All changes / Copies with newer source.
 * ========================================================================== */

/** A row in the "Needs attention" tab. */
export interface NeedsAttentionItem {
  id: string
  /** Object type: Rule, Question, or Questionnaire. */
  kind: 'Rule' | 'Question' | 'Questionnaire'
  /** The object's display name, shown as a link in the Object column. */
  objectName: string
  objectLink?: string
  /** Optional sub-line shown under the object name. */
  objectSub?: string
  /** Extra tag shown under the object cell, e.g. "System" / "Custom". */
  objectTag?: { text: string; tone: 'NEUTRAL' | 'INFO' | 'POSITIVE' | 'NEGATIVE' }
  details: string
  /** Primary action buttons. */
  actions: Array<{ label: string; tone: 'ACCENT' | 'NEGATIVE' }>
  /** Optional secondary note under the actions. */
  actionNote?: string
}

export const needsAttentionItems: NeedsAttentionItem[] = [
  {
    id: 'na1',
    kind: 'Rule',
    objectName: 'Include High Value Contract Clauses',
    objectLink: '#',
    objectSub: 'Question: Will the contract involve covered defense information?',
    details: 'A custom rule uses a system question that was retired',
    actions: [
      { label: 'Open rule', tone: 'ACCENT' },
      { label: 'Deactivate rule', tone: 'NEGATIVE' },
    ],
  },
  {
    id: 'na2',
    kind: 'Rule',
    objectName: 'Copy of FAR 52.219-14 Limitations on Subcontracting Inclusion',
    objectLink: '#',
    objectSub: 'Question: Is the contract set aside for small business?',
    details: 'A custom rule uses a response that was removed',
    actions: [
      { label: 'Open rule', tone: 'ACCENT' },
      { label: 'Deactivate rule', tone: 'NEGATIVE' },
    ],
    actionNote: 'Depends on response IDs (Open Question 4)',
  },
  {
    id: 'na3',
    kind: 'Questionnaire',
    objectName: 'Work Hazards',
    objectLink: '#',
    details: 'A custom questionnaire contains a retired system question',
    actions: [{ label: 'Open questionnaire', tone: 'ACCENT' }],
  },
  {
    id: 'na4',
    kind: 'Question',
    objectName: 'Will the work be performed outside the United States?',
    objectLink: '#',
    details: 'A library question conflicts with the duplicate-question check',
    actions: [{ label: 'Open both', tone: 'ACCENT' }],
    actionNote: 'Same label, responses and response type',
  },
  {
    id: 'na5',
    kind: 'Rule',
    objectName: 'DFARS 252.225-7001 Buy American and Balance of Payments Program Inclusion',
    objectLink: '#',
    details: 'An item failed to import',
    actions: [],
    actionNote: 'None; retry the import',
  },
]

/** A row in the "New rules" tab. */
export interface NewRuleItem {
  id: string
  name: string
  status: 'Active' | 'Inactive'
  conditions: string
  includedClauses: number
  excludedClauses: number
}

export const newRuleItems: NewRuleItem[] = [
  {
    id: 'nr1',
    name: 'FAR 52.219-9 Alt II Small Business Subcontracting Plan Inclusion',
    status: 'Active',
    conditions: '3 conditions · 1 group',
    includedClauses: 1,
    excludedClauses: 0,
  },
  {
    id: 'nr2',
    name: 'FAR 52.222-50 Combating Trafficking in Persons Inclusion',
    status: 'Active',
    conditions: '2 conditions',
    includedClauses: 1,
    excludedClauses: 0,
  },
  {
    id: 'nr3',
    name: 'FAR 52.232-40 Providing Accelerated Payments to Small Business Subcontractors Inclusion',
    status: 'Active',
    conditions: '1 condition',
    includedClauses: 1,
    excludedClauses: 0,
  },
]

/** A row in the "All changes" tab. */
export interface AllChangeItem {
  id: string
  objectType: 'Rule' | 'Question' | 'Response' | 'Questionnaire placement'
  change: ChangeType
  name: string
  /** Clause number for Rule rows, shown in its own column. */
  clause?: string
  /** Optional sub-line shown under the item name. */
  sub?: string
  version: string
}

export const allChangeItems: AllChangeItem[] = [
  {
    id: 'ac1',
    objectType: 'Rule',
    change: 'Created',
    name: 'Small Business Subcontracting Inclusion',
    clause: 'FAR 52.219-9 Alt II',
    version: '4.1.2',
  },
  {
    id: 'ac2',
    objectType: 'Rule',
    change: 'Updated',
    name: 'Basic Safeguarding of Covered Contractor Information Systems Inclusion',
    clause: 'FAR 52.204-21',
    sub: 'New rule version written; past clause sets unaffected',
    version: '4.1.0 → 4.1.2',
  },
  {
    id: 'ac3',
    objectType: 'Rule',
    change: 'Updated',
    name: 'Limitations on Subcontracting Inclusion',
    clause: 'FAR 52.219-14',
    sub: 'Stays deactivated (deactivated by you)',
    version: '4.1.0 → 4.1.2',
  },
  {
    id: 'ac4',
    objectType: 'Rule',
    change: 'Retired',
    name: 'Compliance with Safeguarding Covered Defense Information Controls Inclusion',
    clause: 'DFARS 252.204-7008',
    sub: 'Deactivated, not deleted',
    version: '4.1.2',
  },
  {
    id: 'ac5',
    objectType: 'Question',
    change: 'Retired',
    name: 'Will the contract involve covered defense information?',
    version: '4.1.2',
  },
  {
    id: 'ac6',
    objectType: 'Response',
    change: 'Retired',
    name: 'Is the contract set aside for small business? - Partial set-aside',
    version: '4.1.2',
  },
  {
    id: 'ac7',
    objectType: 'Questionnaire placement',
    change: 'Created',
    name: 'OOTB Library Questionnaire > Contract Basics > Will the work be performed outside the United States?',
    version: '4.1.2',
  },
]

/** A row in the "Copies with newer source" tab. */
export interface CopyWithNewerSourceItem {
  id: string
  copyName: string
  sourceName: string
  copiedAtVersion: string
  sourceNowAt: string
}

export const copiesWithNewerSourceItems: CopyWithNewerSourceItem[] = [
  {
    id: 'cs1',
    copyName: 'Copy of FAR 52.219-14 Limitations on Subcontracting Inclusion',
    sourceName: 'FAR 52.219-14 Limitations on Subcontracting Inclusion',
    copiedAtVersion: '4.1.0',
    sourceNowAt: '4.1.2',
  },
  {
    id: 'cs2',
    copyName: 'Will the prime contractor subcontract more than 50% of the work?',
    sourceName: 'Will the prime contractor subcontract any portion of the work?',
    copiedAtVersion: '4.1.0',
    sourceNowAt: '4.1.2',
  },
]
