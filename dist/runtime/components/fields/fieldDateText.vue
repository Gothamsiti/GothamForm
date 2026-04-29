<template lang="pug">
.input.fieldDateText(
  v-if="field && field.visible && _hide"
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
      :placeholder="$__('FormDateTextGG')"
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
      :placeholder="$__('FormDateTextMM')"
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
      :placeholder="$__('FormDateTextAAAA')"
      inputmode="numeric"
      @input="onYearInput"
      @keydown.backspace="onBackspace('year')"
    )
</template>

<script setup>
import { ref, watch, nextTick } from "#imports";
import { useField } from "../../composables/useField";
const { field, formSlug } = defineProps(["blok", "field", "formSlug"]);
const model = defineModel("model");
const emit = defineEmits(["addEvalFunction"]);
const { hide: _hide } = useField(model, field, emit, formSlug);
const day = ref("");
const month = ref("");
const year = ref("");
const dayRef = ref(null);
const monthRef = ref(null);
const yearRef = ref(null);
if (model.value) {
  const parts = model.value.split("-");
  if (parts.length === 3) {
    year.value = parts[0];
    month.value = parts[1];
    day.value = parts[2];
  }
}
const updateModel = () => {
  if (year.value.length === 4 && month.value.length > 0 && day.value.length > 0) {
    model.value = `${year.value.padStart(4, "0")}-${month.value.padStart(2, "0")}-${day.value.padStart(2, "0")}`;
  } else {
    model.value = "";
  }
};
const onDayInput = () => {
  day.value = day.value.replace(/\D/g, "");
  if (day.value !== "") {
    let dayNum = Number.parseInt(day.value, 10);
    if (dayNum < 1) dayNum = 1;
    if (dayNum > 31) dayNum = 31;
    day.value = dayNum.toString();
  }
  if (day.value.length === 2) {
    nextTick(() => monthRef.value?.focus());
  }
  updateModel();
};
const onMonthInput = () => {
  month.value = month.value.replace(/\D/g, "");
  if (month.value.length === 0) {
    updateModel();
    return;
  }
  if (month.value.length === 1) {
    const firstDigit = Number.parseInt(month.value, 10);
    if (firstDigit > 1) {
      month.value = `0${firstDigit}`;
      nextTick(() => yearRef.value?.focus());
    }
  }
  if (month.value.length === 2) {
    const monthNum = Number.parseInt(month.value, 10);
    if (monthNum < 1) month.value = "01";
    if (monthNum > 12) month.value = "12";
    nextTick(() => yearRef.value?.focus());
  }
  updateModel();
};
const onYearInput = () => {
  year.value = year.value.replace(/\D/g, "");
  updateModel();
};
const onBackspace = (fieldName) => {
  return (e) => {
    const target = e.target;
    if (e.key === "Backspace" && target.value.length === 0) {
      e.preventDefault();
      if (fieldName === "month") {
        dayRef.value?.focus();
      } else if (fieldName === "year") {
        monthRef.value?.focus();
      }
    }
  };
};
watch(model, (newVal) => {
  if (newVal) {
    const parts = newVal.split("-");
    if (parts.length === 3) {
      year.value = parts[0];
      month.value = parts[1];
      day.value = parts[2];
    }
  }
});
defineExpose({ onDayInput, onMonthInput, onYearInput, onBackspace });
</script>
