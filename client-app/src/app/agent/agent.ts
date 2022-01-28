import axios, {AxiosError, AxiosResponse}                 from "axios";
import {Activity, ActivityFormValues}                     from "../models/activity";
import {toast}                                            from "react-toastify";
import {history}                                          from "../../index";
import {store}                                            from "../stores/store";
import {User, UserFormValues} from "../models/user";
import {
    accountPath,
    activitiesPath,
    activityPath,
    attendActivityPath,
    loginPath,
    photosPath,
    profilePath,
    registerPath, setMainPhotoPath
} from "../../utils/paths";
import Profile, {Photo}       from "../models/profile";

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
    if (token)
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
    getList: () => requests.get<Activity[]>(activitiesPath),
    getActivity: (id: string) => requests.get<Activity>(activityPath(id)),
    create: (activity: ActivityFormValues) => requests.post<void>(activitiesPath, activity),
    edit: (activity: ActivityFormValues) => requests.put<void>(activityPath(activity.id || "unknown"), activity),
    delete: (id: string) => requests.delete<void>(activityPath(id)),

    //attend (for regular user) or cancel (for host)
    attend: (id: string) => requests.post<void>(attendActivityPath(id), {}),
}

const Account = {
    currentUser: () => requests.get<User>(accountPath),
    login: (user: UserFormValues) => requests.post<User>(loginPath, user),
    register: (user: UserFormValues) => requests.post<User>(registerPath, user)
}

const Profiles = {
    getProfile: (userName: string) => requests.get<Profile>(profilePath(userName)),
    uploadPhoto: (file: Blob) =>
    {
        let formaData = new FormData();
        formaData.append('File', file);
        return axios.post<Photo>('photos', formaData, {
            headers: {'Content-type': 'multipart/form-data'}
        })
    },
    setMainImage: (id: string) => requests.post(setMainPhotoPath(id), {}),
    deleteImage: (id: string) => requests.delete(photosPath(id))
}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;