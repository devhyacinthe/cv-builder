import LetterClassic from '~/components/letter/templates/LetterClassic.vue'
import LetterModern from '~/components/letter/templates/LetterModern.vue'
import LetterResearch from '~/components/letter/templates/LetterResearch.vue'

/**
 * Registre des modèles de lettre. Comme pour les CV, ajouter un modèle consiste
 * à créer son composant puis à l'inscrire ici : rien d'autre ne change.
 */
export interface LetterTemplate {
  id: string
  name: string
  description: string
  tags: string[]
  component: Component
}

export const letterTemplates: LetterTemplate[] = [
  {
    id: 'classic',
    name: 'Classique professionnel',
    description: 'Disposition postale, objet souligné d’un filet. Le format attendu partout.',
    tags: ['Grandes entreprises', 'Administrations', 'Candidature classique'],
    component: LetterClassic,
  },
  {
    id: 'modern',
    name: 'Moderne',
    description: 'En-tête typographique, objet dans un bloc coloré, texte aéré.',
    tags: ['Entreprises privées', 'Start-up', 'Communication'],
    component: LetterModern,
  },
  {
    id: 'research',
    name: 'Académique / Recherche',
    description: 'Empattements, en-tête centré, marges larges et paragraphes indentés.',
    tags: ['Laboratoires', 'Universités', 'Stage recherche'],
    component: LetterResearch,
  },
]

export const findLetterTemplate = (id: string): LetterTemplate =>
  letterTemplates.find((template) => template.id === id) ?? letterTemplates[0]!

/** Formules d'appel courantes ; le champ reste librement modifiable. */
export const salutationPresets = [
  'Madame, Monsieur,',
  'Madame,',
  'Monsieur,',
  'Madame la Directrice,',
  'Monsieur le Directeur,',
  'Madame, Monsieur les membres du jury,',
]

/** Formules de politesse, de la plus neutre à la plus déférente. */
export const closingPresets = [
  'Dans l’attente de votre réponse, je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.',
  'Je vous prie d’agréer, Madame, Monsieur, l’expression de ma considération distinguée.',
  'Restant à votre disposition, je vous prie de croire, Madame, Monsieur, en l’assurance de mon profond respect.',
  'Vous remerciant de l’attention portée à ma candidature, je vous prie d’agréer mes sincères salutations.',
]
