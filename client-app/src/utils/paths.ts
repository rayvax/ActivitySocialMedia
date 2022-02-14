export const homePagePath = '/';

export const activitiesPath = `/activities`;
export const activityPath = (id: string) => activitiesPath + `/${id}`;
export const attendActivityPath = (id: string) => activityPath(id) + '/attend';
export const manageActivityPath = (id: string) => `/manage/${id}`;
export const createActivityPath = '/createActivity'

export const profileImagePlaceholder = '/assets/user.png'
export const categoryImagePath = (imageName: string) => `/assets/categoryImages/${imageName}`
export const logoPath = '/assets/logo.png'

export const errorsPath = '/errors';
export const serverErrorPath = '/server-error';

export const accountPath = '/account';
export const loginPath = '/account/login';
export const registerPath = '/account/register';
export const accountVkLoginPath = (accessToken: string, email: string) => 
    `/account/vklogin?accessToken=${accessToken}&email=${email}`

export const allProfilesPath = '/profiles';
export const profilePath = (userName: string) => allProfilesPath + `/${userName}`;

export const photosPath = (id: string) => `/photos/${id}`;
export const setMainPhotoPath = (id: string) => photosPath(id) + '/setmain';

export const followPath = (userName: string) => `/follow/${userName}`;
export const followListPath = (userName: string, predicate: string) => followPath(userName) + `?predicate=${predicate}`

export const profileActivitiesPath = (userName: string, predicate: 'hosting' | 'future' | 'past') =>
    `/profiles/${userName}/activities?predicate=${predicate}`

//urls
export const apiBaseUrl = process.env.REACT_APP_API_URL;
export const chatUrl = process.env.REACT_APP_CHAT_URL;
export const frontUrl = process.env.REACT_APP_FRONT_FULL_URL;
export const commentUrl = (activityId: string) => chatUrl + `?activityId=${activityId}`;

//vk login
const vkClientId = 8070387;
export const vkLoginPath = '/vklogin'
export const vkRedirectUrl = frontUrl + vkLoginPath
export const vkLoginSuccessState = 'success'
const vkAuthScope = 4 + 4194304; //photos + email
export const vkOAuthUrl = `https://oauth.vk.com/authorize?
client_id=${vkClientId}&display=page&
redirect_uri=${vkRedirectUrl}&
scope=${vkAuthScope}&
response_type=token&v=5.131&state=${vkLoginSuccessState}`;