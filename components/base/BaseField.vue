<script setup lang="ts">
defineProps<{ label?: string; hint?: string; error?: string; required?: boolean }>()

/** Identifiant transmis au contrôle via le slot pour lier le `<label>`. */
const controlId = useId()
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" :for="controlId" class="block text-sm font-medium text-ink">
      {{ label }}<span v-if="required" class="text-danger"> *</span>
    </label>
    <slot :id="controlId" />
    <p v-if="error" class="text-xs text-danger">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-muted">{{ hint }}</p>
  </div>
</template>
