export function parseFields(fields?: {}): string;
export function getTemplate(storyUuid: any): Promise<{
    template: string;
    subject: any;
    story: any;
} | undefined>;
export function parseMultipartFormFields(body: any): {
    fields: {};
    files: {};
    emailTemplate: any;
};
export function textReplacer(str: any, values: any): any;
