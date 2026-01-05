<template lang="pug">
.input.fieldEmail(
    v-if="field && field.visible"
    :class="{error:field.error,compiled: field.compiled},field.name"
)
    label(v-if="field.label && !field.hideLabel" :for="field.name")
        span(v-html="field.label+(field.required?'*':'')")
    input(
        :id="field.name"
        :name="field.name"
        type="email"
        v-model="model"
        :placeholder="field.placeholder ? field.placeholder + (field.required ? '*' : '' ) : ''"
    )
</template>

<script setup>
const { field } = defineProps(['blok', 'field', 'modelValue'])
const model = defineModel('model')
const emit = defineEmits(['addEvalFunction'])
useField(model, field, emit)
</script>
