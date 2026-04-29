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
    .files(v-if="_selectedFileNames.length")
        .file(v-for="(fileName, index) in _selectedFileNames" :key="`${fileName}-${index}`")
            span {{ fileName }}
            Icon.icon(name="gotham:trash" @click.stop.prevent="model = null")
    .files(v-else)
        .file(v-if="field.placeholder")
            span {{ field.placeholder }}
            Icon.icon(name="gotham:folder")
</template>

<script setup>
import { computed, ref } from '#imports'
import { useField } from '../../composables/useField'

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

const _selectedFileNames = computed(() => {
  if (!model.value) return []

  if (Array.isArray(model.value)) {
    return model.value
      .map(file => file?.name)
      .filter(Boolean)
  }

  if (typeof FileList !== 'undefined' && model.value instanceof FileList) {
    return Array.from(model.value)
      .map(file => file?.name)
      .filter(Boolean)
  }

  if (typeof model.value === 'object' && model.value?.name) {
    return [model.value.name]
  }

  return []
})

const { hide: _hide } = useField(model, field, emit, formSlug)
</script>
