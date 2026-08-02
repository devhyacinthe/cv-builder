<script setup lang="ts">
import { createExperience } from '~/utils/factories'
import { formatPeriod } from '~/utils/date'

const { items, add, remove, move } = useProfileList('experiences', createExperience)
</script>

<template>
  <BaseCard title="Expériences professionnelles" description="La section la plus scrutée : privilégiez des résultats mesurables.">
    <EditableList
      :items="items"
      add-label="Ajouter une expérience"
      empty="Aucune expérience enregistrée."
      @add="add"
      @remove="remove"
      @move="move"
    >
      <template #summary="{ item }">
        <span class="block truncate text-sm font-medium">
          {{ item.position || 'Nouvelle expérience' }}
          <span v-if="item.company" class="font-normal text-muted">· {{ item.company }}</span>
        </span>
        <span class="block truncate text-xs text-muted">{{ formatPeriod(item) }}</span>
      </template>

      <template #default="{ item }">
        <div class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <BaseField v-slot="{ id }" label="Poste" required>
              <BaseInput :id="id" v-model="item.position" />
            </BaseField>
            <BaseField v-slot="{ id }" label="Entreprise" required>
              <BaseInput :id="id" v-model="item.company" />
            </BaseField>
            <BaseField v-slot="{ id }" label="Localisation">
              <BaseInput :id="id" v-model="item.location" />
            </BaseField>
          </div>

          <PeriodFields
            v-model:start="item.startDate"
            v-model:end="item.endDate"
            v-model:current="item.current"
            current-label="Poste actuel"
          />

          <BaseField v-slot="{ id }" label="Description" hint="Une à deux phrases sur le contexte et la mission.">
            <BaseTextarea :id="id" v-model="item.description" :rows="3" />
          </BaseField>

          <BaseField label="Réalisations">
            <BulletInput v-model="item.highlights" />
          </BaseField>

          <BaseField label="Technologies">
            <TagInput v-model="item.technologies" />
          </BaseField>
        </div>
      </template>
    </EditableList>
  </BaseCard>
</template>
