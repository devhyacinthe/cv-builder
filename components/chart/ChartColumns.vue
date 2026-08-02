<script setup lang="ts">
import type { YearActivity } from '~/utils/profileStats'

/** Colonnes groupées par année : deux séries, donc une légende obligatoire. */
const props = withDefaults(defineProps<{ data: YearActivity[]; empty?: string }>(), {
  empty: 'Renseignez des périodes pour voir votre activité par année.',
})

const series = [
  { key: 'experiences', label: 'Expériences', color: 'var(--color-series-1)' },
  { key: 'projects', label: 'Projets', color: 'var(--color-series-2)' },
] as const

const max = computed(() =>
  Math.max(1, ...props.data.flatMap((year) => [year.experiences, year.projects])),
)

const height = (value: number) => (value === 0 ? 0 : Math.max(4, (value / max.value) * 100))

const hoveredYear = ref<number | null>(null)

const revealed = ref(false)
onMounted(() => requestAnimationFrame(() => (revealed.value = true)))
</script>

<template>
  <p v-if="!data.length" class="py-6 text-center text-sm text-muted">{{ empty }}</p>

  <div v-else>
    <ul class="mb-5 flex flex-wrap gap-x-5 gap-y-1">
      <li v-for="item in series" :key="item.key" class="flex items-center gap-2 text-xs text-muted">
        <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: item.color }" />
        {{ item.label }}
      </li>
    </ul>

    <div class="relative pt-6" @mouseleave="hoveredYear = null">
      <span class="absolute top-0 left-0 text-[11px] text-muted tabular-nums">{{ max }}</span>

      <div class="flex items-end gap-1 border-b border-grid">
        <div
          v-for="(year, index) in data"
          :key="year.year"
          class="relative flex flex-1 flex-col items-center"
          @mouseenter="hoveredYear = year.year"
        >
          <Transition name="fade">
            <div
              v-if="hoveredYear === year.year"
              class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-md border border-line bg-surface px-2.5 py-1.5 text-[11px] whitespace-nowrap shadow-sm"
            >
              <p class="font-medium">{{ year.year }}</p>
              <p v-for="item in series" :key="item.key" class="text-muted">
                {{ item.label }} : <span class="tabular-nums">{{ year[item.key] }}</span>
              </p>
            </div>
          </Transition>

          <div class="flex h-32 w-full items-end justify-center gap-0.5">
            <div
              v-for="(item, seriesIndex) in series"
              :key="item.key"
              class="w-6 rounded-t-sm transition-[height,opacity] duration-700 ease-soft"
              :style="{
                height: revealed ? `${height(year[item.key])}%` : '0%',
                backgroundColor: item.color,
                transitionDelay: `${index * 50 + seriesIndex * 40}ms`,
                opacity: hoveredYear === null || hoveredYear === year.year ? 1 : 0.45,
              }"
            />
          </div>
        </div>
      </div>

      <div class="mt-2 flex gap-1">
        <span
          v-for="year in data"
          :key="year.year"
          class="flex-1 text-center text-[11px] text-muted tabular-nums"
        >
          {{ year.year }}
        </span>
      </div>
    </div>

    <table class="sr-only">
      <caption>
        Activité par année
      </caption>
      <thead>
        <tr>
          <th>Année</th>
          <th v-for="item in series" :key="item.key">{{ item.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="year in data" :key="year.year">
          <th scope="row">{{ year.year }}</th>
          <td v-for="item in series" :key="item.key">{{ year[item.key] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
