import type { InjectionKey } from 'vue'

export interface PaperFitState {
  /** Facteur de densité appliqué au document, 1 = taille nominale. */
  zoom: number
  /** Vrai quand le contenu déborde malgré la densité minimale. */
  overflowing: boolean
}

/** La feuille remonte son état d'ajustement à qui l'affiche (aperçu, analyse). */
export const paperFitKey = Symbol('paper-fit') as InjectionKey<(state: PaperFitState) => void>

/**
 * Reçoit l'état d'ajustement de la feuille rendue dans le sous-arbre.
 *
 * Le rapport est relayé au récepteur parent éventuel : un aperçu imbriqué dans
 * une page qui écoute elle aussi ne prive pas cette dernière de l'information.
 */
export function usePaperFitReporter() {
  const parent = inject(paperFitKey, null)
  const state = ref<PaperFitState>({ zoom: 1, overflowing: false })

  provide(paperFitKey, (next: PaperFitState) => {
    state.value = next
    parent?.(next)
  })

  return state
}
