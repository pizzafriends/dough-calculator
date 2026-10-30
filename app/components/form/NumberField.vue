<script setup lang="ts">
import { computed, useId } from 'vue'

const props = defineProps<{
  label: string
  min?: number
  max?: number
  step?: number
  unit?: string
  error?: string
  disabled?: boolean
  id?: string
}>()

const model = defineModel<number>({ required: true })
const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const errorId = computed(() => `${inputId.value}-error`)
</script>

<template>
  <label class="number-field" :for="inputId">
    <span class="number-field__label">{{ label }}<span v-if="unit" class="number-field__unit">{{ unit }}</span></span>
    <input
      :id="inputId"
      :value="Number.isFinite(model) ? model : ''"
      type="number"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? errorId : undefined"
      @input="model = ($event.target as HTMLInputElement).valueAsNumber"
    >
    <span v-if="error" :id="errorId" class="field-error" role="alert">{{ error }}</span>
  </label>
</template>
