import type { IconName } from '~/constants/icons'
import type { Profile } from '~/schemas/profile'
import { skillCount } from '~/utils/profileStats'
import IdentitySection from '~/components/profile/IdentitySection.vue'
import SummarySection from '~/components/profile/SummarySection.vue'
import ExperienceSection from '~/components/profile/ExperienceSection.vue'
import EducationSection from '~/components/profile/EducationSection.vue'
import ProjectSection from '~/components/profile/ProjectSection.vue'
import SkillsSection from '~/components/profile/SkillsSection.vue'
import LanguagesSection from '~/components/profile/LanguagesSection.vue'
import CredentialsSection from '~/components/profile/CredentialsSection.vue'

/**
 * Sections de l'éditeur de profil. Partagées par la page « Profil » et le
 * panneau d'édition en direct de la page « Mes CV » : un seul formulaire,
 * deux contextes d'affichage.
 */
export interface ProfileSection {
  key: string
  label: string
  icon: IconName
  component: Component
  count?: (profile: Profile) => number
}

export const profileSections: ProfileSection[] = [
  { key: 'identite', label: 'Identité', icon: 'user', component: IdentitySection },
  { key: 'resume', label: 'Résumé', icon: 'document', component: SummarySection },
  {
    key: 'experiences',
    label: 'Expériences',
    icon: 'briefcase',
    component: ExperienceSection,
    count: (profile) => profile.experiences.length,
  },
  {
    key: 'formations',
    label: 'Formations',
    icon: 'graduation',
    component: EducationSection,
    count: (profile) => profile.educations.length,
  },
  {
    key: 'projets',
    label: 'Projets',
    icon: 'code',
    component: ProjectSection,
    count: (profile) => profile.projects.length,
  },
  { key: 'competences', label: 'Compétences', icon: 'star', component: SkillsSection, count: skillCount },
  {
    key: 'langues',
    label: 'Langues',
    icon: 'globe',
    component: LanguagesSection,
    count: (profile) => profile.languages.length,
  },
  {
    key: 'certifications',
    label: 'Certifications',
    icon: 'award',
    component: CredentialsSection,
    count: (profile) => profile.certifications.length + profile.publications.length,
  },
]

export const findSection = (key: string): ProfileSection =>
  profileSections.find((section) => section.key === key) ?? profileSections[0]!
