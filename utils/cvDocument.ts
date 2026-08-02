import type { CvDocument } from '~/schemas/document'
import type { Profile } from '~/schemas/profile'

/** Rubriques qu'un document peut masquer, dans l'ordre de l'éditeur. */
export const documentSections = [
  { key: 'summary', label: 'Résumé professionnel' },
  { key: 'experiences', label: 'Expériences' },
  { key: 'educations', label: 'Formations' },
  { key: 'projects', label: 'Projets' },
  { key: 'skills', label: 'Compétences' },
  { key: 'languages', label: 'Langues' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'publications', label: 'Publications' },
  { key: 'interests', label: "Centres d'intérêt" },
] as const

/**
 * Applique les masquages d'un document au profil.
 *
 * Les templates reçoivent ainsi un profil déjà filtré : ils n'ont aucune
 * notion de document, et la sélection des entrées visibles reste au même
 * endroit pour tous les modèles.
 */
export function documentProfile(profile: Profile, document: CvDocument): Profile {
  const hiddenIds = new Set(document.hiddenIds)
  const hidden = new Set(document.hiddenSections)

  const keep = <T extends { id: string }>(items: T[], section: string): T[] =>
    hidden.has(section) ? [] : items.filter((item) => !hiddenIds.has(item.id))

  return {
    personal: profile.personal,
    summary: hidden.has('summary') ? { ...profile.summary, content: '' } : profile.summary,
    experiences: keep(profile.experiences, 'experiences'),
    educations: keep(profile.educations, 'educations'),
    projects: keep(profile.projects, 'projects'),
    skillCategories: keep(profile.skillCategories, 'skills'),
    languages: keep(profile.languages, 'languages'),
    certifications: keep(profile.certifications, 'certifications'),
    publications: keep(profile.publications, 'publications'),
    interests: hidden.has('interests') ? [] : profile.interests,
  }
}

/** Entrées masquables d'un document, regroupées par rubrique. */
export function hideableEntries(profile: Profile) {
  return [
    { section: 'experiences', label: 'Expériences', items: profile.experiences.map((item) => ({ id: item.id, label: [item.position, item.company].filter(Boolean).join(' · ') })) },
    { section: 'educations', label: 'Formations', items: profile.educations.map((item) => ({ id: item.id, label: [item.degree, item.institution].filter(Boolean).join(' · ') })) },
    { section: 'projects', label: 'Projets', items: profile.projects.map((item) => ({ id: item.id, label: item.name })) },
    { section: 'skills', label: 'Compétences', items: profile.skillCategories.map((item) => ({ id: item.id, label: item.name })) },
  ].filter((group) => group.items.length > 0)
}
