<template lang="pug">
.fieldHidden(
    v-if="field && field.visible"
    :class="{error:field.error,compiled: field.compiled},field.name"
)
    input(type="hidden" :id="field.name" :name="field.name")
</template>

<script setup>
const { field, formSlug } = defineProps(['blok', 'field', 'formSlug'])
const model = defineModel('model')
const emit = defineEmits(['addEvalFunction'])
useField(model, field, emit, formSlug)
</script>

<style lang="scss">
.fieldHidden{

}
</style>
