<script setup lang="ts">
import type { DoughRecipeResult } from '../../domain/dough-recipe/types'
import type { DoughRecipeFieldErrors } from '../../domain/dough-recipe/validation'
import { DOUGH_WARNING_LABELS, formatMass, formatSaltMass, formatYeastMass } from '../../utils/format-results'

defineProps<{
  result: DoughRecipeResult | null
  errors: DoughRecipeFieldErrors
  targetLabel: string
}>()
</script>

<template>
  <section class="results-card" aria-labelledby="results-heading" aria-live="polite">
    <header class="results-card__header">
      <p class="eyebrow">Your formula</p>
      <h2 id="results-heading">Dough recipe</h2>
      <div class="results-card__target">
        <span>{{ result ? 'Target dough mass' : 'Recipe status' }}</span>
        <strong>{{ result ? formatMass(result.targetMassGrams) : 'Needs attention' }}</strong>
      </div>
      <p v-if="result" class="target-detail">{{ targetLabel }}</p>
    </header>

    <div class="results-card__body">
      <p v-if="!result" class="validation-summary" role="alert">
        {{ Object.keys(errors).length }} {{ Object.keys(errors).length === 1 ? 'input needs' : 'inputs need' }} attention. Correct the highlighted fields to calculate this recipe.
      </p>
      <template v-else>
        <dl class="ingredient-list">
          <div class="ingredient-list__row ingredient-list__row--main"><dt>Total dough</dt><dd>{{ formatMass(result.newDoughMassGrams) }}</dd></div>
          <div class="ingredient-list__row ingredient-list__row--main"><dt>Total flour</dt><dd>{{ formatMass(result.totalFlourGrams) }}</dd></div>
          <div class="ingredient-list__row"><dt>Main dough flour</dt><dd aria-label="Main dough flour">{{ formatMass(result.mainDough.flourGrams) }}</dd></div>
          <div class="ingredient-list__row"><dt>Water</dt><dd>{{ formatMass(result.mainDough.waterGrams) }}</dd></div>
          <div class="ingredient-list__row"><dt>Salt</dt><dd>{{ formatSaltMass(result.mainDough.saltGrams) }}</dd></div>
          <div v-if="result.mainDough.fatGrams > 0" class="ingredient-list__row"><dt>Fat</dt><dd>{{ formatMass(result.mainDough.fatGrams) }}</dd></div>
          <div class="ingredient-list__row"><dt>Main dough yeast</dt><dd>{{ formatYeastMass(result.mainDough.yeastGrams, result.preferments.poolish.flourGrams > 0 || result.preferments.biga.flourGrams > 0) }}</dd></div>
          <div v-if="result.oldDoughInMassGrams > 0" class="ingredient-list__row"><dt>Old dough in</dt><dd>{{ formatMass(result.oldDoughInMassGrams) }}</dd></div>
          <div v-if="result.oldDoughOutMassGrams > 0" class="ingredient-list__row"><dt>Old dough out</dt><dd>{{ formatMass(result.oldDoughOutMassGrams) }}</dd></div>
        </dl>

        <template v-if="result.flourMix.status !== 'single'">
          <h3 class="results-subhead">Main dough flour mix</h3>
          <dl class="ingredient-list">
            <div v-for="(amount, index) in result.flourMix.flourGrams" :key="index" class="ingredient-list__row">
              <dt>Flour {{ index + 1 }}</dt><dd :aria-label="`Flour ${index + 1} amount`">{{ formatMass(amount) }}</dd>
            </div>
          </dl>
        </template>

        <template v-if="result.preferments.autolysis.flourGrams || result.preferments.poolish.flourGrams || result.preferments.biga.flourGrams">
          <h3 class="results-subhead">Prepare separately</h3>
          <dl class="ingredient-list">
            <template v-if="result.preferments.autolysis.flourGrams">
              <div class="ingredient-list__row"><dt>Autolysis flour</dt><dd>{{ formatMass(result.preferments.autolysis.flourGrams) }}</dd></div>
              <div class="ingredient-list__row"><dt>Autolysis water</dt><dd>{{ formatMass(result.preferments.autolysis.waterGrams) }}</dd></div>
            </template>
            <template v-if="result.preferments.poolish.flourGrams">
              <div class="ingredient-list__row"><dt>Poolish flour</dt><dd>{{ formatMass(result.preferments.poolish.flourGrams) }}</dd></div>
              <div class="ingredient-list__row"><dt>Poolish water</dt><dd>{{ formatMass(result.preferments.poolish.waterGrams) }}</dd></div>
              <div class="ingredient-list__row"><dt>Poolish yeast</dt><dd>{{ formatYeastMass(result.preferments.poolish.yeastGrams, true) }}</dd></div>
            </template>
            <template v-if="result.preferments.biga.flourGrams">
              <div class="ingredient-list__row"><dt>Biga flour</dt><dd>{{ formatMass(result.preferments.biga.flourGrams) }}</dd></div>
              <div class="ingredient-list__row"><dt>Biga water</dt><dd>{{ formatMass(result.preferments.biga.waterGrams) }}</dd></div>
              <div class="ingredient-list__row"><dt>Biga yeast</dt><dd>{{ formatYeastMass(result.preferments.biga.yeastGrams, true) }}</dd></div>
            </template>
          </dl>
        </template>

        <ul v-if="result.warnings.length" class="warning-list" aria-label="Recipe warnings">
          <li v-for="warning in result.warnings" :key="warning">{{ DOUGH_WARNING_LABELS[warning] }}</li>
        </ul>
      </template>
    </div>
  </section>
</template>
