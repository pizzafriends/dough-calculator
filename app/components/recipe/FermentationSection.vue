<script setup lang="ts">
import { computed } from 'vue'
import NumberField from '../form/NumberField.vue'
import type { DoughRecipeInput, TemperatureUnit, YeastType } from '../../domain/dough-recipe/types'
import type { DoughRecipeFieldErrors } from '../../domain/dough-recipe/validation'

const props = defineProps<{
  modelValue: DoughRecipeInput['fermentation']
  yeast: DoughRecipeInput['yeast']
  sourdoughDisabled: boolean
  errors: DoughRecipeFieldErrors
}>()
const emit = defineEmits<{
  'update:modelValue': [value: DoughRecipeInput['fermentation']]
  'update:yeast': [value: DoughRecipeInput['yeast']]
  'unit-change': [value: TemperatureUnit]
}>()

const yeastChoices: Array<{ type: YeastType; label: string }> = [
  { type: 'LBF', label: 'Compressed' },
  { type: 'LSI', label: 'Instant dry' },
  { type: 'LSA', label: 'Active dry' },
  { type: 'LMS', label: 'Stiff sourdough · 50% hydration' },
  { type: 'LML', label: 'Liquid sourdough · 100% hydration' }
]

const temperatureMinimum = computed(() => props.modelValue.temperatureUnit === 'C' ? 10 : 50)
const temperatureMaximum = computed(() => props.modelValue.temperatureUnit === 'C' ? 40 : 104)
const controlledMinimum = computed(() => props.modelValue.temperatureUnit === 'C' ? 1 : 34)
const controlledMaximum = computed(() => props.modelValue.temperatureUnit === 'C' ? 20 : 68)

function update<K extends keyof DoughRecipeInput['fermentation']>(
  key: K,
  value: DoughRecipeInput['fermentation'][K]
) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function updateYeast<K extends keyof DoughRecipeInput['yeast']>(
  key: K,
  value: DoughRecipeInput['yeast'][K]
) {
  emit('update:yeast', { ...props.yeast, [key]: value })
}
</script>

<template>
  <section class="form-card" aria-labelledby="fermentation-heading">
    <div class="section-heading">
      <div><p class="eyebrow">Plan the rise</p><h2 id="fermentation-heading">Fermentation & yeast</h2></div>
      <span class="step-mark">03</span>
    </div>

    <div class="field-grid field-grid--two">
      <NumberField label="Room fermentation time" unit="h" :model-value="modelValue.roomHours" :min="1" :max="100" :step="1" :error="errors['fermentation.roomHours']" @update:model-value="update('roomHours', $event)" />
      <NumberField label="Room temperature" :unit="`°${modelValue.temperatureUnit}`" :model-value="modelValue.roomTemperature" :min="temperatureMinimum" :max="temperatureMaximum" :step="0.5" :error="errors['fermentation.roomTemperature']" @update:model-value="update('roomTemperature', $event)" />
    </div>

    <div class="check-row" style="margin-top: 16px">
      <label class="check-control"><input type="checkbox" :checked="modelValue.controlledEnabled" @change="update('controlledEnabled', ($event.target as HTMLInputElement).checked)">Add controlled-temperature fermentation</label>
      <label class="select-field unit-select">
        <span>Temperature unit</span>
        <select :value="modelValue.temperatureUnit" @change="$emit('unit-change', ($event.target as HTMLSelectElement).value as TemperatureUnit)">
          <option value="C">Celsius (°C)</option>
          <option value="F">Fahrenheit (°F)</option>
        </select>
      </label>
    </div>
    <div v-if="modelValue.controlledEnabled" class="field-grid field-grid--two">
      <NumberField label="Controlled fermentation time" unit="h" :model-value="modelValue.controlledHours" :min="0" :max="100" :step="1" :error="errors['fermentation.controlledHours']" @update:model-value="update('controlledHours', $event)" />
      <NumberField label="Controlled temperature" :unit="`°${modelValue.temperatureUnit}`" :model-value="modelValue.controlledTemperature" :min="controlledMinimum" :max="controlledMaximum" :step="0.5" :error="errors['fermentation.controlledTemperature']" @update:model-value="update('controlledTemperature', $event)" />
    </div>

    <hr class="field-divider">
    <fieldset class="yeast-fieldset">
      <legend>Yeast type</legend>
      <div class="radio-row">
        <label v-for="choice in yeastChoices" :key="choice.type" class="radio-pill">
          <input
            type="radio"
            name="dough-yeast-type"
            :value="choice.type"
            :checked="yeast.type === choice.type"
            :disabled="sourdoughDisabled && (choice.type === 'LMS' || choice.type === 'LML')"
            @change="updateYeast('type', choice.type)"
          >
          {{ choice.label }}
        </label>
      </div>
    </fieldset>
    <NumberField class="yeast-adjustment" label="Yeast adjustment" unit="%" :model-value="yeast.adjustmentPercent" :min="-50" :max="50" :step="5" :error="errors['yeast.adjustmentPercent']" @update:model-value="updateYeast('adjustmentPercent', $event)" />
  </section>
</template>
