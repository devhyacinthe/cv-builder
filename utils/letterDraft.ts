import type { Profile } from '~/schemas/profile'
import type { Letter, LetterBody } from '~/schemas/letter'
import { formatPeriod } from '~/utils/date'

/**
 * Brouillon de lettre composé à partir du profil.
 *
 * Rien n'est inventé : chaque phrase reprend une information déjà saisie. Le
 * texte reste un point de départ à retravailler — le seul passage réellement
 * personnel est signalé entre crochets. Cette fonction est pure : elle sera le
 * point de branchement d'une assistance rédactionnelle plus poussée.
 */

/** Énumération naturelle : « Spark, Kafka et Docker ». */
const enumerate = (items: string[]): string =>
  items.length > 1 ? `${items.slice(0, -1).join(', ')} et ${items.at(-1)}` : (items[0] ?? '')

/** Première phrase d'un texte : de quoi amorcer un paragraphe sans tout recopier. */
function firstSentence(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, ' ')
  const end = trimmed.search(/[.!?](\s|$)/)
  return (end === -1 ? trimmed : trimmed.slice(0, end)).replace(/[.!?]+$/, '')
}

const lowerFirst = (text: string) => (text ? text.charAt(0).toLowerCase() + text.slice(1) : '')

/** Élision devant une voyelle : « de Atelier » devient « d'Atelier ». */
const of = (name: string) => (/^[aeiouyàâéèêëîïôöûüh]/i.test(name) ? `d’${name}` : `de ${name}`)

const sentences = (...parts: string[]) => parts.filter(Boolean).join(' ')

/** Compétences les plus maîtrisées, toutes catégories techniques confondues. */
function topSkills(profile: Profile, limit: number): string[] {
  return profile.skillCategories
    .filter((category) => category.kind === 'technical')
    .flatMap((category) => category.skills)
    .filter((skill) => skill.name)
    .sort((a, b) => b.level - a.level)
    .slice(0, limit)
    .map((skill) => skill.name)
}

export function draftBody(profile: Profile, letter: Letter): LetterBody {
  const { personal, summary } = profile
  const company = letter.recipient.company
  const position = letter.position || personal.title
  const target = position ? `au poste ${of(position)}` : 'à votre offre'
  const at = company ? ` au sein ${of(company)}` : ''

  const skills = topSkills(profile, 4)
  const experience = profile.experiences[0]
  const education = profile.educations[0]
  const project = profile.projects[0]

  return {
    introduction: sentences(
      personal.title
        ? `Actuellement ${personal.title}, je vous adresse ma candidature ${target}${at}.`
        : `Je vous adresse ma candidature ${target}${at}.`,
      letter.reference
        ? `Votre annonce ${letter.reference} a retenu mon attention : elle rejoint précisément le parcours que je construis.`
        : `Votre structure a retenu mon attention : elle rejoint précisément le parcours que je construis.`,
    ),

    profile: sentences(
      education
        ? `Ma formation en ${education.field || education.degree}${
            education.institution ? ` à ${education.institution}` : ''
          } m'a permis de consolider des bases solides sur les plans théorique et pratique.`
        : '',
      skills.length ? `Je travaille aujourd'hui principalement avec ${enumerate(skills)}.` : '',
      summary.headline || firstSentence(summary.content)
        ? `${summary.headline || firstSentence(summary.content)}.`
        : '',
    ),

    skills: sentences(
      experience
        ? `Mon expérience ${of(experience.position)}${experience.company ? ` chez ${experience.company}` : ''}${
            formatPeriod(experience) ? ` (${formatPeriod(experience)})` : ''
          } en est l'illustration : ${lowerFirst(firstSentence(experience.description || experience.highlights[0] || ''))}.`
        : '',
      experience?.highlights[0] && experience.description
        ? `${firstSentence(experience.highlights[0])}.`
        : '',
      project
        ? `J'y ajoute le projet ${project.name}, ${lowerFirst(firstSentence(project.description))}${
            project.technologies.length ? `, mené avec ${enumerate(project.technologies)}` : ''
          }.`
        : '',
    ),

    motivation: sentences(
      `${company ? `Rejoindre ${company}` : 'Rejoindre votre équipe'} représenterait l'occasion de mettre ces compétences au service de projets concrets et exigeants.`,
      '[À compléter : ce qui vous attire précisément ici — les technologies employées, les projets menés, les valeurs de l’entreprise.]',
    ),

    conclusion: sentences(
      'Je me tiens à votre disposition pour un entretien au cours duquel je pourrai détailler mon parcours et ma motivation.',
    ),
  }
}
