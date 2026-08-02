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

/** « 28 ans » à partir d'une date de naissance au mois près. */
export function age(birthDate: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(birthDate)
  if (!match) return ''
  const now = new Date()
  const months = (now.getFullYear() - Number(match[1])) * 12 + (now.getMonth() + 1 - Number(match[2]))
  const years = Math.floor(months / 12)
  return years > 0 ? `${years} ans` : ''
}

/** « 3 ans 4 mois », « 8 mois », « — ». */
export function formatDuration(months: number): string {
  if (months <= 0) return '—'
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts = [years > 0 ? `${years} an${years > 1 ? 's' : ''}` : '', rest > 0 ? `${rest} mois` : '']
  return parts.filter(Boolean).join(' ')
}

/** Horodatage d'un document (« 2 août 2026 », heure comprise si demandée). */
export function formatStamp(iso: string, withTime = false): string {
  if (!iso) return ''
  const options: Intl.DateTimeFormatOptions = withTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'medium' }
  return new Intl.DateTimeFormat('fr-FR', options).format(new Date(iso))
}

/** Date en toutes lettres pour l'en-tête d'une lettre : « 2 août 2026 ». */
export function formatLongDate(isoDay: string): string {
  const date = isoDay ? new Date(`${isoDay}T00:00:00`) : new Date()
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

/** Jour courant au format « 2026-08-02 », valeur attendue par un champ date. */
export const today = (): string => new Date().toISOString().slice(0, 10)

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
