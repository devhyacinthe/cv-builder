import type { InjectionKey } from 'vue'

export interface CvFitState {
  /** Facteur de densité appliqué au document, 1 = taille nominale. */
  zoom: number
  /** Vrai quand le contenu déborde malgré la densité minimale. */
  overflowing: boolean
}

/** La feuille remonte son état d'ajustement à qui l'affiche (aperçu, éditeur). */
export const cvFitKey = Symbol('cv-fit') as InjectionKey<(state: CvFitState) => void>

/** Reçoit l'état d'ajustement de la feuille rendue dans le sous-arbre. */
export function useCvFitReporter() {
  const state = ref<CvFitState>({ zoom: 1, overflowing: false })
  provide(cvFitKey, (next: CvFitState) => (state.value = next))
  return state
}
