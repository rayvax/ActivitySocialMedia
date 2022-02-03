import {User} from "./user";

export interface Profile
{
    userName: string;
    displayName: string;
    about?: string;
    image?: string;
    photos?: Photo[];

    following: boolean; //whether current user following this one
    followersCount: number;
    followingCount: number;
}

export class Profile implements Profile
{
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

export interface FollowingStatus
{
    following: boolean;
}

export type FollowingsPredicate = 'followers' | 'following';

export class ProfileFormValues
{
    displayName: string;
    about?: string;

    constructor(profile: Profile)
    {
        this.displayName = profile.displayName;
        this.about = profile.about;
    }
}

export type ProfileActivitiesPredicate = 'hosting' | 'future' | 'past';