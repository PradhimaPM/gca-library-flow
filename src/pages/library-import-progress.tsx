import { useState } from 'react'
import { useLocation } from 'wouter'
import { HeadingField, CardLayout, ButtonWidget } from '@pglevy/sailwind'
import { RefreshCw, CheckCircle } from 'lucide-react'
import LibraryShell from '../components/library-shell'
import { markLibraryInstalled } from '../lib/library-state'

/**
 * Transient import-progress screen shown between Confirm and the Summary.
 * Starts in an "importing" state with a spinner. Clicking "Refresh status"
 * reveals the completed state (stand-in for polling a real background job).
 */
export default function LibraryImportProgress() {
  const [, setLocation] = useLocation()
  const [done, setDone] = useState(false)

  const handleRefresh = () => {
    setDone(true)
    // Mark installed once the import "finishes" so the nav's Library item
    // resolves to the installed view from here on (reset on hard refresh).
    markLibraryInstalled()
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
              marginBelow="NONE"
            />
          </div>

          {/* Status body */}
          <div className="px-8 py-16 flex flex-col items-center text-center">
            {done ? (
              <>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <HeadingField
                  text="Import complete"
                  size="MEDIUM"
                  headingTag="H2"
                  fontWeight="SEMI_BOLD"
                  align="CENTER"
                  marginBelow="EVEN_LESS"
                />
                <p className="text-sm text-gray-500 mb-5">
                  Version 4.1.0 is installed. The summary page will show you what changed.
                </p>
                <ButtonWidget
                  label="View summary"
                  style="SOLID"
                  color="ACCENT"
                  onClick={() => setLocation('/library/import/summary/with-steps')}
                />
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <RefreshCw className="text-indigo-600" size={24} />
                </div>
                <HeadingField
                  text="Package is importing"
                  size="MEDIUM"
                  headingTag="H2"
                  fontWeight="SEMI_BOLD"
                  align="CENTER"
                  marginBelow="EVEN_LESS"
                />
                <p className="text-sm text-gray-500 mb-5">
                  This can take a few minutes. We'll notify you once the import is done.
                </p>
                <ButtonWidget
                  label="Refresh status"
                  style="OUTLINE"
                  color="ACCENT"
                  icon="RefreshCw"
                  iconPosition="START"
                  onClick={handleRefresh}
                />
              </>
            )}
          </div>
        </CardLayout>
      </div>
    </LibraryShell>
  )
}
