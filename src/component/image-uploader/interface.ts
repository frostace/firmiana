import { UploadFileStatus } from 'antd/lib/upload/interface';

export interface AntFile {
    uid: string;
    name: string;
    status?: UploadFileStatus;
    url?: string;
    percent?: number;
}

export interface ImageUploaderState {
    previewVisible?: boolean;
    previewImage?: string;
    previewTitle?: string;
    fileList?: AntFile[];
}
