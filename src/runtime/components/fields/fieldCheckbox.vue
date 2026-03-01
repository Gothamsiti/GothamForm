<template lang='pug'>
.input.fieldCheckbox(
    v-if="field && field.visible"
    :class="{error:field.error,compiled: field.compiled},field.name"
)
    label(v-if="field.label" :for="field.name")
        span(v-html="field.label+(field.required?'*':'')")
    .inputContent
        label.text( @click="() => { _checkbox?.click() } "  :for="field.name")
            StoryblokRichText(:doc="field.text")
        .fakeCheck(@click="() => { _checkbox?.click() } ")
        input(
            :id="field.name"
            :name="field.name"
            type="checkbox"
            v-model="model"
            ref="_checkbox"
        )
</template>

<script setup>
const _checkbox = ref()
const { field, formSlug } = defineProps(['blok', 'field', 'formSlug'])
const model = defineModel('model')
const emit = defineEmits(['addEvalFunction'])
useField(model, field, emit, formSlug)
</script>
