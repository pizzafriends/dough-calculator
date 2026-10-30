<script setup lang="ts">
import NumberField from '../form/NumberField.vue'
import type { DoughRecipeInput } from '../../domain/dough-recipe/types'
import type { DoughRecipeFieldErrors } from '../../domain/dough-recipe/validation'

const props = defineProps<{
  modelValue: DoughRecipeInput['ingredients']
  errors: DoughRecipeFieldErrors
}>()
const emit = defineEmits<{
  'update:modelValue': [value: DoughRecipeInput['ingredients']]
  'flour-count-change': [count: number]
}>()

function update<K extends keyof DoughRecipeInput['ingredients']>(
  key: K,
  value: DoughRecipeInput['ingredients'][K]
) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function updateShare(index: number, value: number) {
  const flourShares = [...props.modelValue.flourShares]
  flourShares[index] = value
  emit('update:modelValue', { ...props.modelValue, flourShares })
}
</script>

<template>
  <section class="form-card" aria-labelledby="flour-heading">
    <div class="section-heading">
      <div><p class="eyebrow">Build the base</p><h2 id="flour-heading">Flour & ingredients</h2></div>
      <span class="step-mark">02</span>
    </div>
    <div class="field-grid field-grid--two">
      <label class="select-field">
        <span>Number of flours</span>
        <select :value="modelValue.flourCount" @change="$emit('flour-count-change', Number(($event.target as HTMLSelectElement).value))">
          <option v-for="count in 6" :key="count" :value="count">{{ count }} {{ count === 1 ? 'flour' : 'flours' }}</option>
        </select>
      </label>
      <NumberField label="Hydration" unit="%" :model-value="modelValue.hydrationPercent" :min="40" :max="100" :step="1" :error="errors['ingredients.hydrationPercent']" @update:model-value="update('hydrationPercent', $event)" />
      <NumberField label="Salt" unit="%" :model-value="modelValue.saltPercent" :min="0" :max="6" :step="0.1" :error="errors['ingredients.saltPercent']" @update:model-value="update('saltPercent', $event)" />
      <NumberField label="Fat" unit="%" :model-value="modelValue.fatPercent" :min="0" :max="10" :step="0.1" :disabled="!modelValue.fatEnabled" :error="errors['ingredients.fatPercent']" @update:model-value="update('fatPercent', $event)" />
    </div>
    <div class="check-row" style="margin-top: 16px">
      <label class="check-control"><input type="checkbox" :checked="modelValue.fatEnabled" @change="update('fatEnabled', ($event.target as HTMLInputElement).checked)">Add fat to the dough</label>
    </div>
    <div v-if="modelValue.flourCount > 1" class="share-fields">
      <p class="share-fields__hint">Shares must total exactly 100% for individual amounts.</p>
      <div class="field-grid field-grid--three">
        <NumberField
          v-for="index in modelValue.flourCount" :key="index"
          :label="`Flour ${index} share`" unit="%"
          :model-value="modelValue.flourShares[index - 1] ?? 1" :min="1" :max="99" :step="1"
          :error="errors[`ingredients.flourShares.${index - 1}`]"
          @update:model-value="updateShare(index - 1, $event)"
        />
      </div>
    </div>
  </section>
</template>
