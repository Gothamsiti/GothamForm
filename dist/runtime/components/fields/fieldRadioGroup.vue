<template lang="pug">
.input.fieldRadioGroup(
    v-if="field && field.visible && _hide"
    :class="[{ error: field.error, compiled: field.compiled} ,field.class]"
)
    .inputOption(
        v-for="option in field.options"
        :key="option.value"
    )
        input(
            :id="`${field.name}-${option.value}`"
            :name="field.name"
            type="radio"
            :value="option.value"
            v-model="model"
        )
        label.text(:for="`${field.name}-${option.value}`")
            Icon(v-if="option.icon" :name="option.icon")
            span(v-html="option.label")
</template>

<script setup>
import { useField } from "../../composables/useField";
const { field, formSlug } = defineProps(["blok", "field", "formSlug"]);
const model = defineModel();
const emit = defineEmits(["addEvalFunction"]);
const { hide: _hide } = useField(model, field, emit, formSlug);
</script>
