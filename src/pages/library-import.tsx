import { useState, type DragEvent } from 'react'
import { useLocation } from 'wouter'
import {
  HeadingField,
  RichTextDisplayField,
  TextItem,
  CardLayout,
  ButtonWidget,
  Icon,
  FieldLabel,
  FileCard,
  MessageBanner,
} from '@pglevy/sailwind'
import LibraryShell from '../components/library-shell'

/**
 * The library version currently installed in this environment. In the real
 * flow this comes from a system record; here it's a constant so we can
 * compare it against the version metadata of the package the user picks.
 */
const INSTALLED_VERSION = '4.1.0'

/**
 * Stand-in JSON payload used in this prototype. The real import flow would
 * take whatever JSON the user downloaded from Forum; this just lets us skip
 * the OS file picker and jump to the summary.
 */
const MOCK_PACKAGE = {
  manifest: {
    name: 'GCA Library',
    version: '4.1.2',
    previousVersion: '4.1.0',
    farDfarsBaseline: 'FAC 2025-06',
    minimumGcaVersion: '4.1',
  },
  counts: {
    rules: 1141,
    questions: 402,
    responses: 1036,
    questionnairePlacements: 402,
  },
}

/**
 * Second stand-in payload — this one is older than the installed version,
 * so picking it exercises the "older-version rejected" error state.
 */
const OLDER_MOCK_PACKAGE = {
  manifest: {
    name: 'GCA Library',
    version: '4.0.9',
    previousVersion: '4.0.8',
    farDfarsBaseline: 'FAC 2024-11',
    minimumGcaVersion: '4.0',
  },
  counts: {
    rules: 1098,
    questions: 391,
    responses: 998,
    questionnairePlacements: 391,
  },
}

/**
 * Third stand-in payload — same version as the installed one. Picking it
 * exercises the "already installed, re-import is a no-op" info state.
 */
const SAME_MOCK_PACKAGE = {
  manifest: {
    name: 'GCA Library',
    version: INSTALLED_VERSION,
    previousVersion: '4.0.9',
    farDfarsBaseline: 'FAC 2025-04',
    minimumGcaVersion: '4.1',
  },
  counts: {
    rules: 1121,
    questions: 395,
    responses: 1020,
    questionnairePlacements: 395,
  },
}

/**
 * The GCA platform version this environment runs. Compared against a
 * package's minimumGcaVersion to catch "needs a newer platform" packages.
 */
const ENVIRONMENT_GCA_VERSION = '4.1'

/**
 * Package-level problems that block the import entirely (distinct from the
 * version-compare cases, which are derived from manifest.version).
 *  - NEEDS_NEWER_GCA  : package requires a GCA platform newer than this env
 *  - CORRUPT          : file is incomplete / unparseable / damaged
 *  - IMPORT_RUNNING   : another import is already in progress
 */
type PackageProblem = 'NEEDS_NEWER_GCA' | 'CORRUPT' | 'IMPORT_RUNNING'

/** A package that requires GCA 4.2+, newer than this environment's 4.1. */
const NEEDS_NEWER_GCA_PACKAGE = {
  manifest: {
    name: 'GCA Library',
    version: '4.2.0',
    previousVersion: '4.1.2',
    farDfarsBaseline: 'FAC 2026-01',
    minimumGcaVersion: '4.2',
  },
  counts: { rules: 1200, questions: 420, responses: 1050, questionnairePlacements: 420 },
}

/** Build a File-like object with sample JSON contents. */
function makeMockFile(
  pkg: Record<string, unknown> = MOCK_PACKAGE,
  name = 'gca-library-4.1.2.json'
): File {
  const body = JSON.stringify(pkg, null, 2)
  return new File([body], name, { type: 'application/json' })
}

/** Pre-made older-version mock, for the demo-only "simulate older" link. */
function makeOlderMockFile(): File {
  return makeMockFile(OLDER_MOCK_PACKAGE, 'gca-library-4.0.9.json')
}

/** Pre-made same-version mock, for the demo-only "simulate same" link. */
function makeSameMockFile(): File {
  return makeMockFile(SAME_MOCK_PACKAGE, `gca-library-${INSTALLED_VERSION}.json`)
}

/** Package that needs a newer GCA platform than this environment runs. */
function makeNeedsNewerGcaFile(): File {
  return makeMockFile(NEEDS_NEWER_GCA_PACKAGE, 'gca-library-4.2.0.json')
}

/** A corrupt/incomplete package: valid .json name, but the body isn't parseable. */
function makeCorruptFile(): File {
  const body = '{ "manifest": { "name": "GCA Library", "versio' // truncated on purpose
  return new File([body], 'gca-library-corrupt.json', { type: 'application/json' })
}

/**
 * A valid package, but one that should be rejected because an import is
 * already running. We tag the manifest so the handler can flag it; the
 * version itself is fine.
 */
function makeImportRunningFile(): File {
  return makeMockFile(
    { ...MOCK_PACKAGE, manifest: { ...MOCK_PACKAGE.manifest, importRunning: true } },
    'gca-library-4.1.2.json'
  )
}

/**
 * Compare two dotted version strings numerically.
 * Returns < 0 if a is older than b, 0 if equal, > 0 if newer.
 */
function compareVersions(a: string, b: string): number {
  const as = a.split('.').map(n => parseInt(n, 10))
  const bs = b.split('.').map(n => parseInt(n, 10))
  const len = Math.max(as.length, bs.length)
  for (let i = 0; i < len; i++) {
    const ai = Number.isFinite(as[i]) ? as[i] : 0
    const bi = Number.isFinite(bs[i]) ? bs[i] : 0
    if (ai !== bi) return ai - bi
  }
  return 0
}

/**
 * Demo-only cycle. "Choose file" rotates through these six mocks so you can
 * walk through every state by clicking the button, clearing between each
 * click via the file card's X:
 *   1. happy (newer)         2. older (blocked)       3. same (info)
 *   4. needs newer GCA       5. corrupt/damaged       6. import in progress
 */
const MOCK_CYCLE: Array<() => File> = [
  () => makeMockFile(),           // 1 — 4.1.2 newer, happy
  () => makeOlderMockFile(),      // 2 — 4.0.9 older, blocked
  () => makeSameMockFile(),       // 3 — 4.1.0 same, info only
  () => makeNeedsNewerGcaFile(),  // 4 — needs GCA 4.2+, blocked
  () => makeCorruptFile(),        // 5 — corrupt/damaged, blocked
  () => makeImportRunningFile(),  // 6 — import already running, blocked
]

export default function LibraryImport() {
  const [, setLocation] = useLocation()
  const [file, setFile] = useState<File | null>(null)
  const [fileVersion, setFileVersion] = useState<string | null>(null)
  const [problem, setProblem] = useState<PackageProblem | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadAttempts, setUploadAttempts] = useState(0)

  const versionCompare =
    fileVersion ? compareVersions(fileVersion, INSTALLED_VERSION) : null
  const isTooOld = versionCompare !== null && versionCompare < 0
  const isSameVersion = versionCompare !== null && versionCompare === 0

  // Any blocking condition: an older version, or one of the package problems.
  const isBlocked = isTooOld || problem !== null

  const handleFile = async (f: File | null | undefined) => {
    if (!f) return
    if (!f.name.toLowerCase().endsWith('.json')) {
      alert('Please select a .json file.')
      return
    }
    setFile(f)

    // Peek inside the package. A parse failure means the file is corrupt /
    // incomplete; otherwise read the manifest to detect the other problems.
    try {
      const text = await f.text()
      const parsed = JSON.parse(text)
      const manifest = parsed?.manifest ?? {}

      const v = typeof manifest.version === 'string' ? manifest.version : null
      setFileVersion(v)

      if (manifest.importRunning === true) {
        setProblem('IMPORT_RUNNING')
      } else if (
        typeof manifest.minimumGcaVersion === 'string' &&
        compareVersions(manifest.minimumGcaVersion, ENVIRONMENT_GCA_VERSION) > 0
      ) {
        setProblem('NEEDS_NEWER_GCA')
      } else {
        setProblem(null)
      }
    } catch {
      // Unparseable JSON → treat as a corrupt / damaged package.
      setFileVersion(null)
      setProblem('CORRUPT')
    }
  }

  const clearFile = () => {
    setFile(null)
    setFileVersion(null)
    setProblem(null)
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    // Use whatever file the user drops; if nothing lands, fall back to the mock.
    const dropped = e.dataTransfer.files?.[0]
    handleFile(dropped ?? makeMockFile())
  }

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => setIsDragging(false)

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
            <RichTextDisplayField
              value={[
                <TextItem
                  key="required-note"
                  text="Required fields are marked with an asterisk (*)."
                  color="SECONDARY"
                  size="STANDARD"
                />,
              ]}
              marginBelow="NONE"
            />
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            <HeadingField
              text="Upload package"
              size="MEDIUM"
              headingTag="H2"
              fontWeight="SEMI_BOLD"
              marginBelow="STANDARD"
            />

            {/* Step 1 — Download the package from Forum */}
            <div className="relative flex gap-4 pb-6">
              {/* Connector line to Step 2 */}
              <div
                aria-hidden="true"
                className="absolute left-4 top-10 bottom-0 w-px bg-gray-200 -translate-x-px"
              />
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center relative z-10">
                1
              </div>
              <div className="flex-1 min-w-0">
                <HeadingField
                  text="Download the package"
                  size="SMALL"
                  headingTag="H3"
                  fontWeight="SEMI_BOLD"
                  marginBelow="EVEN_LESS"
                />
                <RichTextDisplayField
                  value={[
                    <TextItem
                      key="s1-desc"
                      text="Get the latest JSON package from the Appian Forum."
                      color="SECONDARY"
                      size="STANDARD"
                    />,
                  ]}
                  marginBelow="LESS"
                />
                <ButtonWidget
                  label="Forum download page"
                  style="OUTLINE"
                  color="ACCENT"
                  icon="ExternalLink"
                  iconPosition="END"
                  onClick={() =>
                    alert('Opening Forum download page in a new tab (not wired up in this prototype).')
                  }
                />
              </div>
            </div>

            {/* Step 2 — Library package upload */}
            <div className="relative flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center relative z-10">
                2
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <FieldLabel label="Library package" required />

                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  className={`mt-2 border-2 border-dashed rounded-lg transition-colors ${
                    isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  {file ? (
                    <div className="p-6 flex justify-center">
                      <FileCard
                        fileName={file.name}
                        fileSize={file.size}
                        fileType="JSON"
                        showRemove={true}
                        onRemove={clearFile}
                        maxWidth="420px"
                      />
                    </div>
                  ) : (
                    <div className="py-10 flex flex-col items-center gap-3">
                      <Icon icon="UploadCloud" size="LARGE" color="ACCENT" />
                      <RichTextDisplayField
                        value={[
                          <TextItem
                            key="drop"
                            text="Drop the package here or"
                            color="SECONDARY"
                            size="STANDARD"
                          />,
                        ]}
                        marginBelow="EVEN_LESS"
                      />
                      <ButtonWidget
                        label="Choose file"
                        style="OUTLINE"
                        color="ACCENT"
                        onClick={() => {
                          const nextIdx = uploadAttempts % MOCK_CYCLE.length
                          setUploadAttempts(uploadAttempts + 1)
                          handleFile(MOCK_CYCLE[nextIdx]())
                        }}
                      />
                    </div>
                  )}
                </div>

                {isTooOld && (
                  <div className="mt-3">
                    <MessageBanner
                      primaryText={`This package is version ${fileVersion}.`}
                      secondaryText={`Version ${INSTALLED_VERSION} is installed. Older versions can't be imported.`}
                      backgroundColor="ERROR"
                      highlightColor="NEGATIVE"
                      icon="error"
                      showDecorativeBar={true}
                    />
                  </div>
                )}

                {isSameVersion && !problem && (
                  <div className="mt-3">
                    <MessageBanner
                      primaryText={`Version ${INSTALLED_VERSION} is already installed.`}
                      secondaryText="Importing it again makes no changes."
                      backgroundColor="INFO"
                      highlightColor="INFO"
                      icon="info"
                      showDecorativeBar={true}
                    />
                  </div>
                )}

                {problem === 'NEEDS_NEWER_GCA' && (
                  <div className="mt-3">
                    <MessageBanner
                      primaryText="This package needs GCA 4.2 or later."
                      secondaryText="This environment runs GCA 4.1."
                      backgroundColor="ERROR"
                      highlightColor="NEGATIVE"
                      icon="error"
                      showDecorativeBar={true}
                    />
                  </div>
                )}

                {problem === 'CORRUPT' && (
                  <div className="mt-3">
                    <MessageBanner
                      primaryText="The package is incomplete or damaged."
                      secondaryText="Download it again from Forum."
                      backgroundColor="ERROR"
                      highlightColor="NEGATIVE"
                      icon="error"
                      showDecorativeBar={true}
                    />
                  </div>
                )}

                {problem === 'IMPORT_RUNNING' && (
                  <div className="mt-3">
                    <MessageBanner
                      primaryText="An import process is currently running."
                      secondaryText="Please wait until that process has completed and try again."
                      backgroundColor="ERROR"
                      highlightColor="NEGATIVE"
                      icon="error"
                      showDecorativeBar={true}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-200 flex items-center justify-between">
            <ButtonWidget
              label="Cancel"
              style="LINK"
              color="ACCENT"
              onClick={() => setLocation('/library')}
            />
            <ButtonWidget
              label="Next"
              style="SOLID"
              color="ACCENT"
              disabled={!file || isBlocked}
              onClick={() => setLocation('/library/import/confirm')}
            />
          </div>
        </CardLayout>
      </div>
    </LibraryShell>
  )
}
