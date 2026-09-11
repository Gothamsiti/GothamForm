import { ref } from "#imports";
export const useForm = (fields, uid) => {
  if (!fields?.length) return void 0;
  const evalFunctions = ref([]);
  const formUid = ref(uid);
  const flatFields = () => {
    const arr = [];
    for (const field of fields) {
      if (field.component == "FormFieldFlexGroup") {
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
  const evalFields = (fields2, form = document) => {
    const handleErrorField = function(field) {
      if (!field?.name) return;
      const name = CSS.escape(field.name);
      const input = form.querySelector(`[name="${name}"]`);
      const wrapper = input?.closest(".input") || input || form.querySelector(`.${name}`);
      wrapper?.scrollIntoView({ behavior: "smooth", block: "center" });
      input?.focus({ preventScroll: true });
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
    if (!evalFields(fields, event.currentTarget || void 0)) {
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
