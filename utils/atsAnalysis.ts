import type { Profile } from '~/schemas/profile'
import type { CvTemplate } from '~/constants/cvTemplates'

/**
 * Analyse de compatibilité ATS — fonctions pures.
 *
 * Trois axes indépendants : la structure du document, sa lisibilité, et la
 * correspondance avec une offre d'emploi. Aucune règle n'est cachée : chaque
 * contrôle explique ce qu'il attend, pour que le score reste actionnable.
 */

export type CheckLevel = 'ok' | 'warn' | 'error'

export interface AtsCheck {
  label: string
  level: CheckLevel
  detail: string
  /** Poids dans le score de l'axe. */
  weight: number
}

const check = (level: CheckLevel, label: string, detail: string, weight = 1): AtsCheck => ({
  label,
  level,
  detail,
  weight,
})

const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

/** Tout le texte du CV, mis bout à bout pour les analyses globales. */
export function profileText(profile: Profile): string {
  return [
    profile.personal.title,
    profile.summary.headline,
    profile.summary.content,
    profile.summary.objective,
    ...profile.experiences.flatMap((item) => [
      item.position,
      item.company,
      item.description,
      ...item.highlights,
      ...item.technologies,
    ]),
    ...profile.educations.flatMap((item) => [item.degree, item.field, item.institution, item.description, ...item.highlights]),
    ...profile.projects.flatMap((item) => [item.name, item.context, item.description, ...item.results, ...item.technologies]),
    ...profile.skillCategories.flatMap((category) => [category.name, ...category.skills.map((skill) => skill.name)]),
    ...profile.languages.map((language) => `${language.name} ${language.level}`),
    ...profile.certifications.map((certification) => `${certification.name} ${certification.issuer}`),
    ...profile.interests,
  ]
    .filter(Boolean)
    .join('\n')
}

export function structureChecks(profile: Profile, template: CvTemplate): AtsCheck[] {
  const { personal, summary } = profile
  const datedExperiences = profile.experiences.filter((item) => item.startDate)
  const skillCount = profile.skillCategories.reduce((total, category) => total + category.skills.length, 0)

  return [
    personal.email && personal.phone
      ? check('ok', 'Coordonnées complètes', 'Email et téléphone sont détectables.', 2)
      : check('error', 'Coordonnées incomplètes', 'Un ATS rejette un CV sans email ni téléphone exploitables.', 2),

    personal.title
      ? check('ok', 'Titre professionnel', 'Le poste visé apparaît en tête du CV.', 2)
      : check('error', 'Titre professionnel absent', 'Ajoutez un intitulé de poste : c’est le premier champ indexé.', 2),

    summary.content.trim().length >= 150
      ? check('ok', 'Résumé professionnel', 'Le résumé donne du contexte aux mots-clés.', 1)
      : check('warn', 'Résumé trop court', 'Visez 60 à 90 mots pour couvrir vos domaines d’expertise.', 1),

    datedExperiences.length === profile.experiences.length && profile.experiences.length > 0
      ? check('ok', 'Expériences datées', 'Toutes les expériences ont une date de début.', 2)
      : check(
          profile.experiences.length ? 'error' : 'warn',
          'Dates d’expérience manquantes',
          'Une expérience sans date n’est pas prise en compte dans le calcul d’ancienneté.',
          2,
        ),

    profile.educations.length
      ? check('ok', 'Formation renseignée', 'La rubrique formation est présente.', 1)
      : check('warn', 'Formation absente', 'La plupart des ATS attendent une rubrique formation.', 1),

    skillCount >= 6
      ? check('ok', 'Compétences listées', `${skillCount} compétences indexables.`, 2)
      : check('warn', 'Trop peu de compétences', 'Listez au moins six compétences pour couvrir les recherches.', 2),

    template.atsSafety === 'excellente'
      ? check('ok', `Modèle « ${template.name} »`, 'Structure linéaire, lecture automatique sans risque.', 1)
      : check(
          'warn',
          `Modèle « ${template.name} »`,
          'Colonne latérale : la lecture reste correcte mais un modèle en colonne unique est plus sûr.',
          1,
        ),
  ]
}

export function readabilityChecks(profile: Profile, overflowing: boolean): AtsCheck[] {
  const total = words(profileText(profile))
  const longBullets = profile.experiences
    .flatMap((item) => item.highlights)
    .filter((highlight) => highlight.length > 220).length
  const emptyExperiences = profile.experiences.filter(
    (item) => !item.description.trim() && item.highlights.length === 0,
  ).length

  return [
    !overflowing
      ? check('ok', 'Tient sur une page', 'Le document est resserré pour occuper exactement une page.', 2)
      : check('error', 'Dépasse une page', 'Masquez des entrées ou raccourcissez vos descriptions.', 2),

    total >= 300 && total <= 750
      ? check('ok', 'Volume de texte adapté', `${total} mots, dans la fourchette attendue.`, 2)
      : check(
          total < 300 ? 'warn' : 'warn',
          total < 300 ? 'CV trop léger' : 'CV trop dense',
          total < 300
            ? `${total} mots : détaillez vos réalisations pour dépasser 300 mots.`
            : `${total} mots : au-delà de 750, l’essentiel se dilue.`,
          2,
        ),

    emptyExperiences === 0
      ? check('ok', 'Expériences décrites', 'Chaque expérience porte un contenu.', 2)
      : check('error', 'Expériences vides', `${emptyExperiences} expérience(s) sans description ni réalisation.`, 2),

    longBullets === 0
      ? check('ok', 'Puces concises', 'Aucune réalisation ne dépasse deux lignes.', 1)
      : check('warn', 'Puces trop longues', `${longBullets} réalisation(s) de plus de 220 caractères.`, 1),

    profile.experiences.some((item) => item.highlights.some((highlight) => /\d/.test(highlight)))
      ? check('ok', 'Résultats chiffrés', 'Au moins une réalisation porte un chiffre.', 1)
      : check('warn', 'Aucun résultat chiffré', 'Un volume, un pourcentage ou un délai rend une réalisation crédible.', 1),
  ]
}

/** Score d'un axe : part des poids satisfaits, les avertissements comptant à moitié. */
export function axisScore(checks: AtsCheck[]): number {
  const total = checks.reduce((sum, item) => sum + item.weight, 0)
  if (!total) return 0
  const earned = checks.reduce(
    (sum, item) => sum + item.weight * (item.level === 'ok' ? 1 : item.level === 'warn' ? 0.5 : 0),
    0,
  )
  return Math.round((earned / total) * 100)
}

const STOP_WORDS = new Set(
  `au aux avec ce ces dans de des du elle en et eux il ils je la le les leur lui ma mais me meme mes moi mon ne nos notre nous on ou par pas pour qu que qui sa se ses son sur ta te tes toi ton tu un une vos votre vous c d j l a m n s t y ete etee etees etes etant suis es est sommes etes sont sera seront serait etait etaient soit soient ayant eu eue eues eus ai as avons avez ont aura auront aurait avait avaient plus tres bien tout tous toute toutes autre autres meme aussi ainsi donc alors chez entre sans sous vers lors afin quand comme dont notamment
the and for with you your our are was were will can that this from has have had not but their they them its it a an of to in on at as by or be is`
    .split(/\s+/)
    .filter(Boolean),
)

/** Normalisation sans accents ni casse : « Modèle » et « modele » sont un seul mot. */
const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

export interface KeywordMatch {
  word: string
  count: number
  present: boolean
}

/**
 * Compare une offre d'emploi au contenu du CV.
 * Les mots-clés retenus sont les termes significatifs les plus répétés de l'offre.
 */
export function matchOffer(profile: Profile, offer: string, limit = 24): KeywordMatch[] {
  const haystack = ` ${normalize(profileText(profile)).replace(/[^a-z0-9+#.]+/g, ' ')} `
  const counts = new Map<string, number>()

  for (const raw of normalize(offer).split(/[^a-z0-9+#.]+/)) {
    const word = raw.replace(/^[.]+|[.]+$/g, '')
    if (word.length < 3 || STOP_WORDS.has(word) || /^\d+$/.test(word)) continue
    counts.set(word, (counts.get(word) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word, count]) => ({ word, count, present: haystack.includes(` ${word} `) }))
}

export const keywordScore = (matches: KeywordMatch[]): number =>
  matches.length ? Math.round((matches.filter((match) => match.present).length / matches.length) * 100) : 0
