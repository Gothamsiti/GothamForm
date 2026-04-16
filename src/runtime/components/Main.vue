<template lang='pug'>
section.Form(ref="$el" :class="{submitting,submitted}")
  .system.message(v-if="submitted")
      h4(v-html="$__('FormSubmitOkTitle')")
      p {{ $__('FormSubmitOkText') }}
  template(v-else)
      form(@submit="handleSubmit")
          template(v-if="!submitted" v-for="field of fields" :key="field._uid")
              StoryblokComponent( v-if="field.name" v-model:model="field.value" :blok="{component:field.component,originalblok:field}" :field="field" :formSlug="blok.scope || formSlug" @addEvalFunction="_addEvalFunction" v-editable="field")
              StoryblokComponent( v-else :blok="{component:field.component,originalblok:field}" :field="field" v-editable="field" :formSlug="blok.scope || formSlug")
          .error.system.message(v-if="error")
              h4(v-html="$__('FormSubmitKoTitle')")
              p {{ $__('FormSubmitKoText') }}
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAsyncData } from '#app'
import { useForm } from '../composables/useForm'

const { blok, submitting, submitted, error, storyUuid } = defineProps(['blok','submitting','submitted','error','storyUuid'])
const emit = defineEmits(['submit'])
const fields = ref(undefined)
const formId = ref(undefined)
const formSlug = ref(undefined)
let emailTemplate = undefined;

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
  emailTemplate = story?.value?.content?.emailTemplate
}
else if (blok) {
  fields.value = blok.fields
  formId.value = blok.formWrapperId ?? blok._uid
}
if (fields.value?.length) {
  for (const field of fields.value) if (field.name) field.value = ref()
}
const {
  addEvalFunction: _addEvalFunction,
  formSubmit,
} = useForm(fields.value, formId.value)


const handleSubmit = async (e) => {
  const response = await formSubmit(e);
  if (!response) return;
  emit('submit', { fields: response, emailTemplate });
}
</script>
