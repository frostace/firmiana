import React, { FC } from 'react';
import { Input } from 'antd';

import { ImageUploader } from '..';

interface XComponentProps {
    value?: any;
    onChange?: (v: any) => void;
}

const ComponentMap = {
    input: Input,
    'image-uploader': ImageUploader,
};

const urlRegex =
    /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;

const getXTypeFromValue = (value: any) => {
    if (Array.isArray(value) && value.every((url) => urlRegex.test(url))) {
        return 'image-uploader';
    }
    // fallback
    return 'input';
};

const XComponent: FC<XComponentProps> = (props) => {
    const { value } = props;
    const xType = getXTypeFromValue(value);
    const Component = ComponentMap[xType];
    return <Component {...props} />;
};

export default XComponent;
