/**
 * Formatage des dates au mois près (« 2026-03 » → « Mars 2026 »).
 * Les templates affichent des périodes, jamais des dates brutes.
 */

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

export function formatMonth(value: string, style: 'short' | 'long' = 'short'): string {
  const match = /^(\d{4})-(\d{2})$/.exec(value)
  if (!match) return ''
  const date = new Date(Number(match[1]), Number(match[2]) - 1, 1)
  return capitalize(new Intl.DateTimeFormat('fr-FR', { month: style, year: 'numeric' }).format(date))
}

/** « 3 ans 4 mois », « 8 mois », « — ». */
export function formatDuration(months: number): string {
  if (months <= 0) return '—'
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts = [years > 0 ? `${years} an${years > 1 ? 's' : ''}` : '', rest > 0 ? `${rest} mois` : '']
  return parts.filter(Boolean).join(' ')
}

export interface Period {
  startDate: string
  endDate: string
  current?: boolean
}

/** « Juil. 2023 - Actuellement », « Sept. 2016 - Juin 2020 » ou « 2026 ». */
export function formatPeriod(period: Period, style: 'short' | 'long' = 'short'): string {
  const start = formatMonth(period.startDate, style)
  const end = period.current ? 'Actuellement' : formatMonth(period.endDate, style)
  if (start && end) return `${start} - ${end}`
  return start || end
}
