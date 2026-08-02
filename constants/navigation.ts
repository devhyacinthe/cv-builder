import type { IconName } from '~/constants/icons'

export interface NavItem {
  label: string
  to: string
  icon: IconName
  /** Les entrées désactivées correspondent aux modules des phases suivantes. */
  enabled: boolean
}

export const navigation: NavItem[] = [
  { label: 'Tableau de bord', to: '/', icon: 'dashboard', enabled: true },
  { label: 'Profil', to: '/profil', icon: 'user', enabled: true },
  { label: 'Mes CV', to: '/cv', icon: 'document', enabled: false },
  { label: 'Lettres de motivation', to: '/lettres', icon: 'mail', enabled: false },
  { label: 'Analyse ATS', to: '/analyse', icon: 'chart', enabled: false },
]
