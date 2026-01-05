import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtModule, createResolver, addImportsDir, addComponentsDir } from '@nuxt/kit'
import type { Resolver } from '@nuxt/kit'

const currentDir = dirname(fileURLToPath(import.meta.url))

export interface ModuleOptions {
  submitEndpoint: string
}
const addComposables = (resolver: Resolver) => {
  addImportsDir(resolver.resolve('runtime/composables'))
}
const addComponents = (resolver: Resolver) => {
  addComponentsDir({
    path: resolver.resolve('runtime/components'),
    prefix: 'Form',
    pathPrefix: false,
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
    _nuxt.options.runtimeConfig.gothamstoryblok = { ..._options }
    const resolver = createResolver(import.meta.url)
    // addPlugins(resolver)
    // addServerRoutes(resolver)
    addComposables(resolver)
    addComponents(resolver)
  },
})
