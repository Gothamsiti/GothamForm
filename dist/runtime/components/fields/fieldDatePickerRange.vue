<template lang="pug">
.input.fieldText(
    v-if="field && field.visible && _hide"
    :class="{error:field.error,compiled: field.compiled},field.name"
)
    label(v-if="field.label && !field.hideLabel" :for="field.name")
        span(v-html="field.label+(field.required?'*':'')")
    ClientOnly
        component(:is="_DatePickerComponent"
            :id="field.name"
            :name="field.name"
            :range="field.range || false"
            :multi-calendars="field.multiCalendars || false"
            :placeholder="field.placeholder ? field.placeholder + (field.required ? '*' : '' ) : ''"
            :time-config="{ enableTimePicker: field.enableTimePicker || false }"
            :dark="field.dark || false"
            :format="_format"
            :format-locale="formatLocale"
            :min-date="field.minDateNow ? new Date() : null"
            auto-apply
            v-model="model"
        )
</template>

<script setup>
import { defineAsyncComponent, ref, onMounted, useLanguage } from "#imports";
import { useField } from "../../composables/useField";
const _DatePickerComponent = defineAsyncComponent(
  () => import("@vuepic/vue-datepicker").then((m) => m.VueDatePicker ?? m.default)
);
const _format = ref("dd MMM yy");
const { field, formSlug } = defineProps(["blok", "field", "formSlug"]);
const model = defineModel("model");
const emit = defineEmits(["addEvalFunction"]);
const { currentLanguage: _currentLanguage } = useLanguage();
const formatLocale = ref(null);
onMounted(async () => {
  const localeKey = _currentLanguage.value;
  if (localeKey === "it" || localeKey === "it-IT") {
    const { it } = await import("date-fns/locale/it");
    formatLocale.value = it;
  } else {
    const { enUS } = await import("date-fns/locale/en-US");
    formatLocale.value = enUS;
  }
});
const { hide: _hide } = useField(model, field, emit, formSlug);
</script>
