import { createId } from '~/utils/id'
import { today } from '~/utils/date'
import type { CvDocument } from '~/schemas/document'
import type { Letter } from '~/schemas/letter'
import type {
  Certification,
  Education,
  Experience,
  Language,
  Profile,
  Project,
  Publication,
  Skill,
  SkillCategory,
  SocialLink,
} from '~/schemas/profile'

/**
 * Fabriques d'entités vides. Chaque champ du modèle est initialisé ici :
 * un formulaire n'a donc jamais à gérer de valeur `undefined`.
 */

export const createSocialLink = (patch: Partial<SocialLink> = {}): SocialLink => ({
  id: createId(),
  platform: 'other',
  label: '',
  url: '',
  ...patch,
})

export const createExperience = (patch: Partial<Experience> = {}): Experience => ({
  id: createId(),
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  highlights: [],
  technologies: [],
  ...patch,
})

export const createEducation = (patch: Partial<Education> = {}): Education => ({
  id: createId(),
  institution: '',
  degree: '',
  field: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  highlights: [],
  ...patch,
})

export const createProject = (patch: Partial<Project> = {}): Project => ({
  id: createId(),
  name: '',
  context: '',
  description: '',
  technologies: [],
  results: [],
  startDate: '',
  endDate: '',
  repositoryUrl: '',
  demoUrl: '',
  documentationUrl: '',
  ...patch,
})

export const createSkill = (patch: Partial<Skill> = {}): Skill => ({
  id: createId(),
  name: '',
  level: 3,
  ...patch,
})

export const createSkillCategory = (patch: Partial<SkillCategory> = {}): SkillCategory => ({
  id: createId(),
  name: '',
  kind: 'technical',
  skills: [],
  ...patch,
})

export const createLanguage = (patch: Partial<Language> = {}): Language => ({
  id: createId(),
  name: '',
  level: '',
  certification: '',
  ...patch,
})

export const createCertification = (patch: Partial<Certification> = {}): Certification => ({
  id: createId(),
  name: '',
  issuer: '',
  date: '',
  url: '',
  ...patch,
})

export const createPublication = (patch: Partial<Publication> = {}): Publication => ({
  id: createId(),
  title: '',
  authors: '',
  venue: '',
  date: '',
  url: '',
  ...patch,
})

export const createCvDocument = (patch: Partial<CvDocument> = {}): CvDocument => ({
  id: createId(),
  name: 'Mon CV',
  templateId: 'ats-classic',
  accent: '#1e3a5f',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  exportedAt: '',
  hiddenIds: [],
  hiddenSections: [],
  ...patch,
})

/** Formule de politesse par défaut : la plus neutre du registre professionnel. */
export const DEFAULT_CLOSING =
  'Dans l’attente de votre réponse, je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.'

export const createLetter = (patch: Partial<Letter> = {}): Letter => ({
  id: createId(),
  name: 'Ma lettre',
  templateId: 'classic',
  accent: '#1e3a5f',
  cvId: '',
  recipient: { company: '', contact: '', address: '', city: '' },
  position: '',
  reference: '',
  subject: '',
  place: '',
  date: today(),
  salutation: 'Madame, Monsieur,',
  body: { introduction: '', profile: '', skills: '', motivation: '', conclusion: '' },
  closing: DEFAULT_CLOSING,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  exportedAt: '',
  ...patch,
})

export const createProfile = (): Profile => ({
  personal: {
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    nationality: '',
    birthDate: '',
    drivingLicence: '',
    photo: '',
    links: [],
  },
  summary: { headline: '', content: '', objective: '' },
  experiences: [],
  educations: [],
  projects: [],
  skillCategories: [],
  languages: [],
  certifications: [],
  publications: [],
  interests: [],
})
