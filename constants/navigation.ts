export interface NavItem {
  label: string
  to: string
  /** Les entrées désactivées correspondent aux modules des phases suivantes. */
  enabled: boolean
}

export const navigation: NavItem[] = [
  { label: 'Tableau de bord', to: '/', enabled: true },
  { label: 'Profil', to: '/profil', enabled: false },
  { label: 'Mes CV', to: '/cv', enabled: false },
  { label: 'Lettres de motivation', to: '/lettres', enabled: false },
  { label: 'Analyse ATS', to: '/analyse', enabled: false },
]
