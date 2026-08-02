<script setup lang="ts">
import { moveItem } from '~/utils/collection'

/** Liste de puces ordonnée (réalisations, résultats), telle qu'affichée sur le CV. */
const model = defineModel<string[]>({ default: () => [] })

withDefaults(defineProps<{ addLabel?: string; placeholder?: string }>(), {
  addLabel: 'Ajouter une puce',
  placeholder: 'Réalisation, résultat mesurable…',
})

const update = (index: number, value: string) =>
  (model.value = model.value.map((line, position) => (position === index ? value : line)))

const add = () => (model.value = [...model.value, ''])

const remove = (index: number) => (model.value = model.value.filter((_, position) => position !== index))

function move(index: number, offset: number) {
  const next = [...model.value]
  moveItem(next, index, index + offset)
  model.value = next
}
</script>

<template>
  <div class="space-y-2">
    <TransitionGroup name="list" tag="div" class="relative space-y-2">
      <div v-for="(line, index) in model" :key="index" class="group flex items-start gap-2">
        <span class="mt-3.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted/50" />
        <textarea
          :value="line"
          rows="2"
          :placeholder="placeholder"
          class="field-control resize-y leading-relaxed"
          @input="update(index, ($event.target as HTMLTextAreaElement).value)"
        />
        <div class="flex opacity-60 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
          <BaseIconButton icon="arrowUp" label="Monter" :disabled="index === 0" @click="move(index, -1)" />
          <BaseIconButton
            icon="arrowDown"
            label="Descendre"
            :disabled="index === model.length - 1"
            @click="move(index, 1)"
          />
          <BaseIconButton icon="trash" label="Supprimer" danger @click="remove(index)" />
        </div>
      </div>
    </TransitionGroup>

    <BaseButton size="sm" variant="ghost" @click="add">
      <BaseIcon name="plus" :size="14" />
      {{ addLabel }}
    </BaseButton>
  </div>
</template>
