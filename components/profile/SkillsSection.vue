<script setup lang="ts">
import type { SkillCategory } from '~/schemas/profile'
import { createSkill, createSkillCategory } from '~/utils/factories'
import { removeById } from '~/utils/collection'

const { items, add, remove, move } = useProfileList('skillCategories', createSkillCategory)

const addSkill = (category: SkillCategory) => category.skills.push(createSkill())
</script>

<template>
  <BaseCard title="Compétences" description="Regroupées par catégories, comme sur le CV final.">
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
          {{ item.skills.length }} compétence{{ item.skills.length > 1 ? 's' : '' }}
        </span>
      </template>

      <template #default="{ item }">
        <div class="space-y-4">
          <BaseField v-slot="{ id }" label="Nom de la catégorie" hint="Ex. : Programmation, Big Data, DevOps">
            <BaseInput :id="id" v-model="item.name" />
          </BaseField>

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
              <LevelPicker v-model="skill.level" />
              <BaseIconButton icon="trash" label="Supprimer" danger @click="removeById(item.skills, skill.id)" />
            </div>
          </TransitionGroup>

          <BaseButton size="sm" variant="ghost" @click="addSkill(item)">
            <BaseIcon name="plus" :size="14" />
            Ajouter une compétence
          </BaseButton>
        </div>
      </template>
    </EditableList>
  </BaseCard>
</template>
