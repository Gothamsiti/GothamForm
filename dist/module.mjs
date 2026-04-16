import { defineNuxtModule, createResolver, addPlugin, addImports, addComponentsDir } from '@nuxt/kit';

const addComposables = (resolver) => {
  addImports([
    {
      name: "useForm",
      from: resolver.resolve("runtime/composables/useForm")
    },
    {
      name: "useField",
      from: resolver.resolve("runtime/composables/useField")
    }
  ]);
};
const addComponents = (resolver) => {
  addComponentsDir({
    path: resolver.resolve("runtime/components"),
    prefix: "Form",
    pathPrefix: false,
    global: true
  });
};
const module$1 = defineNuxtModule({
  meta: {
    name: "gothamform",
    configKey: "gothamform"
  },
  setup(_options, _nuxt) {
    _nuxt.options.runtimeConfig.gothamform = { ..._options };
    const resolver = createResolver(import.meta.url);
    addComposables(resolver);
    addComponents(resolver);
    addPlugin(resolver.resolve("./runtime/plugins/vueDatePicker.client.js"));
  }
});

export { module$1 as default };
