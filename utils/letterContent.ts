import type { Letter } from '~/schemas/letter'
import { letterBlocks } from '~/schemas/letter'
import type { PersonalInfo } from '~/schemas/profile'
import { formatLongDate } from '~/utils/date'
import { fullName } from '~/utils/cvContent'

/**
 * Accesseurs partagés par les modèles de lettre. Ils composent le texte
 * effectivement lu — objet, adresses, paragraphes — sans porter de décision
 * visuelle : chaque modèle reste libre de sa mise en page.
 */

/** Une ligne vide sépare deux paragraphes ; les lignes seules sont recollées. */
export const paragraphs = (text: string): string[] =>
  text
    .split(/\n\s*\n/)
    .map((block) => block.trim().replace(/\s*\n\s*/g, ' '))
    .filter(Boolean)

/** Corps complet, dans l'ordre des blocs. Un bloc vide ne laisse aucun trou. */
export const letterParagraphs = (letter: Letter): string[] =>
  letterBlocks.flatMap((block) => paragraphs(letter.body[block.key]))

/** Bloc expéditeur : identité puis coordonnées, une information par ligne. */
export const senderLines = (personal: PersonalInfo): string[] =>
  [personal.location, personal.phone, personal.email].filter(Boolean)

/** Bloc destinataire, dans l'ordre postal. */
export const recipientLines = (letter: Letter): string[] =>
  [letter.recipient.company, letter.recipient.contact, letter.recipient.address, letter.recipient.city].filter(
    Boolean,
  )

/** « Douala, le 2 août 2026 » — ou simplement la date si le lieu manque. */
export function placeAndDate(letter: Letter): string {
  const date = formatLongDate(letter.date)
  if (!date) return ''
  return letter.place ? `${letter.place}, le ${date}` : `Le ${date}`
}

/** L'objet saisi, ou celui que la candidature implique. */
export function letterSubject(letter: Letter): string {
  if (letter.subject) return letter.subject
  return letter.position ? `Candidature au poste de ${letter.position}` : 'Candidature spontanée'
}

export const letterSignature = (letter: Letter, personal: PersonalInfo): string =>
  fullName(personal) || letter.name
