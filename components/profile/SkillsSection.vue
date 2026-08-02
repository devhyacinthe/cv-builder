<script setup lang="ts">
import type { SkillCategory, SkillKind } from '~/schemas/profile'
import { createSkill, createSkillCategory } from '~/utils/factories'
import { removeById } from '~/utils/collection'

const { items, add, remove, move } = useProfileList('skillCategories', createSkillCategory)

const kinds: { value: SkillKind; label: string; hint: string }[] = [
  { value: 'technical', label: 'Techniques', hint: 'Évaluées par un niveau' },
  { value: 'soft', label: 'Transversales', hint: 'Énumérées sans niveau' },
]

/** Propositions courantes, pour éviter la page blanche sur les savoir-être. */
const softSuggestions = [
  'Rigueur',
  "Esprit d'équipe",
  'Autonomie',
  'Communication',
  'Adaptabilité',
  'Sens de l’organisation',
  "Esprit d'analyse",
  'Créativité',
  'Curiosité',
  'Gestion du temps',
]

const addSkill = (category: SkillCategory, name = '') => category.skills.push(createSkill({ name }))

const isUsed = (category: SkillCategory, name: string) =>
  category.skills.some((skill) => skill.name.toLowerCase() === name.toLowerCase())
</script>

<template>
  <BaseCard class="@container" title="Compétences" description="Techniques ou transversales, regroupées par catégories.">
    <EditableList
      :items="items"
      add-label="Ajouter une catégorie"
      empty="Aucune catégorie de compétences."
      @add="add"
      @remove="remove"
      @move="move"
    >
      <template #summary="{ item }">
        <span class="block truncate text-sm font-medium">{{ item.name || 'Nouvelle catégorie' }}</span>
        <span class="block text-xs text-muted">
          {{ item.kind === 'soft' ? 'Transversales' : 'Techniques' }} ·
          {{ item.skills.length }} compétence{{ item.skills.length > 1 ? 's' : '' }}
        </span>
      </template>

      <template #default="{ item }">
        <div class="space-y-4">
          <div class="grid gap-4 @md:grid-cols-2">
            <BaseField v-slot="{ id }" label="Nom de la catégorie" hint="Ex. : Programmation, Savoir-être">
              <BaseInput :id="id" v-model="item.name" />
            </BaseField>

            <BaseField label="Type de compétences">
              <div class="flex rounded-md border border-line bg-surface p-1">
                <button
                  v-for="kind in kinds"
                  :key="kind.value"
                  type="button"
                  class="flex-1 rounded px-3 py-1.5 text-xs transition-all duration-200"
                  :class="item.kind === kind.value ? 'bg-brand text-white shadow-sm' : 'text-muted hover:text-ink'"
                  :title="kind.hint"
                  @click="item.kind = kind.value"
                >
                  {{ kind.label }}
                </button>
              </div>
            </BaseField>
          </div>

          <TransitionGroup name="list" tag="div" class="relative space-y-2">
            <div
              v-for="skill in item.skills"
              :key="skill.id"
              class="flex flex-wrap items-center gap-3 rounded-md border border-line bg-surface px-3 py-2"
            >
              <input
                v-model="skill.name"
                type="text"
                placeholder="Compétence"
                class="min-w-40 flex-1 bg-transparent text-sm outline-none placeholder:text-muted/70"
              />
              <LevelPicker v-if="item.kind === 'technical'" v-model="skill.level" />
              <BaseIconButton icon="trash" label="Supprimer" danger @click="removeById(item.skills, skill.id)" />
            </div>
          </TransitionGroup>

          <div v-if="item.kind === 'soft'" class="flex flex-wrap gap-1.5">
            <button
              v-for="suggestion in softSuggestions"
              :key="suggestion"
              type="button"
              class="rounded-full border border-dashed border-line px-2.5 py-1 text-xs text-muted transition-all duration-200 hover:border-brand hover:text-brand disabled:opacity-40"
              :disabled="isUsed(item, suggestion)"
              @click="addSkill(item, suggestion)"
            >
              + {{ suggestion }}
            </button>
          </div>

          <BaseButton size="sm" variant="ghost" @click="addSkill(item)">
            <BaseIcon name="plus" :size="14" />
            Ajouter une compétence
          </BaseButton>
        </div>
      </template>
    </EditableList>
  </BaseCard>
</template>
