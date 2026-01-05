<template lang="pug">
.input.fieldFile(
    v-if="field && field.visible"
    :class="{error:field.error,compiled: field.compiled},field.name"
    @click="inputFile.click()"
)
    input(type="file" ref="inputFile" :name="field.name" :accept="field.accept" @change="fileChange")
    .label
        label(v-if="field.label" :for="field.name")
            span(v-html="field.label+(field.required?'*':'')")
        .placeholder(v-if="field.placeholder" v-html="field.placeholder")
    Icon.icon(name="gotham:arrow-full-up")
</template>

<script setup>
const inputFile = ref()
const { field } = defineProps(['blok', 'field', 'modelValue'])
const model = defineModel('model')
const emit = defineEmits(['addEvalFunction'])
const filename = computed(() => {
  return model?.value?.name || ''
})
const fileChange = (f) => {
  const { target } = f
  if (target?.files) {
    model.value = target.files[0]
  }
}
useField(model, field, emit)
</script>

<style lang="scss">
.fieldFile{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    input{
        display: none;
    }
}
</style>
