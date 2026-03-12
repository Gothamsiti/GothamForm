<template lang="pug">
.input.fieldText(
    v-if="field && field.visible && _hide"
    :class="{error:field.error,compiled: field.compiled},field.name"
)
    label(v-if="field.label && !field.hideLabel" :for="field.name")
        span(v-html="field.label+(field.required?'*':'')")
    Icon(v-if="field.icon" :name="field.icon")
    input(
        type="text"
        :id="field.name"
        :name="field.name"
        v-model="model"
        :placeholder="field.placeholder ? field.placeholder + (field.required ? '*' : '' ) : ''"
    )
</template>

<script setup>
import { useField } from "../../composables/useField";
const { field, formSlug } = defineProps(["field", "formSlug"]);
const model = defineModel("model");
const emit = defineEmits(["addEvalFunction"]);
const { hide: _hide } = useField(model, field, emit, formSlug);
</script>
