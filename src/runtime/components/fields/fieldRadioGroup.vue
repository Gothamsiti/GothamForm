<template lang="pug">
.input.fieldRadioGroup(
    v-if="field && field.visible"
    :class="{ error: field.error, compiled: field.compiled }"
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
            span(v-html="option.label")
</template>

<script setup>
const { field } = defineProps(['blok', 'field', 'modelValue'])
const model = defineModel()
const emit = defineEmits(['addEvalFunction'])
useField(model, field, emit)
</script>

<style lang="scss">
.fieldRadioGroup {
}
</style>
