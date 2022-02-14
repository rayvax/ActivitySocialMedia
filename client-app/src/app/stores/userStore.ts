import {User, UserFormValues}                     from "../models/user";
import {makeAutoObservable, runInAction}          from "mobx";
import agent                                      from "../agent/agent";
import {store}                                    from "./store";
import {history}                                  from "../../index";
import {activitiesPath, homePagePath, vkOAuthUrl} from "../../utils/paths";
import {Profile}                                  from "../models/profile";

export default class UserStore
{
    private _user: User | null = null;
    private _isLoadingVkLogin = false;

    constructor()
    {
        makeAutoObservable(this);
    }

    public get isLoggedIn()
    {
        return !!this._user;
    }

    public get currentUserName()
    {
        return this._user?.userName;
    }

    public get currentImage()
    {
        return this._user?.image;
    }

    public get currentDisplayName()
    {
        return this._user?.displayName;
    }
    
    public get isLoadingVkLogin()
    {
        return this._isLoadingVkLogin;
    }

    public getProfileWrapper = () =>
    {
        return this._user ? new Profile(this._user) : null;
    }

    public login = async (credentials: UserFormValues) =>
    {
        const user = await agent.Account.login(credentials);
        store.commonStore.setToken(user.token);

        runInAction(() => this._user = user);

        history.push(activitiesPath);
        store.modalStore.closeModal();
    }

    public logout = () =>
    {
        store.commonStore.setToken(null);
        this._user = null;

        history.push(homePagePath);
    }

    public register = async (registerValues: UserFormValues) =>
    {
        const user = await agent.Account.register(registerValues);
        store.commonStore.setToken(user.token);

        runInAction(() => this._user = user);

        history.push(activitiesPath);
        store.modalStore.closeModal();
    }

    public loadCurrentUser = async () =>
    {
        try
        {
            const user = await agent.Account.currentUser();
            runInAction(() => this._user = user);
        }
        catch (error)
        {
            console.log(error)
        }
    }

    public setCurrentUserMainImage = (image: string) =>
    {
        if (this._user)
            this._user.image = image
    }

    public setDisplayName = (displayName: string) =>
    {
        if (this._user)
            this._user.displayName = displayName;
    }

    public redirectToVkLogin = () =>
    {
        window.location.replace(vkOAuthUrl);
    }

    public vkLogin = async (accessToken: string, email: string) =>
    {
        this._isLoadingVkLogin = true;
        try
        {
            const user = await agent.Account.vkLogin(accessToken, email);

            runInAction(() => this._user = user);
            store.commonStore.setToken(user.token);

            history.push(activitiesPath);
        }
        catch (e)
        {
            console.log(e)
        }
        finally
        {
            runInAction(() => this._isLoadingVkLogin = false)
        }
    }
}