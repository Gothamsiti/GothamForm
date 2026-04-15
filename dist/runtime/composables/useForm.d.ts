export declare const useForm: (fields: any, uid: any) => {
    submitted: boolean;
    submitting: boolean;
    error: boolean;
    formSubmit?: undefined;
    addEvalFunction?: undefined;
    formUid?: undefined;
} | {
    submitting: any;
    submitted: any;
    formSubmit: (event: any) => Promise<false | {
        formData: FormData;
        payload: {};
        clearFields: () => void;
    }>;
    addEvalFunction: (f: any) => any;
    error: any;
    formUid: any;
};
