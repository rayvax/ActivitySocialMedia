export interface User
{
    userName: string;
    displayName: string;
    token: string;
    image?: string;
}

export interface UserFormValues //for register and login
{
    email: string;
    password: string;
    userName?: string;
    displayName?: string;
}