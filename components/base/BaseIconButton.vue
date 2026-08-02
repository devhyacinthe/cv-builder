<script setup lang="ts">
import type { IconName } from '~/constants/icons'

withDefaults(defineProps<{ icon: IconName; label: string; danger?: boolean; disabled?: boolean }>(), {
  danger: false,
  disabled: false,
})
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :title="label"
    :disabled="disabled"
    class="grid h-8 w-8 place-items-center rounded-md text-muted transition-all duration-150 hover:bg-canvas hover:text-ink active:scale-95 disabled:pointer-events-none disabled:opacity-30"
    :class="danger && 'hover:bg-danger/5 hover:text-danger'"
  >
    <BaseIcon :name="icon" :size="16" />
  </button>
</template>
