import { getElement, getWrappedInputElement } from '../../helper-functions';
import type { SetPropsFn, ValidationConfig } from './validation-config';

export const getWrappedTextInputValidationConfig = <T>(
    wrapperElelent: T,
    stateField: string,
    setPropsFn: SetPropsFn,
) => {
    return {
        // ...getElement(
        //     getElement(form.children.PasswordInput).children['Control'],
        // ),
        ...getWrappedInputElement(wrapperElelent),
        events: {
            change: (e?: Event) => {
                if (!e) {
                    return;
                }
                const target = e.target as HTMLInputElement;
                setPropsFn({
                    formState: {
                        [stateField]: target.value,
                    },
                });
            },
        },
    };
};
