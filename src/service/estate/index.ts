import axios from 'axios';

class Service {
    url: string;

    constructor() {
        this.url = 'http://47.98.224.122:8888/places';
    }

    getAllEstates() {
        return axios({
            method: 'get',
            url: `${this.url}`,
        });
    }

    getSingleEstate(params: any) {
        const { id } = params;
        return axios({
            method: 'get',
            url: `${this.url}/${id}`,
        });
    }

    putEditEstate(params: any, config?: any) {
        const { id, ...data } = params;
        return axios({
            method: 'put',
            url: `${this.url}/${id}`,
            data,
        });
    }

    postCreateNewEstate(params: any, config?: any) {
        return axios({
            method: 'post',
            url: `${this.url}`,
            data: params,
        });
    }

    deleteSingleEstate(params: any, config?: any) {
        const { id } = params;
        return axios({
            method: 'delete',
            url: `${this.url}/${id}`,
        });
    }
}

export default new Service();
