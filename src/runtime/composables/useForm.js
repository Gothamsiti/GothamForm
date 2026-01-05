export const useForm = (fields, uid) => {
  const evalFunctions = ref([])
  const submitting = ref(false)
  const submitted = ref(undefined)
  const error = ref(false)
  const formUid = ref(uid)

  const flatFields = () => {
    const arr = []
    for (const field of fields) {
      if (field.component == 'fieldFlexGroup') {
        for (const nestedField of field.fields) {
          arr.push(nestedField)
        }
      }
      arr.push(field)
    }

    fields = arr
  }

  flatFields()

  const addEvalFunction = f => evalFunctions.value.push(f)
  const getPayload = (fields) => {
    const payload = {}
    let formData = new FormData()

    const handleFieldValue = (field) => {
      if (field.name) {
        payload[field.name] = field.value
        if (field.component == 'FieldFile') {
          formData.append(field.name, field.value, field.value?.name)
        }
        else {
          formData.append(field.name, field.value)
        }
      }
    }

    for (const field of fields) {
      handleFieldValue(field)
    }
    return { payload, formData }
  }
  const evalFields = (fields) => {
    const handleErrorField = function (field) {
      const classes = `.${field?.component}.${field?.name}`
      document.querySelector(`${classes} input, ${classes} textarea`)?.focus()
    }

    for (const field of fields) {
      if (field.error) {
        handleErrorField(field)
        return false
      };
    }
    return true
  }
  const formSubmit = async (event) => {
    error.value = false
    for (const func of evalFunctions.value) func()
    if (!evalFields(fields)) {
      event.preventDefault()
      return false
    }
    else {
      event.preventDefault()

      const { payload, formData } = getPayload(fields)

      try {
        submitting.value = true
        await $fetch('/api/form/submit', {
          method: 'POST',
          body: formData,
        })
        clearFields()
        submitted.value = formUid.value
      }
      catch (fetchError) {
        console.log('formSubmit fetchError', fetchError)
        error.value = fetchError
      }
      submitting.value = false
    }
  }

  const clearFields = () => {
    if (import.meta.server) return
    window.clearingFields = true

    for (const field of fields) {
      field.value = undefined
    }
    // il nextTick non è sufficiente, ricorro ad un timeout in questo caso.
    setTimeout(() => { window.clearingFields = false }, 50)
  }
  return { submitting, submitted, formSubmit, addEvalFunction, error, formUid }
}
