<script setup lang="ts">
/**
 * Feuille A4. Seul composant à connaître les dimensions physiques du document :
 * les templates se contentent de remplir la page et de définir leurs marges.
 */
defineProps<{ accent: string }>()
</script>

<template>
  <article class="cv-page" :style="{ '--cv-accent': accent }">
    <slot />
  </article>
</template>

<style scoped>
.cv-page {
  box-sizing: border-box;
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  color: #1a1a1a;
  /* Les tailles sont exprimées en points : ce qui est vu est ce qui est imprimé. */
  font-size: 10pt;
  line-height: 1.45;
}
</style>
