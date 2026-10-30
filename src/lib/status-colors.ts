/**
 * Shared status-tone palette driven by Sailwind design tokens.
 *
 * Previously five different files (components/question-status-tag.tsx,
 * pages/rule-review.tsx, pages/library-option-2.tsx,
 * pages/library-option-3.tsx, pages/library-import-summary.tsx,
 * pages/library-import-confirm.tsx) each declared their own hardcoded
 * {bg, fg, border} lookup, using Tailwind-palette hex values that drift
 * from Sailwind's palette (e.g. #991B1B, #DBEAFE). This module replaces
 * all five with a single tone-based palette whose hex values mirror
 * Sailwind tokens exactly — each entry carries a comment with the
 * token path for traceability (see @pglevy/sailwind/dist/theme.css).
 *
 * Callers that need a direct bg/fg/border mapping use `tonePalette`.
 * Callers whose "logical status" (e.g. "Approved", "Failed") implies a
 * tone resolve it via `toneForStatus` and then look up `tonePalette`.
 */

export type StatusTone = 'POSITIVE' | 'WARN' | 'NEGATIVE' | 'INFO' | 'NEUTRAL'

export const tonePalette: Record<
  StatusTone,
  { bg: string; fg: string; border: string }
> = {
  POSITIVE: {
    bg: '#EDF7EE' /* token: color.green.50 */,
    fg: '#357A38' /* token: color.green.700 */,
    border: '#A6D7A8' /* token: color.green.200 */,
  },
  WARN: {
    bg: '#FFF4C8' /* token: color.yellow.100 */,
    fg: '#806D24' /* token: color.yellow.800 */,
    border: '#FFECA4' /* token: color.yellow.200 */,
  },
  NEGATIVE: {
    bg: '#FCE6EB' /* token: color.red.50 */,
    fg: '#9B0027' /* token: color.red.700 */,
    border: '#EF809B' /* token: color.red.200 */,
  },
  INFO: {
    bg: '#E9E9FE' /* token: color.blue.50 */,
    fg: '#1918A8' /* token: color.blue.700 */,
    border: '#9191F8' /* token: color.blue.200 */,
  },
  NEUTRAL: {
    bg: '#EEEEEE' /* token: color.gray.200 */,
    fg: '#424242' /* token: color.gray.800 */,
    border: '#BDBDBD' /* token: color.gray.400 */,
  },
}
