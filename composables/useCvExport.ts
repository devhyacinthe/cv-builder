/**
 * Export PDF.
 *
 * Le document est rendu dans une page dédiée puis confié au moteur
 * d'impression du navigateur : le PDF obtenu contient du vrai texte
 * sélectionnable — donc lisible par les ATS — sans aucune dépendance.
 */
export function useCvExport() {
  const router = useRouter()
  const documentStore = useDocumentStore()

  function exportCv(id: string): void {
    documentStore.markExported(id)
    const href = router.resolve({ path: '/impression', query: { cv: id } }).href
    window.open(href, '_blank', 'noopener')
  }

  return { exportCv }
}
