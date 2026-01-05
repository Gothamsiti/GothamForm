<template lang="pug">
.input.fieldDateText(
  v-if="field && field.visible"
  :class="{error:field.error,compiled: field.compiled},field.name"
)
  label(v-if="field.label && !field.hideLabel" :for="field.name")
    span(v-html="field.label+(field.required?'*':'')")
  .date-inputs
    input(
      ref="dayRef"
      type="text"
      maxlength="2"
      size="2"
      v-model="day"
      :placeholder="$__('GG')"
      inputmode="numeric"
      @input="onDayInput"
      @keydown.backspace="onBackspace('day')"
    )
    input(
      ref="monthRef"
      type="text"
      maxlength="2"
      size="2"
      v-model="month"
      :placeholder="$__('MM')"
      inputmode="numeric"
      @input="onMonthInput"
      @keydown.backspace="onBackspace('month')"
    )
    input(
      ref="yearRef"
      type="text"
      maxlength="4"
      size="4"
      v-model="year"
      :placeholder="$__('AAAA')"
      inputmode="numeric"
      @input="onYearInput"
      @keydown.backspace="onBackspace('year')"
    )
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const { field } = defineProps(['blok', 'field', 'modelValue'])
const model = defineModel('model')
const emit = defineEmits(['addEvalFunction'])

const day = ref('')
const month = ref('')
const year = ref('')

const dayRef = ref(null)
const monthRef = ref(null)
const yearRef = ref(null)

// Inizializza i valori se model.value è presente (formato YYYY-MM-DD)
if (model.value) {
  const parts = model.value.split('-')
  if (parts.length === 3) {
    year.value = parts[0]
    month.value = parts[1]
    day.value = parts[2]
  }
}

// Funzione per aggiornare model.value in formato ISO YYYY-MM-DD
function updateModel() {
  if (year.value.length === 4 && month.value.length > 0 && day.value.length > 0) {
    model.value = `${year.value.padStart(4, '0')}-${month.value.padStart(2, '0')}-${day.value.padStart(2, '0')}`
  }
  else {
    model.value = ''
  }
}

// Funzione per filtrare input numerici e validare giorno
function onDayInput(e) {
  // Rimuovo tutti i caratteri non numerici
  day.value = day.value.replace(/\D/g, '')

  // Limito giorno a max 31
  if (day.value !== '') {
    let dayNum = Number.parseInt(day.value, 10)
    if (dayNum < 1) dayNum = 1
    if (dayNum > 31) dayNum = 31
    day.value = dayNum.toString()
  }

  if (day.value.length === 2) {
    nextTick(() => monthRef.value?.focus())
  }

  updateModel()
}

// Funzione per filtrare input numerici e validare mese
function onMonthInput() {
  // Solo numeri
  month.value = month.value.replace(/\D/g, '')

  if (month.value.length === 0) {
    updateModel()
    return
  }

  // Se ha 1 cifra, controlliamo solo che non sia > 1 se è la prima
  if (month.value.length === 1) {
    const firstDigit = Number.parseInt(month.value, 10)
    if (firstDigit > 1) {
      // es: 3 → diventa 03
      month.value = `0${firstDigit}`
      nextTick(() => yearRef.value?.focus())
    }
  }

  // Se ha 2 cifre, validiamo il range 01–12
  if (month.value.length === 2) {
    const monthNum = Number.parseInt(month.value, 10)

    if (monthNum < 1) month.value = '01'
    if (monthNum > 12) month.value = '12'

    nextTick(() => yearRef.value?.focus())
  }
  updateModel()
}

// Funzione per filtrare input numerici per l'anno
function onYearInput(e) {
  year.value = year.value.replace(/\D/g, '')

  if (year.value.length === 4) {
    // Potresti aggiungere qui eventuali controlli sull'anno
  }

  updateModel()
}

// Supporto per backspace: se campo vuoto torna al campo precedente
function onBackspace(fieldName) {
  return (e) => {
    const target = e.target
    if (e.key === 'Backspace' && target.value.length === 0) {
      e.preventDefault()
      if (fieldName === 'month') {
        dayRef.value?.focus()
      }
      else if (fieldName === 'year') {
        monthRef.value?.focus()
      }
    }
  }
}

useField(model, field, emit)

// Sincronizza se model cambia esternamente
watch(model, (newVal) => {
  if (newVal) {
    const parts = newVal.split('-')
    if (parts.length === 3) {
      year.value = parts[0]
      month.value = parts[1]
      day.value = parts[2]
    }
  }
})
</script>
