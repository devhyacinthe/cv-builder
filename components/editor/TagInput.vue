<script setup lang="ts">
/** Saisie de mots-clés (technologies, outils) sous forme d'étiquettes. */
const model = defineModel<string[]>({ default: () => [] })

withDefaults(defineProps<{ placeholder?: string }>(), { placeholder: 'Ajouter puis Entrée' })

const draft = ref('')

function commit() {
  const value = draft.value.trim().replace(/,$/, '')
  if (value && !model.value.includes(value)) model.value = [...model.value, value]
  draft.value = ''
}

function removeAt(index: number) {
  model.value = model.value.filter((_, position) => position !== index)
}

function onBackspace() {
  if (!draft.value && model.value.length) removeAt(model.value.length - 1)
}

/** La virgule sépare aussi les étiquettes, comme la touche Entrée. */
function onKeydown(event: KeyboardEvent) {
  if (event.key !== ',') return
  event.preventDefault()
  commit()
}
</script>

<template>
  <div class="field-control flex flex-wrap items-center gap-1.5 py-1.5">
    <TransitionGroup name="fade">
      <span
        v-for="(tag, index) in model"
        :key="tag"
        class="inline-flex items-center gap-1 rounded-full bg-brand-soft py-1 pr-1 pl-2.5 text-xs font-medium text-brand"
      >
        {{ tag }}
        <button
          type="button"
          class="grid h-4 w-4 place-items-center rounded-full transition-colors hover:bg-brand/15"
          :aria-label="`Retirer ${tag}`"
          @click="removeAt(index)"
        >
          <BaseIcon name="close" :size="10" />
        </button>
      </span>
    </TransitionGroup>

    <input
      v-model="draft"
      type="text"
      :placeholder="placeholder"
      class="min-w-32 flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted/70"
      @keydown.enter.prevent="commit"
      @keydown="onKeydown"
      @keydown.backspace="onBackspace"
      @blur="commit"
    />
  </div>
</template>
