import { RcFile } from 'antd/lib/upload/interface';

import { AntFile, ImageUploaderState } from './interface';

export const getBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // edge case: no result
            if (typeof reader.result !== 'string') {
                return;
            }
            resolve(reader.result);
        };
        reader.onerror = (error) => reject(error);
    });
};

export const formatImages = (urls: string[] = []): AntFile[] => {
    return urls.map((url) => {
        const uid = `${Math.random()}`;
        const name = url?.split('/')?.slice(-1)?.pop() ?? `${uid}.png`;
        return {
            uid,
            name,
            status: 'done',
            url,
        };
    });
};

export const formatFilesIn = (urls: string[] = []): ImageUploaderState => {
    return {
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: formatImages(urls),
    };
};
