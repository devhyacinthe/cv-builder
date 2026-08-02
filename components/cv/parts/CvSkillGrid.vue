<script setup lang="ts">
import type { SkillCategory } from '~/schemas/profile'

/**
 * Compétences en grille, avec barre de niveau pour les compétences techniques.
 * Bloc partagé par les modèles qui placent les compétences en tête de CV ;
 * chaque modèle l'habille via ses propres variables CSS.
 */
withDefaults(defineProps<{ categories: SkillCategory[]; columns?: number }>(), { columns: 3 })
</script>

<template>
  <div class="skills">
    <div v-for="category in categories" :key="category.id" class="group">
      <p v-if="category.name" class="group-name">{{ category.name }}</p>
      <div class="grid" :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }">
        <div v-for="skill in category.skills" :key="skill.id" class="cell">
          <span class="name">{{ skill.name }}</span>
          <span v-if="category.kind === 'technical'" class="bar">
            <span class="fill" :style="{ width: `${skill.level * 20}%` }" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group + .group {
  margin-top: 3mm;
}

.group-name {
  font-size: 8.5pt;
  font-weight: 700;
  color: var(--grid-label, #4a4a4a);
  margin-bottom: 1.5mm;
}

.grid {
  display: grid;
  gap: 2mm 5mm;
}

.cell {
  min-width: 0;
  break-inside: avoid;
}

.name {
  display: block;
  font-size: 8.5pt;
  color: var(--grid-name, #1f1f1f);
  overflow-wrap: break-word;
}

.bar {
  display: block;
  height: 1.2mm;
  margin-top: 1mm;
  background: var(--grid-track, #dcdfe3);
}

.fill {
  display: block;
  height: 100%;
  background: var(--grid-fill, currentColor);
}
</style>
