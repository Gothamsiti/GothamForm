<template lang="pug">
section.Form(ref="$el" :class="{submitting:_submitting,submitted:_submitted}")
  .system.message(v-if="_submitted")
      h4(v-html="$__('FormSubmitOkTitle')")
      p {{ $__('FormSubmitOkText') }}
  template(v-else)
      form(@submit="_handleSubmit")
          template(v-if="!_submitted" v-for="field of fields" :key="field._uid")
              StoryblokComponent( v-if="field.name" v-model:model="field.value" :blok="{component:field.component,originalblok:field}" :field="field" :formSlug="blok.scope || formSlug" @addEvalFunction="_addEvalFunction" v-editable="field")
              StoryblokComponent( v-else :blok="{component:field.component,originalblok:field}" :field="field" v-editable="field" :formSlug="blok.scope || formSlug")
          .error.system.message(v-if="_error")
              h4(v-html="$__('FormSubmitKoTitle')")
              p {{ $__('FormSubmitKoText') }}
</template>

<script setup>
import { ref } from "vue";
import { useAsyncData } from "#app";
import { useForm } from "../composables/useForm";
import { useLanguage } from "#imports";
const { blok, submitting: _submitting, submitted: _submitted, error: _error, storyUuid } = defineProps(["blok", "submitting", "submitted", "error", "storyUuid"]);
const emit = defineEmits(["submit"]);
const fields = ref(void 0);
const formId = ref(void 0);
const formSlug = ref(void 0);
let emailTemplate = void 0;
const { currentLanguage, defaultLanguage } = useLanguage();
if (storyUuid || blok.form) {
  const uuid = storyUuid || blok.form;
  const language = currentLanguage.value && currentLanguage.value !== defaultLanguage.value ? currentLanguage.value : void 0;
  const { data: story } = await useAsyncData(`form_${uuid}_${language || defaultLanguage.value || "default"}`, async () => {
    const params = {
      fullSlug: uuid,
      find_by: "uuid",
      language
    };
    return $fetch("/api/storyblok/request", { query: params });
  });
  if (story?.value?.content?.component !== "FormMain") throw createError({ statusCode: 500, statusMessage: "story is not a form", fatal: false });
  fields.value = story?.value?.content.fields;
  formId.value = story?.value?.uuid;
  formSlug.value = story?.value?.slug;
  emailTemplate = story?.value?.content?.emailTemplate;
} else if (blok) {
  fields.value = blok.fields;
  formId.value = blok.formWrapperId ?? blok._uid;
}
if (fields.value?.length) {
  for (const field of fields.value) if (field.name) field.value = ref();
}
const {
  addEvalFunction: _addEvalFunction,
  formSubmit
} = useForm(fields.value, formId.value);
const _handleSubmit = async (e) => {
  const response = await formSubmit(e);
  if (!response) return;
  emit("submit", { fields: response, emailTemplate });
};
</script>
