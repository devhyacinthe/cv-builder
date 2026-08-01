<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    type?: 'button' | 'submit'
    /** Rend un lien de navigation au lieu d'un bouton. */
    to?: string
    disabled?: boolean
  }>(),
  { variant: 'secondary', size: 'md', type: 'button', to: undefined, disabled: false },
)

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand/90',
  secondary: 'border border-line bg-surface text-ink hover:bg-canvas',
  ghost: 'text-muted hover:bg-canvas hover:text-ink',
  danger: 'border border-danger/30 text-danger hover:bg-danger/5',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 gap-1.5 px-3 text-xs',
  md: 'h-10 gap-2 px-4 text-sm',
}

const classes = computed(() => [
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  'disabled:pointer-events-none disabled:opacity-50',
  variants[props.variant],
  sizes[props.size],
])
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="classes">
    <slot />
  </NuxtLink>
  <button v-else :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
