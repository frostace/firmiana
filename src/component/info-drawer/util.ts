import { InfoDrawerField } from '.';

export const getInitialValues = (features: InfoDrawerField[] = []) => {
    return features.reduce((result, thisField) => {
        result[thisField.field] = thisField.value;
        return result;
    }, {});
};
