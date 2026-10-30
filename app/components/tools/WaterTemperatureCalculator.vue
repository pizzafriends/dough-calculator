<script setup lang="ts">
import { computed } from 'vue'
import NumberField from '../form/NumberField.vue'
import {
  calculateWaterTemperature,
  setWaterTemperatureUnit,
  type WaterTemperatureInput
} from '../../domain/water-temperature'
import { validateWaterTemperatureInput } from '../../domain/secondary-validation'
import { formatTemperature } from '../../utils/format-results'

const model = defineModel<WaterTemperatureInput>({ required: true })
const errors = computed(() => validateWaterTemperatureInput(model.value))
const result = computed(() => Object.keys(errors.value).length === 0
  ? calculateWaterTemperature(model.value)
  : undefined)
const minimum = computed(() => model.value.temperatureUnit === 'C' ? 10 : 50)
const maximum = computed(() => model.value.temperatureUnit === 'C' ? 40 : 104)
const formattedResult = computed(() => result.value === undefined
  ? '–'
  : formatTemperature(result.value, model.value.temperatureUnit))

function update<K extends keyof WaterTemperatureInput>(key: K, value: WaterTemperatureInput[K]) {
  model.value = { ...model.value, [key]: value }
}

function changeUnit(unit: WaterTemperatureInput['temperatureUnit']) {
  model.value = setWaterTemperatureUnit(model.value, unit)
}
</script>

<template>
  <section class="tool-card water-tool" aria-labelledby="water-temperature-heading">
    <div class="section-heading">
      <div><p class="eyebrow">Tune your mix</p><h2 id="water-temperature-heading">Water temperature</h2></div>
      <span class="step-mark">01</span>
    </div>
    <p class="section-copy">Balance room temperature and mixer friction to reach your desired final dough temperature.</p>
    <div class="field-grid field-grid--two">
      <label class="select-field">
        <span>Temperature unit</span>
        <select :value="model.temperatureUnit" @change="changeUnit(($event.target as HTMLSelectElement).value as 'C' | 'F')">
          <option value="C">Celsius (°C)</option>
          <option value="F">Fahrenheit (°F)</option>
        </select>
      </label>
      <label class="select-field">
        <span>Mixer</span>
        <select :value="model.mixer" @change="update('mixer', ($event.target as HTMLSelectElement).value as WaterTemperatureInput['mixer'])">
          <option value="fork">Fork</option>
          <option value="spiral">Spiral</option>
          <option value="planetary">Planetary</option>
          <option value="plunging-arms">Plunging arms</option>
          <option value="hands">Hands</option>
        </select>
      </label>
      <NumberField
        id="desired-dough-temperature"
        label="Desired final dough temperature" :unit="`°${model.temperatureUnit}`"
        :model-value="model.desiredDoughTemperature" :min="minimum" :max="maximum" :step="0.5"
        :error="errors.desiredDoughTemperature"
        @update:model-value="update('desiredDoughTemperature', $event)"
      />
      <NumberField
        id="room-temperature"
        label="Room temperature" :unit="`°${model.temperatureUnit}`"
        :model-value="model.roomTemperature" :min="minimum" :max="maximum" :step="0.5"
        :error="errors.roomTemperature"
        @update:model-value="update('roomTemperature', $event)"
      />
    </div>
    <div class="result-strip result-strip--single" aria-live="polite">
      <div><span>Water temperature</span><output aria-label="Water temperature result">{{ formattedResult }}</output></div>
    </div>
    <p class="result-note">The calculated water temperature has a minimum of 4°C.</p>
  </section>
</template>
