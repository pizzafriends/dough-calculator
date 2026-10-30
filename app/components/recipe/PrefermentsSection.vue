<script setup lang="ts">
import NumberField from '../form/NumberField.vue'
import type { DoughRecipeInput, PrefermentType } from '../../domain/dough-recipe/types'
import type { DoughRecipeFieldErrors } from '../../domain/dough-recipe/validation'

const props = defineProps<{
  modelValue: DoughRecipeInput['preferments']
  errors: DoughRecipeFieldErrors
}>()
const emit = defineEmits<{
  'update:modelValue': [value: DoughRecipeInput['preferments']]
  'toggle-preferment': [value: 'autolysis' | PrefermentType]
}>()

function update<K extends keyof DoughRecipeInput['preferments']>(
  key: K,
  value: DoughRecipeInput['preferments'][K]
) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <section class="form-card" aria-labelledby="preferments-heading">
    <div class="section-heading">
      <div><p class="eyebrow">Mix ahead</p><h2 id="preferments-heading">Preferments</h2></div>
      <span class="step-mark">04</span>
    </div>
    <p class="section-copy">Autolysis can be combined with either poolish or biga. Flour allocations use total recipe flour.</p>

    <div class="preferment-option">
      <label class="check-control"><input aria-label="Autolysis" type="checkbox" :checked="modelValue.autolysisEnabled" @change="$emit('toggle-preferment', 'autolysis')">Autolysis</label>
      <div v-if="modelValue.autolysisEnabled" class="field-grid field-grid--two preferment-option__fields">
        <NumberField label="Autolysis flour" unit="%" :model-value="modelValue.autolysisFlourPercent" :min="20" :max="100" :step="1" :error="errors['preferments.autolysisFlourPercent']" @update:model-value="update('autolysisFlourPercent', $event)" />
        <NumberField label="Autolysis water (of flour)" unit="%" :model-value="modelValue.autolysisWaterPercent" :min="40" :max="100" :step="1" :error="errors['preferments.autolysisWaterPercent']" @update:model-value="update('autolysisWaterPercent', $event)" />
      </div>
    </div>

    <div class="preferment-option">
      <label class="check-control"><input aria-label="Poolish" type="checkbox" :checked="modelValue.poolishEnabled" @change="$emit('toggle-preferment', 'poolish')">Poolish</label>
      <div v-if="modelValue.poolishEnabled" class="field-grid field-grid--two preferment-option__fields">
        <NumberField label="Poolish flour" unit="%" :model-value="modelValue.poolishFlourPercent" :min="10" :max="100" :step="1" :error="errors['preferments.poolishFlourPercent']" @update:model-value="update('poolishFlourPercent', $event)" />
        <NumberField label="Poolish fermentation time" unit="h" :model-value="modelValue.poolishHours" :min="1" :max="24" :step="1" :error="errors['preferments.poolishHours']" @update:model-value="update('poolishHours', $event)" />
      </div>
    </div>

    <div class="preferment-option">
      <label class="check-control"><input aria-label="Biga" type="checkbox" :checked="modelValue.bigaEnabled" @change="$emit('toggle-preferment', 'biga')">Biga</label>
      <div v-if="modelValue.bigaEnabled" class="field-grid field-grid--two preferment-option__fields">
        <NumberField label="Biga flour" unit="%" :model-value="modelValue.bigaFlourPercent" :min="10" :max="100" :step="1" :error="errors['preferments.bigaFlourPercent']" @update:model-value="update('bigaFlourPercent', $event)" />
      </div>
    </div>
  </section>
</template>
