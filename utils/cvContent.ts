import type { IconName } from '~/constants/icons'
import type { PersonalInfo, Profile } from '~/schemas/profile'
import { age } from '~/utils/date'

/**
 * Petits accesseurs partagés par tous les templates. Ils ne portent aucune
 * décision visuelle : chaque modèle reste libre de sa mise en forme.
 */

export const fullName = (personal: PersonalInfo): string =>
  [personal.firstName, personal.lastName].filter(Boolean).join(' ')

/** Coordonnées prêtes à être affichées, dans l'ordre attendu par un recruteur. */
export const contactItems = (personal: PersonalInfo): string[] =>
  [personal.email, personal.phone, personal.location, ...personal.links.map((link) => link.label || link.url)].filter(
    Boolean,
  )

/** Les sections vides ne doivent jamais laisser de titre orphelin sur le CV. */
export const hasContent = (profile: Profile) => ({
  summary: profile.summary.content.trim().length > 0,
  experiences: profile.experiences.length > 0,
  educations: profile.educations.length > 0,
  projects: profile.projects.length > 0,
  skills: profile.skillCategories.some((category) => category.skills.length > 0),
  languages: profile.languages.length > 0,
  certifications: profile.certifications.length > 0,
  publications: profile.publications.length > 0,
})

export interface ContactLine {
  icon: IconName
  value: string
}

/** Bloc « Contact » des modèles à colonne latérale, icône comprise. */
export const contactLines = (personal: PersonalInfo): ContactLine[] =>
  (
    [
      { icon: 'phone', value: personal.phone },
      { icon: 'mail', value: personal.email },
      { icon: 'pin', value: personal.location },
      { icon: 'globe', value: personal.nationality },
      { icon: 'user', value: age(personal.birthDate) },
      { icon: 'award', value: personal.drivingLicence },
    ] satisfies ContactLine[]
  ).filter((line) => line.value)

/** Bloc « Liens » : libellé lisible plutôt qu'URL brute. */
export const socialLines = (personal: PersonalInfo): ContactLine[] =>
  personal.links
    .filter((link) => link.label || link.url)
    .map((link) => ({ icon: 'link' as IconName, value: link.label || link.url }))

export const skillNames = (skills: { name: string }[]): string =>
  skills
    .map((skill) => skill.name)
    .filter(Boolean)
    .join(', ')
