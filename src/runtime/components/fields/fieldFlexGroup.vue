<template lang="pug">
.fieldFlexGroup
    template(v-for="subfield of blok?.originalblok?.fields" :key="subfield._uid")
        StoryblokComponent( v-if="subfield.name" v-model:model="subfield.value" :blok="{component:subfield.component,originalblok:subfield}" :formSlug="formSlug" :field="subfield" @addEvalFunction="_addEvalFunction" v-editable="subfield")
        StoryblokComponent( v-else :blok="{component:subfield.component,originalblok:subfield}" :formSlug="formSlug" :field="subfield" v-editable="subfield")
</template>

<script setup>
defineProps(['blok', 'formSlug'])
const emit = defineEmits(['addEvalFunction'])
const _addEvalFunction = (event) => {
  emit('addEvalFunction', event)
}
</script>
