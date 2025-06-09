import { getElement, getWrappedInputElement } from '../../helper-functions';
import type { SetPropsFn } from './validation-config';

export const getWrappedTextInputPropsForValidation = <T>(
    wrapperElement: T,
    stateField: string,
    setPropsFn: SetPropsFn,
) => {
    return {
        ...getWrappedInputElement(wrapperElement),
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

export const getTextInputPropsForValidation = <T>(
    element: T,
    stateField: string,
    setPropsFn: SetPropsFn,
) => {
    return {
        ...getElement(element),
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
