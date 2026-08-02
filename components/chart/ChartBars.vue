<script setup lang="ts">
import type { DataPoint } from '~/utils/profileStats'

/**
 * Barres horizontales, série unique : comparaison de grandeurs.
 * Série unique = pas de légende, la valeur est écrite au bout de chaque barre.
 */
const props = withDefaults(defineProps<{ data: DataPoint[]; empty?: string }>(), {
  empty: 'Aucune donnée pour le moment.',
})

const max = computed(() => Math.max(1, ...props.data.map((point) => point.value)))
const total = computed(() => props.data.reduce((sum, point) => sum + point.value, 0))

const share = (value: number) => (total.value ? Math.round((value / total.value) * 100) : 0)

// Les barres poussent depuis zéro au premier rendu.
const revealed = ref(false)
onMounted(() => requestAnimationFrame(() => (revealed.value = true)))
</script>

<template>
  <p v-if="!data.length" class="py-6 text-center text-sm text-muted">{{ empty }}</p>

  <div v-else class="space-y-3">
    <div
      v-for="(point, index) in data"
      :key="point.label"
      class="group -mx-2 rounded-md px-2 py-1 transition-colors duration-150 hover:bg-canvas"
    >
      <div class="flex items-baseline justify-between gap-3">
        <span class="truncate text-sm text-ink">{{ point.label }}</span>
        <span class="shrink-0 text-xs text-muted">
          <span class="tabular-nums">{{ point.value }}</span>
          <span class="ml-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            · {{ share(point.value) }} %
          </span>
        </span>
      </div>
      <div class="mt-1.5 h-2">
        <div
          class="h-2 rounded-r-sm bg-series-1 transition-[width] duration-700 ease-soft"
          :style="{
            width: revealed ? `${(point.value / max) * 100}%` : '0%',
            transitionDelay: `${index * 60}ms`,
          }"
        />
      </div>
    </div>

    <table class="sr-only">
      <caption>
        Données du graphique
      </caption>
      <tbody>
        <tr v-for="point in data" :key="point.label">
          <th scope="row">{{ point.label }}</th>
          <td>{{ point.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
