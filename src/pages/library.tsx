import { HeadingField, RichTextDisplayField, TextItem, CardLayout, ButtonWidget, Icon } from '@pglevy/sailwind'
import { useLocation } from 'wouter'
import LibraryShell from '../components/library-shell'

export default function Library() {
  const [, setLocation] = useLocation()

  return (
    <LibraryShell>
      {/* Page header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <HeadingField
          text="Library"
          size="LARGE"
          headingTag="H1"
          fontWeight="REGULAR"
          marginBelow="EVEN_LESS"
        />
        <RichTextDisplayField
          value={[
            <TextItem
              key="subtitle"
              text="Import and manage the OOTB Rules & Questions Library."
              color="SECONDARY"
              size="STANDARD"
            />,
          ]}
          marginBelow="NONE"
        />
      </header>

      {/* Empty state card — compact, centered */}
      <div className="px-8 py-12 flex justify-center">
        <div className="w-full max-w-2xl">
          <CardLayout padding="EVEN_MORE" showBorder={true} shape="SEMI_ROUNDED" style="STANDARD">
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-5">
                <Icon icon="BookOpen" size="LARGE" color="ACCENT" />
              </div>

              <HeadingField
                text="No library installed"
                size="MEDIUM"
                headingTag="H2"
                fontWeight="SEMI_BOLD"
                marginBelow="EVEN_LESS"
              />

              <RichTextDisplayField
                value={[
                  <TextItem
                    key="desc"
                    text="Import the library to get started."
                    color="SECONDARY"
                    size="STANDARD"
                  />,
                ]}
                marginBelow="STANDARD"
              />

              <ButtonWidget
                label="Import library"
                style="SOLID"
                color="ACCENT"
                icon="Upload"
                iconPosition="START"
                onClick={() => setLocation('/library/import')}
              />
            </div>
          </CardLayout>
        </div>
      </div>
    </LibraryShell>
  )
}
