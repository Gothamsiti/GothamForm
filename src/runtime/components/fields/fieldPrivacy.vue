<template lang='pug'>
.input.fieldPrivacy(
    v-if="field && field.visible"
    :class="{error:field.error,compiled: field.compiled},field.name"
)
    label(v-if="field.label" :for="field.name")
        span(v-html="field.label+(field.required?'*':'')")
    .inputContent
        label.text( @click="() => { checkbox?.click() } "  :for="field.name")
            StoryblokRichText(:doc="field.text")
        .fakeCheck(@click="() => { checkbox?.click() } ")
        input(
            :id="field.name"
            :name="field.name"
            type="checkbox"
            v-model="model"
            ref="checkbox"
        )
</template>

<script setup>
const checkbox = ref()
const { field } = defineProps(['blok', 'field', 'modelValue'])
const model = defineModel('model')
const emit = defineEmits(['addEvalFunction'])
useField(model, field, emit)
</script>
