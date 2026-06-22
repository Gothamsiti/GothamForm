import { ref } from "#imports";
export const useForm = (fields, uid) => {
  if (!fields?.length) return void 0;
  const evalFunctions = ref([]);
  const formUid = ref(uid);
  const flatFields = () => {
    const arr = [];
    for (const field of fields) {
      if (field.component == "fieldFlexGroup") {
        for (const nestedField of field.fields) {
          arr.push(nestedField);
        }
      } else {
        arr.push(field);
      }
    }
    fields = arr;
  };
  flatFields();
  const addEvalFunction = (f) => evalFunctions.value.push(f);
  const getPayload = (fields2) => {
    const payload = {};
    const formData = new FormData();
    const handleFieldValue = (field) => {
      if (field.name) {
        payload[field.name] = field.value;
        if (field.component == "FieldFile") {
          formData.append(field.name, field.value, field.value?.name);
        } else {
          formData.append(field.name, field.value);
        }
      }
    };
    for (const field of fields2) {
      handleFieldValue(field);
    }
    return { payload, formData };
  };
  const evalFields = (fields2) => {
    const handleErrorField = function(field) {
      const classes = `.${field?.component}.${field?.name}`;
      document.querySelector(`${classes} input, ${classes} textarea`)?.focus();
    };
    for (const field of fields2) {
      if (field.error) {
        handleErrorField(field);
        return false;
      }
      ;
    }
    return true;
  };
  const formSubmit = async (event) => {
    for (const func of evalFunctions.value) func();
    if (!evalFields(fields)) {
      event.preventDefault();
      return false;
    } else {
      event.preventDefault();
      const { formData, payload } = getPayload(fields);
      return { formData, payload, clearFields };
    }
  };
  const clearFields = () => {
    if (import.meta.server) return;
    window.clearingFields = true;
    for (const field of fields) {
      field.value = void 0;
    }
    setTimeout(() => window.clearingFields = false, 50);
  };
  return { formSubmit, addEvalFunction, formUid };
};
