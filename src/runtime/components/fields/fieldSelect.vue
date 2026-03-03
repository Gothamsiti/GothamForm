<template lang="pug">
.input.fieldSelect(
    v-if="field && field.visible && _hide"
    :class="{error:field.error,compiled: field.compiled},field.name"
)
    label(v-if="field.label && !field.hideLabel" :for="field.name")
        span(v-html="field.label+(field.required?'*':'')")
    select(
        :id="field.name"
        :name="field.name"
        v-model="field.value"
        :placeholder="field.placeholder ? field.placeholder + (field.required ? '*' : '' ) : ''"
        :class="{error:field.error,compiled: field.compiled},field.name"
    )
        option(default :value="undefined" v-if="field.placeholder") {{field.placeholder}}
        template(v-if="customSource && customSource.length>0")
            option(v-for="item in customSource" :key="item.id" :name="item.name" :value="item.value") {{ item.name }}
        template(v-if="field.options")
            | {{ field.options }}
            option(v-for="option in field.options" :value="option.value") {{ option.name || option.label }}
    Icon(name="gotham:arrow-full-up")
</template>

<script setup>
import { useField } from '../../composables/useField'

const { field, formSlug } = defineProps(['blok', 'field', 'customSource', 'formSlug'])
const model = defineModel('model')
const emit = defineEmits(['addEvalFunction'])
watch(() => field.value, () => {
  model.value = field.value
})
const { hide: _hide } = useField(model, field, emit, formSlug)
</script>
