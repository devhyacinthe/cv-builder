<script setup lang="ts">
import { paperFitKey } from '~/composables/usePaperFit'

/**
 * Feuille A4, partagée par les CV et les lettres de motivation.
 * Seul composant à connaître les dimensions physiques du document.
 *
 * Il assure aussi la règle d'or : **tenir sur une seule page**. Le contenu est
 * resserré automatiquement jusqu'à une densité plancher ; les textes se
 * recomposent (aucune déformation), et au-delà du plancher la feuille signale
 * le débordement pour que l'utilisateur retire des entrées.
 */
defineProps<{ accent: string }>()

const A4_HEIGHT = (297 * 96) / 25.4
/** En dessous, le texte deviendrait trop petit pour être lu confortablement. */
const MIN_ZOOM = 0.72

const page = useTemplateRef<HTMLElement>('page')
const content = useTemplateRef<HTMLElement>('content')

const report = inject(paperFitKey, null)

let busy = false

function fit() {
  const article = page.value
  const inner = content.value
  if (!article || !inner) return

  // Mesure à densité nominale, puis application du facteur retenu.
  inner.style.zoom = '1'
  inner.style.setProperty('--paper-height', '297mm')

  const styles = getComputedStyle(article)
  const padding = Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom)
  const available = A4_HEIGHT - padding
  const natural = inner.scrollHeight

  const zoom = Math.min(1, Math.max(MIN_ZOOM, available / natural))
  inner.style.zoom = String(zoom)
  inner.style.setProperty('--paper-height', `calc((297mm - ${padding}px) / ${zoom})`)
  // Le fond de page, peint hors du contenu resserré, doit suivre le même facteur.
  article.style.setProperty('--paper-zoom', String(zoom))

  report?.({ zoom, overflowing: natural * zoom > available + 1 })
}

/** Un ajustement modifie la taille observée : la boucle converge en deux passes. */
function schedule() {
  if (busy) return
  busy = true
  requestAnimationFrame(() => {
    fit()
    busy = false
  })
}

onMounted(() => {
  const observer = new ResizeObserver(schedule)
  if (content.value) observer.observe(content.value)
  fit()
  onBeforeUnmount(() => observer.disconnect())
})
</script>

<template>
  <article ref="page" class="paper-sheet" :style="{ '--paper-accent': accent }">
    <div ref="content" class="paper-content">
      <slot />
    </div>
  </article>
</template>

<style scoped>
.paper-sheet {
  box-sizing: border-box;
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  color: #1a1a1a;
  /* Les tailles sont exprimées en points : ce qui est vu est ce qui est imprimé. */
  font-size: 10pt;
  line-height: 1.45;
}
</style>
