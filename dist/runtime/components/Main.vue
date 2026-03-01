<template lang="pug">
section.Form(ref="$el" :class="{submitting:_submitting,submitted:_submittedComputed}")
  .system.message(v-if="_submittedComputed")
      h4(v-html="$__('FormSubmitOkTitle')")
      p {{ $__('FormSubmitOkText') }}
  template(v-else)
      form(@submit="formSubmit")
          template(v-if="!_submittedComputed" v-for="field of fields" :key="field._uid")
              .flexGroup(v-if="field.component == 'fieldFlexGroup'")
                  template(v-for="subfield of field.fields" :key="subfield._uid")
                      StoryblokComponent( v-if="subfield.name" v-model:model="subfield.value" :blok="{component:subfield.component,originalblok:subfield}" :field="subfield" @addEvalFunction="addEvalFunction" v-editable="subfield")
                      StoryblokComponent( v-else :blok="{component:subfield.component,originalblok:subfield}" :field="subfield" v-editable="subfield")
              StoryblokComponent( v-else-if="field.name" v-model:model="field.value" :blok="{component:field.component,originalblok:field}" :field="field" @addEvalFunction="addEvalFunction" v-editable="field")
              StoryblokComponent( v-else :blok="{component:field.component,originalblok:field}" :field="field" v-editable="field")
          .error.system.message(v-if="_error")
              h4(v-html="$__('FormSubmitKoTitle')")
              p {{ $__('FormSubmitKoText') }}
</template>

<script setup>
const { blok, storyUuid, addEvalFunction } = defineProps(["blok", "storyUuid", "addEvalFunction"]);
const fields = ref(void 0);
const formId = ref(void 0);
if (storyUuid || blok.form) {
  const uuid = storyUuid || blok.form;
  const { data: story } = await useAsyncData(`form_${uuid}`, async () => {
    const params = {
      fullSlug: uuid,
      find_by: "uuid"
    };
    return $fetch("/api/storyblok/request", { query: params });
  });
  if (story?.value?.content?.component !== "FormMain") throw createError({ statusCode: 500, statusMessage: "story is not a form", fatal: false });
  fields.value = story?.value?.content.fields;
  formId.value = story.value.uuid;
} else if (blok) {
  fields.value = blok.fields;
  formId.value = blok.formWrapperId ?? blok._uid;
}
if (fields.value?.length) {
  for (const field of fields.value) if (field.name) field.value = ref();
}
const {
  submitted: _submitted,
  submitting: _submitting,
  error: _error
} = useForm(fields.value, formId.value);
const _submittedComputed = computed(() => {
  return _submitted.value === formId.value;
});
</script>
