<script setup lang="ts">
/** Niveau de maîtrise 1→5, rendu sous forme de barres par certains modèles de CV. */
const model = defineModel<number>({ default: 3 })

const labels = ['Notions', 'Débutant', 'Intermédiaire', 'Avancé', 'Expert']
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="flex gap-1">
      <button
        v-for="level in 5"
        :key="level"
        type="button"
        :aria-label="`Niveau ${level} : ${labels[level - 1]}`"
        class="h-2 w-5 rounded-full transition-all duration-200 hover:scale-y-150"
        :class="level <= model ? 'bg-brand' : 'bg-line'"
        @click="model = level"
      />
    </div>
    <span class="text-xs text-muted">{{ labels[model - 1] }}</span>
  </div>
</template>
