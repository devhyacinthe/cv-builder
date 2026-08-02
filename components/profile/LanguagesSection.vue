<script setup lang="ts">
import { createLanguage } from '~/utils/factories'

const { items, add, remove, move } = useProfileList('languages', createLanguage)
</script>

<template>
  <BaseCard class="@container" title="Langues" description="Niveau et certification éventuelle.">
    <EditableList
      :items="items"
      add-label="Ajouter une langue"
      empty="Aucune langue enregistrée."
      @add="add"
      @remove="remove"
      @move="move"
    >
      <template #summary="{ item }">
        <span class="block truncate text-sm font-medium">{{ item.name || 'Nouvelle langue' }}</span>
        <span class="block truncate text-xs text-muted">
          {{ [item.level, item.certification].filter(Boolean).join(' · ') }}
        </span>
      </template>

      <template #default="{ item }">
        <div class="grid gap-4 @2xl:grid-cols-3">
          <BaseField v-slot="{ id }" label="Langue">
            <BaseInput :id="id" v-model="item.name" />
          </BaseField>
          <BaseField v-slot="{ id }" label="Niveau" hint="Ex. : Courant, C1">
            <BaseInput :id="id" v-model="item.level" />
          </BaseField>
          <BaseField v-slot="{ id }" label="Certification">
            <BaseInput :id="id" v-model="item.certification" />
          </BaseField>
        </div>
      </template>
    </EditableList>
  </BaseCard>
</template>
