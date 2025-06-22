import axios from 'axios';
import { Window } from '@/types'

const api = axios.create({
    baseURL: '/market/api',
});

const defaultFailure = (messageText: string) => {
    if (messageText === "Unauthorized") {
        messageText = "@请先登录";
    }
    window.$message?.warning(messageText.startsWith(`@`) ? messageText.slice(1) : `系统错误`);
    window.$loadingBar?.error();
};

const defaultError = (err: any) => {
    if (err.response.data.message === "Unauthorized") {
        return;
    }
    console.error(err);
    window.$message?.error(err.response.data.message || '请求失败');
    window.$loadingBar?.error();
};

declare const window: Window

function post(url: string, data: any, headers?: Record<string, string>) {
    return new Promise<any>((resolve, reject) => {
        api.post(url, data, {
            headers: headers
        }).then(({ data }) => {
            if (data.code === 0) {
                resolve(data);
                window.$loadingBar?.finish()
            } else {
                defaultFailure(data.message);
                reject(`${data.message}`);
                window.$loadingBar?.error()
            }
        }).catch(err => { defaultError(err); reject(err); });
    });
}

function get(url: string, params?: Record<string, number | string>, headers?: Record<string, string>) {
    return new Promise<any>((resolve, reject) => {
        api.get(url, {
            params: params,
            headers: headers
        }).then(({ data }) => {
            if (data.code === 0) {
                resolve(data);
                window.$loadingBar?.finish()
            } else {
                reject(`${data.message}`);
                defaultFailure(data.message);
                window.$loadingBar?.error()
            }
        }).catch(err => { defaultError(err); reject(err); });

    });
}

async function unauthorized() {
    return (await axios.get(`/user_info`).then((res) => { return res.data.status !== 200; }));
}

export { api, defaultFailure, defaultError, post, get, unauthorized }