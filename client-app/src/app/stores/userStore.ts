import {User, UserFormValues}            from "../models/user";
import {makeAutoObservable, runInAction} from "mobx";
import agent                             from "../agent/agent";
import {store}                           from "./store";
import {history}                         from "../../index";
import {activitiesPath, homePagePath}    from "../../utils/paths";
import {ProfileWrapper}                  from "../models/profile";

export default class UserStore
{
    private user: User | null = null;

    constructor()
    {
        makeAutoObservable(this);
    }

    public get isLoggedIn()
    {
        return !!this.user;
    }

    public get currentUserName()
    {
        return this.user?.userName;
    }

    public get currentImage()
    {
        return this.user?.image;
    }

    public get currentDisplayName()
    {
        return this.user?.displayName;
    }

    public getProfileWrapper = () =>
    {
        return this.user ? new ProfileWrapper(this.user) : null;
    }

    public login = async (credentials: UserFormValues) =>
    {
        const user = await agent.Account.login(credentials);
        store.commonStore.setToken(user.token);

        runInAction(() => this.user = user);

        history.push(activitiesPath);
        store.modalStore.closeModal();
    }

    public logout = () =>
    {
        store.commonStore.setToken(null);
        this.user = null;

        history.push(homePagePath);
    }

    public register = async (registerValues: UserFormValues) =>
    {
        const user = await agent.Account.register(registerValues);
        store.commonStore.setToken(user.token);

        runInAction(() => this.user = user);

        history.push(activitiesPath);
        store.modalStore.closeModal();
    }

    public loadCurrentUser = async () =>
    {
        try
        {
            const user = await agent.Account.currentUser();
            runInAction(() => this.user = user);
        }
        catch (error)
        {
            console.log(error)
        }
    }

    public setCurrentUserMainImage = (image: string) =>
    {
        if(this.user)
            this.user.image = image
    }

    public setDisplayName = (displayName: string) =>
    {
        if(this.user)
            this.user.displayName = displayName;
    }
}