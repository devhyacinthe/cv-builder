<script setup lang="ts">
import { completionItems, completionScore } from '~/utils/profileStats'

const profileStore = useProfileStore()

const items = computed(() => completionItems(profileStore.profile))
const score = computed(() => completionScore(items.value))

/** Le remplissage porte la sévérité ; le libellé la répète, jamais la couleur seule. */
const state = computed(() => {
  if (score.value >= 70) return { color: 'var(--color-status-good)', label: 'Profil prêt à exporter' }
  if (score.value >= 40) return { color: 'var(--color-status-warning)', label: 'Profil à compléter' }
  return { color: 'var(--color-status-critical)', label: 'Profil incomplet' }
})

const revealed = ref(false)
onMounted(() => requestAnimationFrame(() => (revealed.value = true)))
</script>

<template>
  <section class="rounded-lg border border-line bg-surface p-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs tracking-wide text-muted uppercase">Complétude du profil</p>
        <p class="mt-1 text-5xl leading-none font-semibold tracking-tight">
          {{ score }}<span class="text-2xl text-muted">%</span>
        </p>
      </div>
      <p class="text-sm text-muted">{{ state.label }}</p>
    </div>

    <div
      class="mt-5 h-2.5 w-full overflow-hidden rounded-full"
      :style="{ backgroundColor: `color-mix(in oklab, ${state.color} 18%, white)` }"
      role="progressbar"
      :aria-valuenow="score"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="h-full rounded-full transition-[width,background-color] duration-700 ease-soft"
        :style="{ width: revealed ? `${score}%` : '0%', backgroundColor: state.color }"
      />
    </div>

    <ul class="mt-6 grid gap-x-6 gap-y-2 sm:grid-cols-2">
      <li v-for="(item, index) in items" :key="item.label" class="animate-rise" :style="{ animationDelay: `${index * 45}ms` }">
        <NuxtLink
          :to="item.to"
          class="group flex items-center gap-2.5 rounded-md py-1 text-sm transition-colors"
          :class="item.done ? 'text-muted' : 'text-ink'"
        >
          <span
            class="grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors duration-200"
            :class="item.done ? 'bg-success/10 text-success' : 'bg-canvas text-muted group-hover:bg-brand-soft group-hover:text-brand'"
          >
            <BaseIcon :name="item.done ? 'check' : 'plus'" :size="12" />
          </span>
          <span class="transition-transform duration-200 group-hover:translate-x-0.5" :class="{ 'line-through decoration-line': item.done }">
            {{ item.label }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
