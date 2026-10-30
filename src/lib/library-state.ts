/**
 * In-session "is the library installed?" flag for the prototype.
 *
 * This is a plain module-level variable on purpose:
 *   - It survives client-side route changes (wouter navigation), so once an
 *     import "completes" the nav keeps taking you to the installed view.
 *   - It is NOT persisted to localStorage/sessionStorage, so a hard browser
 *     refresh resets it back to the "not installed" empty state.
 *
 * When the real backend is wired up, replace these helpers with a query of
 * the actual library-installed record and delete this file.
 */

let libraryInstalled = false

/** Where the left-nav "Library" item should go, based on install state. */
export const LIBRARY_EMPTY_ROUTE = '/library'
export const LIBRARY_INSTALLED_ROUTE = '/library-option-3'

export function isLibraryInstalled(): boolean {
  return libraryInstalled
}

/** Call this when an import finishes (prototype stand-in for a real import). */
export function markLibraryInstalled(): void {
  libraryInstalled = true
}

/** The route the "Library" nav item should resolve to right now. */
export function libraryNavRoute(): string {
  return libraryInstalled ? LIBRARY_INSTALLED_ROUTE : LIBRARY_EMPTY_ROUTE
}
