import axios from 'axios';

class Service {
    url: string;

    constructor() {
        this.url = 'https://sm.ms/api/v2/upload';
    }

    uploadImage(params: any) {
        const { file } = params;
        const data = new FormData();
        data.append('smfile', file);
        return axios({
            method: 'post',
            headers: {
                Authorization: 'Basic 1LKc9SyXh8MwDVUmHurxY0Bzeg8aJYYE',
            },
            url: `${this.url}`,
            data,
        });
    }
}

export default new Service();
