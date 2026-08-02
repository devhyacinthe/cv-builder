<script setup lang="ts">
const model = defineModel<boolean>({ default: false })

defineProps<{ label: string }>()
</script>

<template>
  <label class="inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink select-none">
    <span
      class="grid h-4.5 w-4.5 place-items-center rounded border transition-all duration-150"
      :class="model ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-transparent'"
    >
      <BaseIcon name="check" :size="12" />
    </span>
    <input v-model="model" type="checkbox" class="sr-only" />
    {{ label }}
  </label>
</template>
