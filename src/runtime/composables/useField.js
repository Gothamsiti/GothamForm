import debounce from 'lodash.debounce'

export const useField = (model, field, emit) => {
  if (field.name) {
    field.error = false
    field.visible = true
  }
  const evalField = () => {
    if (!field.visible) return
    const value = model.value
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})$/
    if (field.required) {
      field.error = field.required && (
        !value
        || (field.regex && !(new RegExp(field.regex).test(value)))
        || (field.component == 'fieldEmail' && !(new RegExp(emailRegex).test(value)))
      )
    }
    field.compiled = (!field.error && value)
  }
  if (emit) emit('addEvalFunction', evalField)
  watch(model, debounce(evalField))
}
