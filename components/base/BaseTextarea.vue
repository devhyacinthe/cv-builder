<script setup lang="ts">
const model = defineModel<string>({ default: '' })

withDefaults(defineProps<{ rows?: number }>(), { rows: 4 })
</script>

<template>
  <textarea v-model="model" :rows="rows" class="field-control resize-y leading-relaxed" />
</template>
