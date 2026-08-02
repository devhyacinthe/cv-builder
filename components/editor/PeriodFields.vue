<script setup lang="ts">
/** Période au mois près, partagée par les expériences et les formations. */
const start = defineModel<string>('start', { default: '' })
const end = defineModel<string>('end', { default: '' })
const current = defineModel<boolean>('current', { default: false })

withDefaults(defineProps<{ currentLabel?: string; showCurrent?: boolean }>(), {
  currentLabel: 'En cours',
  showCurrent: true,
})
</script>

<template>
  <div class="grid gap-4 @md:grid-cols-2">
    <BaseField v-slot="{ id }" label="Début">
      <BaseInput :id="id" v-model="start" type="month" />
    </BaseField>

    <BaseField v-slot="{ id }" label="Fin">
      <BaseInput v-show="!current" :id="id" v-model="end" type="month" />
      <p v-show="current" class="field-control text-muted">Aujourd'hui</p>
    </BaseField>

    <BaseCheckbox v-if="showCurrent" v-model="current" :label="currentLabel" />
  </div>
</template>
