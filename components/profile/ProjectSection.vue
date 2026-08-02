<script setup lang="ts">
import { createProject } from '~/utils/factories'
import { formatPeriod } from '~/utils/date'

const { items, add, remove, move } = useProfileList('projects', createProject)
</script>

<template>
  <BaseCard title="Projets" description="Vitrine technique : contexte, technologies et résultats obtenus.">
    <EditableList
      :items="items"
      add-label="Ajouter un projet"
      empty="Aucun projet enregistré."
      @add="add"
      @remove="remove"
      @move="move"
    >
      <template #summary="{ item }">
        <span class="block truncate text-sm font-medium">{{ item.name || 'Nouveau projet' }}</span>
        <span class="block truncate text-xs text-muted">
          {{ [item.context, formatPeriod(item)].filter(Boolean).join(' · ') }}
        </span>
      </template>

      <template #default="{ item }">
        <div class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <BaseField v-slot="{ id }" label="Nom du projet" required>
              <BaseInput :id="id" v-model="item.name" />
            </BaseField>
            <BaseField v-slot="{ id }" label="Contexte" hint="Personnel, académique, professionnel…">
              <BaseInput :id="id" v-model="item.context" />
            </BaseField>
          </div>

          <PeriodFields v-model:start="item.startDate" v-model:end="item.endDate" :show-current="false" />

          <BaseField v-slot="{ id }" label="Description">
            <BaseTextarea :id="id" v-model="item.description" :rows="3" />
          </BaseField>

          <BaseField label="Résultats obtenus">
            <BulletInput v-model="item.results" placeholder="Performance, adoption, publication…" />
          </BaseField>

          <BaseField label="Technologies">
            <TagInput v-model="item.technologies" />
          </BaseField>

          <div class="grid gap-4 sm:grid-cols-3">
            <BaseField v-slot="{ id }" label="Dépôt">
              <BaseInput :id="id" v-model="item.repositoryUrl" type="url" />
            </BaseField>
            <BaseField v-slot="{ id }" label="Démo">
              <BaseInput :id="id" v-model="item.demoUrl" type="url" />
            </BaseField>
            <BaseField v-slot="{ id }" label="Documentation">
              <BaseInput :id="id" v-model="item.documentationUrl" type="url" />
            </BaseField>
          </div>
        </div>
      </template>
    </EditableList>
  </BaseCard>
</template>
