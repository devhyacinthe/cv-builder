<script setup lang="ts">
import type { IconName } from '~/constants/icons'

defineProps<{ label: string; value: string | number; hint?: string; icon: IconName }>()
</script>

<template>
  <div
    class="rounded-lg border border-line bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
  >
    <div class="flex items-center gap-2 text-muted">
      <BaseIcon :name="icon" :size="16" />
      <p class="text-xs">{{ label }}</p>
    </div>
    <p class="mt-2 text-2xl font-semibold tracking-tight">{{ value }}</p>
    <p v-if="hint" class="mt-0.5 text-xs text-muted">{{ hint }}</p>
  </div>
</template>
