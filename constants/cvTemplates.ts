import AtsClassic from '~/components/cv/templates/AtsClassic.vue'
import ModernProfessional from '~/components/cv/templates/ModernProfessional.vue'
import Engineer from '~/components/cv/templates/Engineer.vue'
import Academic from '~/components/cv/templates/Academic.vue'
import Executive from '~/components/cv/templates/Executive.vue'
import Compact from '~/components/cv/templates/Compact.vue'
import Centered from '~/components/cv/templates/Centered.vue'
import Impact from '~/components/cv/templates/Impact.vue'
import Duo from '~/components/cv/templates/Duo.vue'

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
  {
    id: 'centered',
    name: 'Centré',
    description: 'Colonne unique, en-tête centré, compétences en grille. Très sûr côté ATS.',
    atsSafety: 'excellente',
    tags: ['Premier emploi', 'Stage', 'Candidature classique'],
    component: Centered,
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Bande latérale colorée étroite, compétences en grille, entrées denses.',
    atsSafety: 'bonne',
    tags: ['Stage', 'Alternance', 'Junior'],
    component: Compact,
  },
  {
    id: 'impact',
    name: 'Impact',
    description: 'Large colonne pleine couleur, identité affirmée, dates mises en valeur.',
    atsSafety: 'bonne',
    tags: ['Commerce', 'Communication', 'Création'],
    component: Impact,
  },
  {
    id: 'duo',
    name: 'Duo',
    description: 'Colonne sombre et coin d’accent, compétences en grille, contraste marqué.',
    atsSafety: 'bonne',
    tags: ['Polyvalent', 'Entreprises privées'],
    component: Duo,
  },
]

export const findTemplate = (id: string): CvTemplate =>
  cvTemplates.find((template) => template.id === id) ?? cvTemplates[0]!

/**
 * Accents proposés. Les teintes sobres conviennent aux modèles où l'accent
 * colore du texte ; les teintes vives sont faites pour les modèles à bande
 * colorée, où l'accent porte un aplat et non des caractères.
 */
export const accentPresets = [
  { value: '#1e3a5f', label: 'Bleu nuit' },
  { value: '#1f4d3d', label: 'Vert profond' },
  { value: '#5b2333', label: 'Bordeaux' },
  { value: '#2f3337', label: 'Anthracite' },
  { value: '#8a5a1b', label: 'Ocre' },
  { value: '#c0392b', label: 'Rouge' },
  { value: '#e07b39', label: 'Orange' },
  { value: '#6a9a3b', label: 'Vert' },
  { value: '#0f8b8d', label: 'Turquoise' },
]
