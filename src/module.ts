import { defineNuxtModule, createResolver, addImports, addServerHandler, addComponentsDir, addPlugin } from '@nuxt/kit'
import type { Resolver } from '@nuxt/kit'
import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

interface BrevoOptions {
  key: string | undefined
}
export interface ModuleOptions {
  from: string
  to: string
  brevo?: BrevoOptions | undefined
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

const currentDir = dirname(fileURLToPath(import.meta.url))

const addServerRoutes = (resolver: Resolver) => {
  // tutto quello che segue è stato fatto perche le dynamic route come da documentazione non funzionano.
  const basePath = '/api/gothamform'
  const sourcePath = './runtime/server/api/gothamform'
  const targetDir = join(currentDir, sourcePath)
  const files = readdirSync(targetDir)
  const cleanedFiles = files.filter(e => e.includes('.js') || e.includes('.ts')).map(e => e.replace('.js', '').replace('.ts', ''))
  cleanedFiles.forEach((handler) => {
    const [route, method] = handler.split('.')
    addServerHandler({
      route: `${basePath}/${route}`,
      handler: resolver.resolve(`${sourcePath}/${route}.${method}`),
    })
  })
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'gothamform',
    configKey: 'gothamform',
  },
  defaults: {

  },
  setup(_options, _nuxt) {
    _nuxt.options.runtimeConfig.gothamform = { ..._options }
    const resolver = createResolver(import.meta.url)
    // addPlugins(resolver)
    // addServerRoutes(resolver)
    addComposables(resolver)
    addComponents(resolver)
    addPlugin(resolver.resolve('./runtime/plugins/vueDatePicker.client.js'))
    addServerRoutes(resolver)
  },
})
