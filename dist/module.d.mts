interface BrevoOptions {
    key: string;
}
interface ModuleOptions {
    from: string;
    to: string;
    brevo?: BrevoOptions | undefined;
}
declare const _default: any;

export { _default as default };
export type { ModuleOptions };
