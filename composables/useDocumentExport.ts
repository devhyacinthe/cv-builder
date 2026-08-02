/**
 * Export PDF, commun aux CV et aux lettres.
 *
 * Le document est rendu dans une page dédiée puis confié au moteur
 * d'impression du navigateur : le PDF obtenu contient du vrai texte
 * sélectionnable — donc lisible par les ATS — sans aucune dépendance.
 */
export function useDocumentExport() {
  const router = useRouter()
  const documentStore = useDocumentStore()
  const letterStore = useLetterStore()

  const openPrintView = (query: Record<string, string>) => {
    const href = router.resolve({ path: '/impression', query }).href
    window.open(href, '_blank', 'noopener')
  }

  function exportCv(id: string): void {
    documentStore.markExported(id)
    openPrintView({ cv: id })
  }

  function exportLetter(id: string): void {
    letterStore.markExported(id)
    openPrintView({ lettre: id })
  }

  return { exportCv, exportLetter }
}
