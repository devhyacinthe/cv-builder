import AtsClassic from '~/components/cv/templates/AtsClassic.vue'
import ModernProfessional from '~/components/cv/templates/ModernProfessional.vue'
import Engineer from '~/components/cv/templates/Engineer.vue'
import Academic from '~/components/cv/templates/Academic.vue'
import Executive from '~/components/cv/templates/Executive.vue'

/**
 * Registre des modèles de CV. Ajouter un modèle consiste à créer son composant
 * puis à l'inscrire ici : aucune autre partie de l'application ne change.
 */
export interface CvTemplate {
  id: string
  name: string
  description: string
  /** Compatibilité avec les analyseurs automatiques, du plus sûr au plus risqué. */
  atsSafety: 'excellente' | 'bonne' | 'moyenne'
  tags: string[]
  component: Component
}

export const cvTemplates: CvTemplate[] = [
  {
    id: 'ats-classic',
    name: 'ATS Classic',
    description: 'Une colonne, titres standards, aucune décoration. Le choix le plus sûr.',
    atsSafety: 'excellente',
    tags: ['Informatique', 'Ingénierie', 'Grandes entreprises'],
    component: AtsClassic,
  },
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Colonne latérale sombre, photo, colonne de dates. Hiérarchie visuelle marquée.',
    atsSafety: 'bonne',
    tags: ['Entreprises privées', 'Candidature classique'],
    component: ModernProfessional,
  },
  {
    id: 'engineer',
    name: 'Engineer',
    description: 'Stack technique en évidence, projets au même rang que les expériences.',
    atsSafety: 'bonne',
    tags: ['Développement', 'Data', 'Ingénierie'],
    component: Engineer,
  },
  {
    id: 'academic',
    name: 'Academic / Research',
    description: 'Typographie à empattements, formation et publications en premier.',
    atsSafety: 'excellente',
    tags: ['Recherche', 'Université', 'Doctorat'],
    component: Academic,
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Colonne unique aérée, accroche mise en avant, réalisations avant les tâches.',
    atsSafety: 'excellente',
    tags: ['Management', 'Conseil', 'Direction de projet'],
    component: Executive,
  },
]

export const findTemplate = (id: string): CvTemplate =>
  cvTemplates.find((template) => template.id === id) ?? cvTemplates[0]!

/** Accents proposés : teintes sobres, lisibles à l'impression noir et blanc. */
export const accentPresets = [
  { value: '#1e3a5f', label: 'Bleu nuit' },
  { value: '#1f4d3d', label: 'Vert profond' },
  { value: '#5b2333', label: 'Bordeaux' },
  { value: '#2f3337', label: 'Anthracite' },
  { value: '#8a5a1b', label: 'Ocre' },
]
