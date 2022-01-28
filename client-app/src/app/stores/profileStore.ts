import {makeAutoObservable, runInAction} from "mobx";
import Profile, {Photo}                  from "../models/profile";
import agent                             from "../agent/agent";
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
        const user = store.userStore.user;
        if(user && this._profile)
        {
            return user.userName === this._profile.userName;
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

                    if(photo.isMain && store.userStore.user)
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

        this._isLoading = true;
        try
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
        }
        catch (error)
        {
            console.log(error);
        }
        finally
        {
            runInAction(() => this._isLoading = false);
        }
    }

    public deleteImage = async (image: Photo) =>
    {
        if(!this._profile?.photos?.some(p => p.id === image.id))
            return;

        this._isLoading = true;

        try
        {
            await agent.Profiles.deleteImage(image.id);

            runInAction(() =>
            {
                if(this._profile)
                {
                    this._profile.photos = this._profile.photos?.filter(p => p.id !== image.id);
                }
            })
        }
        catch (error)
        {
            console.log(error);
        }
        finally
        {
            runInAction(() => this._isLoading = false);
        }
    }
}