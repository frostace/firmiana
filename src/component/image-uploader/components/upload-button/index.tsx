import React from "react";
import { PlusOutlined } from "@ant-design/icons";

interface UploadButtonProps {
    hide?: boolean;
}

const UploadButton = (props: UploadButtonProps) => {
    const { hide = false } = props;
    // edge case
    if (hide) {
        return null;
    }

    return (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
};

export default UploadButton;
