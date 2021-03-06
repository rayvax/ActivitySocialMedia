import axios, {AxiosError, AxiosResponse}              from "axios";
import {Activity, ActivityFormValues, ProfileActivity} from "../models/activity";
import {toast}                                         from "react-toastify";
import {history}                                          from "../../index";
import {store}                                            from "../stores/store";
import {User, UserFormValues} from "../models/user";
import {
    accountPath,
    activitiesPath,
    activityPath, allProfilesPath,
    attendActivityPath, apiBaseUrl, followListPath, followPath,
    loginPath,
    photosPath, profileActivitiesPath,
    profilePath,
    registerPath, setMainPhotoPath, accountVkLoginPath
} from "../../utils/paths";
import {
    Profile,
    Photo,
    ProfileFormValues,
    FollowingStatus,
    ProfileActivitiesPredicate,
    FollowingsPredicate
}                        from "../models/profile";
import {PaginatedResult} from "../models/pagination";

const sleep = (delay: number) =>
{
    return new Promise((resolve) =>
    {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = apiBaseUrl;

axios.interceptors.request.use(config =>
{
    const token = store.commonStore.token;
    if (token)
        config.headers.Authorization = `Bearer ${token}`

    return config;
})

axios.interceptors.response.use(async (response) =>
    {
        if(process.env.NODE_ENV === 'development')
            await sleep(1000);

        const pagination = response.headers['pagination'];
        if(pagination)
        {
            response.data = new PaginatedResult<any>(response.data, JSON.parse(pagination));
            return response as AxiosResponse<PaginatedResult<any>>;
        }

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
    getList: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>(activitiesPath, {params})
        .then(responseBody),
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
    register: (user: UserFormValues) => requests.post<User>(registerPath, user),
    vkLogin: (accessToken: string, email: string) => 
        requests.post<User>(accountVkLoginPath(accessToken, email), {})
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

    setMainImage: (id: string) => requests.post<void>(setMainPhotoPath(id), {}),
    deleteImage: (id: string) => requests.delete<void>(photosPath(id)),
    updateProfile: (profile: ProfileFormValues) => requests.put<void>(allProfilesPath, profile),

    updateFollowing: (userName: string) => requests.post<FollowingStatus>(followPath(userName), {}),
    getFollowings: (userName: string, predicate: FollowingsPredicate) =>
        requests.get<Profile[]>((followListPath(userName, predicate))),

    getProfileActivities: (userName: string, predicate: ProfileActivitiesPredicate) =>
        requests.get<ProfileActivity[]>(profileActivitiesPath(userName, predicate))
}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;