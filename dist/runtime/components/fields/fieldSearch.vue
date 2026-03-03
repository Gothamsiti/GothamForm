<template lang="pug">
.input.fieldSearch(
    v-if="field && field.visible && _hide"
    :class="{error:field.error,compiled: field.compiled},field.name"
)
    label(v-if="field.label && !field.hideLabel" :for="field.name")
        span(v-html="field.label+(field.required?'*':'')")
    input(
        type="search"
        :id="field.name"
        :name="field.name"
        v-model="model"
        :placeholder="field.placeholder ? field.placeholder + (field.required ? '*' : '' ) : ''"
    )
</template>

<script setup>
import { useField } from "../../composables/useField";
const { field, formSlug } = defineProps(["blok", "field", "formSlug"]);
const model = defineModel("model");
const emit = defineEmits(["addEvalFunction"]);
const { hide: _hide } = useField(model, field, emit, formSlug);
</script>
