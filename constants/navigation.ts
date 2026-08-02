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
  { label: 'Mes CV', to: '/cv', icon: 'document', enabled: true },
  { label: 'Lettres de motivation', to: '/lettres', icon: 'mail', enabled: true },
  { label: 'Historique', to: '/historique', icon: 'book', enabled: true },
  { label: 'Analyse ATS', to: '/analyse', icon: 'chart', enabled: true },
  { label: 'Mes données', to: '/donnees', icon: 'archive', enabled: true },
]
