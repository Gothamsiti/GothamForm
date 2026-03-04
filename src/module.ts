import { defineNuxtModule, createResolver, addImports, addComponentsDir, addPlugin } from '@nuxt/kit'
import type { Resolver } from '@nuxt/kit'

export interface ModuleOptions {
  submitEndpoint: string
}
const addComposables = (resolver: Resolver) => {
  addImports([
    {
      name: 'useForm',
      from: resolver.resolve('runtime/composables/useForm'),
    },
    {
      name: 'useField',
      from: resolver.resolve('runtime/composables/useField'),
    },
  ])
}
const addComponents = (resolver: Resolver) => {
  addComponentsDir({
    path: resolver.resolve('runtime/components'),
    prefix: 'Form',
    pathPrefix: false,
    global: true,
  })
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'gothamform',
    configKey: 'gothamform',
  },
  defaults: {
    submitEndpoint: '/api/form/submit',
  },
  setup(_options, _nuxt) {
    _nuxt.options.runtimeConfig.gothamform = { ..._options }
    const resolver = createResolver(import.meta.url)
    // addPlugins(resolver)
    // addServerRoutes(resolver)
    addComposables(resolver)
    addComponents(resolver)
    addPlugin(resolver.resolve('./runtime/plugins/vueDatePicker.client.js'))
  },
})
