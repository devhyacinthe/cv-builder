<script setup lang="ts">
/**
 * Miniature d'une feuille A4 : le document réel, simplement réduit.
 * Aucun aperçu à régénérer, aucune image à maintenir.
 */
const props = withDefaults(defineProps<{ width?: number }>(), { width: 200 })

/** Largeur d'une feuille A4 en pixels CSS (210 mm à 96 dpi). */
const A4_WIDTH = (210 * 96) / 25.4

const scale = computed(() => props.width / A4_WIDTH)
const height = computed(() => (props.width * 297) / 210)
</script>

<template>
  <span class="thumb" :style="{ width: `${width}px`, height: `${height}px` }" aria-hidden="true">
    <span class="thumb-inner" :style="{ transform: `scale(${scale})` }">
      <slot />
    </span>
  </span>
</template>

<style scoped>
.thumb {
  position: relative;
  display: block;
  overflow: hidden;
  border: 1px solid var(--color-line);
  background: #ffffff;
}

.thumb-inner {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
  pointer-events: none;
}
</style>
