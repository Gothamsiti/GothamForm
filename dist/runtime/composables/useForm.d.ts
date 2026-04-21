export declare const useForm: (fields: any, uid: any) => {
    formSubmit: (event: any) => Promise<false | {
        formData: FormData;
        payload: {};
        clearFields: () => void;
    }>;
    addEvalFunction: (f: any) => any;
    formUid: any;
} | undefined;
