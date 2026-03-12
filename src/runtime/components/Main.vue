<template lang='pug'>
section.Form(ref="$el" :class="{submitting:_submitting,submitted:_submittedComputed}")
  .system.message(v-if="_submittedComputed")
      h4(v-html="$__('FormSubmitOkTitle')")
      p {{ $__('FormSubmitOkText') }}
  template(v-else)
      form(@submit="formSubmit")
          template(v-if="!_submittedComputed" v-for="field of fields" :key="field._uid")
              StoryblokComponent( v-if="field.name" v-model:model="field.value" :blok="{component:field.component,originalblok:field}" :field="field" :formSlug="blok.scope || formSlug" @addEvalFunction="_addEvalFunction" v-editable="field")
              StoryblokComponent( v-else :blok="{component:field.component,originalblok:field}" :field="field" v-editable="field" :formSlug="blok.scope || formSlug")
          .error.system.message(v-if="_error")
              h4(v-html="$__('FormSubmitKoTitle')")
              p {{ $__('FormSubmitKoText') }}
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAsyncData } from '#app'
import { useForm } from '../composables/useForm'

const { blok, storyUuid } = defineProps(['blok', 'storyUuid'])
const fields = ref(undefined)
const formId = ref(undefined)
const formSlug = ref(undefined)

if (storyUuid || blok.form) {
  const uuid = storyUuid || blok.form
  const { data: story } = await useAsyncData(`form_${uuid}`, async () => {
    const params = {
      fullSlug: uuid,
      find_by: 'uuid',
    }
    return $fetch('/api/storyblok/request', { query: params })
  })
  if (story?.value?.content?.component !== 'FormMain') throw createError({ statusCode: 500, statusMessage: 'story is not a form', fatal: false })
  fields.value = story?.value?.content.fields
  formId.value = story?.value?.uuid
  formSlug.value = story?.value?.slug
}
else if (blok) {
  fields.value = blok.fields
  formId.value = blok.formWrapperId ?? blok._uid
}
if (fields.value?.length) {
  for (const field of fields.value) if (field.name) field.value = ref()
}
const {
  submitted: _submitted,
  submitting: _submitting,
  error: _error,
  addEvalFunction: _addEvalFunction,
} = useForm(fields.value, formId.value)

const _submittedComputed = computed(() => {
  return _submitted.value === formId.value
})
</script>
