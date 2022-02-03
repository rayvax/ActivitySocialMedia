import {makeAutoObservable, reaction, runInAction} from "mobx";
import {
    Profile,
    Photo,
    ProfileFormValues,
    ProfileActivitiesPredicate,
    FollowingsPredicate
}                                                  from "../models/profile";
import agent                                       from "../agent/agent";
import {store}                                     from "./store";
import {ProfileActivity}                           from "../models/activity";

export enum ActiveTab
{
    About,
    Photos,
    Events,
    Followers,
    Following,
}

export enum EventsActiveTab
{
    Future,
    Past,
    Hosting
}

export default class ProfileStore
{
    private _profile: Profile | null = null;
    private _isLoadingProfile = false;
    private _isUploading = false;
    private _isLoading = false; //setting main or deleting photo
    private _activeTab: ActiveTab = 0;

    private _followings: Profile[] = [];
    private _isLoadingFollowers = false;

    private _eventsActiveTab: EventsActiveTab = 0;
    private _profileActivities: ProfileActivity[] = []

    constructor()
    {
        makeAutoObservable(this);
        reaction(() => this._activeTab,
            activeTab =>
            {
                if (activeTab === ActiveTab.Following || activeTab === ActiveTab.Followers)
                {
                    const predicate = activeTab === ActiveTab.Followers ? 'followers' : 'following';
                    this.loadFollowings(predicate)
                }
                else
                {
                    this._followings = [];
                }
                if(activeTab === ActiveTab.Events)
                {
                    this._eventsActiveTab = 0;
                    this.loadProfileActivities(this.eventPredicate);
                }
                else
                {
                    this._profileActivities = [];
                }
            })

        reaction(() => this._eventsActiveTab,
            () =>
            {
                this.loadProfileActivities(this.eventPredicate);
            })
    }

    public get profile()
    {
        return this._profile;
    }

    public get profileActivities()
    {
        return this._profileActivities;
    }

    public get isLoadingProfile()
    {
        return this._isLoadingProfile;
    }

    public get isUploading()
    {
        return this._isUploading;
    }

    public get isLoading()
    {
        return this._isLoading;
    }

    public get isLoadingFollowers()
    {
        return this._isLoadingFollowers;
    }

    public get followings()
    {
        return this._followings;
    }

    public get isCurrentUser()
    {
        const currentUserName = store.userStore.currentUserName;
        if (this._profile)
        {
            return currentUserName === this._profile.userName;
        }

        return false;
    }

    private get eventPredicate()
    {
        let predicate: ProfileActivitiesPredicate;
        switch(this._eventsActiveTab)
        {
            case EventsActiveTab.Hosting:
                predicate = 'hosting';
                break;

            case EventsActiveTab.Future:
                predicate = 'future';
                break;

            case EventsActiveTab.Past:
                predicate = 'past';
                break;
        }

        return predicate
    }

    public get activeTab()
    {
        return this._activeTab;
    }

    public set activeTab(value: any)
    {
        this._activeTab = value;
    }

    public set eventsActiveTab(value: any)
    {
        this._eventsActiveTab = value;
    }

    loadProfile = async (userName: string) =>
    {
        this._isLoadingProfile = true;

        try
        {
            const profile = await agent.Profiles.getProfile(userName);
            runInAction(() =>
            {
                this._profile = profile
            })
        }
        catch (error)
        {
            console.log(error);
        }
        finally
        {
            runInAction(() => this._isLoadingProfile = false);
        }
    }

    public uploadPhoto = async (file: Blob) =>
    {
        this._isUploading = true;

        try
        {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;

            runInAction(() =>
            {
                if (this._profile)
                {
                    this._profile.photos?.push(photo);

                    if (photo.isMain)
                    {
                        store.userStore.setCurrentUserMainImage(photo.url);
                        this._profile.image = photo.url;
                    }
                }
            })
        }
        catch (error)
        {
            console.log(error)
        }
        finally
        {
            runInAction(() => this._isUploading = false);
        }
    }

    public setMainImage = async (image: Photo) =>
    {
        const currentMain = this._profile?.photos?.find(p => p.isMain);
        if (currentMain?.id === image.id)
            return;

        await this.runInLoading(async () =>
        {
            await agent.Profiles.setMainImage(image.id);

            store.userStore.setCurrentUserMainImage(image.url);
            runInAction(() =>
            {
                if (this._profile && this._profile.photos)
                {
                    this._profile.image = image.url;
                    currentMain!.isMain = false;
                    this._profile.photos.find(p => p.id === image.id)!.isMain = true;
                }
            })
        })
    }

    public deleteImage = async (image: Photo) =>
    {
        if (!this._profile?.photos?.some(p => p.id === image.id))
            return;

        await this.runInLoading(async () =>
        {
            await agent.Profiles.deleteImage(image.id);

            runInAction(() =>
            {
                if (this._profile)
                {
                    this._profile.photos = this._profile.photos?.filter(p => p.id !== image.id);
                }
            })
        })
    }

    public updateProfile = async (profileValues: ProfileFormValues) =>
    {
        await this.runInLoading(async () =>
        {
            await agent.Profiles.updateProfile(profileValues);

            store.userStore.setDisplayName(profileValues.displayName);
            runInAction(() =>
            {
                if (this._profile)
                {
                    this._profile.displayName = profileValues.displayName;
                    this._profile.about = profileValues.about;
                }
            })
        })
    }

    public updateFollowing = (userName: string) =>
    {
        this.runInLoading(async () =>
        {
            const status = await agent.Profiles.updateFollowing(userName);
            const following = status.following;
            store.activityStore.updateAttendeeFollowing(userName);

            const followToAdd = following ? 1 : -1;

            runInAction(() =>
            {
                //changing current profile counts
                if (this._profile)
                {
                    const targetingCurrentProfile = this._profile.userName === userName;
                    const isCurrentUserProfile = this._profile.userName === store.userStore.currentUserName

                    if(isCurrentUserProfile)
                    {
                        this._profile.followingCount += followToAdd;
                    }
                    else if (targetingCurrentProfile)
                    {
                        this._profile.followersCount += followToAdd;
                        this._profile.following = following;
                    }
                }


                this._followings.forEach(profile =>
                {
                    if (profile.userName === userName)
                    {
                        profile.followersCount += followToAdd;
                        profile.following = following;
                    }
                })
            })
        })
    }

    private loadFollowings = async (predicate: FollowingsPredicate) =>
    {
        this._isLoadingFollowers = true;

        try
        {
            const followings = await agent.Profiles.getFollowings(this._profile?.userName!, predicate);
            runInAction(() => this._followings = followings)
        }
        catch (error)
        {
            console.error(error)
        }
        finally
        {
            runInAction(() => this._isLoadingFollowers = false);
        }
    }

    private loadProfileActivities = (predicate: ProfileActivitiesPredicate | undefined) =>
    {
        if(!predicate)
            return;

        return this.runInLoading(async () =>
        {
            if(this._profile)
            {
                const activities = await agent.Profiles.getProfileActivities(this._profile.userName, predicate);

                activities.forEach(activity =>
                {
                    activity.date = new Date(activity.date);
                })

                runInAction(() => this._profileActivities = activities)
            }
        })
    }

    private runInLoading = async (fn: () => Promise<void>) =>
    {
        this.setIsLoading(true);

        try
        {
            return await fn();
        }
        catch (error)
        {
            console.error(error)
        }
        finally
        {
            this.setIsLoading(false);
        }
    }

    private setIsLoading(value: boolean)
    {
        this._isLoading = value;
    }
}