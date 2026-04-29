import { useDebounceFn } from '@vueuse/core'
import { useState } from '#app'
import { watch, computed } from '#imports'

export const useField = (model, field, emit, formSlug) => {
  const gobalFieldsStore = useState('gobalFieldsStore', () => ({}))
  const globalEvalFieldsStore = useState('globalEvalFieldsStore', () => ({}))
  if (model && field && emit) {
    if (formSlug) {
      if (!gobalFieldsStore.value[formSlug]) gobalFieldsStore.value[formSlug] = {}
      if (field.name && !gobalFieldsStore.value[formSlug][field.name]) {
        gobalFieldsStore.value[formSlug][field.name] = field.value
      }
    }
    if (field.name) {
      field.error = false
      field.visible = true
    }
    const evalField = () => {
      if (!field.visible) return
      const value = model.value
      const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]{2,}$/
      if (field.required) {
        field.error = field.required && (
          !value
          || (field.regex && !(new RegExp(field.regex).test(value)))
          || (field.component == 'fieldEmail' && !(new RegExp(emailRegex).test(value)))
        )
      }
      field.compiled = (!field.error && value)
      field.value = model.value
      gobalFieldsStore.value[formSlug][field.name] = field.value
    }
    if (emit) emit('addEvalFunction', evalField)

    if (import.meta.client && formSlug) {
      if (!globalEvalFieldsStore.value[formSlug]) globalEvalFieldsStore.value[formSlug] = {}
      globalEvalFieldsStore.value[formSlug][field.name] = evalField
    }
    watch(model, useDebounceFn(evalField, 300))
  }
  const hide = computed(() => {
    if (!field.hideCondition) return true
    try {
      const func = new Function('gobalFieldsStore', 'field', 'value', `return ${field.hideCondition}`)
      if (func(gobalFieldsStore.value, field, model.value)) {
        return true
      }
      else {
        field.value = undefined
        model.value = undefined
        if (gobalFieldsStore.value[formSlug] && gobalFieldsStore.value[formSlug][field.name])
          delete gobalFieldsStore.value[formSlug][field.name]
        return false
      }
    }
    catch (e) {
      console.error('Error evaluating hideCondition:', e)
      return true
    }
  })
  return { gobalFieldsStore, hide, globalEvalFieldsStore }
}
