import * as _nuxt_schema from '@nuxt/schema';

interface BrevoOptions {
    key: string | undefined;
}
interface ModuleOptions {
    from: string;
    to: string;
    brevo?: BrevoOptions | undefined;
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions, ModuleOptions, false>;

export { _default as default };
export type { ModuleOptions };
