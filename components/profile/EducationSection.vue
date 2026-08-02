<script setup lang="ts">
import { createEducation } from '~/utils/factories'
import { formatPeriod } from '~/utils/date'

const { items, add, remove, move } = useProfileList('educations', createEducation)
</script>

<template>
  <BaseCard title="Formations" description="Diplômes, spécialités et travaux associés.">
    <EditableList
      :items="items"
      add-label="Ajouter une formation"
      empty="Aucune formation enregistrée."
      @add="add"
      @remove="remove"
      @move="move"
    >
      <template #summary="{ item }">
        <span class="block truncate text-sm font-medium">
          {{ item.degree || 'Nouvelle formation' }}
          <span v-if="item.institution" class="font-normal text-muted">· {{ item.institution }}</span>
        </span>
        <span class="block truncate text-xs text-muted">{{ formatPeriod(item) }}</span>
      </template>

      <template #default="{ item }">
        <div class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <BaseField v-slot="{ id }" label="Diplôme" required>
              <BaseInput :id="id" v-model="item.degree" />
            </BaseField>
            <BaseField v-slot="{ id }" label="Établissement" required>
              <BaseInput :id="id" v-model="item.institution" />
            </BaseField>
            <BaseField v-slot="{ id }" label="Domaine / spécialité">
              <BaseInput :id="id" v-model="item.field" />
            </BaseField>
            <BaseField v-slot="{ id }" label="Localisation">
              <BaseInput :id="id" v-model="item.location" />
            </BaseField>
          </div>

          <PeriodFields
            v-model:start="item.startDate"
            v-model:end="item.endDate"
            v-model:current="item.current"
            current-label="Formation en cours"
          />

          <BaseField v-slot="{ id }" label="Description">
            <BaseTextarea :id="id" v-model="item.description" :rows="3" />
          </BaseField>

          <BaseField label="Travaux et projets associés">
            <BulletInput v-model="item.highlights" placeholder="Mémoire, projet de fin d'études…" />
          </BaseField>
        </div>
      </template>
    </EditableList>
  </BaseCard>
</template>
