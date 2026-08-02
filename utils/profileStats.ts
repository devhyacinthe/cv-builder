import type { Profile } from '~/schemas/profile'

/**
 * Statistiques dérivées du profil — fonctions pures, sans dépendance à Vue :
 * le tableau de bord et l'analyse ATS s'appuieront sur les mêmes calculs.
 */

export interface CompletionItem {
  label: string
  done: boolean
  weight: number
  to: string
}

const MONTH_PATTERN = /^(\d{4})-(\d{2})$/

const toMonths = (value: string): number | null => {
  const match = MONTH_PATTERN.exec(value)
  return match ? Number(match[1]) * 12 + Number(match[2]) - 1 : null
}

const yearOf = (value: string): number | null => {
  const match = MONTH_PATTERN.exec(value)
  return match ? Number(match[1]) : null
}

const nowMonths = () => new Date().getFullYear() * 12 + new Date().getMonth()

/** Détail de complétude : sert aussi de liste d'actions sur le tableau de bord. */
export function completionItems(profile: Profile): CompletionItem[] {
  const { personal, summary } = profile
  return [
    {
      label: 'Identité complète',
      done: Boolean(personal.firstName && personal.lastName && personal.title && personal.email),
      weight: 20,
      to: '/profil?section=identite',
    },
    {
      label: 'Résumé professionnel',
      done: summary.content.trim().length >= 120,
      weight: 15,
      to: '/profil?section=resume',
    },
    {
      label: 'Au moins deux expériences détaillées',
      done: profile.experiences.filter((item) => item.highlights.length > 0).length >= 2,
      weight: 25,
      to: '/profil?section=experiences',
    },
    {
      label: 'Formation renseignée',
      done: profile.educations.length > 0,
      weight: 15,
      to: '/profil?section=formations',
    },
    {
      label: 'Projets techniques',
      done: profile.projects.length >= 2,
      weight: 10,
      to: '/profil?section=projets',
    },
    {
      label: 'Compétences classées',
      done: profile.skillCategories.some((category) => category.skills.length >= 3),
      weight: 10,
      to: '/profil?section=competences',
    },
    {
      label: 'Langues',
      done: profile.languages.length > 0,
      weight: 5,
      to: '/profil?section=langues',
    },
  ]
}

export function completionScore(items: CompletionItem[]): number {
  return items.reduce((total, item) => total + (item.done ? item.weight : 0), 0)
}

/** Durée cumulée des expériences, en mois. */
export function experienceMonths(profile: Profile): number {
  return profile.experiences.reduce((total, experience) => {
    const start = toMonths(experience.startDate)
    if (start === null) return total
    const end = experience.current ? nowMonths() : toMonths(experience.endDate)
    if (end === null || end < start) return total
    return total + (end - start + 1)
  }, 0)
}

export interface DataPoint {
  label: string
  value: number
}

export function skillsByCategory(profile: Profile): DataPoint[] {
  return profile.skillCategories
    .filter((category) => category.skills.length > 0)
    .map((category) => ({ label: category.name || 'Sans nom', value: category.skills.length }))
    .sort((a, b) => b.value - a.value)
}

/** Technologies les plus présentes, toutes expériences et projets confondus. */
export function topTechnologies(profile: Profile, limit = 6): DataPoint[] {
  const counts = new Map<string, number>()
  const collect = (technologies: string[]) => {
    for (const raw of technologies) {
      const name = raw.trim()
      if (name) counts.set(name, (counts.get(name) ?? 0) + 1)
    }
  }
  profile.experiences.forEach((experience) => collect(experience.technologies))
  profile.projects.forEach((project) => collect(project.technologies))

  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
    .slice(0, limit)
}

export interface YearActivity {
  year: number
  experiences: number
  projects: number
}

/** Nombre d'expériences et de projets actifs pour chaque année couverte. */
export function activityByYear(profile: Profile, maxYears = 8): YearActivity[] {
  const currentYear = new Date().getFullYear()
  const activity = new Map<number, YearActivity>()

  const register = (start: string, end: string, current: boolean, key: 'experiences' | 'projects') => {
    const from = yearOf(start)
    if (from === null) return
    const to = current ? currentYear : (yearOf(end) ?? from)
    for (let year = from; year <= Math.min(to, currentYear); year += 1) {
      const entry = activity.get(year) ?? { year, experiences: 0, projects: 0 }
      entry[key] += 1
      activity.set(year, entry)
    }
  }

  profile.experiences.forEach((item) => register(item.startDate, item.endDate, item.current, 'experiences'))
  profile.projects.forEach((item) => register(item.startDate, item.endDate, false, 'projects'))

  return [...activity.values()].sort((a, b) => a.year - b.year).slice(-maxYears)
}

/** Nombre total de compétences, toutes catégories confondues. */
export function skillCount(profile: Profile): number {
  return profile.skillCategories.reduce((total, category) => total + category.skills.length, 0)
}
