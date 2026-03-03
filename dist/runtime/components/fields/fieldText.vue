<template lang="pug">
.input.fieldText(
    v-if="field && field.visible && _hide"
    :class="{error:field.error,compiled: field.compiled},field.name"
)
    label(v-if="field.label && !field.hideLabel" :for="field.name")
        span(v-html="field.label+(field.required?'*':'')")
    input(
        type="text"
        :id="field.name"
        :name="field.name"
        v-model="model"
        :placeholder="field.placeholder ? field.placeholder + (field.required ? '*' : '' ) : ''"
    )
</template>

<script setup>
const { field, formSlug } = defineProps(["field", "formSlug"]);
const model = defineModel("model");
const emit = defineEmits(["addEvalFunction"]);
const { hide: _hide } = useField(model, field, emit, formSlug);
</script>
