import { defineNuxtModule, createResolver, addPlugin, addImports, addComponentsDir, addServerHandler } from '@nuxt/kit';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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
const currentDir = dirname(fileURLToPath(import.meta.url));
const addServerRoutes = (resolver) => {
  const basePath = "/api/gothamform";
  const sourcePath = "./runtime/server/api/gothamform";
  const targetDir = join(currentDir, sourcePath);
  const files = readdirSync(targetDir);
  const cleanedFiles = files.filter((e) => e.includes(".js") || e.includes(".ts")).map((e) => e.replace(".js", "").replace(".ts", ""));
  cleanedFiles.forEach((handler) => {
    const [route, method] = handler.split(".");
    addServerHandler({
      route: `${basePath}/${route}`,
      handler: resolver.resolve(`${sourcePath}/${route}.${method}`)
    });
  });
};
const module$1 = defineNuxtModule({
  meta: {
    name: "gothamform",
    configKey: "gothamform"
  },
  defaults: {},
  setup(_options, _nuxt) {
    _nuxt.options.runtimeConfig.gothamform = { ..._options };
    const resolver = createResolver(import.meta.url);
    addComposables(resolver);
    addComponents(resolver);
    addPlugin(resolver.resolve("./runtime/plugins/vueDatePicker.client.js"));
    addServerRoutes(resolver);
  }
});

export { module$1 as default };
