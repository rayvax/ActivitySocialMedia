import axios, {AxiosError, AxiosResponse} from "axios";
import {Activity, ActivityFormValues}     from "../models/activity";
import {toast}                            from "react-toastify";
import {history}                          from "../../index";
import {store}                            from "../stores/store";
import {User, UserFormValues}             from "../models/user";

const sleep = (delay: number) =>
{
    return new Promise((resolve) =>
    {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.request.use(config =>
{
    const token = store.commonStore.token;
    if(token)
        config.headers.Authorization = `Bearer ${token}`

    return config;
})

axios.interceptors.response.use(async (response) =>
    {
        await sleep(1000);
        return response;
    },
    (error: AxiosError) =>
    {
        const {data, status} = error.response!;

        switch (status)
        {
            case 400:
                if (data.errors)
                {
                    //bad guid
                    if (data.errors.hasOwnProperty('guid'))
                    {
                        history.push('/not-found');
                    }

                    //validation error
                    const errorMessages = [];
                    for (const key in data.errors)
                    {
                        if (data.errors[key])
                        {
                            errorMessages.push(data.errors[key]);
                        }
                    }

                    throw errorMessages.flat();
                }
                else
                {
                    //bad request
                    toast.error(data);
                }
                break;
            case 401:
                toast.error('Unauthorised');
                break;
            case 404:
                history.push('/not-found');
                break;
            case 500:
                store.commonStore.error = data;
                history.push('/server-error')
                break;
        }

        return Promise.reject(error);
    })

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}

const Activities = {
    getList: () => requests.get<Activity[]>(`/activities`),
    getActivity: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>(`/activities`, activity),
    edit: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete<void>(`/activities/${id}`),

    //attend (for regular user) or cancel (for host)
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
}

const Account = {
    currentUser: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

const agent = {
    Activities,
    Account
}

export default agent;