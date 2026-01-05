<template lang="pug">
.input.fieldText(
	v-if="field && field.visible"
	:class="{error:field.error,compiled: field.compiled},field.name"
)
	label(v-if="field.label && !field.hideLabel" :for="field.name")
		span(v-html="field.label+(field.required?'*':'')")
	vue-date-picker(
		:id="field.name"
		:name="field.name"
		v-model="model"
		range
		multi-calendars
		:placeholder="field.placeholder ? field.placeholder + (field.required ? '*' : '' ) : ''"
		:enable-time-picker="false"
		auto-apply
		dark
		:format="format"
		:format-locale="formatlocales[currentLanguage]"
	)
</template>

<script setup>
import * as formatlocales from 'date-fns/locale'

const format = ref('dd MMM yy')
const { field } = defineProps(['blok', 'field', 'modelValue'])
const model = defineModel('model')
const emit = defineEmits(['addEvalFunction'])
const { currentLanguage } = useLanguage()
useField(model, field, emit)
</script>
