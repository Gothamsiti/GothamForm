import debounce from 'lodash.debounce'
import { watch } from 'vue'

export const useField = (model, field, emit, formSlug) => {
  const gobalFieldsStore = useState('gobalFieldsStore', () => ({}))
  if(model && field && emit){
    if(formSlug){
      if(!gobalFieldsStore.value[formSlug]) gobalFieldsStore.value[formSlug] = {};
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
    watch(model, debounce(evalField))
  }
  return { gobalFieldsStore }
}
