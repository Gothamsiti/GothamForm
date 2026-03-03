<template lang="pug">
.input.fieldText(
    v-if="field && field.visible && hide"
    :class="{error:field.error,compiled: field.compiled},field.name"
)
    label(v-if="field.label && !field.hideLabel" :for="field.name")
        span(v-html="field.label+(field.required?'*':'')")
    ClientOnly
        VueDatePicker(
            :id="field.name"
            :name="field.name"
            v-model="model"
            range
            multi-calendars
            :placeholder="field.placeholder ? field.placeholder + (field.required ? '*' : '' ) : ''"
            :enable-time-picker="false"
            auto-apply
            :dark="field.dark || false"
            :format="_format"
            :format-locale="_formatlocales[_currentLanguage]"
        )
</template>

<script setup>
import * as _formatlocales from 'date-fns/locale'

const _format = ref('dd MMM yy')
const { field, formSlug } = defineProps(['blok', 'field', 'formSlug'])
const model = defineModel('model')
const emit = defineEmits(['addEvalFunction'])
const { currentLanguage: _currentLanguage } = useLanguage()
const { hide,gobalFieldsStore } = useField(model, field, emit, formSlug)
</script>
