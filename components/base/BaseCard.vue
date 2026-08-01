<script setup lang="ts">
defineProps<{ title?: string; description?: string }>()
</script>

<template>
  <section class="rounded-lg border border-line bg-surface">
    <header
      v-if="title || $slots.actions"
      class="flex items-start justify-between gap-4 border-b border-line px-5 py-4"
    >
      <div>
        <h2 class="text-sm font-semibold tracking-tight text-ink">{{ title }}</h2>
        <p v-if="description" class="mt-0.5 text-xs text-muted">{{ description }}</p>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </header>
    <div class="px-5 py-4">
      <slot />
    </div>
  </section>
</template>
