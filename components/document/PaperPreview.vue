<script setup lang="ts">
/**
 * Prévisualisation fidèle d'un document : la feuille est rendue à sa taille
 * réelle puis mise à l'échelle pour tenir dans le panneau. Aucun recalcul de
 * mise en page — ce qui est affiché correspond exactement à ce qui sera imprimé.
 */
defineProps<{ label: string }>()

/** État de l'ajustement « une seule page » remonté par la feuille. */
const fitState = usePaperFitReporter()

/** Élément de mesure : sa largeur est exactement la place disponible. */
const ruler = useTemplateRef<HTMLElement>('ruler')
const paper = useTemplateRef<HTMLElement>('paper')

const fit = ref(true)
const zoom = ref(1)
/** Largeur d'une feuille A4 en pixels CSS (210 mm à 96 dpi). */
const A4_WIDTH = (210 * 96) / 25.4

const scale = ref(1)
const scaledSize = reactive({ width: 0, height: 0 })

function measure() {
  const available = ruler.value?.clientWidth ?? 0
  if (!available) return
  scale.value = fit.value ? Math.min(1, available / A4_WIDTH) : zoom.value
  scaledSize.width = A4_WIDTH * scale.value
  scaledSize.height = (paper.value?.offsetHeight ?? 0) * scale.value
}

onMounted(() => {
  const observer = new ResizeObserver(measure)
  if (ruler.value) observer.observe(ruler.value)
  if (paper.value) observer.observe(paper.value)
  // Le contenu du modèle (photo, polices) peut arriver après le premier rendu.
  measure()
  requestAnimationFrame(measure)
  onBeforeUnmount(() => observer.disconnect())
})

// Un changement de modèle modifie la hauteur de la feuille : l'observateur s'en charge.
watch([fit, zoom], () => nextTick(measure))

function setZoom(value: number) {
  fit.value = false
  zoom.value = Math.min(1.5, Math.max(0.4, Number(value.toFixed(2))))
}

const percentage = computed(() => Math.round(scale.value * 100))
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
      <div class="flex min-w-0 items-center gap-2">
        <p class="truncate text-xs text-muted">{{ label }} · A4</p>
        <span
          class="shrink-0 rounded-full px-2 py-0.5 text-[11px] transition-colors duration-200"
          :class="fitState.overflowing ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'"
          :title="
            fitState.overflowing
              ? 'Retirez des entrées ou raccourcissez vos textes.'
              : `Contenu resserré à ${Math.round(fitState.zoom * 100)} % pour tenir sur une page.`
          "
        >
          {{ fitState.overflowing ? 'Dépasse une page' : '1 page' }}
        </span>
      </div>

      <div class="flex items-center gap-1">
        <BaseIconButton icon="minus" label="Réduire" @click="setZoom(scale - 0.1)" />
        <button
          type="button"
          class="min-w-14 rounded-md px-2 py-1 text-xs text-muted tabular-nums transition-colors hover:bg-canvas hover:text-ink"
          @click="fit = !fit"
        >
          {{ fit ? 'Ajusté' : `${percentage} %` }}
        </button>
        <BaseIconButton icon="plus" label="Agrandir" @click="setZoom(scale + 0.1)" />
        <slot name="actions" />
      </div>
    </div>

    <div class="flex-1 overflow-auto bg-canvas p-5">
      <div ref="ruler" class="h-0" />
      <div class="mx-auto" :style="{ width: `${scaledSize.width}px`, height: `${scaledSize.height}px` }">
        <div ref="paper" class="paper origin-top-left shadow-lg" :style="{ transform: `scale(${scale})` }">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Repère visuel des changements de page, hors du document lui-même. */
.paper {
  position: relative;
  width: max-content;
}

.paper::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent calc(297mm - 1px),
    rgba(0, 0, 0, 0.18) calc(297mm - 1px),
    rgba(0, 0, 0, 0.18) 297mm
  );
}
</style>
