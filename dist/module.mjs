import { defineNuxtModule, createResolver, addPlugin, addImportsDir, addComponentsDir } from '@nuxt/kit';

const addComposables = (resolver) => {
  addImportsDir(resolver.resolve("runtime/composables"));
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
  defaults: {
    submitEndpoint: "/api/form/submit"
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
