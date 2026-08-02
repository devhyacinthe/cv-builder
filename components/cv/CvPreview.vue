<script setup lang="ts">
import type { Profile } from '~/schemas/profile'
import type { CvDocument } from '~/schemas/document'
import { findTemplate } from '~/constants/cvTemplates'

/**
 * Prévisualisation fidèle : la feuille est rendue à sa taille réelle puis mise
 * à l'échelle pour tenir dans le panneau. Aucun recalcul de mise en page —
 * ce qui est affiché correspond exactement à ce qui sera imprimé.
 */
const props = defineProps<{ profile: Profile; document: CvDocument }>()

const template = computed(() => findTemplate(props.document.templateId))

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

watch([fit, zoom, () => props.document.templateId], () => nextTick(measure))

function setZoom(value: number) {
  fit.value = false
  zoom.value = Math.min(1.5, Math.max(0.4, Number(value.toFixed(2))))
}

const percentage = computed(() => Math.round(scale.value * 100))
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
      <p class="truncate text-xs text-muted">{{ template.name }} · A4</p>

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
        <div
          ref="paper"
          class="paper origin-top-left shadow-lg"
          :style="{ transform: `scale(${scale})` }"
        >
          <component :is="template.component" :profile="profile" :accent="document.accent" />
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
