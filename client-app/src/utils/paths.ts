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

export const profilePath = (userName: string) => `/profiles/${userName}`;

export const photosPath = (id: string) => `/photos/${id}`;
export const setMainPhotoPath = (id: string) => photosPath(id) + '/setmain';