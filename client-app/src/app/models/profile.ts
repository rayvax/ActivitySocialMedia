import {User} from "./user";

export default interface Profile
{
    userName: string;
    displayName: string;
    about?: string;
    image?: string;
    photos?: Photo[];
}

export class ProfileWrapper implements Profile
{
    userName: string;
    displayName: string;
    image?: string;

    constructor(user: User)
    {
        this.userName = user.userName;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}

export interface Photo
{
    id: string;
    url: string;
    isMain: boolean;
}