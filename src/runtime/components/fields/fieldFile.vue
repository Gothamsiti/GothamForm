<template lang="pug">
.input.fieldFile(
    v-if="field && field.visible && _hide"
    :class="{error:field.error,compiled: field.compiled},field.name"
    @click="_inputFile.click()"
)
    input(type="file" ref="_inputFile" :name="field.name" :accept="field.accept" @change="_fileChange")
    .label
        label(v-if="field.label" :for="field.name")
            span(v-html="field.label+(field.required?'*':'')")
        .placeholder(v-if="field.placeholder" v-html="field.placeholder")
    Icon.icon(name="gotham:arrow-full-up")
</template>

<script setup>
import { useField } from '../composables/useField'

const _inputFile = ref()
const { field, formSlug } = defineProps(['blok', 'field', 'formSlug'])
const model = defineModel('model')
const emit = defineEmits(['addEvalFunction'])
const _fileChange = (f) => {
  const { target } = f
  if (target?.files) {
    model.value = target.files[0]
  }
}
const { hide: _hide } = useField(model, field, emit, formSlug)
</script>
