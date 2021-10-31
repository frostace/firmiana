import React, { FC } from 'react';
import { Upload, Modal } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { useSetState } from 'ahooks';

import UploadButton from './components/upload-button';
import { AntFile, ImageUploaderState } from './interface';
import { formatFilesIn, getBase64 } from './util';
import imageService from '../../service/image';

interface ImageUploaderProps {
    value?: string[];
    onChange?: (v: string[]) => void;
}

const ImageUploader: FC<ImageUploaderProps> = (props) => {
    const { value, onChange } = props;
    console.log(value, onChange);
    const [images, setImages] = useSetState<ImageUploaderState>(
        formatFilesIn(value)
    );

    const handleCancel = () => setImages({ previewVisible: false });

    const handleChange: (v: { fileList: AntFile[] }) => void = ({ fileList }) =>
        setImages({ fileList });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview && file.originFileObj) {
            file.preview = await getBase64(file.originFileObj);
        }

        setImages({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle:
                file.name ||
                file.url?.substring?.(file.url.lastIndexOf('/') + 1),
        });
    };

    const { previewVisible, previewImage, fileList, previewTitle } = images;
    return (
        <>
            <Upload
                customRequest={async (options) => {
                    await imageService.uploadImage({ file: options?.file });
                }}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                <UploadButton hide={Number(fileList?.length) >= 8} />
            </Upload>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img
                    alt="example"
                    style={{ width: '100%' }}
                    src={previewImage}
                />
            </Modal>
        </>
    );
};

export default ImageUploader;
