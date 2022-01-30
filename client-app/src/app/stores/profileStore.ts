import {makeAutoObservable, runInAction}   from "mobx";
import Profile, {Photo, ProfileFormValues} from "../models/profile";
import agent                               from "../agent/agent";
import {store}                           from "./store";

export default class ProfileStore
{
    private _profile: Profile | null = null;
    private _isLoadingProfile = false;
    private _isUploading = false;
    private _isLoading = false; //setting main or deleting photo

    constructor()
    {
        makeAutoObservable(this);
    }

    public get profile()
    {
        return this._profile;
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

    public get isCurrentUser()
    {
        const currentUserName = store.userStore.currentUserName;
        if(this._profile)
        {
            return currentUserName === this._profile.userName;
        }

        return false;
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
                if(this._profile)
                {
                    this._profile.photos?.push(photo);

                    if(photo.isMain)
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
        if(currentMain?.id === image.id)
            return;

        await this.runInLoading(async () =>
        {
            await agent.Profiles.setMainImage(image.id);

            store.userStore.setCurrentUserMainImage(image.url);
            runInAction(() =>
            {
                if(this._profile && this._profile.photos)
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
        if(!this._profile?.photos?.some(p => p.id === image.id))
            return;

        await this.runInLoading( async () =>
        {
            await agent.Profiles.deleteImage(image.id);

            runInAction(() =>
            {
                if(this._profile)
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
            runInAction(() => {
                if(this._profile)
                {
                    this._profile.displayName = profileValues.displayName;
                    this._profile.about = profileValues.about;
                }
            })
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